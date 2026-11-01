import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { CASE_STUDIES, SITE } from "@/data/siteContent";

const WORK_FRAMES = [
  "/content/posts/carousel-1.png",
  "/content/posts/carousel-2.png",
  "/content/posts/carousel-3.png",
  "/content/posts/carousel-4.png",
  "/content/posts/carousel-5.png",
  "/content/reels/2.png",
  "/content/reels/3.png",
  "/content/posts/post-2.png",
];

export default function CaseStudiesPage() {
  return (
    <PageShell
      title="Case studies"
      description="A growing portfolio of Stelora Media brands across beauty, hospitality, interiors, travel, automotive, and real estate."
    >
      <PageHero
        kicker="Real brands. Real growth."
        title="Brands that trust us"
        body="A growing portfolio across beauty, hospitality, interiors, travel, automotive, and real estate — 20+ trusted brands."
      />

      <section className="page-section">
        <div className="space-y-6 mb-12">
          {CASE_STUDIES.map((study) => (
            <article key={study.title} className="page-card grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={study.image} alt={study.title} className="page-media aspect-[16/10]" />
              <div>
                <p className="page-card__kicker">{study.industry}</p>
                <h2 className="page-card__title" style={{ fontSize: "1.45rem" }}>
                  {study.title}
                </h2>
                <p className="page-card__body">{study.summary}</p>
                <ul className="page-list">
                  {study.metrics.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          Selected frames
        </h2>
        <div className="page-grid page-grid-4 mb-8">
          {WORK_FRAMES.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="Stelora campaign frame" className="page-media aspect-square" />
          ))}
        </div>

        <div className="page-cta-row">
          <Link href="/services" className="btn-pill btn-pill-outline px-6 py-3 text-[0.68rem]">
            <span>Our services</span>
          </Link>
          <Link href="/contact" className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]">
            <span>Start a project</span>
          </Link>
        </div>
        <p className="mt-6 text-center font-body text-[0.78rem] text-stelora-muted">{SITE.location}</p>
      </section>
    </PageShell>
  );
}
