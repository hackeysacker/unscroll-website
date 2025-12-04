"use client";

import { useEffect } from "react";

export default function ReferralRedirect({ params }) {
  useEffect(() => {
    window.location.href = `/early?ref=${params.code}`;
  }, [params.code]);

  return <div>Redirecting...</div>;
}
