import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { EscapeRooms } from "@/components/home/escape-rooms"
import { Promotions } from "@/components/home/promotions"
import { Testimonials } from "@/components/home/testimonials"
import { ReservationSection } from "@/components/home/reservation-section"
import { Faq } from "@/components/home/faq"
import { CorporateEvents } from "@/components/home/corporate-events"
import { GallerySection } from "@/components/home/gallery-section"
import { BlogSection } from "@/components/home/blog-section"
import { ContactSection } from "@/components/home/contact-section"
import { TeamAndResultsSection } from "@/components/home/teamsandresultssection"
import { Footer } from "@/components/ui/footer"
import SplashCursor from "@/components/ui/splashcursor"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-hidden">
      <Header />
      <SplashCursor />
      <div id="inicio">
        <HeroSection />
      </div>
      <div id="como-funciona">
        <HowItWorks />
      </div>
      <div id="cuartos">
        <EscapeRooms />
      </div>
      <div id="galeria">
        <GallerySection />
      </div>
      <div id="promociones">
        <Promotions />
      </div>
      <div id="teams">
        <TeamAndResultsSection />
      </div>
      {/* <ReservationSection />*/}
      <div id="clasificacion">
        <Testimonials />
      </div>
      <div id="eventos">
        <CorporateEvents />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <div id="faq">
        <Faq />
      </div>
      <div id="contacto">
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}

