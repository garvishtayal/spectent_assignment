import { useState } from "react";

const API = "/feedback";

function AuroraBackdrop() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--a" />
      <div className="aurora__blob aurora__blob--b" />
      <div className="aurora__blob aurora__blob--c" />
      <div className="aurora__grain" />
    </div>
  );
}

function HeaderGlyph() {
  return (
    <div className="glyph" aria-hidden="true">
      <svg className="glyph__svg" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e3bc5e">
              <animate
                attributeName="stop-color"
                values="#e3bc5e;#a78bfa;#38bdf8;#e3bc5e"
                dur="14s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#6366f1">
              <animate
                attributeName="stop-color"
                values="#6366f1;#38bdf8;#e3bc5e;#6366f1"
                dur="14s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" stroke="url(#glyphGrad)" strokeWidth="1.25" opacity="0.45" />
        <circle cx="60" cy="60" r="38" stroke="url(#glyphGrad)" strokeWidth="0.75" opacity="0.35">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="48s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          fill="url(#glyphGrad)"
          opacity="0.9"
          d="M44 58c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16c-3 0-5.8-.8-8.2-2.3L44 78V58z"
        />
      </svg>
    </div>
  );
}

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
    <div className="shell">
      <AuroraBackdrop />

      <main className="page">
        <header className="hero">
          <HeaderGlyph />
          <p className="hero__eyebrow">We value your voice</p>
          <h1 className="hero__title">Tell us what you think</h1>
          <p className="hero__lead">
            A calm place to leave notes — crafted with care, read by humans.
          </p>
        </header>

        <form className="card" onSubmit={onSubmit}>
          <div className="card__accent" aria-hidden="true" />

          <label className="field">
            <span className="field__label">Name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="field__label">Feedback</span>
            <textarea
              name="feedback"
              rows={5}
              placeholder="What worked, what didn’t, what would make this better?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
            />
          </label>

          <button type="submit" className="btn" disabled={loading}>
            <span className="btn__shine" aria-hidden="true" />
            <span className="btn__text">{loading ? "Sending…" : "Send feedback"}</span>
          </button>

          {status && (
            <p className={status.type === "ok" ? "msg msg--ok" : "msg msg--err"} role="status">
              {status.text}
            </p>
          )}
        </form>

        <footer className="foot">
          <span className="foot__dot" aria-hidden="true" />
          Encrypted in transit · In-memory demo store
        </footer>
      </main>
    </div>
  );
}
