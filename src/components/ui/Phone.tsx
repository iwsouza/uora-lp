type PhoneVariant = "dashboard" | "entry" | "insight";

type PhoneProps = {
  variant?: PhoneVariant;
};

export function Phone({ variant = "dashboard" }: PhoneProps) {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[360px]">
      <div className="absolute inset-0 scale-[1.06] rounded-[44px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.18),rgba(255,255,255,0)_55%)] blur-2xl" />
      <div className="relative rounded-[42px] border border-white/10 bg-[#0a0a0a] p-[10px] shadow-[0_24px_100px_rgba(0,0,0,.7)]">
        <div className="absolute left-1/2 top-[10px] z-20 h-[26px] w-[110px] -translate-x-1/2 rounded-b-[18px] bg-black" />
        <div className="overflow-hidden rounded-[34px] border border-white/8 bg-[#111111]">
          <div className="h-[650px] bg-[linear-gradient(180deg,#151515_0%,#0e0e0e_100%)] p-4 text-white">
            {variant === "dashboard" && (
              <>
                <div className="flex items-center justify-between pt-7">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                      Painel
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      R$ 8.420
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/55">
                    Abril
                  </div>
                </div>

                <div className="mt-6 rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                    Fluxo do mês
                  </div>
                  <div className="mt-4 flex h-28 items-end gap-2">
                    {[34, 58, 44, 72, 60, 90, 68].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-white/80"
                        style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.5 }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                      Assinaturas
                    </div>
                    <div className="mt-2 text-2xl font-semibold">6</div>
                    <div className="mt-2 text-xs text-white/45">
                      2 podem ser cortadas
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                      Desvios
                    </div>
                    <div className="mt-2 text-2xl font-semibold">3</div>
                    <div className="mt-2 text-xs text-white/45">
                      acima do padrão
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium">Últimos gastos</div>
                    <div className="text-xs text-white/35">Hoje</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Mercado", "R$ 132,40"],
                      ["Streaming", "R$ 39,90"],
                      ["Transporte", "R$ 28,00"],
                    ].map(([name, value]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-[18px] border border-white/7 bg-black/20 px-3 py-3"
                      >
                        <div>
                          <div className="text-sm font-medium">{name}</div>
                          <div className="text-xs text-white/35">
                            Categoria automática
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {variant === "entry" && (
              <>
                <div className="pt-7">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                    Nova despesa
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Salve como quiser
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.05] px-4 py-4 text-sm">
                    Escrever no chat
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.05] px-4 py-4 text-sm">
                    Enviar áudio
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.05] px-4 py-4 text-sm">
                    + Lançar manualmente
                  </div>
                </div>
                <div className="mt-6 rounded-[26px] border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                    Processamento
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Categoria detectada: Alimentação",
                      "Forma de pagamento: Crédito",
                      "Recorrência: não identificada",
                    ].map((x) => (
                      <div
                        key={x}
                        className="rounded-[18px] bg-black/20 px-3 py-3 text-sm text-white/75"
                      >
                        {x}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {variant === "insight" && (
              <>
                <div className="pt-7">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                    Alerta
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Você está perdendo dinheiro
                  </div>
                </div>
                <div className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.04] p-5">
                  <div className="text-sm text-white/45">Nesta semana</div>
                  <div className="mt-3 text-3xl font-semibold">+28%</div>
                  <div className="mt-1 text-sm text-white/55">
                    em delivery comparado à média
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    "2 assinaturas com baixa utilização",
                    "1 gasto recorrente acima do normal",
                    "economia potencial de R$ 184/mês",
                  ].map((x) => (
                    <div
                      key={x}
                      className="rounded-[22px] border border-white/8 bg-white/[0.05] px-4 py-4 text-sm text-white/78"
                    >
                      {x}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
