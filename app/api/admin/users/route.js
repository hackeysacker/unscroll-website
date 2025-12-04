// Use edge runtime for Cloudflare Pages
export const runtime = 'edge';

// In-memory storage (Note: resets on each deployment)
// For production, use Cloudflare KV or D1 database
const users = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // IMPORTANT: Change this secret in production!
    // Better: Use environment variables via Cloudflare dashboard
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "SECRET";

    if (key !== ADMIN_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ 
      users,
      count: users.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
