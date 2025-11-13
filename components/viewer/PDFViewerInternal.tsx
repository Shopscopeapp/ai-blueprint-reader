"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "@/app/pdf-viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerInternalProps {
  url: string;
  scale: number;
  rotation: number;
  pageNumber: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onPageChange: (page: number) => void;
  showGrid: boolean;
}

export default function PDFViewerInternal({
  url,
  scale,
  rotation,
  pageNumber,
  onLoadSuccess,
  showGrid,
}: PDFViewerInternalProps) {
  return (
    <div className="flex-1 overflow-auto border border-cyan-400/20 rounded-lg bg-[#0a0e27]/40 p-4 relative">
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}
      <div className="flex justify-center">
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          loading={
            <div className="text-cyan-300 font-mono">Loading PDF...</div>
          }
          error={
            <div className="text-red-400 font-mono">Failed to load PDF</div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
}

