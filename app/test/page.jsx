"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

export default function TestPage() {
  const [params, setParams] = useState({ src: "", campaign: "", ref: "" });
  const [phase, setPhase] = useState("intro"); // intro, focus, reaction, impulse, done
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(null);

  // Focus hold test
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [focusBreaks, setFocusBreaks] = useState(0);
  const holdStartRef = useRef(0);
  const holdTimerRef = useRef(null);

  // Reaction test
  const [reactionPhase, setReactionPhase] = useState("waiting");
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(0);
  const reactionStartRef = useRef(0);
  const reactionTimeoutRef = useRef(null);

  // Distraction resistance test
  const [distractionRound, setDistractionRound] = useState(0);
  const [targetColor, setTargetColor] = useState('blue');
  const [distractions, setDistractions] = useState([]);
  const [targetVisible, setTargetVisible] = useState(false);
  const [distractionClicks, setDistractionClicks] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const targetStartRef = useRef(0);
  const distractionTestTimeoutRef = useRef(null);
  const targetTimeoutRef = useRef(null);
  const distractionIntervalRef = useRef(null);
  const targetClickedRef = useRef(false);

  // Feedback
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      if (distractionTestTimeoutRef.current) clearTimeout(distractionTestTimeoutRef.current);
      if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
      if (distractionIntervalRef.current) clearInterval(distractionIntervalRef.current);
    };
  }, []);

  // === FOCUS HOLD TEST ===
  const startFocusTest = () => {
    setPhase("focus");
    setProgress(15);
    setHoldTime(0);
    setFocusBreaks(0);
  };

  const handleFocusPressIn = () => {
    setIsHolding(true);
    holdStartRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      setHoldTime(prev => prev + 100);

      if (holdTime + elapsed >= 8000) {
        clearInterval(holdTimerRef.current);
        setIsHolding(false);
        showQuickFeedback("🎯 Perfect! Amazing focus!", "success");
        setTimeout(() => startReactionTest(), 1500);
      }
    }, 100);
  };

  const handleFocusPressOut = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setIsHolding(false);

    const duration = Date.now() - holdStartRef.current;
    if (duration < 2000 && holdTime < 7900) {
      setFocusBreaks(prev => prev + 1);
      showQuickFeedback("😬 Keep holding!", "warning");
    }
  };

  // === REACTION TEST ===
  const startReactionTest = () => {
    setPhase("reaction");
    setProgress(40);
    setReactionTimes([]);
    setCurrentReaction(0);
    nextReactionRound();
  };

  const nextReactionRound = () => {
    setReactionPhase("waiting");
    const waitTime = 1000 + Math.random() * 2000;

    reactionTimeoutRef.current = setTimeout(() => {
      setReactionPhase("show");
      reactionStartRef.current = Date.now();
    }, waitTime);
  };

  const handleReactionClick = () => {
    if (reactionPhase === "show") {
      const rt = Date.now() - reactionStartRef.current;
      setReactionTimes(prev => [...prev, rt]);
      setReactionPhase("success");
      setCurrentReaction(prev => prev + 1);

      if (rt < 200) {
        showQuickFeedback("⚡ INSANE!", "success");
      } else if (rt < 300) {
        showQuickFeedback("🔥 Lightning fast!", "success");
      } else if (rt < 400) {
        showQuickFeedback("👍 Nice!", "success");
      } else {
        showQuickFeedback("😬 Slow...", "warning");
      }

      if (currentReaction >= 2) {
        setTimeout(() => startDistractionTest(), 1000);
      } else {
        setTimeout(() => nextReactionRound(), 800);
      }
    } else if (reactionPhase === "waiting") {
      clearTimeout(reactionTimeoutRef.current);
      showQuickFeedback("❌ Too early!", "error");
      setTimeout(() => nextReactionRound(), 1000);
    }
  };

  // === DISTRACTION RESISTANCE TEST ===
  const startDistractionTest = () => {
    setPhase("distraction");
    setProgress(70);
    setDistractionClicks(0);
    setCorrectClicks(0);
    setMissedTargets(0);
    setResponseTimes([]);
    setDistractionRound(0);
    setDistractions([]);
    setTargetVisible(false);
    setTargetColor('blue');
    nextDistractionRound();
  };

  const generateDistraction = () => {
    const types = ['notification', 'popup', 'alert', 'badge'];
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // 10-90% of screen width
      y: Math.random() * 60 + 20, // 20-80% of screen height
      type: types[Math.floor(Math.random() * types.length)]
    };
  };

  const nextDistractionRound = () => {
    if (distractionRound >= 6) {
      finishTest();
      return;
    }

    // Clear previous timeouts
    if (distractionTestTimeoutRef.current) {
      clearTimeout(distractionTestTimeoutRef.current);
    }
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current);
    }
    if (distractionIntervalRef.current) {
      clearInterval(distractionIntervalRef.current);
    }

    setDistractions([]);
    setTargetVisible(false);

    // Start showing distractions
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const dist = generateDistraction();
        setDistractions(prev => [...prev, dist]);
      }, i * 600);
    }

    // Show target after 2 seconds
    targetClickedRef.current = false;
    distractionTestTimeoutRef.current = setTimeout(() => {
      setTargetColor(Math.random() < 0.5 ? 'blue' : 'green');
      setTargetVisible(true);
      targetStartRef.current = Date.now();

      // Hide target after 1.5 seconds if not clicked
      targetTimeoutRef.current = setTimeout(() => {
        if (!targetClickedRef.current) {
          setMissedTargets(prev => prev + 1);
          showQuickFeedback("⏱️ Missed target!", "error");
          setTargetVisible(false);
          setDistractionRound(prev => prev + 1);
          setTimeout(() => nextDistractionRound(), 1000);
        }
      }, 1500);
    }, 2000);

    // Keep adding distractions every 1.5 seconds
    distractionIntervalRef.current = setInterval(() => {
      const dist = generateDistraction();
      setDistractions(prev => {
        // Remove old distractions (keep max 5)
        const updated = [...prev, dist];
        return updated.slice(-5);
      });
    }, 1500);
  };

  const handleDistractionClick = (id) => {
    // User clicked a distraction - bad!
    setDistractionClicks(prev => prev + 1);
    setDistractions(prev => prev.filter(d => d.id !== id));
    showQuickFeedback("❌ Distracted!", "error");
  };

  const handleTargetClick = () => {
    if (!targetVisible) return;

    targetClickedRef.current = true;

    // Clear timeout
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current);
    }

    const responseTime = Date.now() - targetStartRef.current;
    setResponseTimes(prev => [...prev, responseTime]);
    setCorrectClicks(prev => prev + 1);
    setTargetVisible(false);

    if (responseTime < 500) {
      showQuickFeedback("⚡ Perfect focus!", "success");
    } else if (responseTime < 800) {
      showQuickFeedback("✓ Good!", "success");
    } else {
      showQuickFeedback("✓ Got it!", "success");
    }

    // Clear all distractions
    setDistractions([]);
    if (distractionIntervalRef.current) {
      clearInterval(distractionIntervalRef.current);
    }

    setDistractionRound(prev => prev + 1);
    setTimeout(() => nextDistractionRound(), 1200);
  };

  // === FINISH TEST ===
  const finishTest = () => {
    setProgress(100);

    // Calculate score
    const focusScore = Math.max(0, Math.min(100, (holdTime / 8000) * 100 - focusBreaks * 15));
    const avgReaction = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length || 400;
    const reactionScore = Math.max(0, 100 - (avgReaction - 150) / 3);
    const distractionResistance = Math.max(0, 100 - (distractionClicks * 20));
    const targetAccuracy = correctClicks / 6;
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 1000;
    const responseTimeScore = Math.max(0, 100 - (avgResponseTime - 400) / 8);
    const missedPenalty = missedTargets * 15;
    const memoryScore = Math.max(0, (distractionResistance * 0.5 + targetAccuracy * 100 * 0.3 + responseTimeScore * 0.2) - missedPenalty);

    const finalScore = Math.round((focusScore * 0.35 + reactionScore * 0.35 + memoryScore * 0.30));
    setScore(Math.min(100, Math.max(0, finalScore)));
    setPhase("done");
  };

  const showQuickFeedback = (message, type) => {
    setFeedback({ message, type });
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1200);
  };

  // Progress bar
  const ProgressBar = () => phase !== "intro" && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'var(--border)',
      zIndex: 1000
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
        transition: 'width 0.5s ease'
      }} />
    </div>
  );

  // Feedback popup
  const FeedbackPopup = () => showFeedback && (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '16px 32px',
      background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.95)' :
                  feedback.type === 'error' ? 'rgba(239, 68, 68, 0.95)' :
                  'rgba(245, 158, 11, 0.95)',
      borderRadius: '12px',
      fontSize: '24px',
      fontWeight: '700',
      color: 'white',
      zIndex: 2000,
      animation: 'scaleIn 0.2s ease-out',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      {feedback.message}
    </div>
  );

  // === INTRO SCREEN ===
  if (phase === "intro") {
    return (
      <>
        <ProgressBar />
        <FeedbackPopup />
        <div className="container" style={{ padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="text-center mb-4 animate-fadeIn" style={{ marginTop: '8px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Logo size={24} />
              <span className="logo logo-small" style={{ fontSize: '18px' }}>unscroll</span>
            </Link>
          </div>

          <div className="card animate-scaleIn" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div className="text-center mb-4">
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--error)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ⚡ 30 Second Brain Test
              </div>
              <h1 style={{ fontSize: '28px', marginBottom: '12px', lineHeight: '1.1' }}>
                How Damaged Is<br/>Your Attention?
              </h1>
              <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                This scientifically-designed test will expose exactly how bad your focus has gotten.
              </p>
            </div>

            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '16px',
              textAlign: 'left',
              flexShrink: 0
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-primary)' }}>
                We'll test your:
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                🎯 <strong style={{color: 'var(--text-primary)'}}>Focus Endurance</strong> – Can you hold attention?<br/>
                ⚡ <strong style={{color: 'var(--text-primary)'}}>Reaction Speed</strong> – How fast is your brain?<br/>
                🚫 <strong style={{color: 'var(--text-primary)'}}>Distraction Resistance</strong> – Can you ignore distractions?
              </div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
              <button className="btn" onClick={startFocusTest} style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                fontSize: '16px',
                padding: '14px',
                marginBottom: '12px',
                width: '100%'
              }}>
                Start Brain Test
                <span>→</span>
              </button>

              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.06)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--error)', fontWeight: '600', margin: '0', lineHeight: '1.4' }}>
                  ⚠️ Warning: Most people score below 40%
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // === FOCUS HOLD TEST ===
  if (phase === "focus") {
    const progressPercent = Math.min(100, (holdTime / 8000) * 100);

    return (
      <>
        <ProgressBar />
        <FeedbackPopup />
        <div className="container" style={{ padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
            <div className="animate-fadeIn" style={{width: '100%', maxWidth: '100%'}}>
              <h2 style={{ marginBottom: '8px', fontSize: '22px', marginTop: '8px' }}>Focus Hold</h2>
              <p style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Hold the circle for <strong style={{color: 'var(--primary)'}}>8 seconds</strong><br/>
                Don't let go!
              </p>

              <div style={{
                position: 'relative',
                width: '220px',
                height: '220px',
                margin: '0 auto 16px'
              }}>
                {/* Progress ring */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-90deg)'
                }}>
                  <circle
                    cx="110"
                    cy="110"
                    r="100"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="100"
                    fill="none"
                    stroke="url(#gradient-focus)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 100}`}
                    strokeDashoffset={`${2 * Math.PI * 100 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round"
                    style={{transition: 'stroke-dashoffset 0.1s linear'}}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient id="gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Hold button */}
                <div
                  onMouseDown={handleFocusPressIn}
                  onMouseUp={handleFocusPressOut}
                  onMouseLeave={handleFocusPressOut}
                  onTouchStart={handleFocusPressIn}
                  onTouchEnd={handleFocusPressOut}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${isHolding ? 1.05 : 1})`,
                    width: '170px',
                    height: '170px',
                    borderRadius: '50%',
                    background: isHolding ?
                      'linear-gradient(135deg, var(--primary), var(--accent))' :
                      'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(245, 158, 11, 0.2))',
                    border: '3px solid',
                    borderColor: isHolding ? 'var(--primary)' : 'var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    fontWeight: '800',
                    color: isHolding ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    boxShadow: isHolding ? '0 0 30px rgba(99, 102, 241, 0.6)' : 'none',
                    userSelect: 'none'
                  }}
                >
                  {isHolding ? '🎯' : 'HOLD'}
                </div>
              </div>

              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: '6px'
              }}>
                {(holdTime / 1000).toFixed(1)}s / 8.0s
              </div>

              {focusBreaks > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--error)',
                  fontWeight: '600'
                }}>
                  Breaks: {focusBreaks}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // === REACTION TEST ===
  if (phase === "reaction") {
    return (
      <>
        <ProgressBar />
        <FeedbackPopup />
        <div className="container" onClick={handleReactionClick} style={{ cursor: 'pointer', padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
            <div className="animate-fadeIn" style={{ width: '100%' }}>
              <h2 style={{ marginBottom: '8px', fontSize: '22px', marginTop: '8px' }}>Reaction Speed</h2>
              <p style={{ marginBottom: '12px', fontSize: '13px' }}>
                Click as soon as you see <span style={{color: 'var(--success)', fontWeight: '700'}}>GREEN</span>
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Round {currentReaction + 1} of 3
              </p>

              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                margin: '20px auto',
                background: reactionPhase === "show" ? 'var(--success)' :
                           reactionPhase === "success" ? 'var(--primary)' :
                           'var(--border)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: reactionPhase === "show" ? '0 0 50px rgba(16, 185, 129, 0.8)' :
                          reactionPhase === "success" ? '0 0 30px rgba(99, 102, 241, 0.6)' :
                          'none',
                animation: reactionPhase === "show" ? 'pulse 0.5s ease-in-out infinite' : 'none'
              }}>
                {reactionPhase === "success" && "✓"}
              </div>

              {reactionPhase === "waiting" && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                  Wait for it...
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // === DISTRACTION RESISTANCE TEST ===
  if (phase === "distraction") {
    return (
      <>
        <ProgressBar />
        <FeedbackPopup />
        <div className="container" style={{ position: 'relative', overflow: 'hidden', padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1, position: 'relative' }}>
            <div className="animate-fadeIn" style={{width: '100%', maxWidth: '100%', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column'}}>
              <div style={{ flexShrink: 0 }}>
                <h2 style={{ marginBottom: '6px', fontSize: '20px', marginTop: '8px' }}>Distraction Resistance</h2>
                <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Round {distractionRound + 1} of 6
                </p>
                
                {/* Instructions */}
                <div style={{
                  marginBottom: '16px',
                  padding: '12px 14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  lineHeight: '1.4'
                }}>
                  🎯 Click <span style={{color: targetColor === 'blue' ? '#3B82F6' : '#10B981', fontWeight: '800'}}>{targetColor.toUpperCase()}</span> when it appears<br/>
                  🚫 <span style={{color: 'var(--error)'}}>IGNORE</span> all distractions!
                </div>
              </div>

              {/* Central target */}
              <div style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                margin: '16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {targetVisible ? (
                  <div
                    onClick={handleTargetClick}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: targetColor === 'blue'
                        ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                        : 'linear-gradient(135deg, #10B981, #059669)',
                      boxShadow: `0 0 40px ${targetColor === 'blue' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)'}`,
                      cursor: 'pointer',
                      animation: 'pulse 0.8s ease-in-out infinite',
                      transition: 'all 0.2s ease',
                      border: '3px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      fontWeight: '800',
                      color: 'white'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.9)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🎯
                  </div>
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: 'var(--text-secondary)'
                  }}>
                    ⏳
                  </div>
                )}
              </div>

              {/* Distractions overlay */}
              {distractions.map((dist) => (
                <div
                  key={dist.id}
                  onClick={() => handleDistractionClick(dist.id)}
                  style={{
                    position: 'absolute',
                    left: `${dist.x}%`,
                    top: `${dist.y}%`,
                    transform: 'translate(-50%, -50%)',
                    padding: dist.type === 'notification' ? '10px 16px' : '12px',
                    background: dist.type === 'notification' 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.95))'
                      : dist.type === 'popup'
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(251, 191, 36, 0.95))'
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
                    borderRadius: dist.type === 'notification' ? '10px' : '50%',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: dist.type === 'notification' ? '12px' : '20px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    animation: 'bounce 0.5s ease-in-out',
                    zIndex: 10,
                    border: '2px solid white',
                    userSelect: 'none'
                  }}
                >
                  {dist.type === 'notification' ? '🔔 New!' : dist.type === 'popup' ? '⚠️' : '🔴'}
                </div>
              ))}

              {/* Score display */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                marginTop: 'auto',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--success)',
                  fontWeight: '700'
                }}>
                  ✓ {correctClicks}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--error)',
                  fontWeight: '700'
                }}>
                  ❌ {distractionClicks}
                </div>
                {responseTimes.length > 0 && (
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--primary)',
                    fontWeight: '700'
                  }}>
                    ⚡ {Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)}ms
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // === RESULTS SCREEN ===
  if (phase === "done") {
    const getScoreMessage = () => {
      if (score >= 80) return { emoji: "🏆", text: "ELITE TIER", subtext: "You're in the top 5%!" };
      if (score >= 65) return { emoji: "💪", text: "Above Average", subtext: "Better than most, but room to grow" };
      if (score >= 45) return { emoji: "⚠️", text: "Struggling", subtext: "Your focus is compromised" };
      return { emoji: "🚨", text: "CRITICAL", subtext: "Your attention is severely damaged" };
    };

    const scoreMsg = getScoreMessage();

    return (
      <>
        <ProgressBar />
        <div className="container" style={{ padding: '12px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
            <div className="card text-center animate-scaleIn" style={{maxWidth: '100%', width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', height: '100%'}}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>{scoreMsg.emoji}</div>

                <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Your Brain Score
                </h2>

                <div style={{
                  fontSize: '72px',
                  fontWeight: '900',
                  background: score >= 65 ?
                    'linear-gradient(135deg, var(--success), var(--primary))' :
                    score >= 45 ?
                    'linear-gradient(135deg, var(--primary), var(--accent))' :
                    'linear-gradient(135deg, var(--error), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '12px',
                  lineHeight: '1'
                }}>
                  {score}
                </div>

                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  {scoreMsg.text}
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '20px', fontWeight: '500' }}>
                  {scoreMsg.subtext}
                </p>

                {/* Detailed breakdown */}
                <div style={{
                  background: 'var(--bg-dark)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                    Your Results:
                  </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Focus Endurance</span>
                      <span style={{fontSize: '14px', fontWeight: '700', color: 'var(--primary)'}}>{((holdTime / 8000) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Reaction Speed</span>
                      <span style={{fontSize: '14px', fontWeight: '700', color: 'var(--success)'}}>{Math.round(reactionTimes.reduce((a,b) => a+b, 0) / reactionTimes.length)}ms</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Distraction Resistance</span>
                      <span style={{fontSize: '14px', fontWeight: '700', color: distractionClicks === 0 && correctClicks >= 4 ? 'var(--success)' : distractionClicks <= 2 && correctClicks >= 3 ? 'var(--primary)' : 'var(--error)'}}>{correctClicks}/6 ({distractionClicks})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', width: '100%' }}>
                <Link href={`/result?score=${score}&src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                  <button className="btn" style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    fontSize: '16px',
                    padding: '14px',
                    marginBottom: '10px',
                    width: '100%'
                  }}>
                    Fix My Broken Focus
                    <span>→</span>
                  </button>
                </Link>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }}>
                  Get your personalized recovery plan • Free
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
