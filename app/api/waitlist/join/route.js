import { generateReferralCode } from "../../../../lib/generateReferral";

// Use edge runtime for Cloudflare Pages
export const runtime = 'edge';

// In-memory storage (Note: resets on each deployment)
// For production, use Cloudflare KV or D1 database
const users = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, signupSource, marketingSource, marketingCampaign, referralCodeUsed } = body;

    if (!email) {
      return Response.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    let user = users.find((u) => u.email === email);

    if (!user) {
      const code = generateReferralCode();
      user = {
        email,
        signupSource,
        marketingSource,
        marketingCampaign,
        focusScore: null,
        referralCode: code,
        referred_by: referralCodeUsed || null,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      console.log('New waitlist signup:', email);
    }

    return Response.json({ ok: true, referralCode: user.referralCode });
  } catch (error) {
    console.error('Waitlist join error:', error);
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
