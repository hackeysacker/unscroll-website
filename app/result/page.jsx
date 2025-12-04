"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [params, setParams] = useState({ score: "", src: "", campaign: "", ref: "" });
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      score: urlParams.get("score") || "",
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    });
  }, []);

  async function save() {
    if (!email) return;
    setLoading(true);
    await fetch("/api/test/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        focusScore: Number(params.score),
        marketingSource: params.src,
        marketingCampaign: params.campaign,
        referralCodeUsed: params.ref,
      }),
    });
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-fadeInUp">
            <div className="success-icon animate-bounce">✓</div>
            <h1>You're in!</h1>
            <p>We'll email you when Unscroll is ready to help you rebuild your focus.</p>

            <div className="mt-6">
              <Link href="/">
                <button className="btn btn-secondary">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-6 animate-fadeIn">
        <Link href="/">
          <span className="logo logo-small">unscroll</span>
        </Link>
      </div>

      <div className="card animate-fadeInUp">
        <div className="text-center mb-6">
          <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>
            Your Focus Score
          </h2>
          <div className="score-display">{params.score}</div>
          <p>
            {Number(params.score) >= 70 ? "You're doing okay, but we can help you do better." :
             Number(params.score) >= 50 ? "Your attention span needs work. Let's fix that." :
             "Your focus is severely compromised. Unscroll can help."}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Save your score & get early access</label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
        </div>

        <button
          className="btn"
          onClick={save}
          disabled={loading || !email}
          style={{ opacity: loading || !email ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Saving...
            </>
          ) : (
            <>
              Save & Join Waitlist
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
