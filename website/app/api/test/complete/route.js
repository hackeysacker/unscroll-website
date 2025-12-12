import { generateReferralCode } from "../../../../lib/generateReferral";

// Use edge runtime for Cloudflare Pages
export const runtime = 'edge';

// In-memory storage (Note: resets on each deployment)
const users = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, focusScore, marketingSource, marketingCampaign, referralCodeUsed } = body;

    if (!email) {
      return Response.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        email,
        signupSource: "attention_test",
        marketingSource,
        marketingCampaign,
        focusScore,
        referralCode: generateReferralCode(),
        referred_by: referralCodeUsed || null,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      console.log('New test completion:', email, 'Score:', focusScore);
    } else {
      user.focusScore = focusScore;
    }

    return Response.json({ ok: true, referralCode: user.referralCode });
  } catch (error) {
    console.error('Test complete error:', error);
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
