import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="text-center animate-fadeInUp">
          <span className="badge mb-4 animate-pulse" style={{ display: 'inline-block' }}>Early Access</span>
          <h1 className="logo" style={{ fontSize: '56px', marginBottom: '20px', lineHeight: '1.1' }}>
            unscroll
          </h1>
          <p style={{
            fontSize: '22px',
            maxWidth: '360px',
            margin: '0 auto 16px',
            lineHeight: '1.5'
          }}>
            Break free from doom scrolling.<br />
            Rebuild your attention span.
          </p>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            margin: '0 auto 40px'
          }}>
            Train your brain with science-backed exercises. Just 5 minutes a day.
          </p>
        </div>

        <div className="animate-fadeInUp delay-200" style={{ width: '100%', animationFillMode: 'both' }}>
          <Link href="/early">
            <button className="btn" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Join Early Access
              <span>→</span>
            </button>
          </Link>
        </div>

        <div className="animate-fadeInUp delay-300 mt-6" style={{ animationFillMode: 'both' }}>
          <Link href="/test" className="btn btn-secondary" style={{
            display: 'inline-block',
            padding: '14px 28px',
            fontSize: '16px'
          }}>
            Take the Focus Test
          </Link>
        </div>

        <div className="animate-fadeInUp delay-400 mt-8 text-center" style={{ animationFillMode: 'both' }}>
          <div style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px'
              }}>
                10,000+
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Lives Changed
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px'
              }}>
                4.9★
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Average Rating
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px'
              }}>
                5 min
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Per Day
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
