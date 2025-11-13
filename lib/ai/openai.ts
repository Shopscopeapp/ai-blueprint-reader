import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. OpenAI will be unavailable.");
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * GPT-4 Vision - Simple and reliable for blueprint analysis
 * - Downloads files and converts to images for reliable delivery
 * - Works with PDFs (converts first page to image), images, and various formats
 * - Proven reliability
 */
export async function analyzeBlueprintWithGPT4(
  imageUrl: string,
  prompt: string,
  systemPrompt?: string
) {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }

  const defaultSystemPrompt = `You are an expert architect and construction analyst with deep knowledge of:
- Building codes and compliance standards
- Construction materials and specifications
- Architectural drawings and CAD files
- Structural engineering principles
- Cost estimation and project planning

Analyze blueprints, CAD drawings, and architectural plans with precision. Extract accurate measurements, identify materials, assess compliance, and provide detailed technical insights.`;

  // Download file and convert to base64 image for reliable delivery
  let imageContent: Array<{ type: "image_url"; image_url: { url: string } }>;
  
  try {
    const fileResponse = await fetch(imageUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    
      const arrayBuffer = await fileResponse.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    
    // Check if it's a PDF
    const contentType = fileResponse.headers.get("content-type") || "";
    const urlLower = imageUrl.toLowerCase();
    const isPDF = contentType.includes("pdf") || urlLower.endsWith(".pdf");
    
    // If PDF, convert pages to images (up to 10 pages for multi-page support)
    if (isPDF) {
      try {
        const { convertPDFToImages } = await import("@/lib/pdf/converter");
        const pdfImages = await convertPDFToImages(buffer, 10); // Convert up to 10 pages
        
        // Create image content array for all pages
        imageContent = pdfImages.map((img) => ({
          type: "image_url" as const,
          image_url: {
            url: `data:${img.mimeType};base64,${img.imageBase64}`,
          },
        }));
        
        console.log(`Converted PDF with ${pdfImages.length} page(s) to images`);
      } catch (pdfError) {
        console.error("Failed to convert PDF to images:", pdfError);
        // Fallback: Try to convert just the first page using a simpler method
        try {
          const { convertPDFToImages } = await import("@/lib/pdf/converter");
          const firstPage = await convertPDFToImages(buffer, 1); // Just first page
          if (firstPage.length > 0) {
            imageContent = [{
              type: "image_url" as const,
              image_url: {
                url: `data:${firstPage[0].mimeType};base64,${firstPage[0].imageBase64}`,
              },
            }];
            console.log("Using first page only due to conversion error");
          } else {
            throw new Error("Could not convert any PDF pages");
          }
        } catch (fallbackError) {
          console.error("Fallback PDF conversion also failed:", fallbackError);
          throw new Error("PDF conversion failed. Please convert your PDF to an image format (PNG, JPEG) and try again.");
        }
      }
    } else {
      // For images, determine MIME type and convert to base64
      let mimeType: string = "image/png";
      
      if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        mimeType = "image/jpeg";
      } else if (contentType.includes("png")) {
        mimeType = "image/png";
      } else if (contentType.includes("webp")) {
        mimeType = "image/webp";
      } else if (contentType.includes("gif")) {
        mimeType = "image/gif";
      } else {
        // Try to detect format
        try {
          const sharp = await import("sharp");
          const metadata = await sharp.default(buffer).metadata();
          if (metadata.format === "jpeg" || metadata.format === "jpg") {
            mimeType = "image/jpeg";
          } else if (metadata.format === "png") {
            mimeType = "image/png";
          } else if (metadata.format === "webp") {
            mimeType = "image/webp";
          } else if (metadata.format === "gif") {
            mimeType = "image/gif";
          } else {
            // Convert to PNG if unknown format
            const convertedBuffer = await sharp.default(buffer).png().toBuffer();
            buffer = Buffer.from(convertedBuffer);
            mimeType = "image/png";
          }
        } catch (detectError) {
          // If detection fails, convert to PNG
          try {
            const sharp = await import("sharp");
            const convertedBuffer = await sharp.default(buffer).png().toBuffer();
            buffer = Buffer.from(convertedBuffer);
            mimeType = "image/png";
          } catch (convertError) {
            console.error("Failed to convert image:", convertError);
            throw new Error("Unsupported image format. Please use PNG, JPEG, WebP, or GIF.");
          }
        }
      }
      
      // Convert single image to base64
      const imageBase64 = buffer.toString("base64");
      imageContent = [
        {
          type: "image_url" as const,
          image_url: {
            url: `data:${mimeType};base64,${imageBase64}`,
          },
        },
      ];
    }
  } catch (error) {
    console.error("Failed to fetch/process file for GPT-4:", error);
    throw new Error(`Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // GPT-4 Omni - latest and best vision model
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt || defaultSystemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          ...imageContent, // Send all images (supports multi-page PDFs!)
        ],
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Extract structured data from blueprint using GPT-4
 */
export async function extractStructuredDataGPT4(
  imageUrl: string,
  ocrContext?: string
) {
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

  const response = await analyzeBlueprintWithGPT4(imageUrl, prompt);
  
  try {
    // GPT-4 often wraps JSON in markdown code blocks
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

