import type { CalcInputSpec, CalcOutput, CalcResult } from "./types";

export function validateInputs(
  raw: Record<string, number>,
  specs: CalcInputSpec[],
): { ok: true; values: Record<string, number> } | { ok: false; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const values: Record<string, number> = {};

  for (const s of specs) {
    const v = raw[s.key];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      fieldErrors[s.key] = "Número inválido";
      continue;
    }
    if (v < s.min || v > s.max) {
      fieldErrors[s.key] = `Use entre ${s.min} e ${s.max}`;
      continue;
    }
    values[s.key] = v;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  return { ok: true, values };
}

export function wrapCompute(
  specs: CalcInputSpec[],
  fn: (v: Record<string, number>) => CalcOutput,
): (raw: Record<string, number>) => CalcResult {
  return (raw) => {
    const v = validateInputs(raw, specs);
    if (!v.ok) return v;
    return { ok: true, output: fn(v.values) };
  };
}
