"use client";

import { useState } from "react";
import Link from "next/link";
import { Grid3x3, ArrowLeft, Mail, MessageSquare, Send, Loader2, CheckCircle2, Github, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate form submission (you can integrate with your backend/email service)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
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
                <div className="text-xs text-cyan-400/60 font-mono">CONTACT US</div>
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-6 shadow-lg shadow-cyan-400/50">
              <MessageSquare className="w-10 h-10 text-[#0a0e27]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 mb-4 font-mono">
              CONTACT US
            </h1>
            <p className="text-xl text-cyan-200/80 font-mono">
              {'>'} GET IN TOUCH WITH OUR TEAM {'<'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="relative bg-[#0a0e27]/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/20" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-cyan-300 mb-6 font-mono">
                  {'>'} CONTACT INFORMATION {'<'}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30 flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#0a0e27]" />
                    </div>
                    <div>
                      <h3 className="text-cyan-300 font-bold font-mono mb-1">EMAIL</h3>
                      <p className="text-cyan-200/80 font-mono text-sm">
                        support@blueprintai.com
                      </p>
                      <p className="text-cyan-200/80 font-mono text-sm">
                        info@blueprintai.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-400/30 flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[#0a0e27]" />
                    </div>
                    <div>
                      <h3 className="text-blue-300 font-bold font-mono mb-1">RESPONSE TIME</h3>
                      <p className="text-cyan-200/80 font-mono text-sm">
                        We typically respond within 24-48 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-cyan-400/20">
                  <h3 className="text-cyan-300 font-bold font-mono mb-4">
                    {'>'} FOLLOW US {'<'}
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center hover:border-cyan-400 transition-colors"
                    >
                      <Github className="w-5 h-5 text-cyan-400" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-br from-cyan-300/20 to-blue-400/20 border border-cyan-300/30 rounded-lg flex items-center justify-center hover:border-cyan-300 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-cyan-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative bg-[#0a0e27]/60 border-2 border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/20" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-blue-300 mb-6 font-mono">
                {'>'} SEND MESSAGE {'<'}
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-400/50 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#0a0e27]" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-300 mb-2 font-mono">
                    MESSAGE SENT
                  </h3>
                  <p className="text-cyan-200/80 font-mono text-sm mb-6">
                    We&apos;ll get back to you soon!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/20 border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-lg font-mono text-sm">
                      {'>'} ERROR: {error} {'<'}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider">
                      {'>'} NAME {'<'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider">
                      {'>'} EMAIL {'<'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider">
                      {'>'} SUBJECT {'<'}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wider">
                      {'>'} MESSAGE {'<'}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    />
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
                        <span className="relative z-10">SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">[SEND MESSAGE]</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

