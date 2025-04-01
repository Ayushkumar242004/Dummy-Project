import { HeroSection } from "@/components/hero-section"
import { FeatureHighlights } from "@/components/feature-highlights"
import { DemoVideo } from "@/components/demo-video"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureHighlights />
        <DemoVideo />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

