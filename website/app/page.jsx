'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from './components/Logo'

export default function Home() {
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
          signupSource: "homepage",
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
            <div className="big-emoji">✨</div>
            <h1 className="success-title">You're In!</h1>
            <p className="success-text">
              Check your email for next steps.<br/>
              We launch in 2 weeks.
            </p>
            <Link href="/test" className="simple-link">
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
        {/* Logo + Brand */}
        <div className="brand-section">
          <Logo size={48} />
          <h1 className="brand-name">unscroll</h1>
        </div>

        {/* Hero Message - Ultra Simple */}
        <div className="hero-section">
          <h2 className="hero-title">
            Your attention span<br/>is broken.
          </h2>
          <p className="hero-subtitle">
            We can fix it in 5 minutes a day.
          </p>
        </div>

        {/* Single CTA - Email Capture */}
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
              {loading ? '...' : 'Join Early Access'}
            </button>
          </div>
          <p className="cta-subtext">
            Limited spots • Launching Feb 2025
          </p>
        </div>

        {/* Simple Social Proof */}
        <div className="proof-section">
          <div className="stat">
            <span className="stat-number">12,847</span>
            <span className="stat-label">people waiting</span>
          </div>
          <div className="stat">
            <span className="stat-number">5 min</span>
            <span className="stat-label">daily training</span>
          </div>
          <div className="stat">
            <span className="stat-number">83%</span>
            <span className="stat-label">see results week 1</span>
          </div>
        </div>

        {/* Optional: Test Link */}
        <div className="footer-link">
          <Link href="/test">
            Take the free focus test first →
          </Link>
        </div>
      </div>
    </div>
  )
}
