"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { cn } from "@/app/lib/utils"
import emailjs from "@emailjs/browser"

const REVENUE_OPTIONS = [
  "Under $5,000/month",
  "$5,000 – $20,000/month",
  "$20,000 – $50,000/month",
  "$50,000 – $100,000/month",
  "Over $100,000/month",
]

const INSTALL_STEPS = [
  { n: "01", title: "Download the ZIP file", desc: "Save the ZIP file to your computer." },
  { n: "02", title: "Extract the ZIP", desc: "Right-click the file and select Extract All. This creates a folder — open it and you'll find another folder inside. That inner folder is the actual extension." },
  { n: "03", title: "Open Extensions tab", desc: "In your browser menu, navigate to Extensions." },
  { n: "04", title: "Enable Developer Mode", desc: "Toggle Developer Mode on from the top-right corner." },
  { n: "05", title: "Click Load Unpacked", desc: "Select the inner folder (not the outer one). If you get an error, you've selected the wrong folder — go one level deeper and select the folder inside it." },
]

function MagneticButton({ onClick, children, className }) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.28
    const dy = (e.clientY - cy) * 0.28
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "translate(0,0)"
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 ease-out", className)}
    >
      {children}
    </button>
  )
}

function DownloadModal({ card, onClose }) {
  const [form, setForm] = useState({ fullName: "", email: "", revenue: "", brandName: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = "Required"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"
    if (!form.revenue) e.revenue = "Required"
    if (!form.brandName.trim()) e.brandName = "Required"
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setSubmitting(true)
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DOWNLOAD,
      { fullName: form.fullName, email: form.email, revenue: form.revenue, brandName: form.brandName, toolName: card.title },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        const a = document.createElement("a")
        a.href = card.downloadUrl || "#"
        a.download = ""
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setSuccess(true)
      })
      .catch(() => alert("Something went wrong. Please try again."))
      .finally(() => setSubmitting(false))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-slate-900 font-bold text-lg">Get {card.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">Fill in your details to download</p>
                </div>
                <motion.button whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }} onClick={onClose} className="text-slate-300 hover:text-slate-700 transition-colors text-xl leading-none cursor-pointer">✕</motion.button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: "Full Name", key: "fullName", type: "text", placeholder: "John Smith" },
                  { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Brand Name on Amazon", key: "brandName", type: "text", placeholder: "Your Amazon brand name" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className={cn("w-full bg-white border rounded-lg px-3 py-2.5 text-slate-900 text-sm outline-none transition-colors placeholder:text-slate-300",
                        errors[key] ? "border-red-400" : "border-slate-200 focus:border-blue-400")}
                    />
                    {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                  </div>
                ))}

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Amazon Revenue</label>
                  <select value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                    className={cn("w-full bg-white border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors cursor-pointer",
                      form.revenue ? "text-slate-900" : "text-slate-300",
                      errors.revenue ? "border-red-400" : "border-slate-200 focus:border-blue-400")}
                  >
                    <option value="" disabled className="bg-white text-slate-400">Select your monthly revenue</option>
                    {REVENUE_OPTIONS.map((o) => <option key={o} value={o} className="bg-white text-slate-900">{o}</option>)}
                  </select>
                  {errors.revenue && <p className="text-red-400 text-xs mt-1">{errors.revenue}</p>}
                </div>

                <button type="submit" disabled={submitting}
                  className="mt-2 w-full py-3 bg-blue-500 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download {card.title}</>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-slate-900 font-bold text-lg">Download Started</h2>
                    <p className="text-slate-400 text-sm">Follow the steps below to install</p>
                  </div>
                </div>
                <motion.button whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }} onClick={onClose} className="text-slate-300 hover:text-slate-700 transition-colors text-xl leading-none cursor-pointer">✕</motion.button>
              </div>

              <div className="relative">
                <div className="absolute left-4.5 top-6 bottom-6 w-px bg-indigo-100" />
                <div className="flex flex-col gap-5">
                  {INSTALL_STEPS.map(({ n, title, desc }, i) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 z-10">
                        <span className="text-xs font-black text-blue-500">{n}</span>
                      </div>
                      <div className="pt-1.5">
                        <p className="text-slate-900 text-sm font-semibold leading-tight">{title}</p>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button onClick={onClose} className="mt-6 w-full py-3 bg-indigo-50 border border-indigo-200 text-blue-600 font-semibold text-sm rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function Component({ cards = [], className }) {
  const [pendingCard, setPendingCard] = useState(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, margin: "-60px" })

  if (!cards || cards.length === 0) return null

  return (
    <>
      <div ref={containerRef} className={cn("flex flex-col gap-3 max-w-2xl mx-auto", className)}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="rounded-xl border border-slate-200 bg-white p-4 relative overflow-hidden group shadow-sm"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-50/60 to-transparent -translate-x-full"
              whileHover={{ translateX: "200%" }}
              transition={{ duration: 0.7 }}
            />

            <div className="flex items-start gap-3">
              {card.icon && (
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50"
                >
                  {card.icon}
                </motion.div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 truncate">{card.title}</h3>
                  {card.comingSoon && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 shrink-0">Coming Soon</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-semibold">{card.description}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex gap-3">
                {card.version && <span className="text-xs text-slate-300">v{card.version}</span>}
                {card.fileSize && <span className="text-xs text-slate-300">{card.fileSize}</span>}
              </div>
              {card.comingSoon ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 cursor-not-allowed">
                  Coming Soon
                </span>
              ) : (
                <MagneticButton
                  onClick={() => setPendingCard(card)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </MagneticButton>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {pendingCard && <DownloadModal card={pendingCard} onClose={() => setPendingCard(null)} />}
      </AnimatePresence>
    </>
  )
}
