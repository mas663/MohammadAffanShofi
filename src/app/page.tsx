import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutEducation from "../components/AboutEducation";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ExperienceCertifications from "../components/ExperienceCertifications";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ScrollVelocity from "../components/ScrollVelocity";

export default function Page() {
  const velocity = 120;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-sky-500/40">
      <Header />
      <Hero />

      {/* Separator A */}
      <ScrollVelocity
        texts={["About & Educations"]}
        velocity={velocity}
        className="rb-scroll-text"
        parallaxClassName="rb-parallax"
        scrollerClassName="rb-scroller"
      />

      <AboutEducation />

      {/* Separator C */}
      <ScrollVelocity
        texts={["Projects | Certifications | Tech Stack"]}
        velocity={velocity}
        className="rb-scroll-text"
        parallaxClassName="rb-parallax"
        scrollerClassName="rb-scroller"
      />

      <Projects />
      <ExperienceCertifications />
      <Skills />

      <ScrollVelocity
        texts={["Contacts"]}
        velocity={velocity}
        className="rb-scroll-text"
        parallaxClassName="rb-parallax"
        scrollerClassName="rb-scroller"
      />
      <Contact />
      <Footer />
    </div>
  );
}
