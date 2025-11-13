import {
  TextractClient,
  DetectDocumentTextCommand,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn("AWS credentials not set. Textract OCR will be unavailable.");
}

const textractClient = 
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? new TextractClient({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

/**
 * Extract text and structured data from PDF/image using AWS Textract
 * Best for technical documents with tables, forms, and structured data
 */
export async function extractTextWithTextract(
  imageUrl: string
): Promise<{
  text: string;
  blocks: any[];
  tables?: any[];
  forms?: any[];
}> {
  if (!textractClient) {
    throw new Error("AWS Textract not configured");
  }

  try {
    // Download image from URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    let imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // Check content type and convert if needed
    const contentType = imageResponse.headers.get("content-type") || "";
    const urlLower = imageUrl.toLowerCase();
    
    // Textract supports: PDF, PNG, JPEG, TIFF
    // If it's not a supported format, try to convert it using sharp
    const isSupported = 
      contentType.includes("pdf") ||
      contentType.includes("png") ||
      contentType.includes("jpeg") ||
      contentType.includes("jpg") ||
      contentType.includes("tiff") ||
      urlLower.endsWith(".pdf") ||
      urlLower.endsWith(".png") ||
      urlLower.endsWith(".jpg") ||
      urlLower.endsWith(".jpeg") ||
      urlLower.endsWith(".tiff");
    
    if (!isSupported && !contentType.includes("pdf")) {
      // Try to convert using sharp (for images only, not PDFs)
      try {
        const sharp = await import("sharp");
        imageBuffer = await sharp.default(imageBuffer)
          .png()
          .toBuffer();
      } catch (convertError) {
        console.warn("Could not convert image format, trying Textract anyway");
      }
    }

    // Check file size (Textract limits: 10MB for AnalyzeDocument, 5MB for DetectDocumentText)
    const maxSize = 5 * 1024 * 1024; // 5MB for safer operation
    let useSimpleDetection = imageBuffer.length > maxSize;
    
    // Try AnalyzeDocument first (better for tables/forms) if file is small enough
    if (!useSimpleDetection) {
      try {
        const command = new AnalyzeDocumentCommand({
          Document: {
            Bytes: imageBuffer,
          },
          FeatureTypes: ["TABLES", "FORMS"],
        });

        const response = await textractClient.send(command);

        const textBlocks = response.Blocks?.filter(
          (block) => block.BlockType === "LINE"
        ) || [];
        const text = textBlocks
          .map((block) => block.Text)
          .filter(Boolean)
          .join("\n");

        return {
          text,
          blocks: response.Blocks || [],
          tables: response.Blocks?.filter((b) => b.BlockType === "TABLE") || [],
          forms: response.Blocks?.filter((b) => b.BlockType === "KEY_VALUE_SET") || [],
        };
      } catch (analyzeError: any) {
        // If AnalyzeDocument fails due to unsupported format, fall back to DetectDocumentText
        if (analyzeError.name === "UnsupportedDocumentException" || 
            analyzeError.name === "InvalidParameterException" ||
            analyzeError.message?.includes("unsupported document format")) {
          console.log("AnalyzeDocument not supported for this format, using DetectDocumentText");
          useSimpleDetection = true;
        } else {
          throw analyzeError;
        }
      }
    }
    
    // Use DetectDocumentText for simpler detection (works with more formats)
    const { DetectDocumentTextCommand } = await import("@aws-sdk/client-textract");
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: imageBuffer,
      },
    });
    
    const response = await textractClient.send(command);
    
    const textBlocks = response.Blocks?.filter(
      (block) => block.BlockType === "LINE"
    ) || [];
    const text = textBlocks
      .map((block) => block.Text)
      .filter(Boolean)
      .join("\n");

    return {
      text,
      blocks: response.Blocks || [],
      tables: [],
      forms: [],
    };
  } catch (error: any) {
    // If it's an unsupported format error, return empty text instead of throwing
    // This allows the system to continue with vision-only analysis
    const errorName = error.name || error.Code || "";
    const errorMessage = error.message || error.Message || "";
    
    if (errorName === "UnsupportedDocumentException" || 
        errorMessage.includes("unsupported document format") ||
        errorMessage.includes("UnsupportedDocumentException") ||
        errorMessage.includes("UnsupportedDocumentException")) {
      console.log("Textract: Document format not supported, skipping OCR");
      return {
        text: "",
        blocks: [],
        tables: [],
        forms: [],
      };
    }
    console.error("Textract error:", error);
    // Don't throw - return empty result so system can continue
    return {
      text: "",
      blocks: [],
      tables: [],
      forms: [],
    };
  }
}

/**
 * Extract measurements and dimensions from blueprint text
 */
export function extractMeasurements(text: string): {
  dimensions: string[];
  areas: string[];
  measurements: string[];
} {
  // Common dimension patterns
  const dimensionPattern = /(\d+(?:\.\d+)?)\s*(?:ft|feet|'|m|meter|cm|inch|")/gi;
  const areaPattern = /(\d+(?:\.\d+)?)\s*(?:sq\s*ft|sqft|square\s*feet|m²|sq\s*m)/gi;
  const measurementPattern = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:ft|m)/gi;

  return {
    dimensions: text.match(dimensionPattern) || [],
    areas: text.match(areaPattern) || [],
    measurements: text.match(measurementPattern) || [],
  };
}

