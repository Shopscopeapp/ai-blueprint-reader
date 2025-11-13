"use client";

import { useState, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Download, Ruler, Grid } from "lucide-react";

interface BlueprintViewerProps {
  url: string;
  fileType: string;
}

export default function BlueprintViewer({ url, fileType }: BlueprintViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const resetView = useCallback(() => {
    setScale(1.0);
    setRotation(0);
    setPageNumber(1);
  }, []);

  const isPDF = fileType === "application/pdf" || url.toLowerCase().endsWith(".pdf");
  const isImage = fileType.startsWith("image/") || 
    /\.(png|jpg|jpeg)$/i.test(url);

  if (isPDF) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-[#0a0e27]/80 border border-cyan-400/30 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-cyan-300 px-3 font-mono text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors ml-2 text-cyan-300"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded hover:bg-cyan-400/20 transition-colors font-mono text-xs ml-2"
              title="Reset View"
            >
              RESET
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded transition-colors ${
                showGrid ? "bg-cyan-400/20 text-cyan-300" : "hover:bg-cyan-400/20 text-cyan-400/60"
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <a
              href={url}
              download
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded hover:bg-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-xs"
              >
                PREV
              </button>
              <span className="text-cyan-300 font-mono text-sm px-3">
                {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                disabled={pageNumber >= numPages}
                className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded hover:bg-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-xs"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto border border-cyan-400/20 rounded-lg bg-[#0a0e27]/40 p-4 relative">
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          )}
          <div className="w-full h-full">
            <iframe
              src={`${url}#page=${pageNumber}&zoom=${scale * 100}`}
              className="w-full h-full border-0"
              style={{
                transform: `rotate(${rotation}deg)`,
                minHeight: '600px',
              }}
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-[#0a0e27]/80 border border-cyan-400/30 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-cyan-300 px-3 font-mono text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors ml-2 text-cyan-300"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded hover:bg-cyan-400/20 transition-colors font-mono text-xs ml-2"
              title="Reset View"
            >
              RESET
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded transition-colors ${
                showGrid ? "bg-cyan-400/20 text-cyan-300" : "hover:bg-cyan-400/20 text-cyan-400/60"
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <a
              href={url}
              download
              className="p-2 hover:bg-cyan-400/20 rounded transition-colors text-cyan-300"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
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
          <div className="flex justify-center items-center min-h-full">
            <div
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: "transform 0.2s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Blueprint"
                className="max-w-full h-auto"
                style={{ maxHeight: "80vh" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text-light/70 p-8 text-center">
      <p>Preview not available for this file type.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-DEFAULT hover:underline mt-4 inline-block"
      >
        Download file
      </a>
    </div>
  );
}

