"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

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
    try {
      const response = await fetch("/api/waitlist/join", {
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
      
      const data = await response.json();
      
      if (!data.ok) {
        console.error('Waitlist error:', data.error);
        alert(`Error: ${data.error || 'Failed to join waitlist. Please try again.'}`);
        setLoading(false);
        return;
      }
      
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Waitlist join error:', error);
      alert('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-scaleIn">
            <div className="success-icon animate-bounce" style={{ fontSize: '64px' }}>🎉</div>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Welcome to the future!</h1>
            <p style={{ fontSize: '17px', lineHeight: '1.6', fontWeight: '500', color: 'var(--text-primary)' }}>
              You're now on the exclusive early access list.
            </p>

            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '24px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600', marginBottom: '12px' }}>
                ⚡ What's next:
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                • Check your inbox for your welcome email<br/>
                • Early access launching in 2 weeks<br/>
                • Founding member pricing (50% off lifetime)<br/>
                • Direct line to our neuroscience team
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/test?src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                <button className="btn" style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  fontSize: '17px',
                  padding: '16px'
                }}>
                  Discover Your Focus Score
                  <span>→</span>
                </button>
              </Link>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginTop: '12px'
              }}>
                Takes 60 seconds • Get personalized insights
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--accent)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            🔥 Only 347 Spots Left
          </div>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>Join the Focus Revolution</h1>
          <p style={{ fontSize: '17px', lineHeight: '1.6', fontWeight: '500', color: 'var(--text-primary)' }}>
            Be among the first to reclaim your attention span
          </p>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Early Access Benefits:
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            ✓ Lifetime 50% discount ($49 → $24.50/mo)<br/>
            ✓ Priority support from neuroscientists<br/>
            ✓ Beta access to new features<br/>
            ✓ Your feedback shapes the product
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Email address</label>
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
              Securing your spot...
            </>
          ) : (
            <>
              Claim My Early Access Spot
              <span>→</span>
            </>
          )}
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{ fontSize: '13px', color: 'var(--error)', fontWeight: '600', margin: '0' }}>
            ⏰ Spots filling fast • Average signup time: 23 seconds
          </p>
        </div>

        <p className="text-center mt-4" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          🔒 No spam. Unsubscribe anytime. Privacy guaranteed.
        </p>
      </div>
    </div>
  );
}
