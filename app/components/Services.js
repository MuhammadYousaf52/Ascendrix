'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useInView } from 'framer-motion'
import BorderGlow from '@/app/components/BorderGlow'

gsap.registerPlugin(ScrollTrigger)

const amazonServices = [
  { name: "Strategy & Brand Audits", description: "Deep-dive brand and account data analysis to uncover hidden growth opportunities and inefficiencies." },
  { name: "Amazon PPC Management", description: "Highly optimized, data-driven Sponsored Ads campaigns designed to maximize sales while lowering ACoS." },
  { name: "Amazon DSP Management", description: "Programmatic display and video advertising to reach high-intent audiences both on and off Amazon." },
  { name: "Amazon Listing Optimization", description: "Conversion-focused copywriting, SEO integration, and premium visual assets built to drive maximum sales." },
  { name: "Product Launch & Market Analysis", description: "Comprehensive competitive research and launch roadmaps to ensure a dominant, profitable market entry." },
  { name: "Supply Chain & Logistics Consulting", description: "Strategic inventory planning and logistics optimization to eliminate stockouts and minimize storage fees." },
]

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-100 flex"
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="0 0 10"
        backgroundColor="#e8ebeb"
        borderRadius={28}
        glowRadius={50}
        glowIntensity={2}
        coneSpread={30}
        animated={false}
        colors={['#0f172a', '#1e293b', '#0f172a']}
      >
        <div className="p-8 h-full flex flex-col justify-between">
          <span className="text-[10px] font-mono text-black mb-4 block tracking-widest">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  )
}

export default function Services() {
  const badgeRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge fade up
      gsap.from(badgeRef.current, {
        opacity: 0, y: 24, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: badgeRef.current, start: "top 95%" }
      })

      const words1 = line1Ref.current?.querySelectorAll("span")
      const words2 = line2Ref.current?.querySelectorAll("span")

      if (words1?.length) {
        gsap.from(words1, {
          opacity: 0, y: 40, rotateX: -20,
          duration: 0.7, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: line1Ref.current, start: "top 95%" }
        })
      }
      if (words2?.length) {
        gsap.from(words2, {
          opacity: 0, y: 40, rotateX: -20,
          duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: line2Ref.current, start: "top 95%" }
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="w-full px-4 md:px-8 lg:px-16 bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100 py-16">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col justify-center items-center mb-16">
        <h3 ref={badgeRef} className="inline-block text-xs md:text-sm font-bold tracking-widest text-cyan-600 uppercase px-5 py-2 border border-cyan-200 rounded-full mb-4 bg-cyan-50">
          Our Services
        </h3>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-black text-center tracking-tight max-w-3xl overflow-hidden" style={{ perspective: "600px" }}>
          <div ref={line1Ref} className="block">
            {"We bring your".split(" ").map((w, i) => (
              <span key={i} className="inline-block mr-[0.25em]">{w}</span>
            ))}
          </div>
          <div ref={line2Ref} className="block">
            {"boldest ideas to life.".split(" ").map((w, i) => (
              <span key={i} className="inline-block mr-[0.25em] underline decoration-4 underline-offset-8">{w}</span>
            ))}
          </div>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {amazonServices.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>
      </div>
    </section>
  )
}
