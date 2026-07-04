'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const caseStudiesData = [
  // ... (Data remains the same as provided, ensuring consistency in content)
  {
    id: 1, number: "01", image: "/Case-Study_1/main.jpeg", brand: "DLNIA Naturals", type: "Supplements",
    title: "From 100% ACoS to Profitability in 90 Days",
    description: "A supplement brand on the verge of shutting down turned into a profit machine. ACoS dropped from 100% to 28%, customer LTV grew from $23 to $163.",
    metrics: [
      { label: "ACOS reduction", value: "71%", numeric: 71, suffix: "%" },
      { label: "Subscribe and save", value: "41%", numeric: 41, suffix: "%" },
      { label: "profitability", value: "90 Days", numeric: 90, suffix: " Days" }
    ],
    detailedContent: {
      overview: "A supplement brand on the verge of shutting down turned into a profit machine. ACoS dropped from 100% to 28%, customer LTV grew from $23 to $163.",
      sections: [
        { type: "text", heading: "The Challenge", content: "The client was extremely frustrated as the account had become difficult to manage. Rising CPCs and an overall ACoS of over 100% were causing continuous losses, and they were close to shutting down the brand." },
        { type: "image", src: "/Case-Study_1/main.jpeg", caption: "DLNIA Naturals" },
        { type: "text", content: "When they came to us, their only goal was to clear inventory and minimize further losses. However, after implementing our Profit Protocol System, the entire direction of the business changed." },
        { type: "text", heading: "Reviewing Account's Overall Performance", content: "We reviewed the account's year-over-year performance and found that both ACoS and TACoS had been consistently increasing." },
        { type: "image", src: "/Case-Study_1/trend.jpeg", caption: "Account Key Metrics — Year-over-Year ACoS & TACoS Performance" },
        { type: "text", heading: "Conducted ASIN Level Analysis", content: "We analyzed performance at the ASIN level to identify which products were driving results and which were underperforming." },
        { type: "image", src: "/Case-Study_1/ASIN.jpeg", caption: "ASIN Level Analysis — Identifying Top & Underperforming Products" },
        { type: "text", heading: "PPC Ads Analysis", content: "We identified that Sponsored Brand Video (SBV) was the best-performing ad type, while Sponsored Display was delivering the weakest results." },
        { type: "image", src: "/Case-Study_1/Ads.jpeg", caption: "PPC Ads Analysis — Sponsored Brand Video vs Sponsored Display Performance" },
        { type: "text", heading: "Customer Search Term Analysis", content: "We identified search terms that had been consistently spending budget without generating any sales. These keywords were immediately negated." },
        { type: "image", src: "/Case-Study_1/STA.jpeg", caption: "Search Term Analysis — High-Spend Zero-Sales Keywords Negated" },
        { type: "text", heading: "Using Subscribe & Save to Increase the Profit", content: "We leveraged the Subscribe & Save strategy to improve profitability by encouraging repeat purchases." },
        { type: "image", src: "/Case-Study_1/SSS.jpeg", caption: "Subscribe & Save Strategy Implementation" },
        { type: "text", content: "Increased Subscribe & Save Subscriptions by 41% in next 8 months. This alone increased the customer's lifetime value from $23.96 to $163.62." },
        { type: "list", items: ["+41% — Subscribe and Save Growth", "163.62$ — Customer LTV After", "90 Days To Profitability"] },
        { type: "image", src: "/Case-Study_1/SSSGrowth.jpeg", caption: "Subscribe & Save Subscriptions Growth — 8-Month Performance Graph" },
        { type: "text", heading: "Conclusion", content: "We successfully helped a brand that was on the verge of shutting down transform into a profit-generating business." }
      ]
    }
  },
  {
    id: 2, number: "02", image: "/Case-Study_2/main.jpeg", brand: "Buff Clucks", type: "Poultry Supplements",
    title: "Generic Listing to Premium High-CTR Brand",
    description: "Transformed a generic chicken supplement listing into a standout premium brand experience through packaging redesign, A+ content, and conversion-focused storytelling.",
    metrics: [
      { label: "After Redesign", value: "↑ CTR", numeric: null },
      { label: "Customer LTV", value: "+220%", numeric: 220, suffix: "%" },
      { label: "Brand Position", value: "Premium", numeric: null }
    ],
    detailedContent: {
      overview: "Turned a generic chicken supplement listing into a premium, high-CTR brand experience through strategic packaging design, A+ content restructuring, and conversion-focused storytelling.",
      sections: [
        { type: "image", src: "/Case-Study_2/main.jpeg", caption: "Buff Clucks — Brand Overview & Listing Visuals" },
        { type: "text", heading: "Client Background", content: "The client was selling a herbal chicken supplement in a highly competitive Amazon niche. Despite having a solid product, their listing was struggling with low CTR and weak brand differentiation." },
        { type: "list", items: ["Low click-through rate (CTR)", "Weak brand differentiation", "Generic, competitor-like packaging visuals", "Poor engagement on product page", "Limited Subscribe & Save adoption"] },
        { type: "quote", text: "We don't want to look like every other competitor. We want something creative, premium, and conversion focused that attracts attention and builds trust instantly.", author: "Buff Cluck" },
        { type: "text", heading: "Core Challenge", content: "The category was saturated with similar-looking listings using plain packaging, weak visual hierarchy, no emotional branding, and no storytelling in design." },
        { type: "text", heading: "Strategic Approach", content: "We completely repositioned the product from a generic feed supplement to a premium flock wellness solution focused on four pillars." },
        { type: "list", items: ["Premium Visual Identity — Bold high-contrast packaging, strong brand identity", "Conversion-First Messaging — 100% Natural as trust anchor", "Subscribe & Save Integration — Positioned as a daily flock health solution", "A+ Content Strategy — 5-section storytelling flow"] },
        { type: "list", heading: "Results", items: ["↑ CTR Significant Increase After Redesign", "Higher Engagement On Product Page", "Premium Brand Asset In Niche"] },
        { type: "text", heading: "Conclusion", content: "The product was no longer just another supplement — it became a recognizable premium brand asset in the niche." }
      ]
    }
  },
  {
    id: 3, number: "03", image: "/Case-Study_3/main.jpeg", brand: "Auraris", type: "Beauty & Personal Care",
    title: "High-Profit Product Launch in Saturated Market.",
    description: "Launched a cold plunge product generating $35 to $45 profit per sale from day one in a saturated niche, using design differentiation and live market intelligence.",
    metrics: [
      { label: "Profit Per Sale", value: "$45", numeric: 45, suffix: "$" },
      { label: "Profitable", value: "Day 1", numeric: null },
      { label: "Market Tracker", value: "Live Intel", numeric: null }
    ],
    detailedContent: {
      overview: "Launched a cold plunge product in Beauty & Personal Care generating $35 to $45 profit per sale from day one in a saturated niche.",
      sections: [
        { type: "image", src: "/Case-Study_3/main.jpeg", caption: "Auraris — Cold Plunge Product Launch" },
        { type: "text", heading: "Client Goal", content: "The client wanted a high profit product launch in Beauty & Personal Care — not a low margin competitive listing." },
        { type: "list", items: ["High margin product (not price-driven competition)", "Premium positioning in Beauty & Personal Care", "Strong differentiation vs generic competitors"] },
        { type: "text", heading: "Challenge", content: "The cold plunge market was saturated with generic inflatable tubs, weak branding, aggressive price competition, and low differentiation." },
        { type: "text", heading: "Our Approach — Design Led Differentiation", content: "We introduced an innovative design where ice is kept separate from direct skin contact through a dedicated chamber, while still maintaining cold water temperature." },
        { type: "text", heading: "Market Tracker System", content: "To strengthen decision making, we built a custom Market Tracker system that turned static market research into a live strategic intelligence system." },
        { type: "image", src: "/Case-Study_3/marketTracker.jpeg", caption: "Market Tracker — Competitor Pricing Analysis" },
        { type: "list", heading: "Results", items: ["$35–$45 Profit Per Sale From Day 1", "Launched High Margin Product", "Live Intel Custom Market Tracker"] },
        { type: "text", heading: "Conclusion", content: "Instead of competing in a crowded market, we focused on engineering product value + controlling positioning + using live market intelligence." }
      ]
    }
  }
]

