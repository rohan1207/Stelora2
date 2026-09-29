import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FINDER_DOMAINS, getDomain, getFolder } from "@/data/finderWork";

function Icon({ name, className = "h-4 w-4" }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "social":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16.5 16.5 21 21" />
        </svg>
      );
    case "ads":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 19V9l8-5 8 5v10" />
          <path d="M9 19v-6h6v6" />
        </svg>
      );
    case "brand":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 3 14.5 9.5 21 10.2 16 14.8 17.5 21 12 17.8 6.5 21 8 14.8 3 10.2 9.5 9.5Z" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
          <circle cx="12" cy="13.5" r="3.2" />
        </svg>
      );
    case "pen":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
          <path d="M13 7l4 4" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16.5" cy="10" r="2.4" />
          <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5S13.7 16 14.5 19M14 14.6c1.5-.4 3.2 0 4.5 1.6.6.8 1 1.7 1.2 2.8" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="5" y="7" width="14" height="11" rx="1.5" />
          <path d="M5 10h14" />
        </svg>
      );
  }
}

function FolderGlyph({ color, icon }) {
  return (
    <div className="finder-folder-glyph" style={{ "--folder-c": color }}>
      <div className="finder-folder-glyph__tab" />
      <div className="finder-folder-glyph__body">
        <Icon name={icon} className="h-5 w-5 text-[#FFF4E0]" />
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="finder-card group">
      <div className="finder-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.cover} alt="" />
        <span className="finder-card__tag">{project.tag}</span>
      </div>
      <div className="finder-card__body">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[0.95rem] font-bold leading-snug text-stelora-ink">
            {project.title}
          </h3>
          <span className="shrink-0 font-display text-[0.65rem] font-bold uppercase tracking-[0.12em] text-stelora-navy">
            {project.metric}
          </span>
        </div>
        <p className="mt-2 font-body text-[0.8rem] leading-relaxed text-stelora-muted">
          {project.summary}
        </p>
      </div>
    </article>
  );
}

export default function FinderDesk() {
  const [domainId, setDomainId] = useState(FINDER_DOMAINS[0].id);
  const [folderId, setFolderId] = useState(null);
  const [paneOverflows, setPaneOverflows] = useState(false);
  const scrollRef = useRef(null);

  const domain = useMemo(() => getDomain(domainId), [domainId]);
  const folder = useMemo(
    () => (folderId ? getFolder(domainId, folderId) : null),
    [domainId, folderId]
  );

  const selectDomain = useCallback((id) => {
    setDomainId(id);
    setFolderId(null);
  }, []);

  // Only enable internal scroll when content actually overflows the pane
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      setPaneOverflows(el.scrollHeight > el.clientHeight + 2);
    };

    measure();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [domainId, folderId]);

  return (
    <section
      id="work"
      className="finder-desk relative flex h-[100svh] items-stretch border-t border-stelora-line bg-[#e8e4dc]"
      aria-labelledby="finder-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,48,123,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,48,123,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-3 py-6 md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stelora-muted">
              Work desk
            </p>
            <h2
              id="finder-heading"
              className="mt-1 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.03em] text-stelora-navy"
            >
              Explore what we build
            </h2>
          </div>
          <p className="max-w-sm font-body text-[0.8rem] leading-relaxed text-stelora-muted md:text-right">
            Domains on the left. Folders open in place. Projects scroll on the right.
          </p>
        </div>

        <div className="finder-window flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Title bar */}
          <div className="finder-titlebar">
            <div className="flex items-center gap-2">
              <span className="finder-dot finder-dot--close" />
              <span className="finder-dot finder-dot--min" />
              <span className="finder-dot finder-dot--max" />
            </div>
            <p className="finder-path font-body text-[0.72rem] text-stelora-muted">
              ~/stelora/{domain.path}
              {folder ? `/${folder.label}` : ""}
            </p>
            <div className="w-[52px]" aria-hidden />
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Sidebar */}
            <aside className="finder-sidebar hidden w-[200px] shrink-0 flex-col sm:flex md:w-[220px]">
              <p className="px-3 pb-2 pt-3 font-display text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stelora-muted">
                Domains
              </p>
              <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3" aria-label="Domains">
                {FINDER_DOMAINS.map((d) => {
                  const active = d.id === domainId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => selectDomain(d.id)}
                      className={`finder-nav-item ${active ? "is-active" : ""}`}
                    >
                      <Icon name={d.icon} className="h-[15px] w-[15px] shrink-0" />
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f7f4ee]">
              {/* Mobile domain chips */}
              <div className="flex gap-1.5 overflow-x-auto border-b border-stelora-line/70 px-3 py-2 sm:hidden">
                {FINDER_DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => selectDomain(d.id)}
                    className={`shrink-0 rounded-full px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.1em] ${
                      d.id === domainId
                        ? "bg-stelora-navy text-stelora-cream"
                        : "bg-white text-stelora-muted"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Toolbar / breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 border-b border-stelora-line/70 px-4 py-2.5">
                <button
                  type="button"
                  className="finder-crumb"
                  onClick={() => setFolderId(null)}
                  disabled={!folder}
                >
                  {domain.label}
                </button>
                {folder ? (
                  <>
                    <span className="text-stelora-muted/50" aria-hidden>
                      /
                    </span>
                    <span className="font-display text-[0.72rem] font-bold text-stelora-navy">
                      {folder.label}
                    </span>
                  </>
                ) : null}
                <span className="ml-auto hidden font-body text-[0.72rem] text-stelora-muted md:inline">
                  {domain.blurb}
                </span>
              </div>

              {/* Internal scroll only when cards overflow; otherwise page scroll stays native */}
              <div
                ref={scrollRef}
                className={`finder-scroll min-h-0 flex-1 px-4 py-5 md:px-6 md:py-6 ${
                  paneOverflows ? "finder-scroll--active" : "finder-scroll--pass"
                }`}
              >
                <AnimatePresence mode="wait">
                  {!folder ? (
                    <motion.div
                      key={`folders-${domain.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="mb-4 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stelora-muted">
                        {domain.folders.length} folders
                      </p>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {domain.folders.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            className="finder-folder"
                            onClick={() => setFolderId(f.id)}
                          >
                            <FolderGlyph color={f.color} icon={f.icon} />
                            <span className="mt-2.5 block font-display text-[0.78rem] font-bold leading-tight text-stelora-ink">
                              {f.label}
                            </span>
                            <span className="mt-1 block font-body text-[0.68rem] text-stelora-muted">
                              {f.projects.length} projects
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`projects-${folder.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stelora-muted">
                            Open folder
                          </p>
                          <h3 className="mt-1 font-display text-xl font-bold text-stelora-navy md:text-2xl">
                            {folder.label}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFolderId(null)}
                          className="btn-pill btn-pill-outline px-4 py-2 text-[0.62rem]"
                        >
                          <span>Back to folders</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {folder.projects.map((p) => (
                          <ProjectCard key={p.id} project={p} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
