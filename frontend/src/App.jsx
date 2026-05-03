import { useState } from "react";

const API = "/feedback";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, feedback }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ type: "ok", text: data.message || "Thanks — your feedback was saved." });
        setName("");
        setEmail("");
        setFeedback("");
      } else {
        setStatus({
          type: "err",
          text: data.error || `Something went wrong (${res.status}).`,
        });
      }
    } catch {
      setStatus({
        type: "err",
        text: "Could not reach the server. Is the API running on port 8080?",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Feedback</h1>
        <p className="sub">Short and honest — we read every message.</p>
      </header>

      <form className="card" onSubmit={onSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Feedback</span>
          <textarea
            name="feedback"
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={loading}
          />
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Sending…" : "Submit"}
        </button>

        {status && (
          <p className={status.type === "ok" ? "msg ok" : "msg err"} role="status">
            {status.text}
          </p>
        )}
      </form>
    </div>
  );
}
