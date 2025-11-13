import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlueprintViewer from "@/components/viewer/BlueprintViewer";
import ChatInterface from "@/components/chat/ChatInterface";
import InsightsPanel from "@/components/chat/InsightsPanel";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import Link from "next/link";
import { ArrowLeft, Grid3x3, FileText, Download, Share2, BarChart3, Zap, Ruler, Layers } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

interface PageProps {
  params: {
    blueprintId: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: blueprint } = await supabase
    .from("blueprints")
    .select("*")
    .eq("id", params.blueprintId)
    .eq("userId", user.id)
    .single();

  if (!blueprint) {
    redirect("/dashboard");
  }

  // Get latest conversation for this blueprint
  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("blueprintId", blueprint.id)
    .eq("userId", user.id)
    .order("updatedAt", { ascending: false })
    .limit(1)
    .single();

  let initialMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
  if (conversation) {
    try {
      const parsed = JSON.parse(conversation.messages);
      initialMessages = parsed.map((msg: any) => ({
        role: msg.role,
        content: typeof msg.content === "string" ? msg.content : msg.content[0]?.text || "",
      }));
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Get all conversations for this blueprint for history
  const { data: allConversations = [] } = await supabase
    .from("conversations")
    .select("*")
    .eq("blueprintId", blueprint.id)
    .eq("userId", user.id)
    .order("updatedAt", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Holographic Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Premium Header */}
      <nav className="relative z-50 border-b border-cyan-400/20 backdrop-blur-md bg-[#0a0e27]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/50">
                  <Grid3x3 className="w-7 h-7 text-[#0a0e27]" />
                </div>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-lg animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 tracking-wider font-mono">
                  BLUEPRINT<span className="text-blue-400">AI</span>
                </h1>
                <div className="text-xs text-cyan-400/60 font-mono">ANALYSIS MODULE</div>
              </div>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-cyan-300/80 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider border-b border-transparent hover:border-cyan-400 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>[DASHBOARD]</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Header */}
        <div className="mb-6 animate-fade-in">
          <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30 flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#0a0e27]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-cyan-300 font-mono truncate mb-1">
                    {blueprint.filename}
                  </h2>
                  <div className="flex items-center space-x-4 text-xs font-mono text-cyan-400/60">
                    <span>{blueprint.fileType.toUpperCase()}</span>
                    <span>•</span>
                    <span>{new Date(blueprint.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={blueprint.supabaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-400/20 transition-colors font-mono text-sm flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Blueprint Viewer */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-6 backdrop-blur-sm overflow-hidden h-[calc(100vh-250px)] flex flex-col animate-fade-in">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
              <div className="relative z-10 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-cyan-300 font-mono">
                    {'>'} BLUEPRINT VIEWER {'<'}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400/60">
                    <Ruler className="w-4 h-4" />
                    <span>MEASUREMENT TOOLS</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-cyan-400/20">
                  <BlueprintViewer
                    url={blueprint.supabaseUrl}
                    fileType={blueprint.fileType}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="lg:col-span-4">
            <div className="relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm overflow-hidden h-[calc(100vh-250px)] flex flex-col animate-fade-in">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
              <div className="relative z-10 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-300 font-mono">
                    {'>'} AI ANALYSIS {'<'}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs font-mono text-blue-400/60">
                    <Zap className="w-4 h-4" />
                    <span>GPT-4 VISION</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    blueprintId={blueprint.id}
                    conversationId={conversation?.id}
                    initialMessages={initialMessages}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Insights Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Auto-Analysis Panel */}
            <AnalysisPanel
              blueprintId={blueprint.id}
              initialData={blueprint.analysisData as any}
              analysisStatus={blueprint.analysisStatus}
            />
            
            {/* Insights Panel */}
            <InsightsPanel 
              blueprint={blueprint} 
              conversations={allConversations || []}
              conversationId={conversation?.id}
              blueprintId={blueprint.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

