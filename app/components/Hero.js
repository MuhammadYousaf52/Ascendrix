"use client";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import FloatingProductCards from '@/app/components/FloatingProductCards';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const pulseGlowVariants = {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      boxShadow: [
        "0 0 20px rgba(6, 182, 212, 0.15)",
        "0 0 40px rgba(6, 182, 212, 0.35)",
        "0 0 20px rgba(6, 182, 212, 0.15)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="home" className="w-full flex flex-col items-center justify-center pt-20 pb-10 md:pt-28 md:pb-10 md:min-h-screen gap-4 md:gap-10 relative overflow-hidden">
      <FloatingProductCards />

      {/* Hero Content */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center justify-center gap-4 md:gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          className="inline-block bg-cyan-400/10 backdrop-blur-sm border mt-6 md:mt-6 border-cyan-400/40 rounded-full px-3 md:px-6 py-1.5 md:py-3"
          variants={pulseGlowVariants}
          initial="initial"
          animate="animate"
        >
          <p className="text-cyan-200 font-semibold text-xs md:text-base lg:text-lg">
            97% of brands recover $3k-$5k in their first month alone
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="max-w-5xl mx-auto text-center px-4"
          variants={itemVariants}
        >
          <div className="min-h-[140px] sm:min-h-0 h-auto flex items-center justify-center">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-white text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] leading-tight mb-4 md:mb-6 font-(family-name:--font-merriweather) tracking-wide"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
            >
              <Typewriter
                options={{
                  delay: 50,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("Increase your brand's net profit by 30% in just 82 days.")
                    .start();
                }}
              />
            </motion.h1>
          </div>
          <motion.p
            className="text-sm sm:text-base md:text-2xl text-cyan-100 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We get paid when your profit grows, that's the <span className="font-bold underline decoration-4">Profit Protocol System.</span>
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex gap-3 md:gap-6 flex-wrap justify-center"
          variants={itemVariants}
        >
          <motion.button
            className="cursor-pointer capitalize text-sm md:text-base lg:text-lg font-bold bg-linear-to-r from-cyan-400 to-cyan-600 text-white py-3 md:py-5 px-6 md:px-14 rounded-full hover:from-cyan-300 hover:to-cyan-500 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50"
            whileHover={{ scale: 1.15, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onClick={() => document.getElementById('book-a-call')?.scrollIntoView({ behavior: 'smooth' })}
          >
            I want more profit
          </motion.button>

          <motion.button
            className="cursor-pointer text-sm md:text-base lg:text-lg font-bold border-2 border-black text-black py-3 md:py-5 px-6 md:px-10 rounded-full hover:bg-white transition-all duration-300 "
            whileHover={{ scale: 1.15, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See our results
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          className="flex flex-wrap gap-3 md:gap-6 text-cyan-200 text-xs md:text-sm lg:text-base font-medium justify-center"
          variants={itemVariants}
        >
          {["No Retainers", "Flexible Terms", "Cancel Anytime"].map((feature, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
            >
              {feature}
              {idx < 2 && <span className="mx-2">•</span>}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}