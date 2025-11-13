import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlueprintComparison from "@/components/comparison/BlueprintComparison";
import Link from "next/link";
import { ArrowLeft, Grid3x3 } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

interface PageProps {
  searchParams: {
    blueprint1?: string;
    blueprint2?: string;
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { blueprint1: blueprint1Id, blueprint2: blueprint2Id } = searchParams;

  if (!blueprint1Id || !blueprint2Id) {
    redirect("/dashboard");
  }

  // Get both blueprints
  const { data: blueprints, error } = await supabase
    .from("blueprints")
    .select("*")
    .eq("userId", user.id)
    .in("id", [blueprint1Id, blueprint2Id]);

  if (error || !blueprints || blueprints.length !== 2) {
    redirect("/dashboard");
  }

  const [blueprint1, blueprint2] = blueprints;

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Holographic Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
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
                <div className="text-xs text-cyan-400/60 font-mono">
                  COMPARISON MODULE
                </div>
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

      {/* Comparison Component */}
      <div className="relative z-10 pt-8">
        <BlueprintComparison
          blueprint1={blueprint1}
          blueprint2={blueprint2}
        />
      </div>
    </div>
  );
}

