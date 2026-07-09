"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowUpRight, ShieldCheck, Phone, MapPin, X, Shield, FileText, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, including your name, email address, phone number, business name, and Amazon store details when you fill out our forms or contact us. We also collect usage data such as pages visited, time spent, and interactions with our platform."
  },
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services, communicate with you about your account and our services, send you marketing communications (with your consent), analyze usage patterns to enhance user experience, and comply with legal obligations."
  },
  {
    title: "Information Sharing",
    content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or servicing you — provided they agree to keep this information confidential."
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure."
  },
  {
    title: "Cookies & Tracking",
    content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our service may not function properly."
  },
  {
    title: "Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications by clicking the unsubscribe link in any email we send. To exercise these rights, contact us at ascendrixc@gmail.com."
  },
  {
    title: "Contact Us",
    content: "If you have any questions about this Privacy Policy, please contact us at ascendrixc@gmail.com or by phone at +1 3479927860. Our office is located in New York, Queens Village."
  },
]

const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using Ascendrix's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use our services."
  },
  {
    title: "Services Description",
    content: "Ascendrix provides Amazon PPC management, DSP advertising, listing optimization, brand strategy, and related e-commerce growth services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice."
  },
  {
    title: "Client Responsibilities",
    content: "You agree to provide accurate and complete information when engaging our services, maintain the confidentiality of your account credentials, promptly notify us of any unauthorized use of your account, and comply with all applicable laws and regulations in connection with your use of our services."
  },
  {
    title: "Intellectual Property",
    content: "All content, strategies, frameworks, and materials created by Ascendrix — including the Profit Protocol System — are the exclusive intellectual property of Ascendrix. You may not reproduce, distribute, or create derivative works without our express written permission."
  },
  {
    title: "Payment & Billing",
    content: "Payment terms are outlined in your individual service agreement. All fees are non-refundable unless otherwise stated. We reserve the right to suspend services for accounts with outstanding balances. Prices are subject to change with 30 days written notice."
  },
  {
    title: "Limitation of Liability",
    content: "Ascendrix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you for the services in the three months preceding the claim."
  },
  {
    title: "Termination",
    content: "Either party may terminate the service agreement with 30 days written notice. Upon termination, your right to use our services will immediately cease. We reserve the right to terminate accounts that violate these terms without prior notice."
  },
  {
    title: "Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York County."
  },
]

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

