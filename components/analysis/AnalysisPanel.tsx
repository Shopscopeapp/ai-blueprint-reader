"use client";

import { useState, useEffect } from "react";
import {
  Ruler,
  Home,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  Loader2,
  RefreshCw,
  TrendingUp,
  FileText,
} from "lucide-react";

interface AnalysisData {
  dimensions?: {
    totalArea?: string;
    length?: string;
    width?: string;
    height?: string;
  };
  rooms?: Array<{
    name: string;
    area?: string;
    dimensions?: string;
  }>;
  materials?: Array<{
    type: string;
    quantity?: string;
    specifications?: string;
  }>;
  features?: string[];
  compliance?: {
    status?: string;
    issues?: string[];
  };
  costEstimate?: {
    range?: string;
    breakdown?: {
      materials?: string;
      labor?: string;
      other?: string;
    };
  };
  summary?: string;
}

interface AnalysisPanelProps {
  blueprintId: string;
  initialData?: AnalysisData;
  analysisStatus?: string;
}

export default function AnalysisPanel({
  blueprintId,
  initialData,
  analysisStatus: initialStatus,
}: AnalysisPanelProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(
    initialData || null
  );
  const [analysisStatus, setAnalysisStatus] = useState(initialStatus || "pending");
  const [loading, setLoading] = useState(false);

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.analysis);
        setAnalysisStatus("completed");
      } else {
        setAnalysisStatus("failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  if (analysisStatus === "pending" || analysisStatus === "analyzing") {
    return (
      <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20" />
        <div className="relative z-10 text-center py-8">
          {analysisStatus === "analyzing" ? (
            <>
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
                {'>'} ANALYZING BLUEPRINT {'<'}
              </h3>
              <p className="text-cyan-200/60 font-mono text-sm">
                Extracting dimensions, materials, and features...
              </p>
            </>
          ) : (
            <>
              <FileText className="w-12 h-12 text-cyan-400/60 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
                {'>'} AUTO-ANALYSIS {'<'}
              </h3>
              <p className="text-cyan-200/60 font-mono text-sm mb-4">
                Click to analyze this blueprint automatically
              </p>
              <button
                onClick={triggerAnalysis}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all font-mono font-bold disabled:opacity-50"
              >
                {loading ? "ANALYZING..." : "START ANALYSIS"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (analysisStatus === "failed" || !analysisData) {
    return (
      <div className="relative bg-[#0a0e27]/60 border-2 border-red-400/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="relative z-10 text-center py-4">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300 font-mono text-sm mb-4">
            Analysis failed. Try again?
          </p>
          <button
            onClick={triggerAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-red-400/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-400/30 transition-colors font-mono text-xs"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {analysisData.summary && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-cyan-300 mb-2 font-mono flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              {'>'} SUMMARY {'<'}
            </h3>
            <p className="text-cyan-200/80 text-sm font-mono">{analysisData.summary}</p>
          </div>
        </div>
      )}

      {/* Dimensions */}
      {analysisData.dimensions && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-cyan-300 mb-3 font-mono flex items-center">
              <Ruler className="w-4 h-4 mr-2" />
              {'>'} DIMENSIONS {'<'}
            </h3>
            <div className="space-y-2">
              {analysisData.dimensions.totalArea && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400/60">Total Area:</span>
                  <span className="text-cyan-200 font-bold">
                    {analysisData.dimensions.totalArea}
                  </span>
                </div>
              )}
              {analysisData.dimensions.length && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400/60">Length:</span>
                  <span className="text-cyan-200">{analysisData.dimensions.length}</span>
                </div>
              )}
              {analysisData.dimensions.width && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400/60">Width:</span>
                  <span className="text-cyan-200">{analysisData.dimensions.width}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rooms */}
      {analysisData.rooms && analysisData.rooms.length > 0 && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-blue-300/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-blue-300 mb-3 font-mono flex items-center">
              <Home className="w-4 h-4 mr-2" />
              {'>'} ROOMS ({analysisData.rooms.length}) {'<'}
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analysisData.rooms.map((room, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono p-2 bg-blue-400/10 rounded border border-blue-400/20"
                >
                  <div className="font-bold text-blue-200">{room.name}</div>
                  {room.area && (
                    <div className="text-blue-400/60">Area: {room.area}</div>
                  )}
                  {room.dimensions && (
                    <div className="text-blue-400/60">{room.dimensions}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Materials */}
      {analysisData.materials && analysisData.materials.length > 0 && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-cyan-300 mb-3 font-mono flex items-center">
              <Package className="w-4 h-4 mr-2" />
              {'>'} MATERIALS ({analysisData.materials.length}) {'<'}
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analysisData.materials.map((material, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono p-2 bg-cyan-400/10 rounded border border-cyan-400/20"
                >
                  <div className="font-bold text-cyan-200">{material.type}</div>
                  {material.quantity && (
                    <div className="text-cyan-400/60">Qty: {material.quantity}</div>
                  )}
                  {material.specifications && (
                    <div className="text-cyan-400/60 text-[10px]">
                      {material.specifications}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance */}
      {analysisData.compliance && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-yellow-300/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-yellow-300 mb-3 font-mono flex items-center">
              {analysisData.compliance.status === "compliant" ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              )}
              {'>'} COMPLIANCE {'<'}
            </h3>
            <div className="text-xs font-mono mb-2">
              <span className="text-yellow-400/60">Status: </span>
              <span
                className={`font-bold ${
                  analysisData.compliance.status === "compliant"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {analysisData.compliance.status?.toUpperCase()}
              </span>
            </div>
            {analysisData.compliance.issues &&
              analysisData.compliance.issues.length > 0 && (
                <div className="space-y-1">
                  {analysisData.compliance.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-yellow-200/80 p-1 bg-yellow-400/10 rounded"
                    >
                      • {issue}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Cost Estimate */}
      {analysisData.costEstimate && (
        <div className="relative bg-[#0a0e27]/60 border-2 border-green-300/30 rounded-xl p-4 backdrop-blur-sm overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-green-300 mb-3 font-mono flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              {'>'} COST ESTIMATE {'<'}
            </h3>
            {analysisData.costEstimate.range && (
              <div className="text-lg font-bold text-green-200 font-mono mb-3">
                {analysisData.costEstimate.range}
              </div>
            )}
            {analysisData.costEstimate.breakdown && (
              <div className="space-y-1 text-xs font-mono">
                {analysisData.costEstimate.breakdown.materials && (
                  <div className="flex justify-between">
                    <span className="text-green-400/60">Materials:</span>
                    <span className="text-green-200">
                      {analysisData.costEstimate.breakdown.materials}
                    </span>
                  </div>
                )}
                {analysisData.costEstimate.breakdown.labor && (
                  <div className="flex justify-between">
                    <span className="text-green-400/60">Labor:</span>
                    <span className="text-green-200">
                      {analysisData.costEstimate.breakdown.labor}
                    </span>
                  </div>
                )}
                {analysisData.costEstimate.breakdown.other && (
                  <div className="flex justify-between">
                    <span className="text-green-400/60">Other:</span>
                    <span className="text-green-200">
                      {analysisData.costEstimate.breakdown.other}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={triggerAnalysis}
        disabled={loading}
        className="w-full px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-400/20 transition-colors font-mono text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <RefreshCw className="w-3 h-3" />
        <span>RE-ANALYZE</span>
      </button>
    </div>
  );
}

