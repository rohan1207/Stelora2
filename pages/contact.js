import PageShell, { PageHero } from "@/components/PageShell";
import { SITE } from "@/data/siteContent";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      description="Book a free strategy call with Stelora Media — Pune, Maharashtra · Pan-India operations."
    >
      <PageHero
        kicker="Ready to grow?"
        title="Let’s talk strategy"
        body="Book a free strategy call and we’ll map out where your paid media, social, or web presence has the most upside."
      />

      <section className="page-section">
        <div className="page-grid page-grid-3 mb-10">
          <article className="page-card">
            <p className="page-card__kicker">Email</p>
            <a
              href={`mailto:${SITE.email}`}
              className="page-card__title mt-3 block break-all"
              style={{ fontSize: "1.05rem" }}
            >
              {SITE.email}
            </a>
          </article>
          <article className="page-card">
            <p className="page-card__kicker">Instagram</p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="page-card__title mt-3 block"
            >
              {SITE.instagram}
            </a>
          </article>
          <article className="page-card">
            <p className="page-card__kicker">LinkedIn</p>
            <a
              href={SITE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="page-card__title mt-3 block"
            >
              Stelora Media
            </a>
          </article>
        </div>

        <article className="page-card text-center">
          <p className="page-card__kicker">Studio</p>
          <h2 className="page-card__title" style={{ fontSize: "1.35rem" }}>
            {SITE.location}
          </h2>
          <p className="page-card__body mx-auto max-w-md">
            Website: {SITE.url.replace("https://", "")}
          </p>
          <div className="page-cta-row">
            <a
              href={`mailto:${SITE.email}?subject=Free%20strategy%20call`}
              className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]"
            >
              <span>Email Stelora</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
