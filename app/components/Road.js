"use client";

import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const steps = [
  {
    title: "Profit Audit™",
    description:
      "A forensic financial diagnosis of your brand pinpointing exactly where profit is leaking, wasted, or left on the table, before you spend a dollar.",
    position: "left-top",
  },
  {
    title: "Profit Blueprint™",
    description:
      "A custom net profit model: high-margin ASIN priority map, campaign architecture, and a 30 to 90-day roadmap showing exactly what profit looks like on paper if executed.",
    position: "right",
  },
  {
    title: "Profit Engine™",
    description:
      "PPC restructuring, listing and A+ optimization, pricing strategy, and inventory management all aligned to maximize net profit, not just sales volume.",
    position: "left-middle",
  },
  {
    title: "Profit Shield™",
    description:
      "This stage secures long term profitability by protecting margins, strengthening account health, and reinforcing brand positioning for sustained growth.",
    position: "left-bottom",
  },
  {
    title: "Profit Scale™",
    description:
      "We systematically scale profits through new ASINs, market expansion, and strategic reinvestment, creating a sustainable growth engine that compounds over time.",
    position: "right-bottom",
  },
];

export default function ProfitProtocolRoad() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const positions = isMobile ? {
    "left-top": "top-[0px] left-[5%]",
    right: "top-[340px] right-[5%]",
    "left-middle": "top-[680px] left-[5%]",
    "left-bottom": "top-[1020px] left-[5%]",
    "right-bottom": "top-[1360px] right-[5%]",
  } : {
    "left-top": "top-[0px] left-[0%]",
    right: "top-[480px] right-[0%]",
    "left-middle": "top-[950px] left-[8%]",
    "left-bottom": "top-[1450px] left-[3%]",
    "right-bottom": "top-[1900px] right-[3%]",
  };

  const journeyHeight = isMobile ? "h-[1650px]" : "h-[2450px]";
  const cardWidth = isMobile ? "w-[260px] max-w-[80vw]" : "w-[380px]";
  const viewBox = isMobile ? "0 0 600 1650" : "0 0 1000 2450";
  const svgPath = isMobile
    ? "M 150 80 C 200 100, 300 200, 300 300 C 300 420, 200 500, 150 600 C 100 700, 100 900, 150 1000 C 200 1100, 300 1150, 300 1280 C 300 1360, 250 1400, 220 1420"
    : "M 220 120 C 520 150, 700 380, 700 580 C 700 750, 520 900, 320 1000 C 120 1100, 120 1350, 300 1500 C 500 1650, 720 1700, 720 1950";

  return (
    <section
      id="pps"
      ref={containerRef}
      className="relative bg-transparent py-4 pt-20 md:pt-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-3 md:mb-6 px-2">
            Our Profit Protocol
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-300 px-2">
            A proven framework designed to transform advertising spend into
            predictable and scalable growth.
          </p>
        </div>

        {/* Journey Container */}
        <div className={`relative ${journeyHeight} max-w-5xl mx-auto`}>

          {/* SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={viewBox}
            preserveAspectRatio="none"
          >
            {/* Background Path */}
            <path
              d={svgPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth={isMobile ? "6" : "8"}
              strokeDasharray="20 28"
              strokeLinecap="round"
              opacity="0.15"
            />

            {/* Animated Path */}
            <motion.path
              d={svgPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth={isMobile ? "6" : "8"}
              strokeDasharray="20 28"
              strokeLinecap="round"
              style={{
                pathLength: scrollYProgress,
              }}
            />
          </svg>

          {/* Cards */}
          {steps.map((step, index) => {
            const cardProgress = index / steps.length + 0.15;
            const active = progress >= cardProgress;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className={`
                  absolute
                  ${positions[step.position]}
                  ${cardWidth}
                `}
              >
                <motion.div
                  animate={{
                    y: active ? -10 : 0,
                    scale: active ? 1.03 : 1,
                    boxShadow: active
                      ? "0 0 40px rgba(255,255,255,0.3)"
                      : "0 0 0px rgba(255,255,255,0)",

                    borderColor: active
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl md:rounded-3xl border bg-white/10 p-5 md:p-8 backdrop-blur-md"
                >
                  {/* Step Number */}
                  <motion.div
                    animate={{
                      textShadow: active
                        ? "0 0 25px rgba(255,255,255,1)"
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    className="mb-3 md:mb-4 text-3xl md:text-5xl font-bold text-orange-400"
                  >
                    0{index + 1}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    animate={{
                      textShadow: active
                        ? "0 0 20px rgba(255,255,255,0.9)"
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.5 }}
                    className="mb-3 md:mb-4 text-lg md:text-2xl font-extrabold text-white"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    animate={{
                      color: active ? "#fff" : "#d1d5db",
                      textShadow: active
                        ? "0 0 12px rgba(255,255,255,0.6)"
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.5 }}
                    className="leading-relaxed text-sm font-semibold md:text-base"
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
