"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ProfileCard from "@/app/components/Team";
import MyBook from "@/app/components/MyBook";

const Team2 = [
  { name: "Adan", role: "CEO", image: "Adan.png" },
  { name: "Joshua", role: "Co-Founder", image: "Joshua.png" },
  { name: "Tuaha", role: "Director of Marketplace", image: "Tuaha.png" },
  { name: "M.Yousaf", role: "Head Of Web Operations", image: "Yousaf.png" }
];

export default function About() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="about" className="bg-[radial-gradient(circle_341px_at_10%_20%,#845ef4_0%,#c4f3fb_90%)] text-gray-900 w-full flex flex-col items-center justify-center gap-12 md:gap-20 py-16 px-4 sm:px-6">
      <motion.div 
        className="max-w-7xl mx-auto w-full"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Story Section */}
        <motion.div className="text-center mb-10" variants={contentVariants}>
          <motion.span 
            className="inline-block text-xs md:text-sm font-extrabold tracking-widest text-cyan-600 uppercase px-4 md:px-6 py-2 border-3 border-cyan-200 rounded-full mb-4 md:mb-6 bg-cyan-50"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
          >
            Our Story
          </motion.span>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold underline decoration-4 text-gray-900 mb-4 md:mb-6 px-2"
            variants={titleVariants}
          >
            Where it all Began
          </motion.h2>
          
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            A journey dedicated to solving the biggest challenge for Amazon sellers.
          </motion.p>
        </motion.div>

        {/* Book */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
        >
          <MyBook />
        </motion.div>

        {/* Team Section */}
        <motion.div className="text-center mt-8 mb-10" variants={contentVariants}>
          <motion.span 
            className="inline-block text-xs md:text-sm font-extrabold tracking-widest text-cyan-600 uppercase px-4 md:px-6 py-2 border-3 border-cyan-200 rounded-full mb-4 md:mb-6 bg-cyan-50"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            viewport={{ once: true }}
          >
            The Team
          </motion.span>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 px-2"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Behind <motion.span 
              className="relative inline-block underline decoration-4"
              initial={{ opacity: 0, rotate: 90 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
            >Ascendrix</motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            The people who treat your brand like it's their own.
          </motion.p>
        </motion.div>

        {/* Team Cards Grid */}
        <motion.div 
          className="team-cards-grid flex gap-8 md:gap-12 items-center justify-center flex-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {Team2.map((member, index) => {
            const isCenter = index === 1;

            return (
              <motion.div
                key={index}
                className={isCenter ? 'team-card-featured' : 'team-card-side'}
                variants={{
                  hidden: { opacity: 0, y: 100, rotate: -20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: {
                      duration: 0.7,
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <ProfileCard
                  name={member.name}
                  title={member.role}
                  handle="javicodes"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl={member.image}
                  showUserInfo={false}
                  enableTilt={true}
                  enableMobileTilt={true}
                  onContactClick={() => console.log('Contact clicked')}
                  behindGlowColor="rgba(6, 182, 212, 0.4)"
                  iconUrl="/Logo.png"
                  behindGlowEnabled
                  innerGradient="linear-gradient(145deg,rgba(240,249,255,0.95) 0%,rgba(186,230,255,0.4) 100%)"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