function ScrambleLink({ href, text, target, rel, className, icon: Icon, onClick }) {
  const spanRef = useRef(null)
  const frameRef = useRef(null)
  const originalText = text.toUpperCase()

  function scramble() {
    let iteration = 0
    clearInterval(frameRef.current)
    frameRef.current = setInterval(() => {
      if (!spanRef.current) return
      spanRef.current.innerText = originalText
        .split("").map((char, i) => {
          if (char === " ") return " "
          if (i < iteration) return originalText[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join("")
      if (iteration >= originalText.length) clearInterval(frameRef.current)
      iteration += 0.6
    }, 30)
  }

  function reset() {
    clearInterval(frameRef.current)
    if (spanRef.current) spanRef.current.innerText = originalText
  }

  if (onClick) {
    return (
      <button onClick={onClick} onMouseEnter={scramble} onMouseLeave={reset} className={className}>
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span ref={spanRef} className="font-mono tracking-wider text-xs">{originalText}</span>
      </button>
    )
  }

  return (
    <a href={href} target={target} rel={rel} onMouseEnter={scramble} onMouseLeave={reset} className={className}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span ref={spanRef} className="font-mono tracking-wider text-xs">{originalText}</span>
    </a>
  )
}

function PolicyModal({ open, onClose, type }) {
  const scrollRef = useRef(null)
  const [activeSection, setActiveSection] = useState(0)
  const isPrivacy = type === "privacy"
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service"
  const icon = isPrivacy ? Shield : FileText
  const Icon = icon

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[88vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-lg tracking-tight">{title}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Ascendrix · Last updated {new Date().getFullYear()}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body: sidebar + content */}
            <div className="flex flex-1 min-h-0">
              {/* Sidebar nav */}
              <div className="hidden md:flex flex-col w-52 shrink-0 border-r border-slate-100 py-4 overflow-y-auto">
                {sections.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSection(i)
                      const el = scrollRef.current?.querySelectorAll(".policy-section")[i]
                      el?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                    className={`text-left px-5 py-2.5 text-xs transition-all flex items-center gap-2 ${
                      activeSection === i
                        ? "text-blue-500 font-semibold bg-blue-50 border-r-2 border-blue-500"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${activeSection === i ? "text-blue-500" : "text-slate-300"}`} />
                    {s.title}
                  </button>
                ))}
              </div>

              {/* Scrollable content */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-8 py-6 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                onScroll={() => {
                  const els = scrollRef.current?.querySelectorAll(".policy-section")
                  if (!els) return
                  els.forEach((el, i) => {
                    const rect = el.getBoundingClientRect()
                    if (rect.top <= 120) setActiveSection(i)
                  })
                }}
              >
                {sections.map((s, i) => (
                  <div key={i} className="policy-section">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black text-slate-300 font-mono">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-slate-900 font-bold text-base">{s.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed pl-7">{s.content}</p>
                    {i < sections.length - 1 && <div className="mt-8 border-b border-slate-100" />}
                  </div>
                ))}

                {/* Footer inside modal */}
                <div className="pt-4 pb-2 flex items-center justify-between">
                  <p className="text-xs text-slate-300">© {new Date().getFullYear()} Ascendrix. All rights reserved.</p>
                  <button
                    onClick={onClose}
                    className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function BalancedPremiumFooter() {
  const footerRef = useRef(null)
  const innerRef = useRef(null)
  const [modal, setModal] = useState(null)
  const devEmail = "yusuf.dev.pk@gmail.com"
  const companyPhone = "+1 3479927860"

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: footerRef.current, start: "top 98%" } }
      )
      gsap.from(innerRef.current?.querySelectorAll(".footer-item"), {
        opacity: 0, y: 24, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.3,
        scrollTrigger: { trigger: footerRef.current, start: "top 98%" }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <footer ref={footerRef} className="w-full bg-linear-to-b from-slate-200 to-slate-100 text-slate-500 font-sans border-t border-slate-200 overflow-hidden">
        <div ref={innerRef} className="max-w-6xl mx-auto px-6 pt-12 pb-10">

          {/* BIG OUTER COMPANY BOX */}
          <div className="footer-item border border-slate-200 bg-white rounded-3xl p-8 md:p-10 shadow-sm mb-6 relative overflow-hidden">

            {/* Top row: brand + tagline */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8 border-b border-slate-100">
              <div className="space-y-3 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-black text-sm tracking-widest uppercase">ASCENDRIX</span>
                  <motion.span
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Engineering high-fidelity conversion funnels and data-driven architectures to optimize marketing velocity.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ScrambleLink
                  href="https://www.linkedin.com/company/ascendrix-co/"
                  text="LinkedIn" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
                  icon={LinkedinIcon}
                />
                <ScrambleLink
                  href="https://www.instagram.com/ascendrix.co.usa/"
                  text="Instagram" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
                  icon={InstagramIcon}
                />
              </div>
            </div>

            {/* Middle row: contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-b border-slate-100">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Email</span>
                <a href="mailto:solutions@ascendrixco.site" className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 group w-fit">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                  solutions@ascendrixco.site
                </a>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Phone</span>
                <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 group w-fit">
                  <Phone className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                  {companyPhone}
                </a>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Location</span>
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  New York, Queens Village
                </span>
              </div>
            </div>

            {/* NESTED DEVELOPER CARD */}
            <div className="pt-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Built by</span>
              <motion.div
                whileHover={{ borderColor: "rgba(15,23,42,0.2)" }}
                transition={{ duration: 0.3 }}
                className="border border-slate-200 bg-slate-50 rounded-2xl p-6 relative overflow-hidden group/dev"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-tr from-slate-50 to-slate-100 opacity-0 group-hover/dev:opacity-100 rounded-2xl"
                  transition={{ duration: 0.4 }}
                />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      <span>// ARCHITECTURE PROFILE</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> VERIFIED
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Blown away by this digital setup?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                      This exact interface, smooth animations, and layout flow were meticulously designed by our Lead Architect. Secure this caliber of work for your own brand.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs text-slate-400">
                      <a href={`mailto:${devEmail}`} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                        <Mail className="w-3.5 h-3.5" />{devEmail}
                      </a>
                    </div>
                  </div>
                  <motion.a
                    href={`mailto:${devEmail}?subject=Web%20Development%20Inquiry`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="shrink-0 flex items-center gap-2 bg-blue-500 text-white text-xs font-semibold px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Hire the Developer
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="footer-item flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-medium tracking-wide uppercase px-2">
            <div>&copy; {new Date().getFullYear()} ASCENDRIX. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-6">
              <ScrambleLink text="Privacy Policy" onClick={() => setModal("privacy")} className="hover:text-slate-700 transition-colors cursor-pointer" />
              <ScrambleLink text="Terms of Service" onClick={() => setModal("terms")} className="hover:text-slate-700 transition-colors cursor-pointer" />
            </div>
          </div>

        </div>
      </footer>

      <PolicyModal open={modal === "privacy"} onClose={() => setModal(null)} type="privacy" />
      <PolicyModal open={modal === "terms"} onClose={() => setModal(null)} type="terms" />
    </>
  )
}
