"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ---------------- StatusDot ---------------- */
export function DensStatusDot({
  tone = "success",
  className,
}: {
  tone?: "success" | "highlight" | "destructive" | "muted";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        tone === "success" && "bg-[#009267] dark:bg-[#24ab7e]",
        tone === "highlight" && "bg-[var(--highlight)]",
        tone === "destructive" && "bg-[var(--destructive)]",
        tone === "muted" && "bg-[var(--muted-foreground)]/50",
        className
      )}
    />
  );
}

/* ---------------- Badge ---------------- */
export function DensBadge({
  variant = "outline",
  className,
  children,
}: {
  variant?: "soft" | "highlight" | "outline" | "neutral";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        variant === "soft" && "bg-[var(--soft)] text-[var(--soft-foreground)]",
        variant === "highlight" && "bg-[var(--highlight)] text-[var(--highlight-foreground)]",
        variant === "outline" && "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]",
        variant === "neutral" && "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Button ---------------- */
export function DensButton({
  variant = "outline",
  size = "sm",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ink" | "brand" | "outline" | "ghost";
  size?: "sm" | "md" | "icon";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        size === "sm" && "h-8 px-3.5 text-xs",
        size === "md" && "h-9 px-4 text-xs",
        size === "icon" && "size-9",
        variant === "ink" && "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
        variant === "brand" && "bg-[var(--brand)] text-[var(--brand-foreground)] hover:opacity-90",
        variant === "outline" && "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]",
        variant === "ghost" && "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Kbd ---------------- */
export function DensKbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded-md border border-[var(--border)] bg-[var(--muted)] px-1.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]",
        className
      )}
    >
      {children}
    </kbd>
  );
}

/* ---------------- InputGroup ---------------- */
export function DensInputGroup({
  start,
  end,
  children,
  className,
}: {
  start?: React.ReactNode;
  end?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-2.5 h-9 gap-2 focus-within:ring-2 focus-within:ring-[var(--ring)]/40",
        className
      )}
    >
      {start && <span className="text-[var(--muted-foreground)] [&>svg]:size-3.5 shrink-0">{start}</span>}
      <div className="min-w-0 flex-1">{children}</div>
      {end && <span className="shrink-0">{end}</span>}
    </div>
  );
}

/* ---------------- SidebarRail ---------------- */
export function DensSidebarRail({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-[28px] bg-[var(--rail)] p-1.5 text-[var(--rail-foreground)] shadow-panel",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function DensSidebarRailItem({
  label,
  active,
  dot,
  onClick,
  className,
  children,
}: {
  label: string;
  active?: boolean;
  dot?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={cn(
              "relative grid size-11 place-content-center rounded-full text-[var(--rail-foreground)]/70 transition-colors hover:bg-white/10 hover:text-[var(--rail-foreground)] [&>svg]:size-[18px] cursor-pointer",
              active && "bg-white/15 text-[var(--rail-foreground)]",
              className
            )}
          >
            {children}
            {dot && (
              <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[var(--highlight)] ring-2 ring-[var(--rail)]" />
            )}
          </button>
        }
      />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

/* ---------------- SidebarMeter (24h activity pill) ---------------- */
export function DensSidebarMeter({
  label,
  total,
  levels,
}: {
  label: string;
  total: number | string;
  levels: number[];
}) {
  const max = Math.max(...levels, 1);
  return (
    <div className="flex flex-col items-center gap-2 rounded-[28px] bg-[var(--card)] px-2 py-3 text-center ring-1 ring-[var(--border)] shadow-panel">
      <span className="font-mono text-[10px] font-medium text-[var(--muted-foreground)] uppercase">
        {label}
      </span>
      <div className="flex h-24 w-4 flex-col-reverse justify-between gap-[2px]" aria-hidden>
        {levels.slice(-16).map((v, i) => {
          const ratio = v / max;
          return (
            <span
              key={i}
              className="block h-[3px] w-full rounded-full transition-colors"
              style={{
                backgroundColor:
                  ratio > 0.7
                    ? "var(--highlight)"
                    : ratio > 0.3
                    ? "var(--brand)"
                    : "var(--muted)",
              }}
            />
          );
        })}
      </div>
      <span className="font-mono text-[11px] font-semibold tabular-nums">{total}</span>
    </div>
  );
}

/* ---------------- DensSidebar ---------------- */
export function DensSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-[28px] bg-[var(--sidebar)] p-3.5 text-[var(--sidebar-foreground)] ring-1 ring-[var(--sidebar-border)] shadow-panel",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function DensSidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex items-center gap-3 px-1", className)}>{children}</div>;
}

export function DensSidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-2.5 pb-1 text-[11px] font-medium text-[var(--muted-foreground)]">
        {label}
      </div>
      {children}
    </div>
  );
}

export function DensSidebarItem({
  icon,
  badge,
  active,
  onClick,
  children,
}: {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition-colors cursor-pointer",
        active
          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] shadow-sm ring-1 ring-[var(--border)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/70 hover:text-[var(--foreground)]"
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
}

export function DensSidebarCount({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "highlight" | "brand";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums",
        tone === "neutral" && "bg-[var(--muted)] text-[var(--muted-foreground)]",
        tone === "highlight" && "bg-[var(--highlight)] text-[var(--highlight-foreground)]",
        tone === "brand" && "bg-[var(--soft)] text-[var(--soft-foreground)]"
      )}
    >
      {children}
    </span>
  );
}

export function DensSidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-auto pt-2 border-t border-[var(--sidebar-border)]", className)}>
      {children}
    </div>
  );
}

/* ---------------- RunStrip ---------------- */
export function DensRunStrip({ strip }: { strip: string }) {
  return (
    <div className="flex h-5 items-stretch gap-[2px]" aria-hidden>
      {strip.split("").map((c, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-[1px]",
            c === "p" && "bg-[var(--foreground)]/55",
            c === "s" && "bg-[var(--highlight)]",
            c === "f" && "bg-[var(--destructive)]",
            c === "b" && "bg-[var(--brand)]",
            c === "n" && "border border-dashed border-[var(--muted-foreground)]/50"
          )}
        />
      ))}
    </div>
  );
}
