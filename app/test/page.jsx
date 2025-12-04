"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestPage() {
  const [params, setParams] = useState({ src: "", campaign: "", ref: "" });
  const [scrollHours, setScrollHours] = useState(4);
  const [switching, setSwitching] = useState("sometimes");
  const [phase, setPhase] = useState("questions"); // questions, countdown, dot, done
  const [countdown, setCountdown] = useState(3);
  const [tapFail, setTapFail] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      src: urlParams.get("src") || "",
      campaign: urlParams.get("campaign") || "",
      ref: urlParams.get("ref") || "",
    });
  }, []);

  function startTest() {
    setPhase("countdown");
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setPhase("dot");
        setTimeout(finishTest, 5000);
      }
    }, 1000);
  }

  function finishTest() {
    setPhase("done");
    const dotScore = tapFail ? 40 : 100;
    const switchScore = switching === "rarely" ? 90 : switching === "sometimes" ? 70 : switching === "often" ? 50 : 30;
    const finalScore = Math.round((dotScore * 0.4) + ((10 - scrollHours) * 10 * 0.3) + (switchScore * 0.3));
    setScore(finalScore);
  }

  if (phase === "done") {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-fadeInUp">
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Your Focus Score</h2>
            <div className="score-display animate-pulse">{score}</div>
            <p>
              {score >= 70 ? "Good! But there's room to improve." :
               score >= 50 ? "Your attention needs some work." :
               "Your focus is compromised. Let's fix that."}
            </p>

            <div className="mt-6">
              <Link href={`/result?score=${score}&src=${params.src}&campaign=${params.campaign}&ref=${params.ref}`}>
                <button className="btn">
                  Save My Score
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
            <p style={{ marginBottom: '24px' }}>Get ready...</p>
            <div className="score-display animate-pulse">{countdown}</div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "dot") {
    return (
      <div
        className="container"
        onClick={() => setTapFail(true)}
        style={{ cursor: 'default' }}
      >
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="animate-fadeIn">
            <h2>Focus on the dot</h2>
            <p style={{ marginBottom: '8px' }}>Do not tap anywhere</p>
            <div className="dot"></div>
            {tapFail && (
              <p style={{ color: 'var(--error)', marginTop: '16px' }} className="animate-fadeIn">
                ❌ You tapped! Stay focused.
              </p>
            )}
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
          <h1>Focus Test</h1>
          <p>Answer honestly for accurate results</p>
        </div>

        <div className="form-group animate-slideIn">
          <label>How many hours per day do you scroll?</label>
          <input
            type="range"
            min="0"
            max="8"
            value={scrollHours}
            onChange={(e) => setScrollHours(Number(e.target.value))}
          />
          <div className="text-center" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            {scrollHours} hours
          </div>
        </div>

        <div className="form-group animate-slideIn delay-100" style={{ opacity: 0 }}>
          <label>How often do you switch between apps?</label>
          <select value={switching} onChange={(e) => setSwitching(e.target.value)}>
            <option value="rarely">Rarely</option>
            <option value="sometimes">Sometimes</option>
            <option value="often">Often</option>
            <option value="constantly">Constantly</option>
          </select>
        </div>

        <div className="animate-fadeIn delay-200 mt-6" style={{ opacity: 0 }}>
          <button className="btn" onClick={startTest}>
            Start Focus Test
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
