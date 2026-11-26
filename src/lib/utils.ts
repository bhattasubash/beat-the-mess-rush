import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(isoOrText: string): string {
  const parsed = Date.parse(isoOrText);
  if (Number.isNaN(parsed)) {
    return isoOrText;
  }
  const diffSec = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (diffSec < 45) return "Updated just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `Updated ${diffHr} hr ago`;
  return `Updated ${Math.floor(diffHr / 24)}d ago`;
}

export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(start24: string, end24: string): string {
  const [sh] = start24.split(":").map(Number);
  const [eh] = end24.split(":").map(Number);
  const startFormatted = formatTime12h(start24);
  const endFormatted = formatTime12h(end24);
  if (!Number.isNaN(sh) && !Number.isNaN(eh) && (sh >= 12) === (eh >= 12)) {
    return `${startFormatted.replace(/ (AM|PM)$/, "")} – ${endFormatted}`;
  }
  return `${startFormatted} – ${endFormatted}`;
}
