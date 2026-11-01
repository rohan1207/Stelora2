import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { CAPABILITIES, SERVICES, SITE } from "@/data/siteContent";

export default function ServicesPage() {
  return (
    <PageShell
      title="Services"
      description="Performance marketing, social media, websites, and branding from Stelora Media."
    >
      <PageHero
        kicker="Our capabilities"
        title="What we do for you"
        body="A modern creative & performance agency — performance, social & web built to convert."
      />

      <section className="page-section">
        <div className="page-grid page-grid-4 mb-10">
          {CAPABILITIES.map((item) => (
            <article key={item} className="page-card">
              <p className="page-card__title" style={{ fontSize: "0.95rem" }}>
                {item}
              </p>
            </article>
          ))}
        </div>

        <div className="space-y-8">
          {SERVICES.map((service) => (
            <article key={service.id} id={service.id} className="page-card">
              <p className="page-card__kicker">{service.kicker}</p>
              <h2 className="page-card__title" style={{ fontSize: "1.45rem" }}>
                {service.title}
              </h2>
              <p className="page-card__body">{service.summary}</p>
              <div className="page-grid mt-5 page-grid-3">
                {service.pillars.map((pillar) => (
                  <div key={pillar.title}>
                    <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.16em] text-stelora-navy">
                      {pillar.title}
                    </p>
                    <ul className="page-list">
                      {pillar.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="page-cta-row">
          <Link href="/packages" className="btn-pill btn-pill-outline px-6 py-3 text-[0.68rem]">
            <span>View packages</span>
          </Link>
          <Link href="/contact" className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]">
            <span>Contact us</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
        <p className="mt-6 text-center font-body text-[0.78rem] text-stelora-muted">
          {SITE.location}
        </p>
      </section>
    </PageShell>
  );
}
