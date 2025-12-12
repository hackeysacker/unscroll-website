'use client'

export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradient1)"
        strokeWidth="3"
        fill="none"
      />

      {/* Phone outline */}
      <rect
        x="35"
        y="25"
        width="30"
        height="50"
        rx="3"
        stroke="url(#gradient2)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Phone screen */}
      <rect
        x="38"
        y="30"
        width="24"
        height="35"
        rx="1"
        fill="rgba(99, 102, 241, 0.1)"
      />

      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="15"
        stroke="url(#gradient3)"
        strokeWidth="2"
        fill="none"
      />

      {/* X mark */}
      <line
        x1="43"
        y1="43"
        x2="57"
        y2="57"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="57"
        y1="43"
        x2="43"
        y2="57"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  )
}
