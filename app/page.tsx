"use client";

import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error("Failed to analyze idea");

      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format markdown-like text to HTML
  const formatResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
      .replace(/📋|✅|⚠️|💡|🎯|❓/g, (match) => `<span class="emoji">${match}</span>`);
  };

  return (
    <div className="container">
      <div className="card">

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/history" style={{ color: '#667eea' }}>📚 View History →</a>
        </div>
        
        <h1>💡 Business Idea Validator</h1>
        <p className="subtitle">Get AI-powered feedback on your startup idea</p>

        <form onSubmit={handleSubmit} className="form">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your business idea here... (e.g., 'An AI-powered app that helps students find study partners based on their learning style and schedule')"
            rows={5}
            className="textarea"
            disabled={loading}
          />

          <button 
            type="submit" 
            disabled={loading || !idea.trim()} 
            className="button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              "Validate Idea"
            )}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {response && (
          <div className="response">
            <h2>🤖 AI Analysis</h2>
            <div 
              className="response-content"
              dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}