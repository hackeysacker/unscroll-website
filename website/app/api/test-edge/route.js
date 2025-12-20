export const runtime = 'edge';

export async function GET() {
  return new Response('Hello from edge runtime', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({ ok: true, received: body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
