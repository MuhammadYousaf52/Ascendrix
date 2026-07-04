"use client";

import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  TrendingUp,
  Star,
  BookOpen,
  Wrench,
  CalendarCheck,
  Layers,
  HelpCircle,
} from "lucide-react";

import Image from "next/image";
import { cn } from "@/app/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: '#home' },
  { label: "About", icon: Info, href: '#about' },
  { label: "PPS", icon: TrendingUp, href: '#pps' },
  { label: "Testimonials", icon: Star, href: '#testimonials' },
  { label: "Case Studies", icon: BookOpen, href: '#case-studies' },
  { label: "Services", icon: Wrench, href: '#services' },
  { label: "Book a call", icon: CalendarCheck, href: '#book-a-call' },
  { label: "Tools", icon: Layers, href: '#tools' },
  { label: "FAQs", icon: HelpCircle, href: '#faqs' },
];

export function BottomNavBar({ className, defaultIndex = 0, onBookCall }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [labelWidths, setLabelWidths] = useState({});
  const measureRefs = useRef({});

  useEffect(() => {
    const widths = {};
    navItems.forEach((item) => {
      const el = measureRefs.current[item.label];
      if (el) widths[item.label] = el.scrollWidth + 4;
    });
    setLabelWidths(widths);
  }, []);

  return (
    <motion.nav
      key="bottom-nav"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-black/50 backdrop-blur-md border border-white/15 rounded-full flex items-center px-3 shadow-xl space-x-1 max-w-[95vw]",
        className,
      )}
    >
      <Image src="/Official_Logo.png" alt="Logo" width={110} height={50} className="object-contain self-center shrink-0 w-[90px] md:w-[110px]" />
      <div className="w-px h-6 bg-white/25 mx-3 shrink-0" />

      <div className="flex items-center overflow-x-auto md:overflow-visible space-x-1 scrollbar-none">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;

            return (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex cursor-pointer items-center gap-0 px-1.5 md:px-3 py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[32px] md:min-w-[44px] min-h-[40px] max-h-[44px]",
                  isActive
                    ? "bg-white/20 text-white gap-2"
                    : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white",
                  "focus:outline-none focus-visible:ring-0",
                )}
                onClick={() => {
                  setActiveIndex(idx);
                  const id = item.href.replace('#', '');
                  const target = document.getElementById(id);
                  if (!target) return;
                  if (window.__lenis) {
                    window.__lenis.scrollTo(target, { offset: -80, duration: 1.4 });
                  } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                aria-label={item.label}
                type="button"
              >
                <Icon size={18} strokeWidth={2} aria-hidden className="transition-colors duration-200 shrink-0 md:w-[22px] md:h-[22px]" />

                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? `${labelWidths[item.label] ?? item.label.length * 8}px` : "0px",
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? "8px" : "0px",
                  }}
                  transition={{
                    width: { type: "spring", stiffness: 350, damping: 32 },
                    opacity: { duration: 0.19 },
                    marginLeft: { duration: 0.19 },
                  }}
                  className="overflow-hidden flex items-center"
                >
                  <span
                    ref={(el) => { if (el) measureRefs.current[item.label] = el; }}
                    className={cn(
                      "font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9]",
                      isActive ? "text-white" : "opacity-0",
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
      </div>

      <div className="w-px h-6 bg-white/25 mx-3 shrink-0 hidden md:block" />
      <button
        onClick={onBookCall}
        className="shrink-0 self-center rounded-full border border-white/40 text-white hover:bg-white/20 transition-colors duration-200 px-5 py-2 text-sm font-medium whitespace-nowrap cursor-pointer hidden md:block"
      >
        Book a call
      </button>
        </motion.nav>
  );
}

export default BottomNavBar;