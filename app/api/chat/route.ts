import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeBlueprintWithGPT4 } from "@/lib/ai/openai";
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

    const { blueprintId, message, conversationId } = await request.json();

    if (!blueprintId || !message) {
      return NextResponse.json(
        { error: "Blueprint ID and message are required" },
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

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("userId", user.id)
        .eq("blueprintId", blueprintId)
        .single();
      
      conversation = existingConversation;
    }

    let messages: Array<{ role: string; content: any }> = [];
    if (conversation) {
      try {
        messages = JSON.parse(conversation.messages);
      } catch (e) {
        messages = [];
      }
    }

    // Add user message
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: message,
        },
        {
          type: "image_url",
          image_url: {
            url: blueprint.supabaseUrl,
          },
        },
      ],
    });

    // Step 1: Extract text using OCR (Textract) for better context
    // Check if OCR text is already cached in database
    let ocrText = blueprint.ocrText || "";
    let ocrMeasurements: any = {};
    
    // If no cached OCR text, extract it now
    if (!ocrText && process.env.AWS_ACCESS_KEY_ID) {
      try {
        const ocrResult = await extractTextWithTextract(blueprint.supabaseUrl);
        ocrText = ocrResult.text;
        ocrMeasurements = extractMeasurements(ocrText);
        
        // Cache OCR text in database for future use
        await supabase
          .from("blueprints")
          .update({
            ocrText: ocrText,
            ocrExtractedAt: new Date().toISOString(),
          })
          .eq("id", blueprintId);
      } catch (ocrError) {
        console.log("OCR extraction failed, continuing with vision-only analysis:", ocrError);
        // Continue without OCR - Claude can still analyze the image
      }
    } else if (ocrText) {
      // Use cached OCR text
      ocrMeasurements = extractMeasurements(ocrText);
    }

        // Step 2: Use GPT-4 Vision for technical document analysis
    // Build conversation context
    let conversationContext = "";
    if (messages.length > 1) {
      // Include previous messages for context (last 3 exchanges)
      const recentMessages = messages.slice(-6);
      conversationContext = recentMessages
        .map((msg: any) => {
          if (msg.role === "user") {
            const text = typeof msg.content === "string" 
              ? msg.content 
              : msg.content.find((c: any) => c.type === "text")?.text || "";
            return `User: ${text}`;
          } else {
            return `Assistant: ${msg.content}`;
          }
        })
        .join("\n\n");
    }

    // Build OCR context for Claude
    const ocrContext = ocrText 
      ? `\n\nIMPORTANT CONTEXT - Text extracted from this blueprint using OCR:\n${ocrText.substring(0, 2000)}\n\nDetected measurements: ${JSON.stringify(ocrMeasurements)}\n\nUse this OCR-extracted text and measurements to provide more accurate answers. Cross-reference the visual analysis with this text data.`
      : "";

    const systemPrompt = `You are an expert architect and construction analyst with deep knowledge of:
- Building codes and compliance standards (IBC, NFPA, ADA)
- Construction materials and specifications
- Architectural drawings and CAD files
- Structural engineering principles
- Cost estimation and project planning

Analyze building blueprints, CAD drawings, and architectural plans with precision. Provide detailed, accurate answers about dimensions, materials, design elements, and construction details. Be specific, professional, and cite measurements when available.

${conversationContext ? `\nPrevious conversation context:\n${conversationContext}` : ""}`;

    const userPrompt = `${message}${ocrContext}`;

        const assistantMessage = await analyzeBlueprintWithGPT4(
          blueprint.supabaseUrl,
          userPrompt,
          systemPrompt
        );

    // Add assistant response
    messages.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Save conversation
    if (conversation) {
      const { data: updatedConversation, error: updateError } = await supabase
        .from("conversations")
        .update({
          messages: JSON.stringify(messages),
        })
        .eq("id", conversation.id)
        .select()
        .single();

      if (updateError) {
        console.error("Update conversation error:", updateError);
      } else {
        conversation = updatedConversation;
      }
    } else {
      // Generate a unique ID for the conversation
      const conversationId = crypto.randomUUID();
      
      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          id: conversationId,
          userId: user.id,
          blueprintId,
          messages: JSON.stringify(messages),
        })
        .select()
        .single();

      if (createError) {
        console.error("Create conversation error:", createError);
        return NextResponse.json(
          { error: "Failed to save conversation" },
          { status: 500 }
        );
      }
      conversation = newConversation;
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

