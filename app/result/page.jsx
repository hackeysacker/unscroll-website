"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

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
    const personalizedMessage = Number(params.score) >= 70 ?
      "We'll send you advanced techniques to push your focus to elite levels." :
      Number(params.score) >= 50 ?
      "We'll send you a custom training program to restore your attention span." :
      "We'll send you emergency protocols to rescue your severely damaged focus.";

    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-scaleIn">
            <div className="success-icon animate-bounce" style={{ fontSize: '64px' }}>🚀</div>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>You're on the list!</h1>
            <p style={{ fontSize: '17px', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>
              {personalizedMessage}
            </p>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--success)', fontWeight: '600', marginBottom: '8px' }}>
                ✓ What happens next:
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.8' }}>
                • Early access invite (launching in 2 weeks)<br/>
                • Your personalized training roadmap<br/>
                • Exclusive founding member pricing<br/>
                • Direct access to our neuroscience team
              </div>
            </div>

            <div className="mt-6">
              <Link href="/">
                <button className="btn" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                  Share Your Score
                  <span>→</span>
                </button>
              </Link>
              <Link href="/" style={{ display: 'block', marginTop: '12px' }}>
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

  const scoreAnalysis = Number(params.score) >= 70 ?
    {
      title: "You're doing well!",
      message: "But imagine what you could achieve with elite-level focus.",
      urgency: "Join 2,847 high performers already training with us.",
      emoji: "💪"
    } :
    Number(params.score) >= 50 ?
    {
      title: "Your focus is slipping",
      message: "Good news: 83% of users like you see results in week 1.",
      urgency: "Don't let another week go by with broken attention.",
      emoji: "⚠️"
    } :
    {
      title: "This is serious",
      message: "Your attention span is in critical condition. But it's not too late.",
      urgency: "2,194 people with similar scores have already transformed their focus.",
      emoji: "🚨"
    };

  return (
    <div className="container">
      <div className="text-center mb-6 animate-fadeIn">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Logo size={32} />
          <span className="logo logo-small">unscroll</span>
        </Link>
      </div>

      <div className="card animate-scaleIn">
        <div className="text-center mb-6">
          <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px', fontSize: '15px' }}>
            Your Focus Score
          </h2>
          <div className="score-display" style={{ marginTop: '16px', marginBottom: '16px' }}>{params.score}</div>

          <div style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            {scoreAnalysis.emoji} {scoreAnalysis.title}
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '12px' }}>
            {scoreAnalysis.message}
          </p>
          <div style={{
            fontSize: '14px',
            color: 'var(--accent)',
            fontWeight: '600',
            padding: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            ⚡ {scoreAnalysis.urgency}
          </div>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Get your free personalized training plan:
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.8' }}>
            ✓ Custom exercises based on your score<br/>
            ✓ Daily 5-minute training sessions<br/>
            ✓ Track your improvement in real-time<br/>
            ✓ Science-backed by neuroscientists
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Enter your email to unlock your plan
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            onKeyDown={(e) => e.key === 'Enter' && save()}
            style={{ fontSize: '16px' }}
          />
        </div>

        <button
          className="btn"
          onClick={save}
          disabled={loading || !email}
          style={{
            opacity: loading || !email ? 0.7 : 1,
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            fontSize: '17px',
            padding: '16px'
          }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Unlocking your plan...
            </>
          ) : (
            <>
              Get My Free Training Plan
              <span>→</span>
            </>
          )}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginTop: '16px',
          marginBottom: '0'
        }}>
          🔒 We respect your privacy. Unsubscribe anytime. No spam.
        </p>
      </div>
    </div>
  );
}
