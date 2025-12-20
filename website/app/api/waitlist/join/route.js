export const runtime = 'edge';

export async function POST() {
  return new Response(JSON.stringify({ ok: true, test: 'working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
