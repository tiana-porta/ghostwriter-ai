"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("default");
  const [type, setType] = useState("tweet");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState({ topic: "", tone: "default", type: "tweet" });

  // History and Favorites
  const [history, setHistory] = useState<{ text: string; favorite: boolean }[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Onboarding modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("gw_onboarding_seen")) setShowModal(true);
    // Load history and favorites from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("gw_history") || "[]");
    setHistory(savedHistory);
    const savedFavorites = JSON.parse(localStorage.getItem("gw_favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  function handleCloseModal() {
    setShowModal(false);
    localStorage.setItem("gw_onboarding_seen", "yes");
  }

  async function handleGenerate(e: React.FormEvent, overridePrompt?: { topic: string; tone: string; type: string }) {
    if (e) e.preventDefault();
    setLoading(true);
    setOutput("");
    const promptData = overridePrompt || { topic, tone, type };
    setLastPrompt(promptData);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptData),
    });

    const data = await res.json();
    setOutput(data.result);

    // Add to history
    if (data.result) {
      const newHistory = [{ text: data.result, favorite: false }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("gw_history", JSON.stringify(newHistory));
    }
    setLoading(false);
  }

  function handleCopy(text?: string) {
    navigator.clipboard.writeText(text || output);
  }

  function handleRegenerate() {
    if (lastPrompt.topic) {
      handleGenerate(undefined as any, lastPrompt); // bypass event type
    }
  }

  function handleShare(text?: string) {
    const tweet = encodeURIComponent(text || output);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  }

  function handleFavorite(idx: number) {
    const newHistory = [...history];
    newHistory[idx].favorite = !newHistory[idx].favorite;
    setHistory(newHistory);
    localStorage.setItem("gw_history", JSON.stringify(newHistory));
    // Add to favorites if newly starred
    if (newHistory[idx].favorite && !favorites.includes(newHistory[idx].text)) {
      const newFavs = [newHistory[idx].text, ...favorites].slice(0, 20);
      setFavorites(newFavs);
      localStorage.setItem("gw_favorites", JSON.stringify(newFavs));
    }
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
        paddingBottom: 60,
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
          <button
            onClick={handleRegenerate}
            disabled={loading || !lastPrompt.topic}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "#352a86",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !lastPrompt.topic ? 0.6 : 1,
            }}
          >
            Regenerate
          </button>
        </div>
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
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handleCopy()}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#392aac",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
              <button
                onClick={() => handleShare()}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#1da1f2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Share to X
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div
          style={{
            marginTop: 28,
            background: "rgba(34,32,60,0.94)",
            borderRadius: 18,
            maxWidth: 500,
            width: "100%",
            padding: 22,
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 18 }}>History</div>
          {history.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: idx < history.length - 1 ? "1px solid #312e49" : "none",
                paddingBottom: 10,
                marginBottom: 10,
                position: "relative",
              }}
            >
              <textarea
                value={item.text}
                readOnly
                style={{
                  width: "100%",
                  minHeight: 60,
                  background: "#221e3c",
                  color: "#fff",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 15,
                  border: "1px solid #352a86",
                  marginBottom: 4,
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => handleCopy(item.text)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "#3b376c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleShare(item.text)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "#1da1f2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Share
                </button>
                <button
                  onClick={() => handleFavorite(idx)}
                  style={{
                    flex: 0.5,
                    background: item.favorite ? "#ffe066" : "#423a88",
                    color: item.favorite ? "#222" : "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div
          style={{
            marginTop: 18,
            background: "rgba(251,245,193,0.88)",
            borderRadius: 16,
            maxWidth: 500,
            width: "100%",
            padding: 18,
            color: "#232",
            boxShadow: "0 2px 8px rgba(180, 160, 70, 0.12)",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 17 }}>Favorites ★</div>
          {favorites.map((fav, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <textarea
                value={fav}
                readOnly
                style={{
                  width: "100%",
                  minHeight: 40,
                  background: "#faf4c0",
                  color: "#232",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 15,
                  border: "1px solid #ffe066",
                  marginBottom: 4,
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => handleCopy(fav)}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    background: "#f6e958",
                    color: "#232",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleShare(fav)}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    background: "#1da1f2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}