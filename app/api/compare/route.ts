import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeBlueprintWithGPT4 } from "@/lib/ai/openai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blueprint1Id, blueprint2Id } = await request.json();

    if (!blueprint1Id || !blueprint2Id) {
      return NextResponse.json(
        { error: "Both blueprint IDs are required" },
        { status: 400 }
      );
    }

    // Get both blueprints
    const { data: blueprints, error } = await supabase
      .from("blueprints")
      .select("*")
      .eq("userId", user.id)
      .in("id", [blueprint1Id, blueprint2Id]);

    if (error || !blueprints || blueprints.length !== 2) {
      return NextResponse.json(
        { error: "Blueprints not found" },
        { status: 404 }
      );
    }

    const [bp1, bp2] = blueprints;

    // Step 1: Extract OCR text from both blueprints (if available)
    // Use cached OCR text if available, otherwise extract
    let ocrText1 = (bp1 as any).ocrText || "";
    let ocrText2 = (bp2 as any).ocrText || "";
    
    try {
      if (process.env.AWS_ACCESS_KEY_ID) {
        const { extractTextWithTextract } = await import("@/lib/ocr/textract");
        
        // Extract OCR for blueprint 1 if not cached
        if (!ocrText1) {
          try {
            const ocr1 = await extractTextWithTextract(bp1.supabaseUrl);
            ocrText1 = ocr1.text;
            // Cache it
            await supabase
              .from("blueprints")
              .update({
                ocrText: ocrText1,
                ocrExtractedAt: new Date().toISOString(),
              })
              .eq("id", bp1.id);
          } catch (e) {
            console.log("OCR failed for blueprint 1");
          }
        }
        
        // Extract OCR for blueprint 2 if not cached
        if (!ocrText2) {
          try {
            const ocr2 = await extractTextWithTextract(bp2.supabaseUrl);
            ocrText2 = ocr2.text;
            // Cache it
            await supabase
              .from("blueprints")
              .update({
                ocrText: ocrText2,
                ocrExtractedAt: new Date().toISOString(),
              })
              .eq("id", bp2.id);
          } catch (e) {
            console.log("OCR failed for blueprint 2");
          }
        }
      }
    } catch (ocrError) {
      console.log("OCR not available for comparison");
    }

        // Use GPT-4 Vision to compare blueprints
    const ocrContext = (ocrText1 || ocrText2) 
      ? `\n\nOCR-EXTRACTED TEXT:\nBlueprint 1 Text: ${ocrText1.substring(0, 500)}\nBlueprint 2 Text: ${ocrText2.substring(0, 500)}\n\nUse this OCR data to enhance comparison accuracy.`
      : "";

    const comparisonPrompt = `Compare these two blueprints and provide a detailed comparison in JSON format.

Blueprint 1: ${bp1.filename}
Analysis Data: ${JSON.stringify(bp1.analysisData || {}, null, 2)}

Blueprint 2: ${bp2.filename}
Analysis Data: ${JSON.stringify(bp2.analysisData || {}, null, 2)}
${ocrContext}

Analyze both blueprints visually and compare:
1. Dimensions and areas
2. Materials and specifications
3. Features and design elements
4. Compliance status
5. Cost estimates

Return JSON in this exact format:
{
  "differences": {
    "dimensions": "Detailed difference in dimensions",
    "materials": "Detailed difference in materials",
    "features": "Detailed difference in features"
  },
  "similarities": ["Similarity 1", "Similarity 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "summary": "Overall comparison summary"
}`;

    const systemPrompt = `You are an expert blueprint comparison analyst. You compare architectural drawings, identify differences, similarities, and provide professional recommendations. Return only valid JSON.`;

        // Compare using both blueprint images
        const comparisonText = await analyzeBlueprintWithGPT4(
          bp1.supabaseUrl, // Use first blueprint image
          comparisonPrompt,
          systemPrompt
        );

    // Parse JSON from Claude's response
    let comparisonData;
    try {
      const jsonMatch = comparisonText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       comparisonText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch?.[1] || jsonMatch?.[0] || comparisonText;
      comparisonData = JSON.parse(jsonString);
    } catch (e) {
      // Fallback: try parsing the whole response
      try {
        comparisonData = JSON.parse(comparisonText);
      } catch (e2) {
        comparisonData = {
          summary: comparisonText,
          error: "Failed to parse comparison data",
        };
      }
    }

    // Save comparison
    const comparisonId = crypto.randomUUID();
    const { data: comparison, error: saveError } = await supabase
      .from("blueprint_comparisons")
      .insert({
        id: comparisonId,
        userId: user.id,
        blueprint1Id: blueprint1Id,
        blueprint2Id: blueprint2Id,
        comparisonData: comparisonData,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save comparison error:", saveError);
    }

    return NextResponse.json({
      success: true,
      comparison: comparisonData,
      comparisonId: comparison?.id,
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Failed to compare blueprints" },
      { status: 500 }
    );
  }
}

