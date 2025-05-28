"use client";
import React, { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("default");
  const [type, setType] = useState("tweet");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    // This will call your backend (to be built next)
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, tone, type }),
    });

    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 540, margin: "auto", padding: 24 }}>
      <h1>GhostWriter AI</h1>
      <form onSubmit={handleGenerate} style={{ marginBottom: 24 }}>
        <div>
          <label>Topic</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          >
            <option value="default">Default</option>
            <option value="funny">Funny</option>
            <option value="aggressive">Aggressive</option>
            <option value="clean">Clean</option>
            <option value="edgy">Edgy</option>
          </select>
        </div>
        <div>
          <label>Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          >
            <option value="tweet">Single Tweet</option>
            <option value="thread">Thread</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10, width: "100%" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {output && (
        <div>
          <h2>Output</h2>
          <textarea
            style={{ width: "100%", minHeight: 120, padding: 10 }}
            value={output}
            readOnly
          />
        </div>
      )}
    </div>
  );
}