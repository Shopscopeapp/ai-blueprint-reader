"use client";

import { useState, useEffect } from "react";
import {
  GitCompare,
  Loader2,
  FileText,
  Ruler,
  Package,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";

interface ComparisonData {
  differences?: {
    dimensions?: string;
    materials?: string;
    features?: string;
  };
  similarities?: string[];
  recommendations?: string[];
  summary?: string;
}

interface Blueprint {
  id: string;
  filename: string;
  analysisData?: any;
}

interface BlueprintComparisonProps {
  blueprint1: Blueprint;
  blueprint2: Blueprint;
  onClose?: () => void;
}

export default function BlueprintComparison({
  blueprint1,
  blueprint2,
  onClose,
}: BlueprintComparisonProps) {
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [error, setError] = useState("");

  const compareBlueprints = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprint1Id: blueprint1.id,
          blueprint2Id: blueprint2.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparisonData(data.comparison);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to compare blueprints");
      }
    } catch (err) {
      setError("Failed to compare blueprints");
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compareBlueprints();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#0a0e27] border-2 border-cyan-400/30 rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-cyan-400/20 rounded-lg transition-colors text-cyan-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-[#0a0e27]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 font-mono">
                {'>'} BLUEPRINT COMPARISON {'<'}
              </h2>
              <p className="text-cyan-400/60 font-mono text-sm">
                Analyzing differences and similarities
              </p>
            </div>
          </div>

          {/* Blueprint Names */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-xs text-cyan-400/60 font-mono mb-1">
                BLUEPRINT 1
              </div>
              <div className="text-cyan-300 font-mono font-bold truncate">
                {blueprint1.filename}
              </div>
              <Link
                href={`/chat/${blueprint1.id}`}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono mt-2 inline-block"
              >
                View {'>'}
              </Link>
            </div>
            <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
              <div className="text-xs text-blue-400/60 font-mono mb-1">
                BLUEPRINT 2
              </div>
              <div className="text-blue-300 font-mono font-bold truncate">
                {blueprint2.filename}
              </div>
              <Link
                href={`/chat/${blueprint2.id}`}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono mt-2 inline-block"
              >
                View {'>'}
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-cyan-300 font-mono">Comparing blueprints...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 text-red-300 font-mono">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={compareBlueprints}
              className="mt-3 px-4 py-2 bg-red-400/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-400/30 transition-colors font-mono text-sm"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Comparison Results */}
        {!loading && !error && comparisonData && (
          <div className="space-y-6">
            {/* Summary */}
            {comparisonData.summary && (
              <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {'>'} SUMMARY {'<'}
                </h3>
                <p className="text-cyan-200/80 font-mono text-sm">
                  {comparisonData.summary}
                </p>
              </div>
            )}

            {/* Differences */}
            {comparisonData.differences && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-300 mb-4 font-mono flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {'>'} DIFFERENCES {'<'}
                </h3>
                <div className="space-y-3">
                  {comparisonData.differences.dimensions && (
                    <div>
                      <div className="text-xs text-yellow-400/60 font-mono mb-1 flex items-center">
                        <Ruler className="w-3 h-3 mr-1" />
                        DIMENSIONS
                      </div>
                      <p className="text-yellow-200 font-mono text-sm">
                        {comparisonData.differences.dimensions}
                      </p>
                    </div>
                  )}
                  {comparisonData.differences.materials && (
                    <div>
                      <div className="text-xs text-yellow-400/60 font-mono mb-1 flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        MATERIALS
                      </div>
                      <p className="text-yellow-200 font-mono text-sm">
                        {comparisonData.differences.materials}
                      </p>
                    </div>
                  )}
                  {comparisonData.differences.features && (
                    <div>
                      <div className="text-xs text-yellow-400/60 font-mono mb-1">
                        FEATURES
                      </div>
                      <p className="text-yellow-200 font-mono text-sm">
                        {comparisonData.differences.features}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Similarities */}
            {comparisonData.similarities &&
              comparisonData.similarities.length > 0 && (
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-green-300 mb-4 font-mono flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {'>'} SIMILARITIES {'<'}
                  </h3>
                  <ul className="space-y-2">
                    {comparisonData.similarities.map((similarity, idx) => (
                      <li
                        key={idx}
                        className="text-green-200 font-mono text-sm flex items-start"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{similarity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Recommendations */}
            {comparisonData.recommendations &&
              comparisonData.recommendations.length > 0 && (
                <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-4 font-mono flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    {'>'} RECOMMENDATIONS {'<'}
                  </h3>
                  <ul className="space-y-2">
                    {comparisonData.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="text-blue-200 font-mono text-sm flex items-start"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

