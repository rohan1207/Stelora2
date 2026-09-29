/** Stelora work desk — domains → folders → project cards */

export const FINDER_DOMAINS = [
  {
    id: "social",
    label: "Social",
    path: "Social",
    icon: "social",
    blurb: "Feeds that grow audiences and drive real action.",
    folders: [
      {
        id: "content-systems",
        label: "Content Systems",
        color: "#1A307B",
        icon: "grid",
        projects: [
          {
            id: "atelier-reels",
            title: "Atelier — Reels Engine",
            tag: "Instagram",
            metric: "+214% reach",
            summary:
              "Weekly reel cadence, hook library, and UGC briefs that turned a quiet boutique into a daily destination.",
            cover: "/images/collage/moodboard.jpg",
          },
          {
            id: "northline-carousel",
            title: "Northline — Carousel Lab",
            tag: "LinkedIn + IG",
            metric: "3.8× saves",
            summary:
              "Narrative carousels for a B2B brand — proof slides, founder voice, and CTA frames that compound weekly.",
            cover: "/images/photoshoot.jpg",
          },
          {
            id: "pulse-community",
            title: "Pulse — Community Desk",
            tag: "Community",
            metric: "1.2k members",
            summary:
              "Moderation playbooks, member rituals, and spotlight series that kept a wellness circle warm and active.",
            cover: "/images/atmosphere.jpg",
          },
          {
            id: "orbit-stories",
            title: "Orbit — Stories OS",
            tag: "Stories",
            metric: "41% reply rate",
            summary:
              "Interactive sticker kits, poll calendars, and DM funnels for a D2C skincare launch week.",
            cover: "/images/collage/torn-strip.jpg",
          },
        ],
      },
      {
        id: "creator-collabs",
        label: "Creator Collabs",
        color: "#0C1638",
        icon: "users",
        projects: [
          {
            id: "seed-seeders",
            title: "Seed — Micro Creator Mesh",
            tag: "UGC",
            metric: "48 creators",
            summary:
              "Casting, briefs, and usage rights for a snack brand’s always-on creator bench across Reels & Shorts.",
            cover: "/images/collage/vinyl.jpg",
          },
          {
            id: "lumen-ambassador",
            title: "Lumen — Ambassadors",
            tag: "Advocacy",
            metric: "6.2× ROI",
            summary:
              "Tiered ambassador program with content kits, payout tracking, and brand-safe review loops.",
            cover: "/images/hero.jpg",
          },
          {
            id: "harbor-live",
            title: "Harbor — Live Commerce",
            tag: "Live",
            metric: "₹18L GMV",
            summary:
              "Host training, show rundowns, and post-live clip packs for a homewares live shopping night.",
            cover: "/images/collage/ticket-art.jpg",
          },
        ],
      },
      {
        id: "social-ads",
        label: "Social Ads",
        color: "#243A8C",
        icon: "spark",
        projects: [
          {
            id: "velvet-prospecting",
            title: "Velvet — Prospecting Stack",
            tag: "Meta",
            metric: "1.9× ROAS",
            summary:
              "Creative testing matrix, audience maps, and retarget layers for a fashion drop that sold through.",
            cover: "/images/collage/moodboard.jpg",
          },
          {
            id: "folio-retarget",
            title: "Folio — Retarget Suite",
            tag: "Meta + IG",
            metric: "-32% CPA",
            summary:
              "Catalog + UGC hybrids, exclusion hygiene, and frequency caps that protected brand equity.",
            cover: "/images/photoshoot.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    path: "SEO",
    icon: "search",
    blurb: "Search that compounds — technical, content, authority.",
    folders: [
      {
        id: "technical",
        label: "Technical SEO",
        color: "#1A307B",
        icon: "gear",
        projects: [
          {
            id: "summit-core",
            title: "Summit — Core Web Rebuild",
            tag: "Technical",
            metric: "98 CWV",
            summary:
              "Crawl budget cleanup, schema, and Core Web Vitals pass for a multi-city hospitality group.",
            cover: "/images/atmosphere.jpg",
          },
          {
            id: "ledger-index",
            title: "Ledger — Indexation Fix",
            tag: "Crawl",
            metric: "+4.1k pages",
            summary:
              "Orphan recovery, sitemap surgery, and parameter hygiene after a messy CMS migration.",
            cover: "/images/hero.jpg",
          },
          {
            id: "nova-i18n",
            title: "Nova — i18n Map",
            tag: "Hreflang",
            metric: "12 locales",
            summary:
              "Hreflang graph, regional landing trees, and duplicate control for a SaaS expansion.",
            cover: "/images/collage/torn-strip.jpg",
          },
        ],
      },
      {
        id: "content-seo",
        label: "Content SEO",
        color: "#12245F",
        icon: "doc",
        projects: [
          {
            id: "grove-cluster",
            title: "Grove — Topic Clusters",
            tag: "Content",
            metric: "+180 keywords",
            metricNote: "page 1",
            summary:
              "Pillar–spoke architecture for a wellness brand — intent maps, briefs, and internal links.",
            cover: "/images/collage/moodboard.jpg",
          },
          {
            id: "prism-blog",
            title: "Prism — Editorial Engine",
            tag: "Blog",
            metric: "2.4× organic",
            summary:
              "Writer guidelines, SERP briefs, and refresh cadence that kept rankings sticky for 14 months.",
            cover: "/images/photoshoot.jpg",
          },
          {
            id: "kite-local",
            title: "Kite — Local Pages",
            tag: "Local",
            metric: "37 cities",
            summary:
              "Location page templates with unique proof, NAP consistency, and GBP-aligned copy.",
            cover: "/images/atmosphere.jpg",
          },
        ],
      },
      {
        id: "authority",
        label: "Authority",
        color: "#0C1638",
        icon: "link",
        projects: [
          {
            id: "anchor-pr",
            title: "Anchor — Digital PR",
            tag: "Links",
            metric: "62 placements",
            summary:
              "Data-led stories and outreach that earned links from tier-1 lifestyle and trade press.",
            cover: "/images/collage/ticket-art.jpg",
          },
          {
            id: "ridge-partners",
            title: "Ridge — Partner Hub",
            tag: "Partners",
            metric: "DR +18",
            summary:
              "Co-created assets with complementary brands — guides, tools, and reciprocal authority.",
            cover: "/images/collage/vinyl.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "ads",
    label: "Paid Ads",
    path: "Paid Ads",
    icon: "ads",
    blurb: "Meta & Google — creative and media that pay for themselves.",
    folders: [
      {
        id: "meta-ads",
        label: "Meta Ads",
        color: "#1A307B",
        icon: "meta",
        projects: [
          {
            id: "flare-launch",
            title: "Flare — Launch Burst",
            tag: "Awareness",
            metric: "₹9 CPA",
            summary:
              "Hook-first creative sprints and Advantage+ tests for a D2C apparel launch weekend.",
            cover: "/images/collage/moodboard.jpg",
          },
          {
            id: "ember-scale",
            title: "Ember — Scale Playbook",
            tag: "Growth",
            metric: "3.1× ROAS",
            summary:
              "Budget ladders, creative fatigue alerts, and audience expansion without brand drift.",
            cover: "/images/photoshoot.jpg",
          },
          {
            id: "silk-catalog",
            title: "Silk — Catalog Sales",
            tag: "DPA",
            metric: "+56% AOV",
            summary:
              "Dynamic product ads with lifestyle overlays and bundle rules for an accessories store.",
            cover: "/images/hero.jpg",
          },
        ],
      },
      {
        id: "google-ads",
        label: "Google Ads",
        color: "#243A8C",
        icon: "google",
        projects: [
          {
            id: "beacon-search",
            title: "Beacon — Search Core",
            tag: "Search",
            metric: "4.6 QS avg",
            summary:
              "Intent-tight RSA structure, negative libraries, and landing sync for a clinic network.",
            cover: "/images/atmosphere.jpg",
          },
          {
            id: "trail-pmax",
            title: "Trail — Performance Max",
            tag: "PMax",
            metric: "+29% conv.",
            summary:
              "Asset groups by persona, feed hygiene, and brand exclusions that protected search demand.",
            cover: "/images/collage/torn-strip.jpg",
          },
          {
            id: "signal-youtube",
            title: "Signal — YouTube Demand",
            tag: "Video",
            metric: "0.8% CTR",
            summary:
              "6s bumpers + 15s stories that warmed cold traffic before Meta conversion campaigns.",
            cover: "/images/collage/vinyl.jpg",
          },
        ],
      },
      {
        id: "creative-lab",
        label: "Creative Lab",
        color: "#0C1638",
        icon: "film",
        projects: [
          {
            id: "frame-ugc",
            title: "Frame — UGC Batch",
            tag: "Creative",
            metric: "120 assets",
            summary:
              "Shot lists, creator kits, and edit templates producing weekly ad variants at speed.",
            cover: "/images/collage/ticket-art.jpg",
          },
          {
            id: "echo-hooks",
            title: "Echo — Hook Vault",
            tag: "Testing",
            metric: "38 winners",
            summary:
              "First-3-second library scored by hold rate — the backbone of every Stelora ad sprint.",
            cover: "/images/photoshoot.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    path: "Brand",
    icon: "brand",
    blurb: "Identity systems that feel human and stay consistent.",
    folders: [
      {
        id: "identity",
        label: "Identity Systems",
        color: "#1A307B",
        icon: "mark",
        projects: [
          {
            id: "solace-rebrand",
            title: "Solace — Full Rebrand",
            tag: "Identity",
            metric: "1 system",
            summary:
              "Wordmark, type, color, and motion rules for a mental-health platform entering Series A.",
            cover: "/images/logo.webp",
          },
          {
            id: "copper-kit",
            title: "Copper — Brand Kit",
            tag: "Guidelines",
            metric: "84 pages",
            summary:
              "Practical brand book — do/don’t, social templates, and partner lockups teams actually use.",
            cover: "/images/collage/moodboard.jpg",
          },
        ],
      },
      {
        id: "voice",
        label: "Voice & Story",
        color: "#12245F",
        icon: "voice",
        projects: [
          {
            id: "maple-voice",
            title: "Maple — Voice Guide",
            tag: "Messaging",
            metric: "12 tones",
            summary:
              "Personality spectrum, sample scripts, and banned phrases for support + marketing alignment.",
            cover: "/images/atmosphere.jpg",
          },
          {
            id: "arc-narrative",
            title: "Arc — Founder Narrative",
            tag: "Story",
            metric: "Keynote + web",
            summary:
              "Origin story, proof pillars, and deck narrative that closed three enterprise pilots.",
            cover: "/images/hero.jpg",
          },
        ],
      },
      {
        id: "campaigns",
        label: "Campaign Worlds",
        color: "#0C1638",
        icon: "world",
        projects: [
          {
            id: "monsoon-drop",
            title: "Monsoon — Seasonal World",
            tag: "Campaign",
            metric: "6 touchpoints",
            summary:
              "Look, language, and asset kit spanning OOH teasers, social, and packaging inserts.",
            cover: "/images/collage/ticket-art.jpg",
          },
          {
            id: "ember-night",
            title: "Ember Night — Event Brand",
            tag: "Experiential",
            metric: "2k guests",
            summary:
              "Wayfinding, invites, stage graphics, and recap films for a brand anniversary soirée.",
            cover: "/images/collage/vinyl.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "web",
    label: "Websites",
    path: "Websites",
    icon: "web",
    blurb: "Sites that convert — designed to feel like the brand.",
    folders: [
      {
        id: "marketing-sites",
        label: "Marketing Sites",
        color: "#1A307B",
        icon: "layout",
        projects: [
          {
            id: "vista-home",
            title: "Vista — Marketing Site",
            tag: "Next.js",
            metric: "+44% leads",
            summary:
              "Narrative homepage, proof modules, and booking flow for a premium travel studio.",
            cover: "/images/hero.jpg",
          },
          {
            id: "quill-landing",
            title: "Quill — Launch Landers",
            tag: "CRO",
            metric: "18% CVR",
            summary:
              "Modular landing system A/B tested across three offers in a single sprint week.",
            cover: "/images/collage/moodboard.jpg",
          },
          {
            id: "folio-case",
            title: "Folio — Case Hub",
            tag: "Portfolio",
            metric: "24 stories",
            summary:
              "Filterable work archive with metric callouts — sales’ favorite leave-behind.",
            cover: "/images/photoshoot.jpg",
          },
        ],
      },
      {
        id: "ecommerce",
        label: "Ecommerce",
        color: "#243A8C",
        icon: "cart",
        projects: [
          {
            id: "loom-store",
            title: "Loom — Store Redesign",
            tag: "Shopify",
            metric: "+31% AOV",
            summary:
              "PDP storytelling, bundle UX, and cart upsells for a textiles brand on Shopify.",
            cover: "/images/collage/torn-strip.jpg",
          },
          {
            id: "petal-checkout",
            title: "Petal — Checkout Polish",
            tag: "UX",
            metric: "-22% abandon",
            summary:
              "Trust signals, express pay, and shipping clarity that calmed a high-intent cart.",
            cover: "/images/atmosphere.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "photo",
    label: "Photoshoot",
    path: "Photoshoot",
    icon: "camera",
    blurb: "Frames that carry the brand across every channel.",
    folders: [
      {
        id: "product",
        label: "Product & Still",
        color: "#1A307B",
        icon: "box",
        projects: [
          {
            id: "amber-pack",
            title: "Amber — Pack Shots",
            tag: "Product",
            metric: "210 frames",
            summary:
              "Hero, detail, and lifestyle packs for a skincare line — color-managed for print + web.",
            cover: "/images/photoshoot.jpg",
          },
          {
            id: "slate-flatlay",
            title: "Slate — Flat Lay System",
            tag: "Still life",
            metric: "9 sets",
            summary:
              "Reusable set grammar so monthly drops stay on-brand without reinventing the table.",
            cover: "/images/collage/moodboard.jpg",
          },
        ],
      },
      {
        id: "campaign-photo",
        label: "Campaign Shoots",
        color: "#0C1638",
        icon: "lens",
        projects: [
          {
            id: "dawn-campaign",
            title: "Dawn — Campaign Day",
            tag: "Campaign",
            metric: "1 day / 4 looks",
            summary:
              "Talent, styling, and shot list for a spring apparel campaign across social and site.",
            cover: "/images/hero.jpg",
          },
          {
            id: "hearth-founders",
            title: "Hearth — Founder Portraits",
            tag: "Portrait",
            metric: "Press ready",
            summary:
              "Editorial portraits and environmental frames for PR kits and About pages.",
            cover: "/founder.jpeg",
          },
          {
            id: "field-broll",
            title: "Field — B-Roll Library",
            tag: "Motion",
            metric: "40 clips",
            summary:
              "Handheld texture, process shots, and ambient loops feeding ads and reels for months.",
            cover: "/images/atmosphere.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    path: "Content",
    icon: "pen",
    blurb: "Words that rank, convert, and sound like the brand.",
    folders: [
      {
        id: "longform",
        label: "Longform",
        color: "#1A307B",
        icon: "book",
        projects: [
          {
            id: "ink-guides",
            title: "Ink — Ultimate Guides",
            tag: "Guides",
            metric: "6 pillars",
            summary:
              "Research-backed guides with downloadable worksheets — SEO and sales enablement in one.",
            cover: "/images/collage/torn-strip.jpg",
          },
          {
            id: "quill-newsletter",
            title: "Quill — Newsletter Desk",
            tag: "Email",
            metric: "48% open",
            summary:
              "Editorial calendar, subject testing, and segment voice for a weekly founder letter.",
            cover: "/images/collage/moodboard.jpg",
          },
        ],
      },
      {
        id: "scripts",
        label: "Scripts & Shorts",
        color: "#12245F",
        icon: "mic",
        projects: [
          {
            id: "cue-reelscripts",
            title: "Cue — Reel Scripts",
            tag: "Scripts",
            metric: "90 / quarter",
            summary:
              "Hook → body → CTA templates tuned per platform length and brand tone.",
            cover: "/images/collage/vinyl.jpg",
          },
          {
            id: "stage-adscript",
            title: "Stage — Ad Script Lab",
            tag: "Ads",
            metric: "Top 10% thumbstop",
            summary:
              "Spoken-word and text-on-screen variants scored against creative testing data.",
            cover: "/images/photoshoot.jpg",
          },
        ],
      },
      {
        id: "copy-systems",
        label: "Copy Systems",
        color: "#0C1638",
        icon: "layers",
        projects: [
          {
            id: "nest-uxcopy",
            title: "Nest — UX Microcopy",
            tag: "Product",
            metric: "Full audit",
            summary:
              "Empty states, errors, and onboarding lines that feel calm and on-brand.",
            cover: "/images/atmosphere.jpg",
          },
          {
            id: "bolt-launchkit",
            title: "Bolt — Launch Copy Kit",
            tag: "Go-to-market",
            metric: "1 week",
            summary:
              "Site, ads, email, and social strings locked before a SaaS feature launch.",
            cover: "/images/hero.jpg",
          },
        ],
      },
    ],
  },
];

export function getDomain(id) {
  return FINDER_DOMAINS.find((d) => d.id === id) || FINDER_DOMAINS[0];
}

export function getFolder(domainId, folderId) {
  const domain = getDomain(domainId);
  return domain.folders.find((f) => f.id === folderId) || null;
}
