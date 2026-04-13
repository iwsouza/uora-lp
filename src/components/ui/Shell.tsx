import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShellProps = {
  children: ReactNode;
  className?: string;
};

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-[24px]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))",
      }}
    >
      {children}
    </div>
  );
}
