import { useEffect, useState } from "react";

/**
 * Renders the same fallback on server + first client paint,
 * then swaps in children after mount — avoids hydration mismatches
 * from next/dynamic { ssr: false } and window-dependent trees.
 */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;
  return children;
}
