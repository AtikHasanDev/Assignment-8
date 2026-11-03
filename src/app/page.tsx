import { Hero } from "@/components/hero";
import { Catalogue } from "@/components/catalogue";
import { HomeSections } from "@/components/home-sections";
import "./home.css";
import { Suspense } from "react";
export default function Home() {
  return (
    <div className="container">
      <Hero />
      <section className="section">
        <Suspense fallback={<p role="status">Loading the shelves…</p>}>
          <Catalogue latest />
        </Suspense>
      </section>
      <HomeSections />
    </div>
  );
}
