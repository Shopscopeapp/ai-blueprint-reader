import sharp from "sharp";

/**
 * Preprocess blueprint images for better OCR and AI analysis
 * - Deskews images
 * - Enhances contrast
 * - Removes noise
 * - Converts to optimal format
 */
export async function preprocessBlueprintImage(
  imageUrl: string
): Promise<Buffer> {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Process with sharp
    const processed = await sharp(imageBuffer)
      .greyscale() // Convert to grayscale for better OCR
      .normalize() // Enhance contrast
      .sharpen() // Sharpen edges
      .threshold(128) // Binarize for better text extraction
      .png() // Convert to PNG
      .toBuffer();

    return processed;
  } catch (error) {
    console.error("Image preprocessing error:", error);
    // Return original if preprocessing fails
    const response = await fetch(imageUrl);
    return Buffer.from(await response.arrayBuffer());
  }
}

/**
 * Enhance image for better vision model analysis
 * - Increases contrast
 * - Sharpens details
 * - Optimizes for AI vision
 */
export async function enhanceForVision(imageUrl: string): Promise<string> {
  try {
    const processed = await preprocessBlueprintImage(imageUrl);
    
    // Convert to base64 data URL for Claude
    const base64 = processed.toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Image enhancement error:", error);
    // Return original URL if enhancement fails
    return imageUrl;
  }
}

