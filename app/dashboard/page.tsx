"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚨 EDGE CASE: double submit protection
    if (loading) return;

    setError("");
    setResponse("");

    // 🚨 FRONTEND VALIDATION
    if (!idea.trim()) {
      setError("Please enter an idea.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || "Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>💡 Business Idea Validator</h1>
        <p className="subtitle">Get AI feedback on your idea</p>

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

          <button
            className="button"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🚀 Validate Idea"}
          </button>
        </form>

        {/* 🚨 ERROR STATE */}
        {error && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        {/* ⏳ LOADING STATE */}
        {loading && (
          <div className="loading-box">
            <p>AI is analyzing your idea...</p>
          </div>
        )}

        {/* ✅ RESPONSE */}
        {response && !loading && (
          <div className="response">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}