import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";
import "@/styles/smooth-scroll.css";
import "@/styles/device-gate.css";
import "@/styles/pages.css";
import "@/components/CursorGrid.css";
import "@/components/TearTicket.css";
import "@/components/Folder.css";
import "@/components/Lanyard.css";
import "@/components/MusicCard.css";
import "@/components/PaperCrumple.css";
import "@/components/PressPrint.css";
import "@/components/IdCardDragHint.css";
import "@/components/TicketTearHint.css";
import "@/components/FinderDesk.css";
import "@/components/DomeGallery.css";
import "@/components/TrueFocus.css";
import "@/components/HeroDeskCollage.css";
import "@/components/LedClock.css";
import "@/components/FlexCarousel.css";
import "@/components/CircularCarousel.css";
import "@/components/OrbitStickers.css";
import "@/components/SteloraBreaker.css";
import "@/components/IntroLanding.css";
import "@/components/Footer.css";
import "@/components/TechText.css";
import SmoothScroll from "@/components/SmoothScroll";
import StayOnHome from "@/components/StayOnHome";

config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <StayOnHome />
      <SmoothScroll />
      <Component {...pageProps} />
    </>
  );
}
