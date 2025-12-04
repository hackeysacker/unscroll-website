import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="text-center animate-fadeInUp">
          <span className="badge mb-4">Early Access</span>
          <h1 className="logo" style={{ fontSize: '48px', marginBottom: '24px' }}>
            unscroll
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '320px', margin: '0 auto 32px' }}>
            Break free from doom scrolling.<br />Rebuild your attention span.
          </p>
        </div>

        <div className="animate-fadeInUp delay-200" style={{ width: '100%', opacity: 0 }}>
          <Link href="/early">
            <button className="btn">
              Join Early Access
              <span>→</span>
            </button>
          </Link>
        </div>

        <div className="animate-fadeInUp delay-300 mt-6" style={{ opacity: 0 }}>
          <Link href="/test" className="btn btn-secondary" style={{ display: 'inline-block', padding: '14px 28px' }}>
            Take the Focus Test
          </Link>
        </div>
      </div>
    </div>
  )
}
