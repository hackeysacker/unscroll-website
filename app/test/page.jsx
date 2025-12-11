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

  // Pattern memory test
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [patternRound, setPatternRound] = useState(0);
  const [correctPatterns, setCorrectPatterns] = useState(0);
  const [wrongPatterns, setWrongPatterns] = useState(0);
  const patternTimeoutRef = useRef(null);

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
      if (patternTimeoutRef.current) clearTimeout(patternTimeoutRef.current);
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
        setTimeout(() => startPatternTest(), 1000);
      } else {
        setTimeout(() => nextReactionRound(), 800);
      }
    } else if (reactionPhase === "waiting") {
      clearTimeout(reactionTimeoutRef.current);
      showQuickFeedback("❌ Too early!", "error");
      setTimeout(() => nextReactionRound(), 1000);
    }
  };

  // === PATTERN MEMORY TEST ===
  const startPatternTest = () => {
    setPhase("pattern");
    setProgress(70);
    setCorrectPatterns(0);
    setWrongPatterns(0);
    setPatternRound(0);
    nextPatternRound();
  };

  const generatePattern = (length) => {
    const newPattern = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * 9));
    }
    return newPattern;
  };

  const nextPatternRound = () => {
    if (patternRound >= 5) {
      finishTest();
      return;
    }

    setUserPattern([]);
    const patternLength = 3 + patternRound; // Start with 3, increase each round
    const newPattern = generatePattern(patternLength);
    setPattern(newPattern);
    setShowingPattern(true);

    // Show pattern for 2 seconds
    patternTimeoutRef.current = setTimeout(() => {
      setShowingPattern(false);
      setPatternRound(prev => prev + 1);
    }, 1500 + (patternLength * 400));
  };

  const handleCellClick = (index) => {
    if (showingPattern) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    // Check if pattern matches so far
    const isCorrect = pattern[newUserPattern.length - 1] === index;

    if (!isCorrect) {
      setWrongPatterns(prev => prev + 1);
      showQuickFeedback("✗ Wrong pattern!", "error");
      setTimeout(() => nextPatternRound(), 1000);
      return;
    }

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      setCorrectPatterns(prev => prev + 1);
      showQuickFeedback("✓ Perfect memory!", "success");
      setTimeout(() => nextPatternRound(), 1000);
    }
  };

  // === FINISH TEST ===
  const finishTest = () => {
    setProgress(100);

    // Calculate score
    const focusScore = Math.max(0, Math.min(100, (holdTime / 8000) * 100 - focusBreaks * 15));
    const avgReaction = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length || 400;
    const reactionScore = Math.max(0, 100 - (avgReaction - 150) / 3);
    const memoryAccuracy = correctPatterns / 5;
    const memoryPenalty = wrongPatterns * 15;
    const memoryScore = Math.max(0, memoryAccuracy * 100 - memoryPenalty);

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
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--error)',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ⚡ 30 Second Brain Test
              </div>
              <h1 style={{ fontSize: '40px', marginBottom: '16px', lineHeight: '1.1' }}>
                How Damaged Is<br/>Your Attention?
              </h1>
              <p style={{ fontSize: '17px', lineHeight: '1.6', marginBottom: '24px' }}>
                This scientifically-designed test will expose<br/>
                exactly how bad your focus has gotten.
              </p>
            </div>

            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: 'var(--text-primary)' }}>
                We'll test your:
              </div>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '2' }}>
                🎯 <strong style={{color: 'var(--text-primary)'}}>Focus Endurance</strong> – Can you hold attention?<br/>
                ⚡ <strong style={{color: 'var(--text-primary)'}}>Reaction Speed</strong> – How fast is your brain?<br/>
                🧠 <strong style={{color: 'var(--text-primary)'}}>Pattern Memory</strong> – Can you remember sequences?
              </div>
            </div>

            <button className="btn" onClick={startFocusTest} style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              fontSize: '18px',
              padding: '18px',
              marginBottom: '16px'
            }}>
              Start Brain Test
              <span>→</span>
            </button>

            <div style={{
              textAlign: 'center',
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.06)',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.15)'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--error)', fontWeight: '600', margin: '0' }}>
                ⚠️ Warning: Most people score below 40%
              </p>
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
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
            <div className="animate-fadeIn" style={{width: '100%', maxWidth: '400px'}}>
              <h2 style={{ marginBottom: '12px', fontSize: '28px' }}>Focus Hold</h2>
              <p style={{ marginBottom: '32px', fontSize: '16px', color: 'var(--text-secondary)' }}>
                Hold the circle for <strong style={{color: 'var(--primary)'}}>8 seconds</strong><br/>
                Don't let go!
              </p>

              <div style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                margin: '0 auto 32px'
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
                    cx="140"
                    cy="140"
                    r="130"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="130"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 130}`}
                    strokeDashoffset={`${2 * Math.PI * 130 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round"
                    style={{transition: 'stroke-dashoffset 0.1s linear'}}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    background: isHolding ?
                      'linear-gradient(135deg, var(--primary), var(--accent))' :
                      'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(245, 158, 11, 0.2))',
                    border: '4px solid',
                    borderColor: isHolding ? 'var(--primary)' : 'var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: '800',
                    color: isHolding ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    boxShadow: isHolding ? '0 0 40px rgba(99, 102, 241, 0.6)' : 'none',
                    userSelect: 'none'
                  }}
                >
                  {isHolding ? '🎯' : 'HOLD'}
                </div>
              </div>

              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: '8px'
              }}>
                {(holdTime / 1000).toFixed(1)}s / 8.0s
              </div>

              {focusBreaks > 0 && (
                <div style={{
                  fontSize: '14px',
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
        <div className="container" onClick={handleReactionClick} style={{ cursor: 'pointer' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
            <div className="animate-fadeIn">
              <h2 style={{ marginBottom: '12px', fontSize: '28px' }}>Reaction Speed</h2>
              <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                Click as soon as you see <span style={{color: 'var(--success)', fontWeight: '700'}}>GREEN</span>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Round {currentReaction + 1} of 3
              </p>

              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                margin: '40px auto',
                background: reactionPhase === "show" ? 'var(--success)' :
                           reactionPhase === "success" ? 'var(--primary)' :
                           'var(--border)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                boxShadow: reactionPhase === "show" ? '0 0 60px rgba(16, 185, 129, 0.8)' :
                          reactionPhase === "success" ? '0 0 40px rgba(99, 102, 241, 0.6)' :
                          'none',
                animation: reactionPhase === "show" ? 'pulse 0.5s ease-in-out infinite' : 'none'
              }}>
                {reactionPhase === "success" && "✓"}
              </div>

              {reactionPhase === "waiting" && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '600' }}>
                  Wait for it...
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // === IMPULSE CONTROL TEST ===
  if (phase === "pattern") {
    return (
      <>
        <ProgressBar />
        <FeedbackPopup />
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
            <div className="animate-fadeIn">
              <h2 style={{ marginBottom: '12px', fontSize: '28px' }}>Pattern Memory</h2>
              <p style={{ marginBottom: '24px', fontSize: '16px' }}>
                {showingPattern ? (
                  <>Watch the <span style={{color: 'var(--primary)', fontWeight: '700'}}>PATTERN</span> carefully!</>
                ) : (
                  <>Tap the cells in the <span style={{color: 'var(--primary)', fontWeight: '700'}}>SAME ORDER</span></>
                )}
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Round {patternRound} of 5 • Pattern Length: {pattern.length}
              </p>

              {/* 3x3 Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                maxWidth: '280px',
                margin: '0 auto 32px'
              }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                  const isInPattern = showingPattern && pattern.includes(index);
                  const isCurrentHighlight = showingPattern && pattern[userPattern.length] === index;
                  const wasClicked = userPattern.includes(index);

                  return (
                    <div
                      key={index}
                      onClick={() => handleCellClick(index)}
                      style={{
                        width: '85px',
                        height: '85px',
                        borderRadius: '12px',
                        background: isInPattern ? 'var(--primary)' :
                                   wasClicked ? 'var(--success)' :
                                   'var(--bg-card)',
                        border: '2px solid var(--border)',
                        cursor: showingPattern ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isInPattern ? '0 0 30px rgba(99, 102, 241, 0.6)' : 'none',
                        opacity: showingPattern && !isInPattern ? 0.3 : 1,
                        animation: isCurrentHighlight ? 'pulse 0.5s ease-in-out' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              <div style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                marginTop: '24px'
              }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--success)',
                  fontWeight: '600'
                }}>
                  ✓ {correctPatterns}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--error)',
                  fontWeight: '600'
                }}>
                  ✗ {wrongPatterns}
                </div>
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
        <div className="container">
          <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
            <div className="card text-center animate-scaleIn" style={{maxWidth: '500px'}}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>{scoreMsg.emoji}</div>

              <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '12px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Your Brain Score
              </h2>

              <div style={{
                fontSize: '96px',
                fontWeight: '900',
                background: score >= 65 ?
                  'linear-gradient(135deg, var(--success), var(--primary))' :
                  score >= 45 ?
                  'linear-gradient(135deg, var(--primary), var(--accent))' :
                  'linear-gradient(135deg, var(--error), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px',
                lineHeight: '1'
              }}>
                {score}
              </div>

              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                {scoreMsg.text}
              </div>
              <p style={{ fontSize: '17px', lineHeight: '1.5', marginBottom: '32px', fontWeight: '500' }}>
                {scoreMsg.subtext}
              </p>

              {/* Detailed breakdown */}
              <div style={{
                background: 'var(--bg-dark)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Your Results:
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Focus Endurance</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: 'var(--primary)'}}>{((holdTime / 8000) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Reaction Speed</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: 'var(--success)'}}>{Math.round(reactionTimes.reduce((a,b) => a+b, 0) / reactionTimes.length)}ms</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Pattern Memory</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: correctPatterns >= 3 ? 'var(--success)' : 'var(--error)'}}>{correctPatterns}/5</span>
                  </div>
                </div>
              </div>

              <div className="mt-6" style={{ width: '100%' }}>
                <Link href={`/result?score=${score}&src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                  <button className="btn" style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    fontSize: '18px',
                    padding: '18px',
                    marginBottom: '12px'
                  }}>
                    Fix My Broken Focus
                    <span>→</span>
                  </button>
                </Link>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center'
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
