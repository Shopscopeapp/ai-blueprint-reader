import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Upload, 
  File, 
  MessageSquare, 
  Plus, 
  BarChart3, 
  Clock, 
  Zap, 
  FolderOpen,
  TrendingUp,
  Activity,
  Grid3x3,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  FileType
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import SmartSearch from "@/components/search/SmartSearch";
import ComparisonSelector from "@/components/dashboard/ComparisonSelector";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user exists in our database
  await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || null,
      },
      {
        onConflict: "id",
      }
    );

  // Get blueprints
  const { data: blueprints = [] } = await supabase
    .from("blueprints")
    .select("*")
    .eq("userId", user.id)
    .order("uploadedAt", { ascending: false })
    .limit(10);

  // Get conversations with blueprint data
  const { data: conversations = [] } = await supabase
    .from("conversations")
    .select(`
      *,
      blueprints (
        id,
        filename
      )
    `)
    .eq("userId", user.id)
    .order("updatedAt", { ascending: false })
    .limit(5);

  // Get total counts for stats
  const { count: totalBlueprints } = await supabase
    .from("blueprints")
    .select("*", { count: "exact", head: true })
    .eq("userId", user.id);

  const { count: totalConversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("userId", user.id);

  // Calculate stats
  const stats = {
    blueprints: totalBlueprints || 0,
    conversations: totalConversations || 0,
    recentActivity: conversations?.length || 0,
    avgPerDay: blueprints && blueprints.length > 0 ? Math.round((blueprints.length / 30) * 10) / 10 : 0,
  };

  // Helper function to get file type icon
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return FileText;
    if (fileType.includes("image") || fileType.includes("png") || fileType.includes("jpg") || fileType.includes("jpeg")) return ImageIcon;
    if (fileType.includes("dwg") || fileType.includes("dxf")) return FileType;
    return File;
  };

  // Helper function to format date
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

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
            <div className="flex items-center space-x-3">
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
                <div className="text-xs text-cyan-400/60 font-mono">DASHBOARD</div>
              </div>
            </div>
                <div className="flex items-center space-x-6">
                  <div className="hidden md:block w-64">
                    <SmartSearch />
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-cyan-400/80 font-mono">{user.user_metadata?.name || "User"}</div>
                    <div className="text-xs text-cyan-400/50 font-mono">{user.email}</div>
                  </div>
                  <LogoutButton />
                </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-2 font-mono">
                Welcome back{user.user_metadata?.name ? `, ${user.user_metadata.name.split(" ")[0]}` : ""}
              </h2>
              <p className="text-xl text-cyan-200/80 font-mono">
                {'>'} SYSTEM STATUS: ONLINE {'<'}
              </p>
            </div>
            <Link
              href="/upload"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold hover:shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-105 flex items-center space-x-2 font-mono tracking-wider overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">UPLOAD</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400 transition-all backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30">
                  <FolderOpen className="w-6 h-6 text-[#0a0e27]" />
                </div>
                <TrendingUp className="w-5 h-5 text-cyan-400/60" />
              </div>
              <div className="text-3xl font-bold text-cyan-300 mb-1 font-mono">{stats.blueprints}</div>
              <div className="text-sm text-cyan-400/60 font-mono tracking-wider">TOTAL BLUEPRINTS</div>
            </div>
          </div>

          <div className="group relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-xl p-6 hover:border-blue-400 transition-all backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-400/30">
                  <MessageSquare className="w-6 h-6 text-[#0a0e27]" />
                </div>
                <Activity className="w-5 h-5 text-blue-400/60" />
              </div>
              <div className="text-3xl font-bold text-blue-300 mb-1 font-mono">{stats.conversations}</div>
              <div className="text-sm text-blue-400/60 font-mono tracking-wider">CONVERSATIONS</div>
            </div>
          </div>

          <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-xl p-6 hover:border-cyan-300 transition-all backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-300/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-300/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-300/30">
                  <Clock className="w-6 h-6 text-[#0a0e27]" />
                </div>
                <Zap className="w-5 h-5 text-cyan-300/60" />
              </div>
              <div className="text-3xl font-bold text-cyan-200 mb-1 font-mono">{stats.recentActivity}</div>
              <div className="text-sm text-cyan-300/60 font-mono tracking-wider">RECENT ACTIVITY</div>
            </div>
          </div>

          <div className="group relative bg-[#0a0e27]/60 border-2 border-blue-300/30 rounded-xl p-6 hover:border-blue-300 transition-all backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-300/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-300/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-300/30">
                  <BarChart3 className="w-6 h-6 text-[#0a0e27]" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-300/60" />
              </div>
              <div className="text-3xl font-bold text-blue-200 mb-1 font-mono">{stats.avgPerDay}</div>
              <div className="text-sm text-blue-300/60 font-mono tracking-wider">AVG/DAY</div>
            </div>
          </div>
        </div>

        {/* Blueprints Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-black text-cyan-400 mb-2 font-mono tracking-tight">
                BLUEPRINT LIBRARY
              </h3>
              <div className="h-1 bg-gradient-to-r from-cyan-400 to-transparent w-32" />
            </div>
            {blueprints && blueprints.length > 0 && (
              <Link
                href="/upload"
                className="text-cyan-400/80 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider flex items-center space-x-2"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {!blueprints || blueprints.length === 0 ? (
            <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-16 text-center backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-400/20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-400/20" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <File className="w-10 h-10 text-cyan-400/60" />
                </div>
                <h4 className="text-2xl font-bold text-cyan-300 mb-2 font-mono">NO BLUEPRINTS YET</h4>
                <p className="text-cyan-200/60 mb-8 font-mono">Upload your first blueprint to get started</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold hover:shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-105 font-mono tracking-wider"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  UPLOAD BLUEPRINT
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprints && blueprints.map((blueprint, index) => {
                const FileIcon = getFileIcon(blueprint.fileType);
                return (
                  <Link
                    key={blueprint.id}
                    href={`/chat/${blueprint.id}`}
                    className="group relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400 transition-all backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform">
                          <FileIcon className="w-7 h-7 text-[#0a0e27]" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-cyan-400/60 font-mono mb-1">
                            {formatDate(blueprint.uploadedAt)}
                          </div>
                          <div className="text-[10px] text-cyan-400/40 font-mono uppercase">
                            {blueprint.fileType.split("/").pop()?.toUpperCase() || "FILE"}
                          </div>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-cyan-300 mb-3 font-mono truncate group-hover:text-cyan-200 transition-colors">
                        {blueprint.filename}
                      </h4>
                      <div className="flex items-center justify-between pt-4 border-t border-cyan-400/20">
                        <div className="flex items-center text-cyan-400 text-sm font-mono">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span>CHAT</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-cyan-400/60 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        {conversations && conversations.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-black text-blue-400 mb-2 font-mono tracking-tight">
                  RECENT ACTIVITY
                </h3>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-transparent w-32" />
              </div>
            </div>
            <div className="relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-blue-400/20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-400/20" />
              <div className="relative z-10 space-y-3">
                {conversations && conversations.map((conversation: any, index: number) => (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.blueprintId}`}
                    className="group block p-4 bg-[#0a0e27]/40 border border-blue-400/20 rounded-lg hover:border-blue-400/40 hover:bg-[#0a0e27]/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-400/30 flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-[#0a0e27]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-300 font-bold font-mono truncate group-hover:text-blue-200 transition-colors">
                            {conversation.blueprints?.filename || "Unknown Blueprint"}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <p className="text-xs text-blue-400/60 font-mono">
                              {formatDate(conversation.updatedAt)}
                            </p>
                            <span className="text-blue-400/40">•</span>
                            <p className="text-xs text-blue-400/60 font-mono">
                              {new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Selector - Floating Button */}
        {blueprints && blueprints.length >= 2 && (
          <ComparisonSelector blueprints={blueprints} />
        )}
      </div>
    </div>
  );
}

