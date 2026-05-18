"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import { 
  LogOut, Plus, Send, Loader2, AlertCircle,
  BrainCircuit
} from "lucide-react";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [emptyClicked, setEmptyClicked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else {
      fetchHistory();
    }
  }, [authLoading]);

  const fetchHistory = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("ideas")
      .select("id, title, description, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch error:", error.message);
    if (data) setHistory(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!idea.trim()) {
      if (!emptyClicked) {
        setEmptyClicked(true);
        setError("Please write an Idea so we can validate it.");
      }
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, userId: user?.id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      if (!data.result) throw new Error("AI returned empty response");

      setResponse(data.result);

      const { data: inserted, error: insertError } = await supabase
        .from("ideas")
        .insert([{ title: idea, description: data.result, user_id: user?.id }])
        .select("id, title, description, created_at");

      if (insertError) {
        console.error("Insert error:", insertError.message);
      } else if (inserted) {
        setHistory([inserted[0], ...history]);
      }

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix për glitch-in: mos e rendero faqen derisa authLoading të përfundojë
  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#063376]">
        <Loader2 className="animate-spin text-[#1C5E92]" size={40} />
      </div>
    );
  }

  if (!user) {
    return null; // mos e shfaq faqen fare derisa të bëhet redirect
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#063376] via-[#0B4D97] to-[#3A7BD5] text-[#063376] overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-[#063376] flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 font-black text-2xl text-white tracking-tighter">
            <div className="bg-[#0B4D97] p-2 rounded-xl">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <span>BusinessLogic<span className="text-[#A1C4FF]">.ai</span></span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <button 
            onClick={() => { setResponse(""); setIdea(""); setError(""); setEmptyClicked(false); }}
            className="w-full flex items-center justify-center gap-2 bg-[#1C5E92] hover:bg-[#0B4D97] text-white p-4 rounded-2xl font-bold transition-all mb-10 shadow-lg"
          >
            <Plus size={18} /> New Analysis
          </button>

          <h3 className="text-sm font-bold text-[#A1C4FF] mb-4">Search History (last 30 days)</h3>

          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setResponse(item.description); setIdea(item.title); }}
                className="p-4 rounded-2xl bg-[#0B4D97]/30 border hover:border-[#1C5E92]/30 hover:bg-[#0B4D97]/50 cursor-pointer transition-all shadow-md"
              >
                <p className="text-sm font-bold text-[#A1C4FF] mb-2">{item.title || "Untitled Idea"}</p>
                <p className="text-xs text-gray-300 truncate">{item.description || "No response yet"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-[#A1C4FF]/10 bg-[#04285a]">
          <button 
            onClick={() => router.push("/about")}
            className="flex items-center gap-3 text-[#A1C4FF] hover:text-[#0B4D97] p-3 w-full rounded-xl transition-all font-bold text-sm mb-3"
          >
            About Us
          </button>

          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="flex items-center gap-3 text-[#A1C4FF] hover:text-[#0B4D97] p-3 w-full rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-4xl mx-auto">
          {!response ? (
            <div className="text-center flex flex-col justify-center min-h-[70vh]">
              <h1 className="text-6xl font-black text-[#063376] mb-6">
                Refine your Business Logic
              </h1>

              <form onSubmit={handleSubmit} className="bg-[#0B4D97]/90 p-6 rounded-2xl shadow-lg" noValidate>
                <textarea
                  className="w-full min-h-[220px] p-4 rounded-xl bg-[#063376]/80 text-white placeholder:text-[#A1C4FF] border border-[#1C5E92]/40 focus:border-[#A1C4FF] focus:ring-2 focus:ring-[#1C5E92]/50 outline-none transition-all"
                  placeholder="Describe your idea..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 px-6 py-3 rounded-xl flex items-center gap-2 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#063376] text-white"}`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {loading ? "Analyzing..." : "Validate Idea"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#063376]/90 p-10 rounded-2xl shadow-lg text-white">
              <ReactMarkdown>{response}</ReactMarkdown>
              <button
                onClick={() => { setResponse(""); setIdea(""); setEmptyClicked(false); }}
                className="w-full flex items-center justify-center gap-2 bg-[#063376]/90 hover:bg-[#0B4D97] text-[#A1C4FF] p-4 rounded-2xl font-bold transition-all mb-10 shadow-lg backdrop-blur-sm"
              >
                New Analysis
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 text-red-600 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
