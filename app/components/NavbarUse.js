"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavBar from '@/app/components/Navbar';

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
      clearTimeout(hideTimer.current);
      if (window.scrollY > 100) {
        hideTimer.current = setTimeout(() => setVisible(false), 1000);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="navbar-wrapper"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="flex items-center justify-center fixed top-4 left-0 right-0 z-50 px-6"
        >
          <BottomNavBar onBookCall={() => {
            const el = document.getElementById('book-a-call');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
