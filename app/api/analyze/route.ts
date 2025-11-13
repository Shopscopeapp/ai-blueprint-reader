import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractStructuredDataGPT4 } from "@/lib/ai/openai";
import { extractTextWithTextract, extractMeasurements } from "@/lib/ocr/textract";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blueprintId } = await request.json();

    if (!blueprintId) {
      return NextResponse.json(
        { error: "Blueprint ID is required" },
        { status: 400 }
      );
    }

    // Get blueprint
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .eq("userId", user.id)
      .single();

    if (blueprintError || !blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found" },
        { status: 404 }
      );
    }

    // Update status to analyzing
    await supabase
      .from("blueprints")
      .update({ analysisStatus: "analyzing" })
      .eq("id", blueprintId);

    // Step 1: Extract text using OCR (if available)
    // Check if OCR text is already cached
    let ocrText = blueprint.ocrText || "";
    let ocrMeasurements: any = {};
    
    // If no cached OCR text, extract it now
    if (!ocrText && process.env.AWS_ACCESS_KEY_ID) {
      try {
        const ocrResult = await extractTextWithTextract(blueprint.supabaseUrl);
        ocrText = ocrResult.text;
        ocrMeasurements = extractMeasurements(ocrText);
        
        // Cache OCR text in database
        await supabase
          .from("blueprints")
          .update({
            ocrText: ocrText,
            ocrExtractedAt: new Date().toISOString(),
          })
          .eq("id", blueprintId);
      } catch (ocrError) {
        console.log("OCR not available or failed, continuing with vision-only analysis");
      }
    } else if (ocrText) {
      // Use cached OCR text
      ocrMeasurements = extractMeasurements(ocrText);
    }

        // Step 2: Use GPT-4 Vision for comprehensive analysis
    // Include OCR data if available in the prompt
    const ocrContext = ocrText 
      ? `\n\nIMPORTANT: The following text was extracted from this blueprint using OCR:\n${ocrText.substring(0, 1000)}\n\nDetected measurements: ${JSON.stringify(ocrMeasurements)}\n\nUse this OCR data to enhance your analysis accuracy.`
      : "";

        // Extract structured data with GPT-4 (pass OCR context if available)
        const analysisData = await extractStructuredDataGPT4(blueprint.supabaseUrl, ocrContext);
    
    // Merge OCR measurements if available
    if (ocrMeasurements.dimensions?.length > 0 || ocrMeasurements.areas?.length > 0) {
      if (!analysisData.dimensions) {
        analysisData.dimensions = {};
      }
      // Add OCR-extracted measurements to analysis
      analysisData.ocrExtracted = {
        text: ocrText.substring(0, 500), // First 500 chars
        measurements: ocrMeasurements,
      };
    }

    // Save analysis data
    const { error: updateError } = await supabase
      .from("blueprints")
      .update({
        analysisData: analysisData,
        autoAnalyzed: true,
        analysisStatus: "completed",
      })
      .eq("id", blueprintId);

    if (updateError) {
      console.error("Update analysis error:", updateError);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: analysisData,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    
    // Update status to failed
    try {
      const supabase = await createClient();
      const { blueprintId } = await request.json();
      await supabase
        .from("blueprints")
        .update({ analysisStatus: "failed" })
        .eq("id", blueprintId);
    } catch (e) {
      // Ignore
    }

    return NextResponse.json(
      { error: "Failed to analyze blueprint" },
      { status: 500 }
    );
  }
}

