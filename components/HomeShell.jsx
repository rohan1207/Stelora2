import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PressPrint from "@/components/PressPrint";
import BounceBack from "@/components/BounceBack";
import FinderDesk from "@/components/FinderDesk";
import CaptureDome from "@/components/CaptureDome";
import FlexReel from "@/components/FlexReel";
import CircularReel from "@/components/CircularReel";
import SteloraBreaker from "@/components/SteloraBreaker";
import BrandFocus from "@/components/BrandFocus";
import Footer from "@/components/Footer";
import IntroLanding from "@/components/IntroLanding";
import { INTRO_SESSION_KEY, warmLanyardPipeline } from "@/lib/lanyardWarm";
import { SITE } from "@/data/siteContent";

const SITE_URL = SITE.url;
const TITLE = `${SITE.name} | Performance Marketing, Social & Web`;
const DESCRIPTION = SITE.description;

/**
 * Full site with optional 6s intro overlay.
 * Hero/ID card mounts underneath so reveal has zero blank lag.
 */
export default function HomeShell() {
  const [showIntro, setShowIntro] = useState(true);
  const dismissIntro = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    warmLanyardPipeline();
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY) === "1") {
        setShowIntro(false);
      }
    } catch {
      /* keep intro */
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MarketingAgency",
    name: SITE.name,
    url: SITE_URL,
    description: DESCRIPTION,
    email: SITE.email,
    areaServed: "India",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    serviceType: [
      "Social Media Marketing",
      "Performance Marketing",
      "Search Engine Optimization",
      "Brand Optimization",
      "Website Design",
      "Commercial Photoshoots",
      "Google Ads",
      "Meta Ads",
    ],
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="Stelora, social media marketing, SEO, brand optimization, Meta ads, Google ads, content writing, website design, photoshoot agency"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={SITE.name} />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:image" content={`${SITE_URL}/images/hero.jpg`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/images/hero.jpg`} />

        <link rel="preload" href="/video.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/lanyard/card.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/lanyard/lanyard.png" as="image" />
        <link rel="preload" href="/founder.jpeg" as="image" />
        <link rel="preload" href="/logo.webp" as="image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {showIntro ? <IntroLanding onComplete={dismissIntro} /> : null}

      <Navbar />
      <main>
        <Hero />
        <PressPrint />
        <BrandFocus />
        <FinderDesk />
        <CaptureDome />
        <FlexReel />
        <CircularReel />
        <SteloraBreaker />
        <BounceBack />
      </main>
      <Footer />
    </>
  );
}
