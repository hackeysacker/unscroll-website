import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://sxgpcsfwbzptlmwfddda.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z3Bjc2Z3YnpwdGxtd2ZkZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTI0NzYsImV4cCI6MjA3OTMyODQ3Nn0.kkQc632Gu8ozuCD5HoZVS35yGbxA4l2kmuq96bCBg4w';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email format' }, { status: 400 });
    }

    const referralCode = 'focus' + Math.floor(1000 + Math.random() * 9000);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/email_submissions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email,
        subject: 'Waitlist Signup',
        message: 'Waitlist signup',
        source: 'waitlist'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        ok: false,
        error: `Database error: ${errorText}`
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, referralCode });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: `Server error: ${error.message}`
    }, { status: 500 });
  }
}
