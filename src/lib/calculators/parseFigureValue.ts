/**
 * Extrai número para gráficos a partir de strings formatadas (pt-BR), ex.: "R$ 1.234,56", "12,5%".
 */
export function parseFigureValue(s: string): number | null {
  const t = s.trim().replace(/\u00a0/g, " ");
  if (!t) return null;

  if (/%/.test(t)) {
    const n = Number(t.replace(/[^\d,.-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  let u = t.replace(/R\$\s?/gi, "").trim();
  const lastComma = u.lastIndexOf(",");
  const lastDot = u.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      u = u.replace(/\./g, "").replace(",", ".");
    } else {
      u = u.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    u = u.replace(/\./g, "").replace(",", ".");
  } else {
    const dotCount = (u.match(/\./g) || []).length;
    if (dotCount > 1) {
      u = u.replace(/\./g, "");
    }
  }

  u = u.replace(/[^\d.-]/g, "");
  const n = parseFloat(u);
  return Number.isFinite(n) ? n : null;
}
