"use client";
import LogoLoop from "@/app/components/Brands";
import VideoPlayer from "@/app/components/VideoC";

const techLogos = [
  { src: "/L6.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/L1.png", alt: "Vita Up", href: "https://vitaup.us/" },
  { src: "/L2.png", alt: "Blue Print", href: "https://www.blue-print.com/" },
  { src: "/L3.png", alt: "Bird & be", href: "https://birdandbe.com/" },
  { src: "/L4.png", alt: "Forest Leaf", href: "https://www.forestleaf.com/" },
];

export default function VideoAndLogos() {
  return (
    <section className="w-full flex flex-col items-center gap-10 md:gap-16 py-12 md:py-20 px-4">
      {/* Video */}
      
       <VideoPlayer src="/Dummy-intro.mp4"/>

      {/* Logo Loop */}
      <div className="w-full pb-4 md:pb-8">
        <LogoLoop
          logos={techLogos}
          speed={50}
          logoHeight={28}
          gap={24}
          pauseOnHover
          fadeOut
          fadeOutColor="transparent"
          className="w-full overflow-x-hidden"
        />
      </div>
    </section>
  );
}
