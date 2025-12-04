"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EarlyPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ src: "", campaign: "", ref: "" });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    });
  }, []);

  async function joinWaitlist() {
    if (!email) return;
    setLoading(true);
    await fetch("/api/waitlist/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        signupSource: "waitlist",
        marketingSource: params.src,
        marketingCampaign: params.campaign,
        referralCodeUsed: params.ref,
      }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-fadeInUp">
            <div className="success-icon animate-bounce">✓</div>
            <h1>You're on the list!</h1>
            <p>We'll notify you when Unscroll launches.</p>

            <div className="mt-6">
              <Link href={`/test?src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                <button className="btn">
                  Take the Focus Test
                  <span>→</span>
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
          <h1>Join Early Access</h1>
          <p>Be the first to rebuild your attention span</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={(e) => e.key === 'Enter' && joinWaitlist()}
          />
        </div>

        <button
          className="btn"
          onClick={joinWaitlist}
          disabled={loading || !email}
          style={{ opacity: loading || !email ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Joining...
            </>
          ) : (
            <>
              Get Early Access
              <span>→</span>
            </>
          )}
        </button>

        <p className="text-center mt-4" style={{ fontSize: '14px' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
