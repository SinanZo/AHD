import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// Accepts: id, children, bg (color/gradient/image), container ("xl"/"lg"/"md"), glass, animate
export default function SectionWrapper({
  id,
  children,
  bg = "",                   // e.g. "gradient" or "bg-[#002b3a]"
  container = "xl",          // "xl" | "lg" | "md" | false
  glass = false,             // glassmorphism background
  animate = true,
  className = "",
  style = {},
}) {
  // Optional backgrounds
  const backgrounds = {
    gradient: "bg-linear-to-br from-[#002b3a] via-[#375c6a] to-[#5b7d89]",
    glass: "backdrop-blur-md bg-white/30 shadow-xl",
  };

  const containerClass =
    container === "xl"
      ? "container mx-auto px-4 max-w-7xl"
      : container === "lg"
      ? "container mx-auto px-4 max-w-5xl"
      : container === "md"
      ? "container mx-auto px-4 max-w-3xl"
      : "";

  const sectionClass = clsx(
    "relative py-16 md:py-24",
    bg && backgrounds[bg],
    glass && backgrounds.glass,
    className
  );

  // Simple animation
  const Wrapper = animate ? motion.section : "section";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      id={id}
      className={sectionClass}
      style={style}
      {...motionProps}
    >
      <div className={containerClass}>{children}</div>
    </Wrapper>
  );
}
