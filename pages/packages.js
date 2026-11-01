import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { ADDONS, PACKAGE_NOTES, PACKAGES, SITE } from "@/data/siteContent";

export default function PackagesPage() {
  return (
    <PageShell
      title="Packages"
      description="Stelora Media package tiers for social, performance, and full-funnel brand growth."
    >
      <PageHero
        kicker="Getting started"
        title="Package tiers"
        body="Consistent content, strong strategy, steady growth — pick the engagement that matches your stage."
      />

      <section className="page-section">
        <div className="page-grid page-grid-3 mb-10">
          {PACKAGES.map((pkg) => (
            <article key={pkg.name} className={`page-card${pkg.featured ? " is-featured" : ""}`}>
              <p className="page-card__kicker">{pkg.featured ? "Recommended" : "SMM"}</p>
              <h2 className="page-card__title">{pkg.name}</h2>
              <p className="page-card__price">{pkg.price}</p>
              <p className="page-card__body">{pkg.blurb}</p>
            </article>
          ))}
        </div>

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          Add-ons
        </h2>
        <div className="page-grid page-grid-3 mb-8">
          {ADDONS.map((item) => (
            <article key={item.name} className="page-card">
              <h3 className="page-card__title">{item.name}</h3>
              <p className="page-card__price" style={{ fontSize: "1.35rem" }}>
                {item.price}
              </p>
            </article>
          ))}
        </div>

        <ul className="page-list mb-8 max-w-2xl">
          {PACKAGE_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <div className="page-cta-row">
          <a
            href={`mailto:${SITE.email}?subject=Strategy%20call%20with%20Stelora%20Media`}
            className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]"
          >
            <span>Book a free strategy call</span>
            <span aria-hidden>↗</span>
          </a>
          <Link href="/contact" className="btn-pill btn-pill-outline px-6 py-3 text-[0.68rem]">
            <span>Contact us</span>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
