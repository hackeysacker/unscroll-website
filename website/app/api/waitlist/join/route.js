// Use edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

const SUPABASE_URL = 'https://sxgpcsfwbzptlmwfddda.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z3Bjc2Z3YnpwdGxtd2ZkZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTI0NzYsImV4cCI6MjA3OTMyODQ3Nn0.kkQc632Gu8ozuCD5HoZVS35yGbxA4l2kmuq96bCBg4w';

// Generate referral code inline (edge runtime compatible)
function generateReferralCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return "focus" + num.toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, signupSource, marketingSource, marketingCampaign, referralCodeUsed } = body;

    if (!email) {
      return new Response(JSON.stringify({ ok: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const referralCode = generateReferralCode();

    const insertData = {
      email,
      subject: 'Waitlist Signup',
      message: `Waitlist signup - Source: ${signupSource || 'waitlist'}, Marketing: ${marketingSource || 'none'}, Campaign: ${marketingCampaign || 'none'}, Referral: ${referralCodeUsed || 'none'}, Referral Code: ${referralCode}`,
      name: null,
      source: 'waitlist',
    };

    const insertResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/email_submissions`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(insertData)
      }
    );

    const responseText = await insertResponse.text();
    let errorData;
    
    try {
      errorData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      errorData = { message: responseText || 'Unknown error' };
    }

    if (!insertResponse.ok) {
      if (insertResponse.status === 406 || insertResponse.status === 404 ||
          errorData?.message?.includes('relation') ||
          errorData?.message?.includes('does not exist') ||
          errorData?.code === 'PGRST116') {
        return new Response(JSON.stringify({
          ok: false,
          error: 'Database table not found. Please run the SQL migration in Supabase.'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (insertResponse.status === 425 || insertResponse.status === 401 ||
          errorData?.message?.includes('permission denied') ||
          errorData?.code === '42501') {
        return new Response(JSON.stringify({
          ok: false,
          error: 'Permission denied. Please check Row Level Security policies in Supabase.'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({
        ok: false,
        error: errorData?.message || errorData?.error || `Failed to save to database (${insertResponse.status}: ${insertResponse.statusText})`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, referralCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'Server error: ' + (error.message || String(error))
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
