import Header from "../components/Header";
import Hero from "../components/Hero";
import ChevronDivider from "../components/ChevronDivider";
import AboutEducation from "../components/AboutEducation";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ExperienceCertifications from "../components/ExperienceCertifications";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-sky-500/40">
      <Header />
      <Hero />
      <ChevronDivider />
      <AboutEducation />
      <ChevronDivider />
      <Skills />
      <ChevronDivider />
      <Projects />
      <ChevronDivider />
      <ExperienceCertifications />
      <ChevronDivider />
      <Contact />
      <Footer />
    </div>
  );
}
