"use client"
import emailjs from '@emailjs/browser'
import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ArrowRight, Check, Sparkles, ChevronLeft } from "lucide-react"

const AD_SPEND_OPTIONS = [
  "Under $1,000 / month",
  "$1,000 - $5,000 / month",
  "$5,000 - $15,000 / month",
  "$15,000 - $50,000 / month",
  "$50,000+ / month",
]
const PPC_SITUATIONS = [
  "Running ads in-house",
  "Currently with an agency",
  "Running but not managing",
  "Not running any ads yet",
]
const PPC_CHALLENGES = [
  "High ACoS / Wasted Spend",
  "Low Visibility / not ranking",
  "Scaling without losing profitability",
  "Just launched - Need momentum",
  "Don't know what's working",
]
const GOALS = [
  "Reduce ACOS",
  "Increase Revenue",
  "Launch new products",
  "Enter new marketplaces",
  "Full account turnaround",
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit:  (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
}

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isValidUrl   = (v) => { try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:" } catch { return false } }

function TextInput({ type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white/30 border rounded-xl px-4 py-3.5 text-gray-800 text-base outline-none placeholder-gray-400 transition-all duration-200 focus:bg-white/55
          ${error ? "border-red-300 focus:border-red-400" : "border-white/60 focus:border-cyan-400"}`}
      />
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs pl-1">
          {error}
        </motion.p>
      )}
    </div>
  )
}

function OptionButton({ option, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm flex justify-between items-center transition-all duration-200 ${
        selected
          ? "bg-cyan-500 text-white border-cyan-500 font-semibold shadow-lg shadow-cyan-200/50"
          : "bg-white/30 text-gray-600 border-white/60 hover:border-cyan-300 hover:bg-white/50 hover:text-gray-900"
      }`}
    >
      {option}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i + 1 === current ? 20 : 6, opacity: i + 1 <= current ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full bg-cyan-500"
        />
      ))}
    </div>
  )
}

