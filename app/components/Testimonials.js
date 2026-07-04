"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Nate Collins",
    role: "Co-Founder, DLNIA Dietary",
    image: "/DLNIA.jpeg",
    video: "/Testimonial-1.mp4",
    rating: 5,
    text: "Just a few months ago, this DLNIA Dietary was struggling to keep up with daily operations and Nate was seriously considering shutting it down. After partnering with us, they regained control of their business, improved profitability, and built a clear path for growth. Today, they are not only generating consistent profits but are also expanding their brand and launching new products with confidence."
  },
  // {
  //   name: "James Carter",
  //   role: "Founder, NovaBrands",
  //   image: "/DLNIA.jpeg",
  //   video: "/Dummy-intro.mp4",
  //   rating: 5,
  //   text: "Working with Ascendrix completely transformed how we approach Amazon. Within 60 days our ACoS dropped significantly and our net profit grew by over 40%. The team genuinely treats your brand like their own and the Profit Protocol System is unlike anything we have seen from any other agency."
  // }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);

  const paginate = (newDir) => {
    setDirection(newDir);
    setCurrent((prev) => (prev + newDir + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[current];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="w-full flex flex-col items-center justify-center gap-6 md:gap-8 px-4 sm:px-6 py-16 bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100">
      <div className="max-w-7xl mx-auto w-full">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            className="inline-block text-xs md:text-sm font-extrabold tracking-widest text-cyan-600 uppercase px-4 md:px-6 py-2 border-3 border-cyan-200 rounded-full mb-4 md:mb-6 bg-cyan-50"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 px-2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            What Our Clients{" "}
            <span className="relative inline-block">
              Say About Us
            </span>
          </motion.h2>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start lg:items-center"
            >
              {/* Video */}
              <motion.div
                className="relative w-full lg:w-96 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-cyan-200 shadow-2xl shadow-cyan-200/40"
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <video
                  src={testimonial.video}
                  controls
                  playsInline
                  preload="metadata"
                  width={400}
                  height={600}
                  className="rounded-2xl md:rounded-3xl w-full"
                  onWaiting={() => setIsBuffering(true)}
                  onCanPlay={() => setIsBuffering(false)}
                  onPlaying={() => setIsBuffering(false)}
                />
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl md:rounded-3xl pointer-events-none">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>

              {/* Content */}
              <div className="w-full lg:flex-1 flex flex-col gap-4 md:gap-6 px-2 lg:px-0">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-cyan-500 text-xl md:text-2xl">★</span>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 leading-relaxed text-base md:text-lg italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-cyan-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-cyan-300 w-12 md:w-16 h-12 md:h-16 object-center object-fill"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-base md:text-lg">{testimonial.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <motion.button
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 cursor-pointer h-12 rounded-full bg-white border-2 border-cyan-200 flex items-center justify-center shadow-md shadow-cyan-100 hover:border-cyan-500 transition-all duration-300"
            >
              <Image src="/arrowLeft.svg" alt="Previous" width={20} height={20} />
            </motion.button>
            <div className="flex gap-3 items-center">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  whileHover={{ scale: 1.2 }}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-3 bg-cyan-500" : "w-3 h-3 bg-cyan-200 hover:bg-cyan-300"}`}
                />
              ))}
            </div>
            <motion.button
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 cursor-pointer h-12 rounded-full bg-white border-2 border-cyan-200 flex items-center justify-center shadow-md shadow-cyan-100 hover:border-cyan-500 transition-all duration-300"
            >
              <Image src="/arrowRight.svg" alt="Next" width={20} height={20} />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
