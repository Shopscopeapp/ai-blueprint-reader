/**
 * Convert PDF pages to images using pdfjs-dist
 * Handles multi-page PDFs by converting each page to a PNG image
 * Uses canvas for rendering (requires canvas package)
 * 
 * SERVER-ONLY: This module should only be imported in API routes or server components
 * For server-side use in Next.js, we disable the worker
 */
export async function convertPDFToImages(
  pdfBuffer: Buffer,
  maxPages: number = 10 // Limit to first 10 pages for performance
): Promise<Array<{ page: number; imageBase64: string; mimeType: string }>> {
  try {
    // Dynamic import to avoid Next.js bundling issues
    const pdfjsLib = await import("pdfjs-dist");
    
    // For server-side, disable the worker completely
    // This prevents worker-related errors in Next.js server environment
    try {
      if ((pdfjsLib as any).GlobalWorkerOptions) {
        // Try to disable worker - if this fails, continue anyway
        try {
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
        } catch (e) {
          // Ignore worker setup errors
        }
      }
    } catch (workerError) {
      // Worker setup failed, but we can still try to use pdfjs-dist
      console.warn("Worker setup warning (non-fatal):", workerError);
    }

    // Convert Buffer to Uint8Array (required by pdfjs-dist)
    const uint8Array = new Uint8Array(pdfBuffer);
    
    // Load PDF with worker disabled
    const loadingTask = (pdfjsLib as any).getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      verbosity: 0, // Reduce logging
      disableAutoFetch: true,
      disableStream: true,
    });
    
    const pdf = await loadingTask.promise;
    const numPages = Math.min(pdf.numPages, maxPages);
    const images: Array<{ page: number; imageBase64: string; mimeType: string }> = [];

    // Try to use canvas, fallback if not available
    let Canvas: any;
    try {
      const canvasModule = await import("canvas");
      Canvas = canvasModule.default || canvasModule;
    } catch (canvasError) {
      throw new Error("Canvas library not available. PDF conversion requires the 'canvas' package. Please install it: npm install canvas");
    }

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

      // Create canvas
      const canvas = Canvas.createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;

      // Convert canvas to buffer
      const imageBuffer = canvas.toBuffer("image/png");
      const imageBase64 = imageBuffer.toString("base64");

      images.push({
        page: pageNum,
        imageBase64,
        mimeType: "image/png",
      });
    }

    return images;
  } catch (error) {
    console.error("PDF conversion error:", error);
    throw new Error(`Failed to convert PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Convert first page of PDF to image (for quick preview)
 */
export async function convertPDFFirstPageToImage(
  pdfBuffer: Buffer
): Promise<{ imageBase64: string; mimeType: string }> {
  const images = await convertPDFToImages(pdfBuffer, 1);
  return {
    imageBase64: images[0]?.imageBase64 || "",
    mimeType: images[0]?.mimeType || "image/png",
  };
}

