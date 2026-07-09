"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquare, HelpCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger)

const faqData = [
  { id: 1, question: "What exactly is the Profit Protocol System?", answer: "A proprietary five-stage growth framework designed to increase profitability, not just sales. Every optimization decision is based on protecting margins while creating sustainable long-term growth." },
  { id: 2, question: "How is our agency different from a typical Amazon PPC agency?", answer: "Most agencies optimize campaigns. We optimize the entire profit engine—advertising, search terms, account health, profitability, scaling opportunities, and long-term brand growth." },
  { id: 3, question: "What brands has this system worked for?", answer: "The Profit Protocol has been implemented across multiple Amazon brands in different categories, helping businesses improve profitability, reduce wasted ad spend, and build scalable growth systems." },
  { id: 4, question: "How long before I see improvements?", answer: "Many brands begin seeing optimization opportunities within the first few weeks. Sustainable profit growth typically compounds over the following months as each stage of the protocol is implemented." },
]

const messageBubble = {
  initial: { opacity: 0, y: 12, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring", stiffness: 340, damping: 26 },
}

export default function ChatFAQ() {
  const [messages, setMessages] = useState([{ id: "welcome", sender: "agency", text: "Hey there! 👋 Welcome to our PPC Support hub. Click any question on the left, and I'll break down how our management systems work!" }])
  const [isTyping, setIsTyping] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState(null)
  const chatContainerRef = useRef(null)
  const sidebarRef = useRef(null)
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const sidebarInView = useInView(sidebarRef, { once: true, margin: "-60px" })

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: badgeRef.current, start: "top 95%" } })
      gsap.from(headingRef.current, { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", delay: 0.1, scrollTrigger: { trigger: headingRef.current, start: "top 95%" } })
    })
    return () => ctx.revert()
  }, [])

  const handleQuestionClick = (faq) => {
    if (isTyping || activeQuestionId === faq.id) return
    setActiveQuestionId(faq.id)
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: "user", text: faq.question }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: `agency-${Date.now()}`, sender: "agency", text: faq.answer }])
    }, 1200)
  }

  return (
    <section id="faqs" className="w-full px-4 md:px-8 lg:px-16 py-16 bg-linear-to-b from-slate-100 via-slate-50 to-slate-100">
      <div className="flex flex-col justify-center items-center mb-16">
        <h3 ref={badgeRef} className="inline-block text-xs md:text-sm font-bold tracking-widest text-slate-600 uppercase px-5 py-2 border border-slate-300 rounded-full mb-4 bg-slate-100">
          FAQs
        </h3>
        <h1 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-black text-center tracking-tight max-w-3xl">
          Everything you need to <span className="underline decoration-4">know</span>
        </h1>
      </div>

      <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200 grid grid-cols-1 md:grid-cols-5 h-auto md:h-150">

        {/* CHAT PANEL */}
        <div className="order-1 md:order-2 md:col-span-3 flex flex-col h-110 md:h-full border-b border-slate-200 md:border-b-0 overflow-hidden" style={{ background: "#f0f0f5" }}>

          {/* iMessage-style top bar */}
          <div className="px-4 py-3 flex flex-col items-center gap-1 shrink-0 border-b border-slate-200/80" style={{ background: "rgba(240,240,245,0.85)", backdropFilter: "blur(12px)" }}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shadow-md">
                <img src="/Logo.png" alt="Ascendrix" className="w-full h-full object-cover" />
              </div>
              <motion.div
                className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 text-sm leading-tight">Ascendrix</h4>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isAgency = msg.sender === "agency"
                return (
                  <motion.div
                    key={msg.id}
                    {...messageBubble}
                    className={`flex items-end gap-1.5 ${isAgency ? "mr-auto" : "ml-auto flex-row-reverse"} max-w-[80%]`}
                  >
                    {isAgency && (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0 mb-0.5">
                        <img src="/Logo.png" alt="Ascendrix" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                      isAgency
                        ? "bg-white text-slate-800 rounded-2xl rounded-bl-sm shadow-sm"
                        : "text-white rounded-2xl rounded-br-sm shadow-sm"
                    }`}
                    style={!isAgency ? { background: "linear-gradient(135deg, #3b82f6, #2563eb)" } : {}}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="flex items-end gap-1.5 mr-auto max-w-[80%]">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0 mb-0.5">
                    <img src="/Logo.png" alt="Ascendrix" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                    {[0, 150, 300].map((delay, i) => (
                      <motion.span key={i} className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* iMessage bottom bar */}
          <div className="px-4 py-3 border-t border-slate-200/80 shrink-0 flex items-center gap-2" style={{ background: "rgba(240,240,245,0.85)", backdropFilter: "blur(12px)" }}>
            <div className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-400 select-none">
              iMessage
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* QUESTIONS PANEL */}
        <div ref={sidebarRef} className="order-2 md:order-1 md:col-span-2 border-t md:border-t-0 md:border-r border-slate-200 bg-white p-4 flex flex-col justify-between h-48 md:h-full overflow-hidden shrink-0">
          <div className="overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="flex items-center gap-2 mb-4 px-1">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800 text-sm md:text-base">Frequently Asked</h3>
            </div>

            <div className="space-y-2 pb-2">
              {faqData.map((faq, i) => {
                const isSelected = activeQuestionId === faq.id
                return (
                  <motion.button
                    key={faq.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={sidebarInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ x: 3 }}
                    onClick={() => handleQuestionClick(faq)}
                    disabled={isTyping}
                    className={`w-full cursor-pointer text-left p-3 rounded-2xl border text-sm transition-all duration-200 flex items-start gap-2.5 ${
                      isSelected
                        ? "border-blue-400 text-white font-medium shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={isSelected ? { background: "linear-gradient(135deg, #3b82f6, #2563eb)" } : {}}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span>{faq.question}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400 px-1 flex items-center justify-between shrink-0">
            <span>Tap a question to ask</span>
            {messages.length > 1 && (
              <button onClick={() => { setMessages([messages[0]]); setActiveQuestionId(null) }} className="text-blue-500 cursor-pointer font-medium hover:underline">
                Clear
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
