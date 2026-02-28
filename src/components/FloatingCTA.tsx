import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const FloatingCTA = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setVisible(v > 500);
  });

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2"
    >
      <Link
        to="/booking"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
      >
        Đặt lịch xăm
      </Link>
    </motion.div>
  );
};

export default FloatingCTA;