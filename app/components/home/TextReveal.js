/** Homepage text animation with identical SSR/client markup, including reduced-motion users. */
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export function TextReveal({ text, className = "", delay = 0, as = "div", style = {} }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Split into words for animation
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0, staggerChildren: 0, delayChildren: 0 } : { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: shouldReduceMotion ? { duration: 0 } : {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Keep the heading tag and word spans identical during hydration; disable motion via variants.
  const Component = motion[as] || motion.div;

  return (
    <Component
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}
