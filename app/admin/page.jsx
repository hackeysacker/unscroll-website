"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("key");

    if (key === "SECRET") {
      setAllowed(true);
      fetch(`/api/admin/users?key=${key}`)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
          <div className="card text-center animate-fadeInUp">
            <h1 style={{ color: 'var(--error)' }}>Access Denied</h1>
            <p>You don't have permission to view this page.</p>
            <div className="mt-6">
              <Link href="/">
                <button className="btn btn-secondary">
                  Back to Home
                </button>
              </Link>
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
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ marginBottom: 0 }}>Users</h1>
          <span className="badge">{users.length} total</span>
        </div>

        {users.length === 0 ? (
          <p className="text-center">No users yet</p>
        ) : (
          <div>
            {users.map((u, i) => (
              <div key={i} className="user-item animate-slideIn" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <strong>{u.email}</strong>
                <div style={{ marginTop: '8px' }}>
                  <span>Source: {u.signupSource || 'N/A'}</span>
                  {u.marketingSource && <span> • Campaign: {u.marketingSource}</span>}
                  {u.focusScore && <span> • Score: <strong style={{ color: 'var(--primary)' }}>{u.focusScore}</strong></span>}
                </div>
                {u.referralCode && (
                  <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Referral: {u.referralCode}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
