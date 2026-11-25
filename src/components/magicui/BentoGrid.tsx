// Based on Magic UI (MIT License - https://magicui.design)
import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[16rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  children,
  onClick,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  href?: string;
  cta?: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      key={name}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",
        "p-5 transition-all duration-300 hover:shadow-md dark:hover:border-slate-700",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Background visual element */}
      {background && (
        <div className="absolute inset-0 pointer-events-none -z-0 opacity-80 transition-transform duration-300 group-hover:scale-105">
          {background}
        </div>
      )}

      {/* Card Header & Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            {Icon && (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit">
                <Icon className="size-5" />
              </div>
            )}
            {cta && (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                {cta} →
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Dynamic child content */}
        {children && <div className="mt-3 relative z-10">{children}</div>}
      </div>
    </div>
  );
}
