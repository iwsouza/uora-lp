/**
 * Funções financeiras base. Taxas em decimal (ex.: 1% → 0.01).
 * Períodos e taxas devem estar na mesma base (ex.: mês + taxa mensal).
 */

/** Prestação fixa (modelo Price), pagamento no fim do período. */
export function pmtPrice(ratePerPeriod: number, nPeriods: number, pv: number): number {
  const r = ratePerPeriod;
  const n = nPeriods;
  if (!Number.isFinite(pv) || !Number.isFinite(n) || n <= 0) return NaN;
  if (Math.abs(r) < 1e-15) return pv / n;
  const factor = (1 + r) ** n;
  return (pv * r * factor) / (factor - 1);
}

/** Valor futuro com aportes no fim de cada período (série uniforme). */
export function fvCompound(
  ratePerPeriod: number,
  nPeriods: number,
  pv: number,
  pmt: number,
): number {
  const r = ratePerPeriod;
  const n = nPeriods;
  if (Math.abs(r) < 1e-15) return pv + pmt * n;
  const growth = (1 + r) ** n;
  return pv * growth + pmt * ((growth - 1) / r);
}

/** Juros simples: FV = PV * (1 + r * n). */
export function fvSimple(rateTotalPerPeriod: number, nPeriods: number, pv: number): number {
  return pv * (1 + rateTotalPerPeriod * nPeriods);
}

/** Número de períodos (busca binária) para atingir fv alvo com PV e PMT no fim do período. */
/** Aporte periódico (fim do período) necessário para atingir `fvTarget` com taxa `r` em `n` períodos e PV inicial 0. */
export function pmtToReachFv(ratePerPeriod: number, nPeriods: number, fvTarget: number): number {
  const r = ratePerPeriod;
  const n = nPeriods;
  if (!Number.isFinite(fvTarget) || !Number.isFinite(n) || n <= 0) return NaN;
  if (Math.abs(r) < 1e-15) return fvTarget / n;
  const growth = (1 + r) ** n - 1;
  if (Math.abs(growth) < 1e-15) return NaN;
  return (fvTarget * r) / growth;
}

/** Valor presente de série uniforme no fim de cada período: PV = PMT × (1 − (1+r)^−n) / r. */
export function pvAnnuity(ratePerPeriod: number, nPeriods: number, pmt: number): number {
  const r = ratePerPeriod;
  const n = nPeriods;
  if (!Number.isFinite(pmt) || !Number.isFinite(n) || n <= 0) return NaN;
  if (Math.abs(r) < 1e-15) return pmt * n;
  return (pmt * (1 - (1 + r) ** (-n))) / r;
}

/** Saldo devedor após `k` pagamentos de `pmt` no modelo Price (taxa `r`, principal inicial `pv`). */
export function loanBalanceAfterPayments(
  ratePerPeriod: number,
  pv: number,
  pmt: number,
  paymentsMade: number,
): number {
  const r = ratePerPeriod;
  const k = paymentsMade;
  if (!Number.isFinite(pv) || !Number.isFinite(pmt) || k < 0) return NaN;
  if (Math.abs(r) < 1e-15) return pv - pmt * k;
  return pv * (1 + r) ** k - (pmt * ((1 + r) ** k - 1)) / r;
}

export function nperCompound(
  ratePerPeriod: number,
  pv: number,
  pmt: number,
  fvTarget: number,
  maxN = 1200,
): number {
  const r = ratePerPeriod;
  if (Math.abs(r) < 1e-15) {
    if (Math.abs(pmt) < 1e-15) return Infinity;
    return Math.ceil((fvTarget - pv) / pmt);
  }
  let lo = 0;
  let hi = maxN;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    const v = fvCompound(r, mid, pv, pmt);
    if (v < fvTarget) lo = mid;
    else hi = mid;
  }
  return hi;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function brl(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

export function pct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
}
