import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/data/siteContent";

/**
 * Shared layout for inner pages — same canvas / navy language as home.
 */
export default function PageShell({
  title,
  description = SITE.description,
  children,
  bare = false,
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.name;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={SITE.name} />
      </Head>
      <Navbar />
      <main className="min-h-[100svh] bg-stelora-canvas pt-[4.75rem] md:pt-[5.25rem]">
        {bare ? (
          children
        ) : (
          <div className="relative overflow-hidden border-b border-stelora-line">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 0%, rgba(26, 48, 123, 0.07), transparent 60%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 55%, #ebe7df 100%)",
              }}
              aria-hidden
            />
            <div className="relative z-10">{children}</div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export function PageHero({ kicker, title, body }) {
  return (
    <header className="mx-auto w-full max-w-4xl px-5 pb-8 pt-10 text-center md:px-8 md:pb-10 md:pt-14">
      {kicker ? (
        <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.26em] text-stelora-muted">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 font-display text-[clamp(1.85rem,5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.035em] text-stelora-navy">
        {title}
      </h1>
      {body ? (
        <p className="mx-auto mt-4 max-w-2xl font-body text-[0.92rem] leading-relaxed text-stelora-muted md:text-[1rem]">
          {body}
        </p>
      ) : null}
    </header>
  );
}
