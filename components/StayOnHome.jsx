import { useEffect } from "react";

const ALLOWED_PATHS = new Set([
  "/",
  "/home",
  "/services",
  "/about",
  "/packages",
  "/testimonials",
  "/case-studies",
  "/contact",
]);

/**
 * Keep navigation on Stelora site pages.
 * Allows in-site routes + mailto to steloramedia@gmail.com + hash jumps.
 * Blocks unknown external destinations.
 */
export default function StayOnHome() {
  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest?.("a");
      if (!anchor) return;

      const raw = anchor.getAttribute("href");
      if (raw == null || raw === "" || raw === "#") {
        event.preventDefault();
        return;
      }
      if (raw.startsWith("#")) return;

      const lower = raw.toLowerCase();
      if (lower.startsWith("mailto:steloramedia@gmail.com")) return;
      if (
        lower.startsWith("mailto:") ||
        lower.startsWith("tel:") ||
        lower.startsWith("sms:") ||
        lower.startsWith("javascript:")
      ) {
        event.preventDefault();
        return;
      }

      try {
        const url = new URL(raw, window.location.href);
        if (url.origin !== window.location.origin) {
          // Allow official social profiles only
          const host = url.hostname.replace(/^www\./, "");
          if (
            (host === "instagram.com" && url.pathname.toLowerCase().includes("steloramedia")) ||
            (host === "linkedin.com" && url.pathname.toLowerCase().includes("stelora"))
          ) {
            return;
          }
          event.preventDefault();
          return;
        }
        const path = url.pathname.replace(/\/$/, "") || "/";
        if (!ALLOWED_PATHS.has(path)) {
          event.preventDefault();
        }
      } catch {
        event.preventDefault();
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
