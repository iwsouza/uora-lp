import { landingCopy } from "@/data/landingCopy";
import { Shell } from "@/components/ui/Shell";

export function FinalCTA() {
  const t = landingCopy;

  return (
    <section className="pt-24 sm:pt-32">
      <Shell className="overflow-hidden p-7 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              {t.finalTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
              {t.finalText}
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              {t.finalCta}
            </button>
          </div>
        </div>
      </Shell>
    </section>
  );
}
