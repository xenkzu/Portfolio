import { Navbar } from "@/components/nav/Navbar";
import { Loader } from "@/components/ui/Loader";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Stats } from "@/components/sections/Stats";
import { Capabilities } from "@/components/sections/Capabilities";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Cursor />
      <Grain />
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <WorkGrid />
        <Stats />
        <Capabilities />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
