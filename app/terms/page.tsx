import Link from "next/link";
import { Grid3x3, FileText, ArrowLeft, Scale, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function TermsPage() {
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
            <Link href="/" className="flex items-center space-x-3">
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
                <div className="text-xs text-cyan-400/60 font-mono">TERMS OF SERVICE</div>
              </div>
            </Link>
            <Link
              href="/"
              className="text-cyan-300/80 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider border-b border-transparent hover:border-cyan-400 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>[HOME]</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-6 shadow-lg shadow-cyan-400/50">
              <Scale className="w-10 h-10 text-[#0a0e27]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-4 font-mono">
              TERMS OF SERVICE
            </h1>
            <p className="text-xl text-cyan-200/80 font-mono">
              {'>'} LAST UPDATED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {'<'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 animate-fade-in">
          {/* Section 1 */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-300 font-mono">1. ACCEPTANCE OF TERMS</h2>
              </div>
              <div className="space-y-4 text-cyan-200/80 font-mono text-sm leading-relaxed">
                <p>
                  By accessing and using BlueprintAI, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300 font-mono">2. USE LICENSE</h2>
              </div>
              <div className="space-y-4 text-cyan-200/80 font-mono text-sm leading-relaxed">
                <p>Permission is granted to use BlueprintAI for personal and commercial purposes, subject to the following restrictions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must not use the service for illegal purposes</li>
                  <li>You must not attempt to reverse engineer or hack the service</li>
                  <li>You must not upload malicious files or content</li>
                  <li>You must not share your account credentials</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-300/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-300/20" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-300/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-200 font-mono">3. DISCLAIMER</h2>
              </div>
              <div className="space-y-4 text-cyan-200/80 font-mono text-sm leading-relaxed">
                <p>
                  The AI analysis provided by BlueprintAI is for informational purposes only. 
                  The service does not guarantee:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>100% accuracy in analysis results</li>
                  <li>Compliance with building codes or regulations</li>
                  <li>Professional engineering or architectural advice</li>
                  <li>Liability for decisions made based on AI analysis</li>
                </ul>
                <p className="text-cyan-300 font-bold">
                  Always consult with qualified professionals for critical decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-blue-300/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-300/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-300/20" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-blue-200 font-mono">4. LIMITATIONS OF LIABILITY</h2>
              </div>
              <div className="space-y-4 text-cyan-200/80 font-mono text-sm leading-relaxed">
                <p>
                  In no event shall BlueprintAI or its suppliers be liable for any damages 
                  (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                  arising out of the use or inability to use the service.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-300 font-mono">5. MODIFICATIONS</h2>
              </div>
              <div className="space-y-4 text-cyan-200/80 font-mono text-sm leading-relaxed">
                <p>
                  BlueprintAI may revise these terms of service at any time without notice. 
                  By using this service you are agreeing to be bound by the then current version 
                  of these terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

