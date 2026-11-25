// Based on Magic UI (MIT License - https://magicui.design)
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 2500 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    useEffect(() => {
      if (childrenArray.length <= 1) return;
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);

    const itemsToShow = useMemo(() => {
      if (childrenArray.length === 0) return [];
      const result = [];
      for (let i = 0; i < Math.min(childrenArray.length, 3); i++) {
        const itemIdx = (index - i + childrenArray.length) % childrenArray.length;
        result.push(childrenArray[itemIdx]);
      }
      return result;
    }, [index, childrenArray]);

    return (
      <div className={cn("flex flex-col items-center gap-2.5 overflow-hidden", className)}>
        <AnimatePresence initial={false}>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      layout
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}
