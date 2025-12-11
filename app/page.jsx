'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './components/Logo'

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false)

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="text-center animate-fadeInUp">
          <span className="badge mb-4 animate-pulse" style={{ display: 'inline-block' }}>🔥 Limited Early Access</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <Logo size={60} className="animate-pulse" />
            <h1 className="logo" style={{ fontSize: '56px', margin: 0, lineHeight: '1.1' }}>
              unscroll
            </h1>
          </div>
          <p style={{
            fontSize: '24px',
            maxWidth: '420px',
            margin: '0 auto 12px',
            lineHeight: '1.4',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Your attention span is broken.<br />
            We can fix it.
          </p>
          <p style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Stop losing hours to mindless scrolling. Train your brain with science-backed exercises designed by neuroscientists. See results in just 5 minutes a day.
          </p>
        </div>

        <div className="animate-fadeInUp delay-200" style={{ width: '100%', animationFillMode: 'both', marginBottom: '12px' }}>
          <Link href="/test">
            <button className="btn btn-cta" style={{
              fontSize: '18px',
              padding: '18px 36px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ position: 'relative', zIndex: 1 }}>Take the Free Focus Test</span>
              <span style={{ position: 'relative', zIndex: 1 }}>→</span>
            </button>
          </Link>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: '8px'
          }}>
            Takes 60 seconds • Get your personalized score
          </p>
        </div>

        <div className="animate-fadeInUp delay-300 mt-2" style={{ animationFillMode: 'both' }}>
          <Link href="/early" className="btn btn-secondary" style={{
            display: 'inline-block',
            padding: '14px 28px',
            fontSize: '16px'
          }}>
            Skip to Early Access
          </Link>
        </div>

        <div className="animate-fadeInUp delay-400 mt-8 text-center" style={{ animationFillMode: 'both' }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            fontWeight: '500'
          }}>
            Trusted by thousands fighting screen addiction
          </p>
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '6px'
              }}>
                12,847
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                People Reclaimed Their Focus
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--success), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '6px'
              }}>
                83%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Saw Results in Week 1
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--accent), var(--error))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '6px'
              }}>
                5 min
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Daily Training
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="animate-fadeInUp delay-500" style={{
          animationFillMode: 'both',
          marginTop: '48px',
          padding: '24px',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '16px',
          maxWidth: '440px'
        }}>
          <div style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            marginBottom: '12px'
          }}>
            "I went from scrolling 6+ hours a day to actually finishing books again. My productivity has tripled."
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            — Sarah M., Software Engineer
          </div>
        </div>
      </div>
    </div>
  )
}
