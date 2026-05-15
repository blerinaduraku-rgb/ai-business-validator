"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  LogOut, Plus, Send, Trash2, History, Loader2, AlertCircle,
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
  const [emptyClicked, setEmptyClicked] = useState(false); // përjashtimi

  // ✅ Thirret vetëm një herë pas autentikimit
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else {
      fetchHistory();
    }
  }, [authLoading]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch error:", error.message);
    if (data) setHistory(data);
  };

  const deleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
    } else {
      setHistory(history.filter((h) => h.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    // ✅ Përjashtimi për empty state
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

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.result) {
        throw new Error("AI returned empty response");
      }

      setResponse(data.result);

      setHistory([
        { id: Date.now(), idea, ai_response: data.result, user_id: user?.id },
        ...history,
      ]);

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#063376]">
        <Loader2 className="animate-spin text-[#E6A3AD]" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-[#063376] overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-[#063376] flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 font-black text-2xl text-white tracking-tighter">
            <div className="bg-[#E6A3AD] p-2 rounded-xl">
              <BrainCircuit size={24} className="text-[#063376]" />
            </div>
            <span>Validator<span className="text-[#A1ADD3]">.ai</span></span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <button 
            onClick={() => { setResponse(""); setIdea(""); setError(""); setEmptyClicked(false); }}
            className="w-full flex items-center justify-center gap-2 bg-[#1C5E92] hover:bg-[#0B4D97] text-white p-4 rounded-2xl font-bold transition-all mb-10 shadow-lg"
          >
            <Plus size={18} /> New Analysis
          </button>

          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[10px] font-black text-[#A1ADD3] uppercase tracking-[0.2em]">History</h3>
            <History size={14} className="text-[#A1ADD3]/50" />
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setResponse(item.ai_response); setIdea(item.idea); }}
                className="group p-4 rounded-2xl bg-[#0B4D97]/30 border border-transparent hover:border-[#E6A3AD]/30 hover:bg-[#0B4D97]/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <p className="text-sm font-bold text-[#A1ADD3] truncate mr-2">{item.idea}</p>
                <button 
                  onClick={(e) => deleteHistoryItem(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#E6A3AD] hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-[#A1ADD3]/10 bg-[#04285a]">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-3 text-[#A1ADD3] hover:text-[#E6A3AD] p-3 w-full rounded-xl transition-all font-bold text-sm"
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

              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow" noValidate>
                <textarea
                  className="w-full min-h-[220px] p-4 border rounded-xl"
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
            <div className="bg-white p-10 rounded-2xl shadow">
              <ReactMarkdown>{response}</ReactMarkdown>
              <button
                onClick={() => { setResponse(""); setIdea(""); setEmptyClicked(false); }}
                className="mt-6 text-blue-600"
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
