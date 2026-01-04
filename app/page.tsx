import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <>
            <Navigation />
            <Hero />
            <About />
            <Skills />
            <Achievements />
            <Projects />
            <Blog />
            <Contact />
        </>
    );
}
