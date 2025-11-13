"use client";

import { useState, useEffect } from "react";
import { GitCompare, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Blueprint {
  id: string;
  filename: string;
}

interface ComparisonSelectorProps {
  blueprints: Blueprint[];
}

export default function ComparisonSelector({
  blueprints,
}: ComparisonSelectorProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selected.length === 2) {
      router.push(
        `/compare?blueprint1=${selected[0]}&blueprint2=${selected[1]}`
      );
    }
  };

  const clearSelection = () => {
    setSelected([]);
  };

  // Add click handlers to blueprint cards
  useEffect(() => {
    const handleBlueprintClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('[data-blueprint-id]');
      if (card && selected.length > 0) {
        const blueprintId = card.getAttribute('data-blueprint-id');
        if (blueprintId) {
          e.preventDefault();
          toggleSelection(blueprintId);
        }
      }
    };

    if (selected.length > 0) {
      document.addEventListener('click', handleBlueprintClick);
      return () => document.removeEventListener('click', handleBlueprintClick);
    }
  }, [selected]);

  if (blueprints.length < 2) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {selected.length > 0 && (
        <div className="bg-[#0a0e27] border-2 border-cyan-400/30 rounded-xl p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-mono font-bold">
                COMPARE MODE
              </span>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-cyan-400/20 rounded text-cyan-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-cyan-400/60 font-mono mb-3">
            {selected.length} of 2 selected
          </div>
          {selected.length === 2 && (
            <button
              onClick={handleCompare}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all font-mono font-bold flex items-center justify-center space-x-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>COMPARE NOW</span>
            </button>
          )}
        </div>
      )}

      {selected.length === 0 && (
        <button
          onClick={() => {
            // Enable comparison mode by selecting first two
            if (blueprints.length >= 2) {
              setSelected([blueprints[0].id, blueprints[1].id]);
            }
          }}
          className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50 hover:shadow-xl hover:shadow-cyan-400/70 transition-all flex items-center justify-center text-[#0a0e27] hover:scale-110"
          title="Compare Blueprints"
        >
          <GitCompare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

