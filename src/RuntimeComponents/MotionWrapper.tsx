import { motion} from "framer-motion";
import type { MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "left" | "right" | "bottom" | "top" | "fade";
} & MotionProps;

export default function MotionWrapper({
  children,
  className,
  delay = 0,
  from = "bottom",
  ...props
}: MotionWrapperProps) {
  const variants = {
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    bottom: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    top: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  };

  return (
    <motion.div
      initial={variants[from].initial}
      animate={variants[from].animate}
      transition={{ duration: 0.4, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
