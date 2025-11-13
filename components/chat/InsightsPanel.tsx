"use client";

import { useState } from "react";

interface InsightsPanelProps {
  blueprint: {
    id: string;
    filename: string;
    uploadedAt: string;
  };
  conversations: Array<{
    id: string;
    messages: string;
    updatedAt: string;
  }>;
  conversationId?: string;
  blueprintId: string;
}

export default function InsightsPanel({
  blueprint,
  conversations,
  conversationId,
  blueprintId,
}: InsightsPanelProps) {
  const [exporting, setExporting] = useState(false);

  const totalMessages = conversations.reduce((acc, conv) => {
    try {
      const msgs = JSON.parse(conv.messages || "[]");
      return acc + msgs.length;
    } catch {
      return acc;
    }
  }, 0);

  const handleQuickQuestion = async (question: string) => {
    // Trigger a custom event that the ChatInterface can listen to
    window.dispatchEvent(
      new CustomEvent("quickQuestion", { detail: question })
    );
  };

  const handleExportConversation = async () => {
    if (conversations.length === 0) return;

    setExporting(true);
    try {
      const latestConv = conversations[0];
      const messages = JSON.parse(latestConv.messages || "[]");
      const conversationText = messages
        .map((msg: any) => {
          const content =
            typeof msg.content === "string"
              ? msg.content
              : msg.content[0]?.text || "";
          return `${msg.role.toUpperCase()}:\n${content}`;
        })
        .join("\n\n---\n\n");

      const fullText = `BLUEPRINT ANALYSIS REPORT\n${"=".repeat(
        50
      )}\n\nFile: ${blueprint.filename}\nDate: ${new Date().toLocaleString()}\n\n${"=".repeat(
        50
      )}\n\n${conversationText}`;

      const blob = new Blob([fullText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blueprint-analysis-${blueprint.filename.replace(
        /\.[^/.]+$/,
        ""
      )}-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprintId: blueprintId,
          format: "html",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blueprint-report-${blueprint.filename.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate report");
      }
    } catch (error) {
      console.error("Report generation error:", error);
      alert("Failed to generate report");
    }
  };

  const handleShareAnalysis = async () => {
    if (navigator.share) {
      try {
        const latestConv = conversations[0];
        const messages = JSON.parse(latestConv.messages || "[]");
        const summary = messages
          .filter((msg: any) => msg.role === "assistant")
          .slice(0, 2)
          .map((msg: any) => {
            const content =
              typeof msg.content === "string"
                ? msg.content
                : msg.content[0]?.text || "";
            return content.substring(0, 200);
          })
          .join("\n\n");

        await navigator.share({
          title: `Blueprint Analysis: ${blueprint.filename}`,
          text: summary,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats */}
      <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-300/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-300/20" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-cyan-200 mb-4 font-mono">
            {">"} QUICK STATS {"<"}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-cyan-300 font-mono mb-1">
                {conversations.length}
              </div>
              <div className="text-xs text-cyan-400/60 font-mono">
                CONVERSATIONS
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-300 font-mono mb-1">
                {totalMessages}
              </div>
              <div className="text-xs text-cyan-400/60 font-mono">
                TOTAL MESSAGES
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-300 font-mono mb-1">
                {new Date(blueprint.uploadedAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-cyan-400/60 font-mono">UPLOADED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative bg-[#0a0e27]/60 border-2 border-blue-300/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-300/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-300/20" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-blue-200 mb-4 font-mono">
            {">"} QUICK ACTIONS {"<"}
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleExportConversation}
              disabled={conversations.length === 0 || exporting}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:border-cyan-400 transition-colors font-mono text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? "EXPORTING..." : "> EXPORT CONVERSATION"}
            </button>
            <button
              onClick={handleGenerateReport}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:border-blue-400 transition-colors font-mono text-sm text-left"
            >
              {">"} GENERATE REPORT
            </button>
            <button
              onClick={handleShareAnalysis}
              disabled={conversations.length === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-300/20 to-blue-400/20 border border-cyan-300/30 rounded-lg text-cyan-200 hover:border-cyan-300 transition-colors font-mono text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {">"} SHARE ANALYSIS
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-cyan-300 mb-4 font-mono">
            {">"} SUGGESTED QUESTIONS {"<"}
          </h3>
          <div className="space-y-2">
            {[
              "What are the key dimensions?",
              "Identify all materials used",
              "What's the total area?",
              "List all rooms and spaces",
              "Are there any code violations?",
              "Estimate construction cost",
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="w-full px-3 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-lg text-cyan-200/80 hover:bg-cyan-400/20 hover:text-cyan-200 transition-colors font-mono text-xs text-left"
              >
                {">"} {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

