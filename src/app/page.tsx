import { ProfileProvider } from "@/contexts/ProfileContext";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutEducation from "../components/AboutEducation";
import Portfolio from "../components/Portfolio";
import Comments from "../components/Comments";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";

export default function Page() {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-sky-500/40">
        <ScrollProgress />
        <Header />
        <Hero />
        <AboutEducation />
        <Portfolio />
        <Comments />
        <Contact />
        <Footer />
      </div>
    </ProfileProvider>
  );
}
