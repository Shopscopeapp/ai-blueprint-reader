"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Copy, Check, Download, Share2, Sparkles, Zap, FileText, BarChart3 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  blueprintId: string;
  conversationId?: string;
  initialMessages?: Message[];
}

export default function ChatInterface({
  blueprintId,
  conversationId,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleQuickQuestion = (event: CustomEvent) => {
      const question = event.detail;
      setInput(question);
      textareaRef.current?.focus();
      // Auto-submit after a short delay
      setTimeout(() => {
        const form = textareaRef.current?.form;
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }, 100);
    };

    window.addEventListener('quickQuestion', handleQuickQuestion as EventListener);
    return () => {
      window.removeEventListener('quickQuestion', handleQuickQuestion as EventListener);
    };
  }, []);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");
    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-conversation-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprintId,
          message: input,
          conversationId: currentConversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-cyan-300 mb-3 font-mono">
              {'>'} READY TO ANALYZE {'<'}
            </h3>
            <p className="text-cyan-200/80 font-mono text-sm">
              Ask me anything about your blueprint
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } group`}
          >
            <div
              className={`relative max-w-[85%] rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27]"
                  : "bg-[#0a0e27]/80 border border-cyan-400/30 text-cyan-200"
              }`}
            >
              {message.role === "assistant" && (
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-cyan-400/20 rounded"
                  title="Copy message"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              )}
              {message.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none font-mono">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                      ),
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-bold text-cyan-100">{children}</strong>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-cyan-400/20 px-1.5 py-0.5 rounded text-sm text-cyan-100">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-[#0a0e27] border border-cyan-400/30 rounded-lg p-3 my-2 overflow-x-auto text-sm">
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-cyan-100 mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-cyan-100 mb-2">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-bold text-cyan-100 mb-2">{children}</h3>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-cyan-400/50 pl-4 my-2 italic text-cyan-200/80">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                          <table className="min-w-full border border-cyan-400/30">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-cyan-400/30 px-3 py-2 bg-cyan-400/10 text-left font-bold">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-cyan-400/30 px-3 py-2">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-mono text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0a0e27]/80 border border-cyan-400/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span className="text-cyan-300 font-mono text-sm">AI is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-cyan-400/20 p-4 bg-[#0a0e27]/40">
        {messages.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={exportConversation}
                className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-400/20 transition-colors font-mono text-xs flex items-center space-x-1"
                title="Export conversation"
              >
                <Download className="w-3 h-3" />
                <span>EXPORT</span>
              </button>
            </div>
            <div className="text-xs text-cyan-400/60 font-mono">
              {messages.length} {messages.length === 1 ? 'MESSAGE' : 'MESSAGES'}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Ask a question about the blueprint..."
              className="w-full px-4 py-3 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono text-sm resize-none"
              disabled={loading}
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center font-mono font-bold"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>SEND</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

