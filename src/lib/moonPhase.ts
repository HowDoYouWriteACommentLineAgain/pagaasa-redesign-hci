/** Mean synodic month (days) */
export const SYNODIC_DAYS = 29.53058867;
const SYNODIC_MS = SYNODIC_DAYS * 86400000;

/** Anchor instant (UTC) for repeating lunar cycle — not almanac-exact */
export const REF_NEW_MOON_UTC_MS = Date.UTC(2020, 0, 24, 21, 42, 0);

/** Geometric illuminated fraction 0–100 from age a in [0,1), a=0 new, 0.5 full */
export function illuminationPercent(age: number): number {
  const u = ((age % 1) + 1) % 1;
  return ((1 - Math.cos(2 * Math.PI * u)) / 2) * 100;
}

export function waxing(age: number): boolean {
  const u = ((age % 1) + 1) % 1;
  return u < 0.5;
}

export function phaseName(age: number): string {
  const u = ((age % 1) + 1) % 1;
  const x = u * 8;
  const names = [
    "New",
    "Waxing crescent",
    "First quarter",
    "Waxing gibbous",
    "Full",
    "Waning gibbous",
    "Last quarter",
    "Waning crescent",
  ];
  return names[Math.min(7, Math.floor(x))]!;
}

/**
 * Age in [0,1) of synodic cycle at instant `t` (ms UTC).
 * 0 = new, 0.5 = full.
 */
export function synodicAgeAtTime(t: number): number {
  let u = (t - REF_NEW_MOON_UTC_MS) / SYNODIC_MS;
  u = u - Math.floor(u);
  if (u < 0) u += 1;
  return u;
}

/** Local calendar day at 12:00 local — stable phase label for that date */
export function synodicAgeAtLocalNoon(d: Date): number {
  const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  return synodicAgeAtTime(noon.getTime());
}

/** Calendar day when local noon sits near exact full (age ≈ 0.5) */
export function isTrueFullMoonDay(d: Date): boolean {
  const a = synodicAgeAtLocalNoon(d);
  return Math.abs(a - 0.5) < 0.042;
}

/** New-moon day at local noon (age near 0) */
export function isNewMoonDay(d: Date): boolean {
  const a = synodicAgeAtLocalNoon(d);
  return a < 0.035 || a > 0.965;
}

/**
 * Thin-crescent evenings after new: elongation proxy via age + illum.
 * prime = best few evenings; possible = still thin.
 */
export function crescentSighting(
  age: number,
  illum: number,
): "—" | "possible" | "prime" {
  const u = ((age % 1) + 1) % 1;
  if (u > 0.5) return "—";
  if (u < 0.008 || illum > 22) return "—";
  if (u <= 0.055 && illum >= 1.5 && illum <= 18) return "prime";
  if (u <= 0.1 && illum < 22) return "possible";
  return "—";
}

/**
 * Illustrative peak altitude (°) near upper culmination for ~Manila latitude.
 * Not ephemeris-grade — encodes cycle + weak seasonal swing for table dynamics.
 */
export function estPeakAltitudeDeg(age: number, dayOfYear: number, latDeg = 14.6): number {
  const u = ((age % 1) + 1) % 1;
  const cycle = 34 * Math.sin(2 * Math.PI * (u - 0.22));
  const season = 9 * Math.sin((2 * Math.PI * (dayOfYear - 100)) / 365.25);
  const base = 90 - Math.abs(latDeg) + 18;
  let h = base + cycle * 0.45 + season;
  h = Math.round(h);
  return Math.max(22, Math.min(88, h));
}

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function enumerateNewMoonsUtc(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  const t0 = from.getTime();
  const t1 = to.getTime();
  if (!(Number.isFinite(t0) && Number.isFinite(t1)) || t1 < t0) return out;
  let t = REF_NEW_MOON_UTC_MS;
  let g = 0;
  while (t < t0 && g < 5000) {
    t += SYNODIC_MS;
    g++;
  }
  g = 0;
  while (t <= t1 && g < 5000) {
    out.push(new Date(t));
    t += SYNODIC_MS;
    g++;
  }
  return out;
}
