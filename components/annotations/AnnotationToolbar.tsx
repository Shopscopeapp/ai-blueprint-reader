"use client";

import { useState } from "react";
import {
  PenTool,
  Highlighter,
  Ruler,
  ArrowRight,
  X,
  Save,
  Trash2,
} from "lucide-react";

interface Annotation {
  id: string;
  type: "note" | "highlight" | "measurement" | "arrow";
  x: number;
  y: number;
  content?: string;
  color?: string;
}

interface AnnotationToolbarProps {
  blueprintId: string;
  onAnnotationAdd: (annotation: Omit<Annotation, "id">) => void;
  onAnnotationDelete: (id: string) => void;
  annotations: Annotation[];
}

export default function AnnotationToolbar({
  blueprintId,
  onAnnotationAdd,
  onAnnotationDelete,
  annotations,
}: AnnotationToolbarProps) {
  const [selectedTool, setSelectedTool] = useState<
    "note" | "highlight" | "measurement" | "arrow" | null
  >(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const tools = [
    { type: "note" as const, icon: PenTool, label: "Note", color: "#3b82f6" },
    {
      type: "highlight" as const,
      icon: Highlighter,
      label: "Highlight",
      color: "#fbbf24",
    },
    {
      type: "measurement" as const,
      icon: Ruler,
      label: "Measure",
      color: "#10b981",
    },
    {
      type: "arrow" as const,
      icon: ArrowRight,
      label: "Arrow",
      color: "#ef4444",
    },
  ];

  const handleToolSelect = (tool: typeof tools[0]["type"]) => {
    if (selectedTool === tool) {
      setSelectedTool(null);
      setIsDrawing(false);
    } else {
      setSelectedTool(tool);
      setIsDrawing(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool || !isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const annotation: Omit<Annotation, "id"> = {
      type: selectedTool,
      x,
      y,
      color: tools.find((t) => t.type === selectedTool)?.color || "#3b82f6",
      content: selectedTool === "note" ? "New note" : undefined,
    };

    onAnnotationAdd(annotation);
    setSelectedTool(null);
    setIsDrawing(false);
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 bg-[#0a0e27]/95 border-2 border-cyan-400/30 rounded-xl p-3 backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-cyan-400/60 font-mono">TOOLS</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.type;
            return (
              <button
                key={tool.type}
                onClick={() => handleToolSelect(tool.type)}
                className={`p-3 rounded-lg transition-all font-mono text-xs ${
                  isSelected
                    ? "bg-cyan-400/30 border-2 border-cyan-400"
                    : "bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20"
                }`}
                style={{
                  borderColor: isSelected ? tool.color : undefined,
                }}
              >
                <Icon
                  className="w-4 h-4 mx-auto mb-1"
                  style={{ color: tool.color }}
                />
                <div className="text-cyan-300 text-[10px]">{tool.label}</div>
              </button>
            );
          })}
        </div>

        {/* Annotations List */}
        {annotations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cyan-400/20">
            <div className="text-xs text-cyan-400/60 font-mono mb-2">
              ANNOTATIONS ({annotations.length})
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="flex items-center justify-between p-2 bg-cyan-400/5 rounded text-xs font-mono"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: annotation.color }}
                    />
                    <span className="text-cyan-300 truncate">
                      {annotation.type}
                    </span>
                  </div>
                  <button
                    onClick={() => onAnnotationDelete(annotation.id)}
                    className="p-1 hover:bg-red-400/20 rounded text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawing Canvas Overlay */}
      {isDrawing && (
        <div
          className="absolute inset-0 z-5 cursor-crosshair"
          onClick={handleCanvasClick}
          style={{
            background: "rgba(59, 130, 246, 0.05)",
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-400/20 border-2 border-cyan-400 rounded-lg p-4 backdrop-blur-md">
            <p className="text-cyan-300 font-mono text-sm text-center">
              Click on the blueprint to add {selectedTool}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

