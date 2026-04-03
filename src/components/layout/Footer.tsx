"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1b1512] text-white">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl mb-4 block">Uora</span>
            <p className="text-sm text-primary-foreground/50 leading-relaxed">
              Seu assistente de IA para finanças pessoais. Converse com o seu
              dinheiro.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/30 mb-4">
              Produto
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Funcionalidades", href: "#funcionalidades" },
                { label: "Dashboard", href: "#como-funciona" },
                { label: "Open Finance", href: "#funcionalidades" },
                { label: "Planos", href: "#planos" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/30 mb-4">
              Empresa
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Calculadora", href: "/calculadora" },
                { label: "Sobre", href: "#" },
                { label: "Contato", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") && l.href !== "#" ? (
                    <Link
                      href={l.href}
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/30 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {["Termos de Uso", "Privacidade", "LGPD", "Segurança"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-xs text-primary-foreground/30 text-center">
          <p>
            © 2026 Uora Tecnologia Financeira. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
