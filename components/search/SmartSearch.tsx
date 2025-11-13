"use client";

import { useState } from "react";
import { Search, Loader2, FileText, X } from "lucide-react";
import Link from "next/link";

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all blueprints..."
          className="w-full px-4 py-3 pl-12 bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-lg text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono text-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-[#0a0e27]/95 border-2 border-cyan-400/30 rounded-lg backdrop-blur-md z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
              <p className="text-cyan-300 font-mono text-sm">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-cyan-300/60 font-mono text-sm">No results found</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/chat/${result.id}`}
                  className="block p-3 hover:bg-cyan-400/10 rounded-lg transition-colors border border-transparent hover:border-cyan-400/30 mb-2"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-cyan-300 font-mono text-sm truncate">
                        {result.filename}
                      </div>
                      {result.reason && (
                        <div className="text-xs text-cyan-400/60 font-mono mt-1">
                          {result.reason}
                        </div>
                      )}
                      {result.relevance && (
                        <div className="text-xs text-cyan-400/40 font-mono mt-1">
                          {(result.relevance * 100).toFixed(0)}% match
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

