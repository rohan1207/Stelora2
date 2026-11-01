import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { RESULTS, SITE, TESTIMONIALS } from "@/data/siteContent";

const SHOTS = [
  "/content/testimonials/WhatsApp Image 2026-10-26 at 11.15.01 AM.jpeg",
  "/content/testimonials/WhatsApp Image 2026-10-26 at 11.15.02 AM.jpeg",
  "/content/testimonials/WhatsApp Image 2026-10-26 at 11.15.03 AM.jpeg",
  "/content/testimonials/WhatsApp Image 2026-10-26 at 11.15.04 AM.jpeg",
];

export default function TestimonialsPage() {
  return (
    <PageShell
      title="Client testimonials"
      description="Real results and client words from brands that trust Stelora Media."
    >
      <PageHero
        kicker="In their words"
        title="What clients say"
        body="Real results, real growth — content and strategy that drive numbers, not just aesthetics."
      />

      <section className="page-section">
        {TESTIMONIALS.map((item) => (
          <article key={item.author} className="page-card mb-8">
            <blockquote className="page-quote">“{item.quote}”</blockquote>
            <p className="mt-5 font-display text-[0.78rem] font-bold uppercase tracking-[0.16em] text-stelora-navy">
              {item.author}
            </p>
            <p className="mt-1 font-body text-[0.8rem] text-stelora-muted">{item.role}</p>
          </article>
        ))}

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          Numbers our clients have seen
        </h2>
        <div className="page-grid page-grid-3 mb-10">
          {RESULTS.map((stat) => (
            <div key={stat.label} className="page-stat">
              <div className="page-stat__value">{stat.value}</div>
              <p className="page-stat__label">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          Screenshots from the work
        </h2>
        <div className="page-grid page-grid-4 mb-8">
          {SHOTS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="Client result screenshot" className="page-media aspect-[4/5]" />
          ))}
        </div>

        <div className="page-cta-row">
          <Link href="/case-studies" className="btn-pill btn-pill-outline px-6 py-3 text-[0.68rem]">
            <span>Case studies</span>
          </Link>
          <Link href="/contact" className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]">
            <span>Contact us</span>
          </Link>
        </div>
        <p className="mt-6 text-center font-body text-[0.78rem] text-stelora-muted">{SITE.location}</p>
      </section>
    </PageShell>
  );
}
