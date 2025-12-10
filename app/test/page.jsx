"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function TestPage() {
  const [params, setParams] = useState({ src: "", campaign: "", ref: "" });
  const [scrollHours, setScrollHours] = useState(4);
  const [switching, setSwitching] = useState("sometimes");
  const [phase, setPhase] = useState("questions"); // questions, countdown, reaction, impulse, switching, done
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(null);

  // Reaction phase
  const [reactionPhase, setReactionPhase] = useState("waiting"); // waiting, show, clicked
  const [reactionTime, setReactionTime] = useState(0);
  const [reactionAttempts, setReactionAttempts] = useState(0);
  const reactionStartTimeRef = useRef(0);
  const reactionTimeoutRef = useRef(null);

  // Impulse phase
  const [impulseCount, setImpulseCount] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [showDistractor, setShowDistractor] = useState(false);
  const [correctTaps, setCorrectTaps] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);
  const impulseTimeoutRef = useRef(null);

  // Switching phase
  const [switchCount, setSwitchCount] = useState(0);
  const [switchMode, setSwitchMode] = useState("tap"); // tap or hold
  const [switchCorrect, setSwitchCorrect] = useState(0);
  const [switchErrors, setSwitchErrors] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    });
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      if (impulseTimeoutRef.current) clearTimeout(impulseTimeoutRef.current);
    };
  }, []);

  function startTest() {
    setPhase("countdown");
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setPhase("reaction");
        startReactionTest();
      }
    }, 1000);
  }

  // === REACTION TEST ===
  function startReactionTest() {
    if (reactionAttempts >= 3) {
      // Move to impulse phase
      setPhase("impulse");
      startImpulseTest();
      return;
    }

    setReactionPhase("waiting");
    const waitTime = 1000 + Math.random() * 2000; // 1-3 seconds

    reactionTimeoutRef.current = setTimeout(() => {
      setReactionPhase("show");
      reactionStartTimeRef.current = Date.now();
      setReactionAttempts(prev => prev + 1);
    }, waitTime);
  }

  function handleReactionClick() {
    if (reactionPhase === "show") {
      const rt = Date.now() - reactionStartTimeRef.current;
      setReactionTime(prev => prev + rt);
      setReactionPhase("clicked");

      setTimeout(() => {
        startReactionTest();
      }, 500);
    } else if (reactionPhase === "waiting") {
      // Too early - restart
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      setTimeout(() => {
        startReactionTest();
      }, 1000);
    }
  }

  // === IMPULSE CONTROL TEST ===
  function startImpulseTest() {
    if (impulseCount >= 8) {
      // Move to switching phase
      setPhase("switching");
      startSwitchingTest();
      return;
    }

    const showDistractorNow = Math.random() > 0.5;
    setImpulseCount(prev => prev + 1);

    impulseTimeoutRef.current = setTimeout(() => {
      if (showDistractorNow) {
        // Show red distractor
        setShowDistractor(true);
        setTimeout(() => {
          setShowDistractor(false);
          // Auto-advance after distractor disappears
          setTimeout(() => {
            startImpulseTest();
          }, 300);
        }, 800);
      } else {
        // Show green target
        setShowTarget(true);
        // Auto-advance if not tapped within time limit
        const autoAdvance = setTimeout(() => {
          setShowTarget(false);
          setTimeout(() => {
            startImpulseTest();
          }, 300);
        }, 1500);

        // Store timeout ID to clear if tapped
        impulseTimeoutRef.current = autoAdvance;
      }
    }, 500 + Math.random() * 1000);
  }

  function handleImpulseTap(isTarget) {
    if (isTarget && showTarget) {
      setCorrectTaps(prev => prev + 1);
      setShowTarget(false);
      // Clear auto-advance timeout
      if (impulseTimeoutRef.current) clearTimeout(impulseTimeoutRef.current);
      // Advance to next target
      setTimeout(() => {
        startImpulseTest();
      }, 300);
    } else if (!isTarget && showDistractor) {
      setWrongTaps(prev => prev + 1);
    }
  }

  // === SWITCHING TEST ===
  function startSwitchingTest() {
    if (switchCount >= 6) {
      finishTest();
      return;
    }

    const newMode = Math.random() > 0.5 ? "tap" : "hold";
    setSwitchMode(newMode);
    setSwitchCount(prev => prev + 1);
  }

  function handleSwitchAction(action) {
    if (action === switchMode) {
      setSwitchCorrect(prev => prev + 1);
    } else {
      setSwitchErrors(prev => prev + 1);
    }

    setTimeout(() => {
      startSwitchingTest();
    }, 600);
  }

  function finishTest() {
    setPhase("done");

    // Calculate comprehensive score
    const avgReactionTime = reactionTime / 3;
    const reactionScore = Math.max(0, 100 - (avgReactionTime / 10)); // Faster = better

    const impulseAccuracy = correctTaps / 8;
    const impulsePenalty = wrongTaps * 10;
    const impulseScore = Math.max(0, impulseAccuracy * 100 - impulsePenalty);

    const switchAccuracy = switchCorrect / 6;
    const switchScore = switchAccuracy * 100;

    // Factor in survey answers
    const scrollScore = (10 - scrollHours) * 10;
    const switchingScore =
      switching === "rarely" ? 90 :
      switching === "sometimes" ? 70 :
      switching === "often" ? 50 : 30;

    // Weighted final score
    const finalScore = Math.round(
      reactionScore * 0.25 +
      impulseScore * 0.25 +
      switchScore * 0.20 +
      scrollScore * 0.15 +
      switchingScore * 0.15
    );

    setScore(Math.min(100, Math.max(0, finalScore)));
  }

  // === RENDER PHASES ===

  if (phase === "done") {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-fadeInUp">
            <div className="success-icon animate-bounce">✓</div>
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>
              Your Focus Score
            </h2>
            <div className="score-display animate-pulse">{score}</div>
            <p style={{ fontSize: '18px', marginTop: '16px' }}>
              {score >= 80 ? "Excellent focus! You're in the top tier." :
               score >= 60 ? "Good! But there's room to improve." :
               score >= 40 ? "Your attention needs some work." :
               "Your focus is significantly compromised."}
            </p>

            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '24px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'var(--bg-dark)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  {Math.round(reactionTime / 3)}ms
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Reaction Time
                </div>
              </div>
              <div style={{
                background: 'var(--bg-dark)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                  {correctTaps}/{impulseCount}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Impulse Control
                </div>
              </div>
              <div style={{
                background: 'var(--bg-dark)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>
                  {switchCorrect}/{switchCount}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Task Switching
                </div>
              </div>
              <div style={{
                background: 'var(--bg-dark)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--error)' }}>
                  {wrongTaps}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Errors
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/result?score=${score}&src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                <button className="btn">
                  See Your Results
                  <span>→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="animate-fadeIn">
            <p style={{ marginBottom: '24px', fontSize: '18px' }}>Get ready...</p>
            <div className="score-display animate-pulse">{countdown}</div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "reaction") {
    return (
      <div className="container" onClick={handleReactionClick} style={{ cursor: 'pointer' }}>
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="animate-fadeIn">
            <h2 style={{ marginBottom: '16px' }}>Reaction Test</h2>
            <p style={{ marginBottom: '24px' }}>
              Click as soon as the circle turns <span style={{ color: 'var(--success)' }}>green</span>
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Attempt {reactionAttempts + 1} of 3
            </p>

            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '40px auto',
              background: reactionPhase === "show" ? 'var(--success)' :
                         reactionPhase === "clicked" ? 'var(--primary)' :
                         'var(--border)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              boxShadow: reactionPhase === "show" ? '0 0 40px rgba(16, 185, 129, 0.6)' : 'none'
            }}>
              {reactionPhase === "clicked" && "✓"}
            </div>

            {reactionPhase === "waiting" && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Wait for green...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "impulse") {
    return (
      <div className="container" style={{ cursor: 'default' }}>
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="animate-fadeIn">
            <h2 style={{ marginBottom: '16px' }}>Impulse Control</h2>
            <p style={{ marginBottom: '24px' }}>
              Tap <span style={{ color: 'var(--success)' }}>green</span> circles only!<br/>
              Avoid <span style={{ color: 'var(--error)' }}>red</span> distractors
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Target {impulseCount} of 8
            </p>

            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '40px auto',
              background: showTarget ? 'var(--success)' :
                         showDistractor ? 'var(--error)' :
                         'transparent',
              transition: 'all 0.2s ease',
              cursor: showTarget || showDistractor ? 'pointer' : 'default',
              boxShadow: showTarget ? '0 0 40px rgba(16, 185, 129, 0.6)' :
                        showDistractor ? '0 0 40px rgba(239, 68, 68, 0.6)' :
                        'none',
              animation: showTarget || showDistractor ? 'fadeIn 0.2s ease-out' : 'none'
            }}
            onClick={() => {
              if (showTarget) handleImpulseTap(true);
              if (showDistractor) handleImpulseTap(false);
            }}
            />

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '24px'
            }}>
              <div style={{
                fontSize: '14px',
                color: 'var(--success)'
              }}>
                ✓ {correctTaps}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--error)'
              }}>
                ✗ {wrongTaps}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "switching") {
    return (
      <div className="container" style={{ cursor: 'default' }}>
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="animate-fadeIn">
            <h2 style={{ marginBottom: '16px' }}>Task Switching</h2>
            <p style={{ marginBottom: '24px' }}>
              Follow the instructions quickly!
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Round {switchCount} of 6
            </p>

            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--primary)',
              marginBottom: '32px',
              padding: '24px',
              background: 'var(--bg-dark)',
              borderRadius: '16px',
              border: '2px solid var(--primary)',
              animation: 'pulse 0.4s ease-out'
            }}>
              {switchMode === "tap" ? "TAP THE CIRCLE" : "HOLD THE CIRCLE"}
            </div>

            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto',
              background: 'var(--primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)'
            }}
            onClick={() => switchMode === "tap" && handleSwitchAction("tap")}
            onMouseDown={() => switchMode === "hold" && handleSwitchAction("hold")}
            />

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '32px'
            }}>
              <div style={{
                fontSize: '14px',
                color: 'var(--success)'
              }}>
                ✓ {switchCorrect}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--error)'
              }}>
                ✗ {switchErrors}
              </div>
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
          <h1>Focus Assessment</h1>
          <p>Answer honestly for accurate results</p>
        </div>

        <div className="form-group animate-slideIn">
          <label>How many hours per day do you scroll social media?</label>
          <input
            type="range"
            min="0"
            max="8"
            value={scrollHours}
            onChange={(e) => setScrollHours(Number(e.target.value))}
          />
          <div className="text-center" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '20px' }}>
            {scrollHours} hours
          </div>
        </div>

        <div className="form-group animate-slideIn delay-100" style={{ animationFillMode: 'both' }}>
          <label>How often do you switch between apps while doing focused work?</label>
          <select value={switching} onChange={(e) => setSwitching(e.target.value)}>
            <option value="rarely">Rarely - I stay focused</option>
            <option value="sometimes">Sometimes - A few times per hour</option>
            <option value="often">Often - Every few minutes</option>
            <option value="constantly">Constantly - Can't help it</option>
          </select>
        </div>

        <div className="animate-fadeIn delay-200 mt-6" style={{ animationFillMode: 'both' }}>
          <button className="btn" onClick={startTest}>
            Start Focus Test
            <span>→</span>
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginTop: '20px',
          marginBottom: '0'
        }}>
          This test measures reaction time, impulse control, and task-switching ability
        </p>
      </div>
    </div>
  );
}
