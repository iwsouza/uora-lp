import { landingCopy } from "@/data/landingCopy";
import { Shell } from "@/components/ui/Shell";

export function Header() {
  const t = landingCopy;

  return (
    <header className="sticky top-4 z-50">
      <Shell className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-white">
                Uora
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/58 md:flex">
            <a href="#features" className="transition hover:text-white">
              {t.navFeatures}
            </a>
            <a href="#how" className="transition hover:text-white">
              {t.navHow}
            </a>
            <a href="#pricing" className="transition hover:text-white">
              {t.navPlans}
            </a>
          </nav>

          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.02] sm:px-5"
          >
            {t.heroCta}
          </button>
        </div>
      </Shell>
    </header>
  );
}
