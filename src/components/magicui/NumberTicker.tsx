// Based on Magic UI (MIT License - https://magicui.design)
import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(direction === "down" ? value : 0);
  const startTimestampRef = useRef<number | null>(null);
  const prevValueRef = useRef<number>(direction === "down" ? value : 0);

  useEffect(() => {
    let animationFrameId: number;
    const startVal = prevValueRef.current;
    const targetVal = value;
    const duration = 800; // ms

    const timeout = setTimeout(() => {
      startTimestampRef.current = null;

      const step = (timestamp: number) => {
        if (!startTimestampRef.current) startTimestampRef.current = timestamp;
        const elapsed = timestamp - startTimestampRef.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const current = startVal + (targetVal - startVal) * easeOut;

        setDisplayValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(targetVal);
          prevValueRef.current = targetVal;
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, delay]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return (
    <span className={cn("inline-block tabular-nums tracking-normal", className)}>
      {formatted}
    </span>
  );
}