function useCounter(target, inView, duration = 1.8) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView || target === null) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

function MetricItem({ metric, inView }) {
  const count = useCounter(metric.numeric, inView)
  const display = metric.numeric !== null
    ? (metric.suffix === "%" ? `${count}%` : metric.suffix === "$" ? `$${count}` : `${count}${metric.suffix}`)
    : metric.value
  return (
    <div className="text-center p-3 bg-cyan-50 rounded-lg border border-cyan-200">
      <div className="text-base font-black text-gray-900 mb-0.5">{display}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-tight leading-tight">{metric.label}</div>
    </div>
  )
}

function CaseStudyCard({ caseStudy, onClick, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
      className="bg-white rounded-xl overflow-hidden border border-cyan-100 cursor-pointer group flex flex-col min-h-145 h-full hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all duration-500" 
      onClick={onClick}
    >
      <div className="relative h-60 w-full overflow-hidden border-b border-cyan-100 bg-sky-50">
        <Image src={caseStudy.image} alt={caseStudy.title} fill className="object-cover transition-all duration-700 group-hover:scale-105" />
        <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full" whileHover={{ translateX: "200%" }} transition={{ duration: 0.8 }} /> {/* Shine effect is white */}
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-md border border-cyan-200">
          <span className="text-cyan-600 font-mono text-[10px] tracking-widest">CASE {caseStudy.number}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col grow justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-cyan-50 rounded-md text-[10px] font-medium tracking-wider text-cyan-700 border border-cyan-200 uppercase">{caseStudy.brand}</span>
            <span className="px-3 py-1 bg-sky-50 rounded-md text-[10px] font-medium tracking-wider text-sky-600 border border-sky-200 uppercase">{caseStudy.type}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-cyan-600 transition-colors leading-snug">{caseStudy.title}</h3>
          <p className="text-gray-500 text-xs mb-6 leading-relaxed">{caseStudy.description}</p>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {caseStudy.metrics.map((metric, idx) => <MetricItem key={idx} metric={metric} inView={inView} />)}
          </div>
          <button className="w-full py-3 cursor-pointer bg-linear-to-r from-cyan-500 to-sky-500 text-white rounded-lg font-bold text-xs hover:from-cyan-400 hover:to-sky-400 transition-all duration-300 flex items-center justify-center gap-2 mt-auto tracking-wider uppercase shadow-lg shadow-cyan-200">
            View Case Study
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CaseStudyModal({ caseStudy, onClose }) {
  useEffect(() => {
    if (caseStudy) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [caseStudy])

  return (
    <AnimatePresence>
      {caseStudy && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.92, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="bg-white border border-cyan-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-cyan-100 p-6 flex justify-between items-center z-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 bg-cyan-50 rounded-md text-[10px] uppercase font-semibold text-cyan-700 tracking-wider border border-cyan-200">{caseStudy.brand}</span>
                  <span className="px-3 py-1 bg-sky-50 rounded-md text-[10px] uppercase font-semibold text-sky-600 tracking-wider border border-sky-200">{caseStudy.type}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{caseStudy.title}</h2>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}
                onClick={onClose}
                className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-cyan-50 hover:bg-cyan-100 transition-colors border border-cyan-200 shrink-0 ml-4"
              >
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-gray-600 text-lg leading-relaxed border-l-2 border-cyan-400 pl-4">
                {caseStudy.detailedContent.overview}
              </motion.p>

              {caseStudy.detailedContent.sections.map((section, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.04 }} className="w-full">
                  {section.type === 'text' && (
                    <div>
                      {section.heading && <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{section.heading}</h3>}
                      <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                    </div>
                  )}
                  {section.type === 'image' && (
                    <div className="rounded-xl overflow-hidden border border-cyan-100 bg-sky-50 my-6 w-full">
                      <img src={section.src} alt={section.caption || "Case study asset"} className="w-full h-auto object-contain block mx-auto max-h-[75vh]" />
                      {section.caption && <p className="text-xs text-gray-500 text-center py-3 bg-white border-t border-cyan-100 font-mono tracking-wide">{section.caption}</p>}
                    </div>
                  )}
                  {section.type === 'list' && (
                    <div>
                      {section.heading && <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{section.heading}</h3>}
                      <ul className="space-y-2.5 pl-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                            <span className="text-cyan-500 font-mono mt-0.5">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {section.type === 'quote' && (
                    <div className="bg-cyan-50 border-l-2 border-cyan-400 p-6 rounded-r-lg my-4">
                      <p className="text-lg text-gray-900 italic mb-2">"{section.text}"</p>
                      <p className="text-gray-500 font-mono text-xs">— {section.author}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(null)
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const badgeInView = useInView(badgeRef, { once: true, margin: "-80px" })
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" })

  return (
    <section id="case-studies" className="w-full px-4 md:px-8 lg:px-16 text-gray-900 bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100 py-16"> 
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center mb-20">
          <motion.h3
            ref={badgeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={badgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-xs md:text-sm font-bold tracking-widest text-cyan-600 uppercase px-5 py-2 border border-cyan-200 rounded-full mb-4 bg-cyan-50"
          >
            Case Studies
          </motion.h3>
          <motion.h1
            ref={headingRef}
            initial={{ opacity: 0, y: 40 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-black text-center tracking-tight"
          >
            Turning Challenges Into <span className="underline decoration-4">Success</span>
          </motion.h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudiesData.map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} index={index} onClick={() => setSelectedCase(caseStudy)} />
          ))}
        </div>
      </div>
      <CaseStudyModal caseStudy={selectedCase} onClose={() => setSelectedCase(null)} />
    </section>
  )
}