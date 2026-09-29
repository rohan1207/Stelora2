import { useEffect } from "react";

function isHomePath(pathname) {
  return pathname === "/" || pathname === "/home" || pathname === "";
}

/**
 * Showcase mode: never leave the home page.
 * Hash jumps on this page are allowed; mail, tel, and off-site/other routes are blocked.
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
          event.preventDefault();
          return;
        }
        if (!isHomePath(url.pathname)) {
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
