import { redirect } from 'next/navigation';

// Use edge runtime for Cloudflare Pages
export const runtime = 'edge';

export default function ReferralRedirect({ params }) {
  redirect(`/early?ref=${params.code}`);
}
