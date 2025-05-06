import { Variants } from "motion/react";

export const topVariants: Variants = {
  open: { height: "60%" },
  hover: { height: "58.333%" }, // 7/12 ≈ 58.333%
  closed: { height: "0%" },
};

export const bottomVariants: Variants = {
  closed: { height: "0%" },
  open: { height: "50%" },
};

// Use custom for dynamic duration
export const senhaLabelVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 1,
    fontSize: "3.75rem",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  open: (custom: number) => ({
    y: 0,
    opacity: 1,
    fontSize: "3.75rem",
    transition: { duration: custom, ease: "anticipate" },
  }),
  outOfFocus: {
    y: 0,
    opacity: 1,
    fontSize: "2.5rem",
    transition: { duration: 0.1, delay: 0 },
  },
};
