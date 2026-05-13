import type { ReactNode } from "react";
import Link from "next/link";
import { Shell } from "@/components/ui/Shell";
import { Footer } from "@/components/layout/Footer";

type BlogLayoutProps = {
  children: ReactNode;
  backHref: string;
  backLabel: string;
};

function BlogSiteHeader({ backHref, backLabel }: Pick<BlogLayoutProps, "backHref" | "backLabel">) {
  return (
    <header className="sticky top-4 z-50">
      <Shell className="rounded-xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-tight text-white transition hover:text-white/90"
            >
              Uora
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <Link
              href="/blog"
              className="hidden text-sm text-white/50 transition hover:text-white/80 sm:inline"
            >
              Blog
            </Link>
          </div>
          <Link
            href={backHref}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/[0.06] sm:px-5"
          >
            {backLabel}
          </Link>
        </div>
      </Shell>
    </header>
  );
}

export function BlogLayout({ children, backHref, backLabel }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
        <div className="absolute right-0 top-[28%] h-[340px] w-[340px] rounded-full bg-white/[0.03] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1100px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <BlogSiteHeader backHref={backHref} backLabel={backLabel} />
        <div className="mt-10 sm:mt-12">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
