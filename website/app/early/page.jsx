"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Logo from "../components/Logo"

export default function EarlyPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({ src: "", campaign: "", ref: "" })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setParams({
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    })
  }, [])

  async function joinWaitlist() {
    if (!email) return
    setLoading(true)
    try {
      const response = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          signupSource: "early-access",
          marketingSource: params.src,
          marketingCampaign: params.campaign,
          referralCodeUsed: params.ref,
        }),
      })

      const data = await response.json()

      if (!data.ok) {
        alert(`Error: ${data.error || 'Failed to join. Please try again.'}`)
        setLoading(false)
        return
      }

      setLoading(false)
      setSubmitted(true)
    } catch (error) {
      alert('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="simple-container">
        <div className="center-content">
          <div className="success-card">
            <div className="big-emoji">🎉</div>
            <h1 className="success-title">You're In!</h1>
            <p className="success-text">
              Check your email for next steps.<br/>
              We launch in 2 weeks.
            </p>
            <Link href={`/test?src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`} className="simple-link">
              Take the 60-second focus test →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="simple-container">
      <div className="center-content">
        {/* Logo + Back Link */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <Logo size={40} />
            <span className="brand-name" style={{ fontSize: '28px' }}>unscroll</span>
          </Link>
        </div>

        {/* Hero Message */}
        <div className="hero-section">
          <h2 className="hero-title">
            Join Early Access
          </h2>
          <p className="hero-subtitle">
            347 spots left • 50% off lifetime
          </p>
        </div>

        {/* Email Capture */}
        <div className="cta-section">
          <div className="email-box">
            <input
              type="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={(e) => e.key === 'Enter' && joinWaitlist()}
              disabled={loading}
            />
            <button
              className="cta-button"
              onClick={joinWaitlist}
              disabled={loading || !email}
            >
              {loading ? '...' : 'Secure My Spot'}
            </button>
          </div>
          <p className="cta-subtext">
            🔒 No spam • Launching Feb 2025
          </p>
        </div>

        {/* Benefits - Simple List */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '2' }}>
            ✓ Lifetime 50% discount ($24.50/mo)<br/>
            ✓ Priority neuroscientist support<br/>
            ✓ Beta access to new features<br/>
            ✓ Shape the product with feedback
          </div>
        </div>

        {/* Footer Link */}
        <div className="footer-link">
          <Link href="/">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
