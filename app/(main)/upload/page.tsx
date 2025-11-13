import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FileUpload from "@/components/upload/FileUpload";
import Link from "next/link";
import { ArrowLeft, Grid3x3, Upload as UploadIcon } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
                <div className="text-xs text-cyan-400/60 font-mono">FILE UPLOAD MODULE</div>
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-2 font-mono">
                UPLOAD BLUEPRINT
              </h2>
              <p className="text-xl text-cyan-200/80 font-mono">
                {'>'} SELECT FILE TO BEGIN ANALYSIS {'<'}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm overflow-hidden animate-fade-in">
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400" />

          <div className="relative z-10">
            {/* Info Section */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-4 shadow-lg shadow-cyan-400/50">
                <UploadIcon className="w-8 h-8 text-[#0a0e27]" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-3 font-mono">
                SUPPORTED FORMATS
              </h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm font-mono">
                <span className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-300">
                  PDF
                </span>
                <span className="px-4 py-2 bg-blue-400/10 border border-blue-400/30 rounded-lg text-blue-300">
                  PNG
                </span>
                <span className="px-4 py-2 bg-cyan-300/10 border border-cyan-300/30 rounded-lg text-cyan-200">
                  JPG
                </span>
                <span className="px-4 py-2 bg-blue-300/10 border border-blue-300/30 rounded-lg text-blue-200">
                  DWG
                </span>
                <span className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-300">
                  DXF
                </span>
              </div>
            </div>

            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}

