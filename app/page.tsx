"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("default");
  const [type, setType] = useState("tweet");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Onboarding modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("gw_onboarding_seen")) {
      setShowModal(true);
    }
  }, []);

  function handleCloseModal() {
    setShowModal(false);
    localStorage.setItem("gw_onboarding_seen", "yes");
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, tone, type }),
    });

    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6b5bfc 0%, #8378fc 50%, #a358ec 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Onboarding Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(20,18,44,0.78)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(34, 32, 60, 1)",
              borderRadius: 22,
              maxWidth: 380,
              width: "100%",
              padding: "40px 30px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            }}
          >
            <Image src="/logo.png" alt="GhostWriter AI" width={64} height={64} />
            <h2 style={{ color: "#fff", marginTop: 18, fontWeight: 800 }}>Welcome to GhostWriter AI!</h2>
            <p style={{ color: "#c1baff", marginTop: 12, fontSize: 16 }}>
              Generate punchy, high-converting tweets and threads in seconds.<br /><br />
              <strong>How it works:</strong><br />
              1. Enter a topic and choose your tone<br />
              2. Hit <b>Generate</b> to get your tweet or thread<br />
              3. Copy, tweak, and post<br /><br />
              <em>Pro tip: The more specific your topic, the better the tweet!</em>
            </p>
            <button
              style={{
                background: "linear-gradient(90deg, #6b5bfc 0%, #a358ec 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 0",
                width: "100%",
                fontWeight: 700,
                fontSize: 17,
                marginTop: 18,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(86, 63, 230, 0.08)",
              }}
              onClick={handleCloseModal}
            >
              Let’s go!
            </button>
          </div>
        </div>
      )}

      {/* Main app content */}
      <div
        style={{
          background: "rgba(25, 20, 50, 0.97)",
          borderRadius: 32,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: 40,
          maxWidth: 420,
          width: "100%",
          margin: 16,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* Logo at top */}
          <Image src="/logo.png" alt="GhostWriter AI" width={88} height={88} style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: "#fff" }}>GhostWriter AI</h1>
          <div style={{ color: "#b7b7ff", marginTop: 6 }}>AI for punchy Twitter threads</div>
        </div>
        <form onSubmit={handleGenerate}>
          <label style={{ color: "#b7b7ff" }}>Topic</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            placeholder="What do you want to tweet about?"
            style={{
              width: "100%",
              padding: "10px 12px",
              margin: "8px 0 16px",
              borderRadius: 10,
              border: "1px solid #392aac",
              background: "#222040",
              color: "#fff",
              fontSize: 16,
            }}
          />
          <label style={{ color: "#b7b7ff" }}>Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              margin: "8px 0 16px",
              borderRadius: 10,
              border: "1px solid #392aac",
              background: "#222040",
              color: "#fff",
              fontSize: 16,
            }}
          >
            <option value="default">Default</option>
            <option value="funny">Funny</option>
            <option value="aggressive">Aggressive</option>
            <option value="clean">Clean</option>
            <option value="edgy">Edgy</option>
          </select>
          <label style={{ color: "#b7b7ff" }}>Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              margin: "8px 0 16px",
              borderRadius: 10,
              border: "1px solid #392aac",
              background: "#222040",
              color: "#fff",
              fontSize: 16,
            }}
          >
            <option value="tweet">Single Tweet</option>
            <option value="thread">Thread</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "linear-gradient(90deg, #6b5bfc 0%, #a358ec 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              marginTop: 8,
              marginBottom: 4,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(86, 63, 230, 0.08)",
              transition: "opacity 0.2s",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {output && (
          <div style={{ marginTop: 20 }}>
            <label style={{ color: "#b7b7ff" }}>Output</label>
            <textarea
              style={{
                width: "100%",
                minHeight: 120,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #3e36a1",
                background: "#1b1933",
                color: "#fff",
                fontSize: 16,
                marginBottom: 8,
                resize: "vertical",
              }}
              value={output}
              readOnly
            />
            <button
              onClick={handleCopy}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#392aac",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                marginTop: 0,
              }}
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}