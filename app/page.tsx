"use client";

import Link from "next/link";
import { Upload, MessageSquare, Zap, Shield, CheckCircle2, ArrowRight, Sparkles, FileText, Brain, Lock, Scan, Grid3x3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    // Scanning line animation
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 2) % 100);
    }, 50);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-400/30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-400/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-400/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-400/30" />
      </div>

      {/* Scanning Line Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `linear-gradient(to bottom, transparent ${scanLine}%, rgba(6, 182, 212, 0.1) ${scanLine}%, rgba(6, 182, 212, 0.1) ${scanLine + 2}%, transparent ${scanLine + 2}%)`,
        }}
      />

      {/* Holographic Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            transition: "all 0.5s ease-out",
            boxShadow: "0 0 200px rgba(6, 182, 212, 0.3)",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation - Jarvis Style */}
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
                <div className="text-xs text-cyan-400/60 font-mono">SYSTEM ONLINE</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/login"
                className="text-cyan-300/80 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider border-b border-transparent hover:border-cyan-400"
              >
                [ACCESS]
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105 flex items-center space-x-2 font-mono text-sm tracking-wider"
              >
                <span>INITIALIZE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Jarvis Interface */}
      <section className="relative z-10 pt-32 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-cyan-400 font-mono tracking-wider">GPT-4 VISION ACTIVE</span>
            </div>

            {/* Main Heading - Blueprint Style */}
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-4 font-mono tracking-tight leading-none">
                ANALYZE
              </h1>
              <div className="absolute inset-0 text-7xl md:text-9xl font-black text-cyan-400/20 blur-sm font-mono">
                ANALYZE
              </div>
            </div>

            <div className="relative mb-8">
              <h2 className="text-6xl md:text-8xl font-black text-cyan-300 font-mono tracking-tight leading-none">
                BLUEPRINTS
              </h2>
              <div className="absolute inset-0 text-6xl md:text-8xl font-black text-cyan-400/20 blur-sm font-mono">
                BLUEPRINTS
              </div>
            </div>

            <div className="relative mb-12">
              <p className="text-xl md:text-2xl text-cyan-200/80 font-mono max-w-3xl mx-auto leading-relaxed">
                {'>'} UPLOAD ARCHITECTURAL DRAWINGS {'<'}
                <br />
                {'>'} QUERY AI ANALYSIS ENGINE {'<'}
                <br />
                {'>'} RECEIVE INSTANT TECHNICAL INSIGHTS {'<'}
              </p>
            </div>

            {/* CTA Buttons - Tech Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                href="/register"
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold hover:shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-mono tracking-wider overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">[START ANALYSIS]</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-10 py-5 border-2 border-cyan-400/50 text-cyan-400 rounded-lg font-bold hover:bg-cyan-400/10 hover:border-cyan-400 transition-all flex items-center justify-center font-mono tracking-wider backdrop-blur-sm"
              >
                [VIEW DEMO]
              </Link>
            </div>

            {/* System Stats - Jarvis Style */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-cyan-400 mb-2 font-mono">10K+</div>
                <div className="text-xs text-cyan-400/60 font-mono tracking-wider">FILES PROCESSED</div>
              </div>
              <div className="text-center p-6 bg-blue-400/5 border border-blue-400/20 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-blue-400 mb-2 font-mono">99.9%</div>
                <div className="text-xs text-blue-400/60 font-mono tracking-wider">ACCURACY RATE</div>
              </div>
              <div className="text-center p-6 bg-cyan-300/5 border border-cyan-300/20 rounded-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-cyan-300 mb-2 font-mono">24/7</div>
                <div className="text-xs text-cyan-300/60 font-mono tracking-wider">SYSTEM ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Technical Grid */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <h2 className="text-5xl md:text-7xl font-black text-cyan-400 font-mono tracking-tight">
                SYSTEM CAPABILITIES
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2" />
            </div>
            <p className="text-xl text-cyan-300/70 font-mono max-w-2xl mx-auto">
              {'>'} ADVANCED AI PROCESSING MODULES {'<'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-lg p-8 hover:border-cyan-400 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-cyan-400/30">
                  <Upload className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-cyan-400/60 text-xs font-mono mb-2 tracking-wider">MODULE 01</div>
                <h3 className="text-2xl font-bold text-cyan-300 mb-3 font-mono">
                  FILE UPLOAD
                </h3>
                <p className="text-cyan-200/60 leading-relaxed font-mono text-sm">
                  {'>'} SUPPORT: PDF, DWG, DXF, PNG, JPG
                  <br />
                  {'>'} DRAG & DROP INTERFACE
                  <br />
                  {'>'} INSTANT PROCESSING
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-lg p-8 hover:border-blue-400 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-400/30">
                  <Brain className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-blue-400/60 text-xs font-mono mb-2 tracking-wider">MODULE 02</div>
                <h3 className="text-2xl font-bold text-blue-300 mb-3 font-mono">
                  AI ANALYSIS
                </h3>
                <p className="text-blue-200/60 leading-relaxed font-mono text-sm">
                  {'>'} GPT-4 VISION ENGINE
                  <br />
                  {'>'} DIMENSION ANALYSIS
                  <br />
                  {'>'} MATERIAL IDENTIFICATION
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-lg p-8 hover:border-cyan-300 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-300/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-300/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-cyan-300/30">
                  <Zap className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-cyan-300/60 text-xs font-mono mb-2 tracking-wider">MODULE 03</div>
                <h3 className="text-2xl font-bold text-cyan-200 mb-3 font-mono">
                  INSTANT RESULTS
                </h3>
                <p className="text-cyan-200/60 leading-relaxed font-mono text-sm">
                  {'>'} REAL-TIME PROCESSING
                  <br />
                  {'>'} {'<'} 2 SECOND RESPONSE
                  <br />
                  {'>'} DETAILED INSIGHTS
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-lg p-8 hover:border-cyan-400 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-cyan-400/30">
                  <MessageSquare className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-cyan-400/60 text-xs font-mono mb-2 tracking-wider">MODULE 04</div>
                <h3 className="text-2xl font-bold text-cyan-300 mb-3 font-mono">
                  CONVERSATIONAL AI
                </h3>
                <p className="text-cyan-200/60 leading-relaxed font-mono text-sm">
                  {'>'} NATURAL LANGUAGE QUERIES
                  <br />
                  {'>'} CONTEXTUAL FOLLOW-UPS
                  <br />
                  {'>'} DEEP DIVE ANALYSIS
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-lg p-8 hover:border-blue-400 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-400/30">
                  <FileText className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-blue-400/60 text-xs font-mono mb-2 tracking-wider">MODULE 05</div>
                <h3 className="text-2xl font-bold text-blue-300 mb-3 font-mono">
                  MULTI-FORMAT
                </h3>
                <p className="text-blue-200/60 leading-relaxed font-mono text-sm">
                  {'>'} PDF SUPPORT
                  <br />
                  {'>'} CAD FILES (DWG, DXF)
                  <br />
                  {'>'} IMAGE FORMATS
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-[#0a0e27]/60 border-2 border-cyan-300/30 rounded-lg p-8 hover:border-cyan-300 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-300/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-300/20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-cyan-300/30">
                  <Lock className="w-8 h-8 text-[#0a0e27]" />
                </div>
                <div className="text-cyan-300/60 text-xs font-mono mb-2 tracking-wider">MODULE 06</div>
                <h3 className="text-2xl font-bold text-cyan-200 mb-3 font-mono">
                  SECURE STORAGE
                </h3>
                <p className="text-cyan-200/60 leading-relaxed font-mono text-sm">
                  {'>'} ENCRYPTED FILES
                  <br />
                  {'>'} PRIVATE CLOUD
                  <br />
                  {'>'} ENTERPRISE SECURITY
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Process Flow */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-cyan-400/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-cyan-400 font-mono tracking-tight mb-6">
              PROCESS FLOW
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent max-w-md mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-4xl font-bold text-[#0a0e27] font-mono shadow-lg shadow-cyan-400/50">
                  01
                </div>
                <div className="absolute inset-0 bg-cyan-400/30 rounded-lg animate-ping" />
              </div>
              <div className="text-cyan-400/60 text-xs font-mono mb-4 tracking-wider">STEP 01</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 font-mono">UPLOAD</h3>
              <p className="text-cyan-200/60 font-mono text-sm">
                {'>'} DRAG & DROP FILE
                <br />
                {'>'} AUTO-DETECT FORMAT
                <br />
                {'>'} VERIFY INTEGRITY
              </p>
            </div>

            <div className="text-center relative">
              <div className="absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 hidden md:block" />
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-4xl font-bold text-[#0a0e27] font-mono shadow-lg shadow-blue-400/50">
                  02
                </div>
                <div className="absolute inset-0 bg-blue-400/30 rounded-lg animate-ping" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="text-blue-400/60 text-xs font-mono mb-4 tracking-wider">STEP 02</div>
              <h3 className="text-2xl font-bold text-blue-300 mb-4 font-mono">QUERY</h3>
              <p className="text-blue-200/60 font-mono text-sm">
                {'>'} INPUT QUESTION
                <br />
                {'>'} AI PROCESSING
                <br />
                {'>'} CONTEXT ANALYSIS
              </p>
            </div>

            <div className="text-center relative">
              <div className="absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 hidden md:block" />
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg flex items-center justify-center text-4xl font-bold text-[#0a0e27] font-mono shadow-lg shadow-cyan-300/50">
                  03
                </div>
                <div className="absolute inset-0 bg-cyan-300/30 rounded-lg animate-ping" style={{ animationDelay: "1s" }} />
              </div>
              <div className="text-cyan-300/60 text-xs font-mono mb-4 tracking-wider">STEP 03</div>
              <h3 className="text-2xl font-bold text-cyan-200 mb-4 font-mono">ANALYZE</h3>
              <p className="text-cyan-200/60 font-mono text-sm">
                {'>'} GENERATE INSIGHTS
                <br />
                {'>'} DETAILED REPORT
                <br />
                {'>'} INSTANT DELIVERY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Jarvis Terminal */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative border-2 border-cyan-400/50 rounded-lg p-12 md:p-16 bg-[#0a0e27]/80 backdrop-blur-md overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
            
            <div className="relative z-10 text-center">
              <div className="text-cyan-400/60 text-sm font-mono mb-4 tracking-wider">
                {'>'} SYSTEM READY {'<'}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-cyan-400 mb-6 font-mono tracking-tight">
                INITIALIZE ANALYSIS
              </h2>
              <p className="text-xl text-cyan-300/80 mb-10 max-w-2xl mx-auto font-mono">
                {'>'} JOIN ARCHITECTS & ENGINEERS
                <br />
                {'>'} LEVERAGE AI TECHNOLOGY
                <br />
                {'>'} ACCELERATE WORKFLOW
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/register"
                  className="group relative px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-mono tracking-wider overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">[START SESSION]</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-5 border-2 border-cyan-400/50 text-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-400/10 transition-all font-mono tracking-wider"
                >
                  [ACCESS SYSTEM]
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-cyan-400/60 font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>NO CREDENTIALS REQUIRED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>TRIAL AVAILABLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Tech Style */}
      <footer className="relative z-10 border-t border-cyan-400/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-5 h-5 text-[#0a0e27]" />
              </div>
              <p className="text-cyan-400/60 font-mono text-sm tracking-wider">
                {'>'} BLUEPRINTAI v1.0.0 | SYSTEM ONLINE {'<'}
              </p>
            </div>
            <div className="flex space-x-8 font-mono text-sm">
              <Link href="/privacy" className="text-cyan-400/60 hover:text-cyan-400 transition-colors tracking-wider">
                [PRIVACY]
              </Link>
              <Link href="/terms" className="text-cyan-400/60 hover:text-cyan-400 transition-colors tracking-wider">
                [TERMS]
              </Link>
              <Link href="/contact" className="text-cyan-400/60 hover:text-cyan-400 transition-colors tracking-wider">
                [CONTACT]
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
