import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Claude 4.5 Sonnet is the latest and best for technical document analysis
 * - Superior understanding of technical drawings
 * - Better at extracting structured data
 * - More accurate measurements
 * - Better JSON output
 * - Enhanced vision capabilities
 */
export async function analyzeBlueprintWithClaude(
  imageUrl: string,
  prompt: string,
  systemPrompt?: string
) {
  const defaultSystemPrompt = `You are an expert architect and construction analyst with deep knowledge of:
- Building codes and compliance standards
- Construction materials and specifications
- Architectural drawings and CAD files
- Structural engineering principles
- Cost estimation and project planning

Analyze blueprints, CAD drawings, and architectural plans with precision. Extract accurate measurements, identify materials, assess compliance, and provide detailed technical insights.`;

  // Download image and convert to base64 for reliable delivery
  let imageBase64: string;
  let mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif" = "image/png"; // Default
  
  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    
    // Determine media type from content-type or URL
    const contentType = imageResponse.headers.get("content-type") || "";
    const urlLower = imageUrl.toLowerCase();
    const isPDF = contentType.includes("pdf") || urlLower.endsWith(".pdf");
    
    // If it's a PDF, convert first page to PNG using Sharp
    if (isPDF) {
      try {
        const sharp = await import("sharp");
        // Convert PDF first page to PNG
        const pdfBuffer = await sharp.default(buffer, { pages: 1 })
          .png()
          .toBuffer();
        buffer = Buffer.from(pdfBuffer);
        mediaType = "image/png";
      } catch (pdfError) {
        console.error("Failed to convert PDF to image:", pdfError);
        throw new Error("PDF conversion failed. Please ensure the file is a valid PDF or convert it to an image format (PNG, JPEG) first.");
      }
    } else {
      // For images, determine the correct media type
      if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        mediaType = "image/jpeg";
      } else if (contentType.includes("png")) {
        mediaType = "image/png";
      } else if (contentType.includes("webp")) {
        mediaType = "image/webp";
      } else if (contentType.includes("gif")) {
        mediaType = "image/gif";
      } else {
        // Fallback: determine from URL extension
        if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg")) {
          mediaType = "image/jpeg";
        } else if (urlLower.endsWith(".png")) {
          mediaType = "image/png";
        } else if (urlLower.endsWith(".webp")) {
          mediaType = "image/webp";
        } else if (urlLower.endsWith(".gif")) {
          mediaType = "image/gif";
        } else {
          // Try to detect format from buffer using Sharp
          try {
            const sharp = await import("sharp");
            const metadata = await sharp.default(buffer).metadata();
            if (metadata.format === "jpeg" || metadata.format === "jpg") {
              mediaType = "image/jpeg";
            } else if (metadata.format === "png") {
              mediaType = "image/png";
            } else if (metadata.format === "webp") {
              mediaType = "image/webp";
            } else if (metadata.format === "gif") {
              mediaType = "image/gif";
            }
            // Convert to PNG if format is not supported by Claude
            if (!["jpeg", "jpg", "png", "webp", "gif"].includes(metadata.format || "")) {
              const convertedBuffer = await sharp.default(buffer).png().toBuffer();
              buffer = Buffer.from(convertedBuffer);
              mediaType = "image/png";
            }
          } catch (detectError) {
            // If detection fails, convert to PNG as fallback
            try {
              const sharp = await import("sharp");
              const convertedBuffer = await sharp.default(buffer).png().toBuffer();
              buffer = Buffer.from(convertedBuffer);
              mediaType = "image/png";
            } catch (convertError) {
              console.error("Failed to convert image:", convertError);
              throw new Error("Unsupported image format. Please use PNG, JPEG, WebP, or GIF.");
            }
          }
        }
      }
    }
    
    // Convert to base64
    imageBase64 = buffer.toString("base64");
  } catch (error) {
    console.error("Failed to fetch/process image for Claude:", error);
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929", // Claude 4.5 Sonnet (latest 2025)
    max_tokens: 4096,
    system: systemPrompt || defaultSystemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "";
}

/**
 * Extract structured data from blueprint using Claude
 */
export async function extractStructuredData(imageUrl: string, ocrContext?: string) {
  const prompt = `Analyze this blueprint and extract structured data in JSON format.${ocrContext || ""}

Return ONLY valid JSON with this exact structure:
{
  "dimensions": {
    "totalArea": "X sq ft",
    "length": "X ft",
    "width": "X ft",
    "height": "X ft"
  },
  "rooms": [
    {"name": "Room Name", "area": "X sq ft", "dimensions": "X x Y ft"}
  ],
  "materials": [
    {"type": "Material Type", "quantity": "X", "specifications": "Details"}
  ],
  "features": ["Feature 1", "Feature 2"],
  "compliance": {
    "status": "compliant/non-compliant/needs-review",
    "issues": ["Issue 1", "Issue 2"]
  },
  "costEstimate": {
    "range": "$X - $Y",
    "breakdown": {
      "materials": "$X",
      "labor": "$X",
      "other": "$X"
    }
  },
  "summary": "Brief summary of the blueprint"
}`;

  const response = await analyzeBlueprintWithClaude(imageUrl, prompt);
  
  try {
    // Claude often wraps JSON in markdown code blocks
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch?.[1] || jsonMatch?.[0] || response;
    return JSON.parse(jsonString);
  } catch (e) {
    // Fallback: try parsing the whole response
    try {
      return JSON.parse(response);
    } catch (e2) {
      return { summary: response, error: "Failed to parse JSON" };
    }
  }
}