export default function BookACall() {
  const [step, setStep]           = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [formData, setFormData]   = useState({
    fullName: "", email: "", phone: "", country: "", state: "",
    storefrontUrl: "", adSpend: "", ppcSituation: "", ppcChallenge: "", primaryGoal: ""
  })

  const badgeRef      = useRef(null)
  const headingRef    = useRef(null)
  const badgeInView   = useInView(badgeRef,   { once: true, margin: "-80px" })
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" })
  const totalSteps    = 5

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }))
  const clearErr = (key) => setErrors(p => ({ ...p, [key]: "" }))

  const goNext = () => { setDirection(1);  setStep(s => Math.min(s + 1, totalSteps)) }
  const goPrev = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)) }

  const autoNext = (key, val) => {
    set(key, val)
    setTimeout(() => { setDirection(1); setStep(s => Math.min(s + 1, totalSteps)) }, 260)
  }

  const validateStep1 = () => {
    const e = {}
    if (!formData.fullName.trim())                                        e.fullName      = "Required"
    if (!formData.email || !isValidEmail(formData.email))                 e.email         = "Enter a valid email"
    if (!formData.phone.trim())                                           e.phone         = "Required"
    if (!formData.country.trim())                                         e.country       = "Required"
    if (!formData.storefrontUrl || !isValidUrl(formData.storefrontUrl))   e.storefrontUrl = "Enter a valid URL (https://...)"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => { if (step === 1 && !validateStep1()) return; goNext() }

  const handleSubmit = () => {
    setSending(true)
    emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BOOKCALL, formData, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
      .then(() => {
        setSubmitted(true)
        window.location.href = `https://calendly.com/ascendrixc?name=${encodeURIComponent(formData.fullName)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.phone)}`
      })
      .catch(() => alert("Something went wrong. Please try again."))
      .finally(() => setSending(false))
  }

  const progress = (step / totalSteps) * 100

  return (
    <section id="book-a-call" className="w-full px-4 md:px-8 lg:px-16 bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="flex flex-col items-center mb-16">
          <motion.h3
            ref={badgeRef}
            initial={{ opacity: 0, y: 20 }} animate={badgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-xs md:text-sm font-bold tracking-widest text-cyan-600 uppercase px-5 py-2 border border-cyan-200 rounded-full mb-4 bg-cyan-50"
          >
            Book A Call
          </motion.h3>
          <motion.h1
            ref={headingRef}
            initial={{ opacity: 0, y: 40 }} animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-black text-center tracking-tight max-w-3xl"
          >
            Speak directly with our <span className="underline decoration-4">Team</span>
          </motion.h1>
        </div>

        {/* Glass card */}
        <div className="max-w-xl mx-auto">
          <div
            className="rounded-3xl border border-white/70 shadow-2xl shadow-cyan-200/40 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
          >
            {/* Top bar */}
            <div className="px-8 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-600 font-semibold">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Growth Partnership
              </div>
              <StepDots total={totalSteps} current={step} />
            </div>

            {/* Form body */}
            <div className="p-8">
              <AnimatePresence mode="wait" custom={direction}>
                {!submitted ? (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >

                    {/* ── Step 1 ── */}
                    {step === 1 && (
                      <>
                        <div className="mb-2">
                          <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                            Let's start with the{" "}
                            <span className="font-bold text-gray-900 underline decoration-cyan-400 underline-offset-6">basics.</span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">Tell us a bit about yourself.</p>
                        </div>

                        <TextInput
                          placeholder="Full name"
                          value={formData.fullName}
                          onChange={e => { set("fullName", e.target.value); clearErr("fullName") }}
                          error={errors.fullName}
                        />
                        <TextInput
                          type="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={e => {
                            set("email", e.target.value)
                            setErrors(p => ({ ...p, email: e.target.value && !isValidEmail(e.target.value) ? "Enter a valid email" : "" }))
                          }}
                          error={errors.email}
                        />
                        <TextInput
                          type="tel"
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={e => { set("phone", e.target.value.replace(/[^0-9+\-\s()]/g, "")); clearErr("phone") }}
                          error={errors.phone}
                        />

                        {/* Country + State side by side */}
                        <div className="grid grid-cols-2 gap-3">
                          <TextInput
                            placeholder="Country"
                            value={formData.country}
                            onChange={e => { set("country", e.target.value); clearErr("country") }}
                            error={errors.country}
                          />
                          <TextInput
                            placeholder="State / Province"
                            value={formData.state}
                            onChange={e => set("state", e.target.value)}
                          />
                        </div>

                        <TextInput
                          placeholder="Amazon Storefront URL (https://...)"
                          value={formData.storefrontUrl}
                          onChange={e => {
                            set("storefrontUrl", e.target.value)
                            setErrors(p => ({ ...p, storefrontUrl: e.target.value && !isValidUrl(e.target.value) ? "Enter a valid URL (https://...)" : "" }))
                          }}
                          error={errors.storefrontUrl}
                        />
                      </>
                    )}

                    {/* ── Step 2 ── */}
                    {step === 2 && (
                      <>
                        <div className="mb-2">
                          <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                            Monthly <span className="font-bold text-gray-900">Amazon ad spend?</span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">Select the range that fits your account.</p>
                        </div>
                        <div className="space-y-2.5">
                          {AD_SPEND_OPTIONS.map(o => (
                            <OptionButton key={o} option={o} selected={formData.adSpend === o} onClick={() => autoNext("adSpend", o)} />
                          ))}
                        </div>
                      </>
                    )}

                    {/* ── Step 3 ── */}
                    {step === 3 && (
                      <>
                        <div className="mb-2">
                          <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                            Current <span className="font-bold text-gray-900">PPC structure?</span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">How are your ads being managed right now?</p>
                        </div>
                        <div className="space-y-2.5">
                          {PPC_SITUATIONS.map(o => (
                            <OptionButton key={o} option={o} selected={formData.ppcSituation === o} onClick={() => autoNext("ppcSituation", o)} />
                          ))}
                        </div>
                      </>
                    )}

                    {/* ── Step 4 ── */}
                    {step === 4 && (
                      <>
                        <div className="mb-2">
                          <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                            Biggest <span className="font-bold text-gray-900">PPC bottleneck?</span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">What's holding your account back the most?</p>
                        </div>
                        <div className="space-y-2.5">
                          {PPC_CHALLENGES.map(o => (
                            <OptionButton key={o} option={o} selected={formData.ppcChallenge === o} onClick={() => autoNext("ppcChallenge", o)} />
                          ))}
                        </div>
                      </>
                    )}

                    {/* ── Step 5 ── */}
                    {step === 5 && (
                      <>
                        <div className="mb-2">
                          <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                            Primary <span className="font-bold text-gray-900">goal for next 3–6 months?</span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">We'll tailor our strategy around this.</p>
                        </div>
                        <div className="space-y-2.5">
                          {GOALS.map(o => (
                            <OptionButton key={o} option={o} selected={formData.primaryGoal === o} onClick={() => set("primaryGoal", o)} />
                          ))}
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={!formData.primaryGoal || sending}
                          className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-sky-400 transition-all duration-300 shadow-lg shadow-cyan-200/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {sending
                            ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            : <><Sparkles className="w-4 h-4" /> Submit & Book Your Call</>
                          }
                        </motion.button>
                      </>
                    )}

                    {/* Nav row */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/40">
                      <button
                        type="button" onClick={goPrev} disabled={step === 1}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Back
                      </button>
                      <span className="text-xs text-gray-400 font-mono">{step} / {totalSteps}</span>
                      {step < totalSteps && (
                        <motion.button
                          type="button" onClick={handleContinue} whileHover={{ x: 2 }}
                          className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/60 border border-white/80 text-gray-700 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-200 cursor-pointer"
                        >
                          Continue <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="text-center py-12 space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-200"
                    >
                      <Check className="w-8 h-8" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900">Transmission Received.</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                      We're analyzing your account data. A bespoke growth blueprint will hit your inbox shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mt-6 h-1 bg-white/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
