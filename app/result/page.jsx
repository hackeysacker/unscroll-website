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

  async function shareScore() {
    const score = params.score;
    const shareText = `I just scored ${score}/100 on the Unscroll Focus Test! 🧠\n\nTest your attention span: ${window.location.origin}/test${params.src ? `?src=${params.src}` : ''}`;
    const shareUrl = `${window.location.origin}/test${params.src ? `?src=${params.src}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Focus Score: ${score}/100`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard if share fails
          copyToClipboard();
        }
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  }

  async function copyToClipboard() {
    const score = params.score;
    const shareText = `I just scored ${score}/100 on the Unscroll Focus Test! 🧠\n\nTest your attention span: ${window.location.origin}/test${params.src ? `?src=${params.src}` : ''}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Score copied to clipboard! 📋');
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert('Score copied to clipboard! 📋');
      } catch (e) {
        alert('Could not copy. Please share manually.');
      }
      document.body.removeChild(textarea);
    }
  }

  if (done) {
    const personalizedMessage = Number(params.score) >= 70 ?
      "We'll send you advanced techniques to push your focus to elite levels." :
      Number(params.score) >= 50 ?
      "We'll send you a custom training program to restore your attention span." :
      "We'll send you emergency protocols to rescue your severely damaged focus.";

    return (
      <div className="container" style={{ padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-scaleIn" style={{ padding: '16px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <div className="success-icon animate-bounce" style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
              <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>You're on the list!</h1>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-primary)', fontWeight: '500', marginBottom: '16px' }}>
                {personalizedMessage}
              </p>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', marginBottom: '8px' }}>
                  ✓ What happens next:
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.6' }}>
                  • Early access invite (launching in 2 weeks)<br/>
                  • Your personalized training roadmap<br/>
                  • Exclusive founding member pricing<br/>
                  • Direct access to our neuroscience team
                </div>
              </div>
            </div>

            <div style={{ width: '100%', marginTop: 'auto' }}>
              <button 
                className="btn" 
                onClick={shareScore}
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  width: '100%',
                  marginBottom: '10px',
                  fontSize: '15px',
                  padding: '14px'
                }}
              >
                📤 Share Your Score
                <span>→</span>
              </button>
              <Link href="/" style={{ display: 'block' }}>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '14px', padding: '12px' }}>
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
    <div className="container" style={{ padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="text-center mb-4 animate-fadeIn" style={{ marginTop: '8px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Logo size={24} />
          <span className="logo logo-small" style={{ fontSize: '18px' }}>unscroll</span>
        </Link>
      </div>

      <div className="card animate-scaleIn" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div className="text-center mb-4">
          <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Your Focus Score
          </h2>
          <div className="score-display" style={{ marginTop: '8px', marginBottom: '12px', fontSize: '72px' }}>{params.score}</div>

          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            {scoreAnalysis.emoji} {scoreAnalysis.title}
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '10px', color: 'var(--text-secondary)' }}>
            {scoreAnalysis.message}
          </p>
          <div style={{
            fontSize: '12px',
            color: 'var(--accent)',
            fontWeight: '600',
            padding: '10px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            lineHeight: '1.4'
          }}>
            ⚡ {scoreAnalysis.urgency}
          </div>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Get your free personalized training plan:
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.6' }}>
            ✓ Custom exercises based on your score<br/>
            ✓ Daily 5-minute training sessions<br/>
            ✓ Track your improvement in real-time<br/>
            ✓ Science-backed by neuroscientists
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="email" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
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
              style={{ fontSize: '15px', padding: '12px' }}
            />
          </div>

          <button
            className="btn"
            onClick={save}
            disabled={loading || !email}
            style={{
              opacity: loading || !email ? 0.7 : 1,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              fontSize: '15px',
              padding: '14px',
              marginBottom: '10px',
              width: '100%'
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                Unlocking...
              </>
            ) : (
              <>
                Get My Free Training Plan
                <span>→</span>
              </>
            )}
          </button>

          <button
            className="btn btn-secondary"
            onClick={shareScore}
            style={{
              fontSize: '14px',
              padding: '12px',
              width: '100%',
              marginBottom: '10px'
            }}
          >
            📤 Share My Score
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginTop: '8px',
            marginBottom: '0',
            lineHeight: '1.4'
          }}>
            🔒 We respect your privacy. Unsubscribe anytime. No spam.
          </p>
        </div>
      </div>
    </div>
  );
}
