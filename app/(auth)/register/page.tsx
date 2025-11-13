"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Grid3x3, UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || null,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Registration failed");
        return;
      }

      if (data.user) {
        // Sync user to our database
        const response = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: name || null,
          }),
        });

        router.push("/login?registered=true");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden flex items-center justify-center px-4 py-20">
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
        <div 
          className="absolute w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b border-cyan-400/20 backdrop-blur-md bg-[#0a0e27]/80">
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
                <div className="text-xs text-cyan-400/60 font-mono">SYSTEM INITIALIZATION</div>
              </div>
            </Link>
            <Link
              href="/login"
              className="text-cyan-300/80 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider border-b border-transparent hover:border-cyan-400"
            >
              [LOGIN]
            </Link>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-4 shadow-lg shadow-cyan-400/50">
                <UserPlus className="w-10 h-10 text-[#0a0e27]" />
              </div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-2 font-mono">
                INITIALIZE ACCOUNT
              </h1>
              <p className="text-cyan-200/80 font-mono">
                {'>'} CREATE NEW USER PROFILE {'<'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-lg font-mono text-sm">
                  {'>'} ERROR: {error} {'<'}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider"
                >
                  {'>'} NAME (OPTIONAL) {'<'}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider"
                >
                  {'>'} EMAIL ADDRESS {'<'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider"
                >
                  {'>'} PASSWORD {'<'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-cyan-400/50 mt-2 font-mono">
                  {'>'} MINIMUM 6 CHARACTERS REQUIRED {'<'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold hover:shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 font-mono tracking-wider overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
                    <span className="relative z-10">INITIALIZING...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">[CREATE ACCOUNT]</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-cyan-400/20">
              <p className="text-cyan-400/60 font-mono text-sm mb-2">
                {'>'} ALREADY REGISTERED? {'<'}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm tracking-wider border-b border-transparent hover:border-cyan-400"
              >
                [ACCESS EXISTING ACCOUNT]
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
