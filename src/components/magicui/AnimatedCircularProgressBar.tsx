// Based on Magic UI (MIT License - https://magicui.design)
import { cn } from "@/src/lib/utils";

interface AnimatedCircularProgressBarProps {
  max?: number;
  min?: number;
  value: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
  children,
}: AnimatedCircularProgressBarProps) {
  const circumfrence = 2 * Math.PI * 45;
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentPx = circumfrence / (max - min);
  const strokeDashoffset = circumfrence - (clampedValue - min) * percentPx;

  return (
    <div
      className={cn("relative size-36 text-2xl font-semibold", className)}
      style={
        {
          "--circle-size": "100px",
          "--circumference": circumfrence,
          "--percent-to-px": `${percentPx}px`,
          "--gap-percent": "5",
          "--offset-factor": "0",
          "--transition-length": "1s",
          "--transition-step": "200ms",
          "--delay": "0s",
          "--percent-to-deg": "3.6deg",
          transform: "translateZ(0)",
        } as React.CSSProperties
      }
    >
      <svg
        fill="none"
        className="size-full -rotate-90 stroke-current"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          strokeDashoffset="0"
          strokeLinecap="round"
          stroke={gaugeSecondaryColor}
          className="opacity-30 dark:opacity-20"
        />
        {/* Gauge progress */}
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          strokeDasharray={circumfrence}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={gaugePrimaryColor}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
