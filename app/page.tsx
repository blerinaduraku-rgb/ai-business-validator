"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  // 🔒 PROTECTED ROUTE
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const goDashboard = () => {
    router.push("/dashboard");
  };

  // ⏳ LOADING
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading authentication...
      </div>
    );
  }

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setResponse("");

    if (!idea.trim() || idea.trim().length < 10) {
      setError("Please provide a more detailed idea (min 10 chars)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      {/* 🔵 SIDE BUTTONS (ONLY WHAT MAKES SENSE) */}
      <div className="fixed top-4 right-4 flex flex-col gap-2">

        <button
          onClick={goDashboard}
          className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg"
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* 🧠 MAIN CARD (UNCHANGED DESIGN) */}
      <div className="card">
        <h1>💡 Business Idea Validator</h1>
        <p className="subtitle">
          Get AI feedback on your business idea
        </p>

        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="textarea"
            placeholder="Describe your business idea..."
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              setError("");
            }}
            rows={5}
            disabled={loading}
          />

          <button className="button" disabled={loading || !idea.trim()}>
            {loading ? "Analyzing..." : "🚀 Validate Idea"}
          </button>
        </form>

        {error && <div className="error">⚠️ {error}</div>}

        {loading && (
          <div className="loading-box">
            <div className="loading-spinner"></div>
            <p>AI is analyzing your idea...</p>
          </div>
        )}

        {response && !loading && (
          <div className="response">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}