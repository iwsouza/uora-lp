import { landingCopy } from "@/data/landingCopy";

export function Footer() {
  const t = landingCopy;

  return (
    <footer className="mt-24 border-t border-white/8 pt-10 text-white/44">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-white">Uora</div>
          <p className="mt-3 text-sm leading-6 text-white/46">{t.footerText}</p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold text-white">Produto</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="transition hover:text-white/70">
                {t.navFeatures}
              </a>
            </li>
            <li>
              <a href="#how" className="transition hover:text-white/70">
                {t.navHow}
              </a>
            </li>
            <li>
              <a href="#pricing" className="transition hover:text-white/70">
                {t.navPlans}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold text-white">Legal</div>
          <ul className="space-y-2 text-sm">
            <li>Termos de uso</li>
            <li>Privacidade</li>
            <li>Segurança</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold text-white">Contato</div>
          <ul className="space-y-2 text-sm">
            <li>contato@uora.com</li>
            <li>Instagram</li>
            <li>WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/32 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Uora. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}
