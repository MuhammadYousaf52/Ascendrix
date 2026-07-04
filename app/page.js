import Navbar from '@/app/components/NavbarUse';
import About from '@/app/components/About';
import Testimonials from '@/app/components/Testimonials';
import ProfitProtocolRoad from "@/app/components/Road";
import Hero from '@/app/components/Hero';
import VideoAndLogos from '@/app/components/VideoAndLogos';
import CaseStudies from '@/app/components/CaseStudies'
import Services from '@/app/components/Services';
import BookACall from "@/app/components/BookACall"
import DemoOne from "@/app/components/DockUse"
import ChatFAQ from "@/app/components/FAQ"
import PremiumFooter from "@/app/components/footer"

export default function Home() {


  return (
    <div className="min-h-screen overflow-x-hidden">

      <main className="flex flex-col items-center overflow-x-hidden ">

        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Video & Logos */}
        <VideoAndLogos />

        {/* About */}
        <About />

        {/* Profit Protocol System */}

        <ProfitProtocolRoad />

        {/* Testimonials */}
        <Testimonials />

        {/* Case Studies */}
        <CaseStudies />

        {/* Services */}
        <Services />

        {/* Book A Call */}
        <BookACall />
        
        <DemoOne />

        <ChatFAQ/>

        {/* Footer */}
        <PremiumFooter />
      </main>
    </div>
  );
}
