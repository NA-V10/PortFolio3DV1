import Nav from "@/components/Nav";
import SceneLoader from "@/components/3d/SceneLoader";
import Cursor from "@/components/ui/Cursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SectionObserver from "@/components/ui/SectionObserver";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Work from "@/components/sections/Work";
import CyberSentinel from "@/components/sections/CyberSentinel";
import IntelliCourse from "@/components/sections/IntelliCourse";
import DailyDocs from "@/components/sections/DailyDocs";
import OpenSource from "@/components/sections/OpenSource";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { getGitHubStats } from "@/lib/github";

export const revalidate = 21600;

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <>
      <SceneLoader />
      <SmoothScroll />
      <SectionObserver />
      <Cursor />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <Intro />
        <Work />
        <div id="projects">
          <CyberSentinel />
          <IntelliCourse />
          <DailyDocs />
        </div>
        <OpenSource stats={stats} />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
