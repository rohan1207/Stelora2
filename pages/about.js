import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { FOUNDER, PROCESS, SITE, STATS, TEAM, WHO_WE_ARE } from "@/data/siteContent";

export default function AboutPage() {
  return (
    <PageShell
      title="About us"
      description="Meet Divya Chauhan and the Stelora Media team — creativity, strategy, and impact from Pune."
    >
      <PageHero
        kicker="Who we are"
        title="A modern creative & performance agency"
        body={WHO_WE_ARE}
      />

      <section className="page-section">
        <article className="page-card mb-8">
          <p className="page-card__kicker">Founder</p>
          <h2 className="page-card__title" style={{ fontSize: "1.6rem" }}>
            {FOUNDER.name}
          </h2>
          <p className="mt-1 font-display text-[0.72rem] font-bold uppercase tracking-[0.16em] text-stelora-muted">
            {FOUNDER.role}
          </p>
          <p className="page-card__body">{FOUNDER.blurb}</p>
          <p className="page-card__body">{FOUNDER.vision}</p>
        </article>

        <div className="page-grid page-grid-4 mb-10">
          {STATS.map((stat) => (
            <div key={stat.label} className="page-stat">
              <div className="page-stat__value">{stat.value}</div>
              <p className="page-stat__label">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          Who you’ll work with
        </h2>
        <p className="mb-6 max-w-2xl font-body text-[0.9rem] leading-relaxed text-stelora-muted">
          At Stelora Media, creativity meets strategy. Our passionate team of designers, creators,
          and storytellers craft meaningful digital experiences that leave a lasting impact.
        </p>
        <div className="page-team mb-12">
          {TEAM.map((member) => (
            <article key={member.name} className="page-team__card">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.image} alt={member.name} className="page-team__photo" />
              ) : (
                <div className="page-team__photo flex items-center justify-center font-display text-sm font-bold text-stelora-navy">
                  {member.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div className="page-team__meta">
                <p className="font-display text-[0.9rem] font-bold text-stelora-navy">{member.name}</p>
                <p className="mt-1 font-body text-[0.75rem] text-stelora-muted">{member.role}</p>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mb-4 font-display text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-[-0.03em] text-stelora-navy">
          How we work
        </h2>
        <div className="page-grid page-grid-4">
          {PROCESS.map((step) => (
            <article key={step.step} className="page-card">
              <p className="page-card__kicker">{step.step}</p>
              <h3 className="page-card__title">{step.title}</h3>
              <p className="page-card__body">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="page-cta-row">
          <Link href="/contact" className="btn-pill btn-pill-primary px-6 py-3 text-[0.68rem]">
            <span>Let’s talk strategy</span>
          </Link>
        </div>
        <p className="mt-6 text-center font-body text-[0.78rem] text-stelora-muted">
          {SITE.location} · {SITE.email}
        </p>
      </section>
    </PageShell>
  );
}
