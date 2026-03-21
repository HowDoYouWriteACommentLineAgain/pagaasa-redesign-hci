import { useId, useMemo, useState, type ReactNode } from "react";
import {
  SYNODIC_DAYS,
  crescentSighting,
  dayOfYear,
  enumerateNewMoonsUtc,
  estPeakAltitudeDeg,
  illuminationPercent,
  isNewMoonDay,
  isTrueFullMoonDay,
  phaseName,
  synodicAgeAtLocalNoon,
  waxing,
} from "../lib/moonPhase";

const SYNODIC_MS = SYNODIC_DAYS * 86400000;

type EventKind = "new" | "full" | "season" | "eclipse" | "meteor" | "conjunction";

type SkyEvent = { at: Date; kind: EventKind; title: string; note: string };

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

const ECLIPSES: { y: number; m: number; d: number; title: string; note: string }[] = [
  { y: 2025, m: 2, d: 14, title: "Total lunar eclipse", note: "Totality where visible." },
  { y: 2025, m: 8, d: 7, title: "Total lunar eclipse", note: "Second lunar eclipse of the year." },
  { y: 2026, m: 1, d: 17, title: "Annular solar eclipse", note: "Certified solar filters only." },
  { y: 2026, m: 2, d: 3, title: "Total lunar eclipse", note: "Umbra passage." },
  { y: 2026, m: 7, d: 28, title: "Partial lunar eclipse", note: "Partial umbra." },
  { y: 2027, m: 1, d: 6, title: "Annular solar eclipse", note: "Ring phase on path." },
];

const METEORS: { m: number; d: number; title: string; note: string }[] = [
  { m: 0, d: 3, title: "Quadrantids peak", note: "Sharp peak; dark sky." },
  { m: 3, d: 22, title: "Lyrids peak", note: "Moderate rates." },
  { m: 4, d: 6, title: "Eta Aquariids peak", note: "Pre-dawn Halley debris." },
  { m: 7, d: 12, title: "Perseids peak", note: "Often strongest summer shower." },
  { m: 9, d: 21, title: "Orionids peak", note: "Halley-related." },
  { m: 10, d: 17, title: "Leonids peak", note: "Variable year to year." },
  { m: 11, d: 14, title: "Geminids peak", note: "Usually rich shower." },
];

const SEASONS: { m: number; d: number; title: string; note: string }[] = [
  { m: 2, d: 20, title: "March equinox", note: "Sun northbound across celestial equator." },
  { m: 5, d: 21, title: "June solstice", note: "Northern summer solstice." },
  { m: 8, d: 22, title: "September equinox", note: "Sun southbound across equator." },
  { m: 11, d: 21, title: "December solstice", note: "Northern winter solstice." },
];

const CONJUNCTIONS: { y: number; m: number; d: number; title: string; note: string }[] = [
  { y: 2025, m: 1, d: 28, title: "Moon near Jupiter", note: "Evening; binoculars." },
  { y: 2025, m: 5, d: 5, title: "Moon–Saturn appulse", note: "Morning sky." },
  { y: 2026, m: 2, d: 20, title: "Moon–Venus", note: "Western dusk." },
  { y: 2026, m: 7, d: 16, title: "Moon–Mars appulse", note: "Check ephemeris." },
  { y: 2027, m: 0, d: 19, title: "Moon near Saturn", note: "Predawn." },
];

function climateBandsYear(y: number) {
  return [
    { start: new Date(y, 0, 1), end: new Date(y, 2, 15), label: "Amihan", hi: true },
    {
      start: new Date(y, 2, 15),
      end: new Date(y, 4, 31, 23, 59, 59, 999),
      label: "Hot dry",
      hi: false,
    },
    {
      start: new Date(y, 5, 1),
      end: new Date(y, 9, 15, 23, 59, 59, 999),
      label: "Habagat",
      hi: true,
    },
    {
      start: new Date(y, 9, 15),
      end: new Date(y, 11, 31, 23, 59, 59, 999),
      label: "Amihan",
      hi: true,
    },
  ];
}

function typhoonClimatologyYear(y: number) {
  return {
    start: new Date(y, 7, 1),
    end: new Date(y, 9, 31, 23, 59, 59, 999),
  };
}

function overlaps(a0: Date, a1: Date, b0: Date, b1: Date): boolean {
  return a0.getTime() <= b1.getTime() && a1.getTime() >= b0.getTime();
}

function buildSkyEvents(year: number): SkyEvent[] {
  const from = new Date(year, 0, 1, 0, 0, 0, 0);
  const to = new Date(year, 11, 31, 23, 59, 59, 999);
  const list: SkyEvent[] = [];

  for (const nm of enumerateNewMoonsUtc(from, to)) {
    list.push({ at: nm, kind: "new", title: "New moon (model)", note: "UTC instant from synodic cycle." });
    const fm = new Date(nm.getTime() + SYNODIC_MS / 2);
    if (fm.getTime() <= to.getTime()) {
      list.push({
        at: fm,
        kind: "full",
        title: "Full moon (model)",
        note: "Half synodic month after new in this model.",
      });
    }
  }
  for (const s of SEASONS) {
    list.push({
      at: new Date(year, s.m, s.d, 12, 0, 0, 0),
      kind: "season",
      title: s.title,
      note: s.note,
    });
  }
  for (const e of ECLIPSES.filter((e) => e.y === year)) {
    list.push({
      at: new Date(year, e.m, e.d, 12, 0, 0, 0),
      kind: "eclipse",
      title: e.title,
      note: e.note,
    });
  }
  for (const m of METEORS) {
    list.push({
      at: new Date(year, m.m, m.d, 12, 0, 0, 0),
      kind: "meteor",
      title: m.title,
      note: m.note,
    });
  }
  for (const c of CONJUNCTIONS.filter((c) => c.y === year)) {
    list.push({
      at: new Date(year, c.m, c.d, 12, 0, 0, 0),
      kind: "conjunction",
      title: c.title,
      note: c.note,
    });
  }
  list.sort((a, b) => a.at.getTime() - b.at.getTime());
  return list;
}

function kindLabel(k: EventKind) {
  return (
    { new: "Moon", full: "Moon", season: "Season", eclipse: "Eclipse", meteor: "Meteor", conjunction: "Conj." }[
      k
    ] ?? k
  );
}

function MoonGlyph({ illum, waxing: wx, size = 26 }: { illum: number; waxing: boolean; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const r = size / 2 - 1.5;
  const cx = size / 2;
  const cy = size / 2;
  const frac = Math.min(1, Math.max(0, illum / 100));
  const litW = 2 * r * frac;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <defs>
        <clipPath id={`mg-${uid}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#mg-${uid})`}>
        <circle cx={cx} cy={cy} r={r} fill="#0f172a" />
        {wx ? (
          <rect x={cx + r - litW} y={cy - r} width={litW} height={2 * r} fill="#fbbf24" />
        ) : (
          <rect x={cx - r} y={cy - r} width={litW} height={2 * r} fill="#fbbf24" />
        )}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.75} />
    </svg>
  );
}

function IllumBar({ pct }: { pct: number }) {
  const p = Math.min(100, Math.max(0, pct));
  return (
    <div className="flex items-center gap-2 min-w-[5.5rem]">
      <div className="h-2 flex-1 max-w-[4.5rem] rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-900/80 to-amber-200"
          style={{ width: `${p}%` }}
        />
      </div>
      <span className="tabular-nums text-white/70 w-9 text-right">{p.toFixed(0)}%</span>
    </div>
  );
}

const W_STRIP = 880;
const STRIP_PAD = { l: 112, r: 14, t: 2, b: 20 };

const STRIP_STROKE: Record<EventKind, string> = {
  new: "rgba(196,181,253,0.95)",
  full: "rgba(226,232,240,0.9)",
  season: "rgba(74,222,128,0.9)",
  eclipse: "rgba(248,113,113,0.95)",
  meteor: "rgba(34,211,238,0.9)",
  conjunction: "rgba(232,121,249,0.9)",
};

function xInYear(t: number, year: number, left: number, width: number): number {
  const t0 = new Date(year, 0, 1).getTime();
  const t1 = new Date(year + 1, 0, 1).getTime();
  if (t1 <= t0) return left;
  const u = (t - t0) / (t1 - t0);
  return left + Math.min(1, Math.max(0, u)) * width;
}

function MonthAxisStrip({
  year,
  left,
  plotW,
  y,
}: {
  year: number;
  left: number;
  plotW: number;
  y: number;
}) {
  return (
    <>
      {MONTH_SHORT.map((name, m) => {
        const x0 = xInYear(new Date(year, m, 1).getTime(), year, left, plotW);
        const x1 =
          m < 11
            ? xInYear(new Date(year, m + 1, 1).getTime(), year, left, plotW)
            : left + plotW;
        const xc = (x0 + x1) / 2;
        return (
          <text key={name} x={xc} y={y} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>
            {name}
          </text>
        );
      })}
    </>
  );
}

function EventStrip({
  title,
  hint,
  year,
  plotH,
  todayX,
  children,
}: {
  title: string;
  hint: string;
  year: number;
  plotH: number;
  todayX: number | null;
  children: (x: (d: Date) => number, plotW: number, left: number) => ReactNode;
}) {
  const plotW = W_STRIP - STRIP_PAD.l - STRIP_PAD.r;
  const H = STRIP_PAD.t + plotH + STRIP_PAD.b;
  const x = (d: Date) => xInYear(d.getTime(), year, STRIP_PAD.l, plotW);
  return (
    <div className="border border-white/10 rounded-lg bg-white/[0.02] overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[11px] font-semibold text-white/85">{title}</span>
        <span className="text-[10px] text-white/40 max-w-md text-right">{hint}</span>
      </div>
      <svg viewBox={`0 0 ${W_STRIP} ${H}`} className="w-full h-auto block" role="img" aria-label={title}>
        <text
          x={8}
          y={STRIP_PAD.t + plotH / 2 + 4}
          fill="rgba(255,255,255,0.4)"
          fontSize={9}
          fontWeight={600}
        >
          {year}
        </text>
        {children(x, plotW, STRIP_PAD.l)}
        {todayX != null && (
          <line
            x1={todayX}
            y1={STRIP_PAD.t}
            x2={todayX}
            y2={STRIP_PAD.t + plotH}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            strokeDasharray="5 4"
          >
            <title>Today</title>
          </line>
        )}
        <MonthAxisStrip year={year} left={STRIP_PAD.l} plotW={plotW} y={H - 6} />
      </svg>
    </div>
  );
}

const tableWrap = "w-full text-left text-[11px] border-collapse";
const th = "p-2.5 bg-white/[0.06] text-white/55 font-semibold border-b border-white/10 align-bottom";
const td = "p-2 border-b border-white/[0.06] text-white/80 align-middle";
const sectionHead = "px-3 py-2.5 bg-violet-950/40 text-white/90 text-xs font-bold tracking-wide border-b border-white/10";

export default function AstrologyPanel() {
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth();
  const [year, setYear] = useState(cy);
  const [moonMonth, setMoonMonth] = useState(cm);

  const events = useMemo(() => buildSkyEvents(year), [year]);
  const climateBands = useMemo(() => climateBandsYear(year), [year]);
  const tcWin = useMemo(() => typhoonClimatologyYear(year), [year]);

  const todayStart = startOfLocalDay(now);
  const todayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const keepUp = useMemo(() => {
    const sod = todayStart;
    if (year === cy) {
      const rest = events.filter((e) => e.at.getTime() >= sod);
      const todayHits = events.filter((e) => startOfLocalDay(e.at) === sod);
      return { mode: "live" as const, todayHits, upcoming: rest.slice(0, 12) };
    }
    if (year > cy) {
      return { mode: "future" as const, todayHits: [] as SkyEvent[], upcoming: events.slice(0, 8) };
    }
    return { mode: "past" as const, todayHits: [] as SkyEvent[], upcoming: [] as SkyEvent[] };
  }, [year, cy, events, todayStart]);

  const climateToday =
    year === cy
      ? climateBands.find(
          (b) => now.getTime() >= b.start.getTime() && now.getTime() <= b.end.getTime(),
        )?.label ?? "—"
      : null;
  const tcToday =
    year === cy &&
    now.getTime() >= tcWin.start.getTime() &&
    now.getTime() <= tcWin.end.getTime();

  const daysInMoonMonth = useMemo(() => {
    const last = new Date(year, moonMonth + 1, 0);
    const days: Date[] = [];
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(year, moonMonth, d));
    }
    return days;
  }, [year, moonMonth]);

  const lunationRows = useMemo(() => {
    const from = new Date(year, 0, 1);
    const to = new Date(year, 11, 31, 23, 59, 59, 999);
    const news = enumerateNewMoonsUtc(from, to);
    return news.map((nm, i) => {
      const next = news[i + 1] ?? new Date(year + 1, 0, 1);
      const fullInst = new Date(nm.getTime() + SYNODIC_MS / 2);
      const crescentDays: string[] = [];
      for (let t = nm.getTime() + 86400000; t < nm.getTime() + 5 * 86400000 && t < next.getTime(); t += 86400000) {
        const d = new Date(t);
        const a = synodicAgeAtLocalNoon(d);
        const ill = illuminationPercent(a);
        const s = crescentSighting(a, ill);
        if (s === "prime" || s === "possible") {
          crescentDays.push(
            `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}${s === "prime" ? "★" : ""}`,
          );
        }
      }
      const meanIll: number[] = [];
      for (let t = nm.getTime(); t < Math.min(next.getTime(), nm.getTime() + SYNODIC_MS); t += 86400000) {
        const d = new Date(t);
        if (d.getFullYear() !== year) continue;
        meanIll.push(illuminationPercent(synodicAgeAtLocalNoon(d)));
      }
      const avgIll = meanIll.length ? meanIll.reduce((a, b) => a + b, 0) / meanIll.length : 0;
      return {
        n: i + 1,
        newUtc: nm,
        fullInst,
        crescentDays: crescentDays.slice(0, 6).join(" · ") || "—",
        avgIll,
        lengthDays: (next.getTime() - nm.getTime()) / 86400000,
      };
    });
  }, [year]);

  const skyRows = useMemo(
    () => events.filter((e) => e.kind !== "new" && e.kind !== "full"),
    [events],
  );

  const lunarStrip = useMemo(
    () => events.filter((e) => e.kind === "new" || e.kind === "full"),
    [events],
  );
  const seasonsStrip = useMemo(() => events.filter((e) => e.kind === "season"), [events]);
  const eclipsesStrip = useMemo(() => events.filter((e) => e.kind === "eclipse"), [events]);
  const meteorsStrip = useMemo(() => events.filter((e) => e.kind === "meteor"), [events]);
  const conjunctionsStrip = useMemo(() => events.filter((e) => e.kind === "conjunction"), [events]);

  const plotWStrip = W_STRIP - STRIP_PAD.l - STRIP_PAD.r;
  const todayStripX = year === cy ? xInYear(now.getTime(), year, STRIP_PAD.l, plotWStrip) : null;

  const detailsSummary =
    "cursor-pointer select-none px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.05] flex items-center justify-between gap-3 list-none [&::-webkit-details-marker]:hidden border-b border-white/10";

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Today */}
      <div className="border-b border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/80">Today</p>
            <p className="text-lg font-semibold text-white mt-1">{todayLabel}</p>
            {year === cy ? (
              <p className="text-[12px] text-white/55 mt-2">
                Climate strip: <span className="text-white/85">{climateToday}</span>
                {tcToday && (
                  <span className="text-rose-300/90"> · TC climatology months (not a warning)</span>
                )}
              </p>
            ) : (
              <p className="text-[12px] text-amber-200/70 mt-2">Viewing data for {year}.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-white/40">Year</span>
            {[cy - 1, cy, cy + 1].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded px-2 py-1 text-[11px] font-medium ${
                  year === y ? "bg-violet-500/35 text-white" : "text-white/45 hover:text-white/75"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        {(keepUp.mode === "live" || keepUp.mode === "future") && keepUp.upcoming.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] font-semibold text-white/45 uppercase tracking-wider mb-2">
              {year === cy ? "Next on the calendar" : `First in ${year}`}
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/65">
              {keepUp.upcoming.slice(0, 8).map((e) => (
                <li key={`${e.kind}-${e.at.getTime()}`}>
                  <span className="text-white/35">
                    {e.at.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>{" "}
                  {e.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <p className="text-[11px] text-white/55 leading-relaxed">
          <span className="text-white/85 font-medium">Year strips</span> run left → right through {year} (each row has
          its own month scale). Dashed vertical line = today when you’re viewing the current year. Open the sections
          below only when you want the numeric tables.
        </p>
      </div>

      <div className="p-3 space-y-3 border-b border-white/10">
        <EventStrip
          title="Seasonal climate & TC climatology"
          hint="Bands = schematic monsoon regimes; dashed red = historical peak cyclone months."
          year={year}
          plotH={46}
          todayX={todayStripX}
        >
          {(x, plotW, left) => {
            const m = STRIP_PAD;
            return (
              <>
                <defs>
                  <filter id="astClimateGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect
                  x={left}
                  y={m.t}
                  width={plotW}
                  height={46}
                  rx={3}
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.06)"
                />
                {climateBands.map((b, i) => {
                  const x0 = x(b.start);
                  const x1 = x(b.end);
                  const w = Math.max(1, x1 - x0);
                  return (
                    <g key={i}>
                      <title>{b.label}</title>
                      <rect
                        x={x0}
                        y={m.t + 7}
                        width={w}
                        height={32}
                        rx={2}
                        fill={
                          b.label.includes("Amihan")
                            ? "rgba(147,197,253,0.42)"
                            : b.label.includes("Habagat")
                              ? "rgba(56,189,248,0.42)"
                              : "rgba(251,191,36,0.25)"
                        }
                        stroke={b.hi ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.08)"}
                        strokeWidth={b.hi ? 1.25 : 1}
                        filter={b.hi ? "url(#astClimateGlow)" : undefined}
                      />
                    </g>
                  );
                })}
                <g>
                  <title>TC climatology peak</title>
                  <rect
                    x={x(tcWin.start)}
                    y={m.t + 3}
                    width={Math.max(2, x(tcWin.end) - x(tcWin.start))}
                    height={40}
                    rx={2}
                    fill="rgba(248,113,113,0.06)"
                    stroke="rgba(248,113,113,0.65)"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                </g>
              </>
            );
          }}
        </EventStrip>

        <EventStrip
          title="Moon illumination (local noon, synodic model)"
          hint="Bar height ∝ lit fraction; same cycle as tables below."
          year={year}
          plotH={34}
          todayX={todayStripX}
        >
          {(x, _plotW, left) => {
            const m = STRIP_PAD;
            const rows: ReactNode[] = [];
            for (let doy = 0; doy < 370; doy += 2) {
              const d = new Date(year, 0, 1 + doy);
              if (d.getFullYear() !== year) break;
              const d2 = new Date(d.getTime() + 1.9 * 86400000);
              const ill = illuminationPercent(synodicAgeAtLocalNoon(d));
              const h = (ill / 100) * (34 - 10);
              const x0 = x(d);
              const x1 = x(d2);
              const w = Math.max(0.8, x1 - x0);
              rows.push(
                <rect
                  key={doy}
                  x={x0}
                  y={m.t + 34 - 5 - h}
                  width={w}
                  height={h}
                  fill="rgba(251,191,36,0.55)"
                />,
              );
            }
            return (
              <>
                <rect
                  x={left}
                  y={m.t}
                  width={_plotW}
                  height={34}
                  rx={3}
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.06)"
                />
                {rows}
              </>
            );
          }}
        </EventStrip>

        <EventStrip
          title="Lunar — new & full (model instants)"
          hint="Tick = new · dot = full"
          year={year}
          plotH={30}
          todayX={todayStripX}
        >
          {(x, _plotW, left) => (
            <>
              <line
                x1={left}
                y1={STRIP_PAD.t + 15}
                x2={left + (W_STRIP - STRIP_PAD.l - STRIP_PAD.r)}
                y2={STRIP_PAD.t + 15}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              {lunarStrip.map((e, i) => {
                const xi = x(e.at);
                const cy0 = STRIP_PAD.t + 15;
                return (
                  <g key={`${e.kind}-${i}`}>
                    <title>{`${e.title}: ${e.note}`}</title>
                    {e.kind === "full" ? (
                      <circle cx={xi} cy={cy0} r={2.8} fill={STRIP_STROKE.full} />
                    ) : (
                      <line
                        x1={xi}
                        y1={cy0 - 10}
                        x2={xi}
                        y2={cy0 + 10}
                        stroke={STRIP_STROKE.new}
                        strokeWidth={1.25}
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                );
              })}
            </>
          )}
        </EventStrip>

        <EventStrip
          title="Sun — equinoxes & solstices"
          hint="Four orbital anchors"
          year={year}
          plotH={28}
          todayX={todayStripX}
        >
          {(x, _pw, left) => (
            <>
              <line
                x1={left}
                y1={STRIP_PAD.t + 14}
                x2={left + (W_STRIP - STRIP_PAD.l - STRIP_PAD.r)}
                y2={STRIP_PAD.t + 14}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              {seasonsStrip.map((e, i) => (
                <g key={i}>
                  <title>{`${e.title}: ${e.note}`}</title>
                  <line
                    x1={x(e.at)}
                    y1={STRIP_PAD.t + 3}
                    x2={x(e.at)}
                    y2={STRIP_PAD.t + 25}
                    stroke={STRIP_STROKE.season}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </>
          )}
        </EventStrip>

        <EventStrip
          title="Eclipses"
          hint="Illustrative dates"
          year={year}
          plotH={26}
          todayX={todayStripX}
        >
          {(x, _pw, left) => (
            <>
              <line
                x1={left}
                y1={STRIP_PAD.t + 13}
                x2={left + (W_STRIP - STRIP_PAD.l - STRIP_PAD.r)}
                y2={STRIP_PAD.t + 13}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              {eclipsesStrip.length === 0 ? (
                <text x={left + 4} y={STRIP_PAD.t + 17} fill="rgba(255,255,255,0.35)" fontSize={9}>
                  None in dataset for {year}
                </text>
              ) : (
                eclipsesStrip.map((e, i) => (
                  <g key={i}>
                    <title>{`${e.title}: ${e.note}`}</title>
                    <line
                      x1={x(e.at)}
                      y1={STRIP_PAD.t + 2}
                      x2={x(e.at)}
                      y2={STRIP_PAD.t + 24}
                      stroke={STRIP_STROKE.eclipse}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </g>
                ))
              )}
            </>
          )}
        </EventStrip>

        <EventStrip
          title="Meteor shower peaks"
          hint="Typical calendar peaks"
          year={year}
          plotH={28}
          todayX={todayStripX}
        >
          {(x, _pw, left) => (
            <>
              <line
                x1={left}
                y1={STRIP_PAD.t + 14}
                x2={left + (W_STRIP - STRIP_PAD.l - STRIP_PAD.r)}
                y2={STRIP_PAD.t + 14}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              {meteorsStrip.map((e, i) => (
                <g key={i}>
                  <title>{`${e.title}: ${e.note}`}</title>
                  <line
                    x1={x(e.at)}
                    y1={STRIP_PAD.t + 3}
                    x2={x(e.at)}
                    y2={STRIP_PAD.t + 25}
                    stroke={STRIP_STROKE.meteor}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </>
          )}
        </EventStrip>

        <EventStrip
          title="Moon & planets (sample conjunctions)"
          hint="Close appulses"
          year={year}
          plotH={28}
          todayX={todayStripX}
        >
          {(x, _pw, left) => (
            <>
              <line
                x1={left}
                y1={STRIP_PAD.t + 14}
                x2={left + (W_STRIP - STRIP_PAD.l - STRIP_PAD.r)}
                y2={STRIP_PAD.t + 14}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              {conjunctionsStrip.length === 0 ? (
                <text x={left + 4} y={STRIP_PAD.t + 17} fill="rgba(255,255,255,0.35)" fontSize={9}>
                  None in dataset for {year}
                </text>
              ) : (
                conjunctionsStrip.map((e, i) => (
                  <g key={i}>
                    <title>{`${e.title}: ${e.note}`}</title>
                    <line
                      x1={x(e.at)}
                      y1={STRIP_PAD.t + 3}
                      x2={x(e.at)}
                      y2={STRIP_PAD.t + 25}
                      stroke={STRIP_STROKE.conjunction}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </g>
                ))
              )}
            </>
          )}
        </EventStrip>
      </div>

      <div className="overflow-x-auto border-t border-white/10">
        <details className="group border-b border-white/10">
          <summary className={detailsSummary}>
            <span>Moon — daily table (phase, illum., altitude, sighting)</span>
            <span className="text-[10px] font-normal text-white/40 group-open:hidden">Show</span>
            <span className="text-[10px] font-normal text-violet-300/80 hidden group-open:inline">Hide</span>
          </summary>
          <div>
        <div className={sectionHead}>Moon — daily ({MONTH_SHORT[moonMonth]} {year})</div>
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-white/10 bg-white/[0.02]">
          <span className="text-[10px] text-white/40">Month</span>
          {MONTH_SHORT.map((name, mi) => (
            <button
              key={name}
              type="button"
              onClick={() => setMoonMonth(mi)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                moonMonth === mi ? "bg-amber-500/25 text-amber-100" : "text-white/40 hover:text-white/70"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <table className={tableWrap}>
          <thead>
            <tr>
              <th className={th}>Day</th>
              <th className={th}>Disk</th>
              <th className={th}>Phase</th>
              <th className={th}>Wax / wane</th>
              <th className={th}>Illumination</th>
              <th className={th}>Est. peak alt.°</th>
              <th className={th}>Crescent eve.</th>
              <th className={th}>Flags</th>
            </tr>
          </thead>
          <tbody>
            {daysInMoonMonth.map((d) => {
              const age = synodicAgeAtLocalNoon(d);
              const ill = illuminationPercent(age);
              const wx = waxing(age);
              const sight = crescentSighting(age, ill);
              const doy = dayOfYear(d);
              const alt = estPeakAltitudeDeg(age, doy);
              const nf = isNewMoonDay(d);
              const tf = isTrueFullMoonDay(d);
              return (
                <tr key={d.getTime()} className={nf || tf ? "bg-amber-500/[0.06]" : undefined}>
                  <td className={td + " tabular-nums text-white/90 font-medium"}>{d.getDate()}</td>
                  <td className={td}>
                    <MoonGlyph illum={ill} waxing={wx} />
                  </td>
                  <td className={td + " text-white/70"}>{phaseName(age)}</td>
                  <td className={td}>
                    <span
                      className={
                        wx ? "text-emerald-400/90 font-semibold" : "text-orange-300/90 font-semibold"
                      }
                    >
                      {wx ? "Waxing ↑" : "Waning ↓"}
                    </span>
                  </td>
                  <td className={td}>
                    <IllumBar pct={ill} />
                  </td>
                  <td className={td + " tabular-nums text-cyan-200/90"}>{alt}°</td>
                  <td className={td}>
                    {sight === "prime" && (
                      <span className="text-amber-200 font-semibold">Prime ★</span>
                    )}
                    {sight === "possible" && <span className="text-white/50">Possible</span>}
                    {sight === "—" && <span className="text-white/25">—</span>}
                  </td>
                  <td className={td}>
                    {nf && <span className="text-violet-300 mr-1">New</span>}
                    {tf && <span className="text-amber-100 font-semibold">True full</span>}
                    {!nf && !tf && <span className="text-white/20">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
          </div>
        </details>

        <details className="group border-b border-white/10">
          <summary className={detailsSummary}>
            <span>Moon — lunations summary</span>
            <span className="text-[10px] font-normal text-white/40 group-open:hidden">Show</span>
            <span className="text-[10px] font-normal text-violet-300/80 hidden group-open:inline">Hide</span>
          </summary>
          <div>
        <div className={sectionHead}>Moon — lunations ({year})</div>
        <table className={tableWrap}>
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>New (model UTC)</th>
              <th className={th}>Length (d)</th>
              <th className={th}>Full instant (model)</th>
              <th className={th}>Mean night illum.</th>
              <th className={th}>Crescent evenings (thin)</th>
            </tr>
          </thead>
          <tbody>
            {lunationRows.map((row) => (
              <tr key={row.n}>
                <td className={td + " tabular-nums"}>{row.n}</td>
                <td className={td + " text-white/60 font-mono text-[10px]"}>
                  {row.newUtc.toISOString().slice(0, 16).replace("T", " ")}Z
                </td>
                <td className={td + " tabular-nums"}>{row.lengthDays.toFixed(1)}</td>
                <td className={td + " text-white/60 font-mono text-[10px]"}>
                  {row.fullInst.toISOString().slice(0, 16).replace("T", " ")}Z
                </td>
                <td className={td}>
                  <IllumBar pct={row.avgIll} />
                </td>
                <td className={td + " text-white/55 max-w-[14rem]"}>{row.crescentDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        </details>

        <details className="group border-b border-white/10">
          <summary className={detailsSummary}>
            <span>Sky events table (seasons, eclipses, meteors, conjunctions)</span>
            <span className="text-[10px] font-normal text-white/40 group-open:hidden">Show</span>
            <span className="text-[10px] font-normal text-violet-300/80 hidden group-open:inline">Hide</span>
          </summary>
          <div>
        <div className={sectionHead}>Sky — seasons, eclipses, meteors, conjunctions ({year})</div>
        <table className={tableWrap}>
          <thead>
            <tr>
              <th className={th}>Date</th>
              <th className={th}>Type</th>
              <th className={th}>Event</th>
              <th className={th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {skyRows.map((e) => (
              <tr key={`${e.kind}-${e.at.getTime()}`}>
                <td className={td + " tabular-nums text-white/50"}>
                  {e.at.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </td>
                <td className={td}>{kindLabel(e.kind)}</td>
                <td className={td + " text-white/90"}>{e.title}</td>
                <td className={td + " text-white/45"}>{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        </details>

        <details className="group border-b border-white/10">
          <summary className={detailsSummary}>
            <span>Climate periods table</span>
            <span className="text-[10px] font-normal text-white/40 group-open:hidden">Show</span>
            <span className="text-[10px] font-normal text-violet-300/80 hidden group-open:inline">Hide</span>
          </summary>
          <div>
        <div className={sectionHead}>Climate — schematic regimes & TC climatology ({year})</div>
        <table className={tableWrap}>
          <thead>
            <tr>
              <th className={th}>From</th>
              <th className={th}>To</th>
              <th className={th}>Regime</th>
              <th className={th}>Overlaps TC peak months</th>
            </tr>
          </thead>
          <tbody>
            {climateBands.map((b, i) => (
              <tr key={i}>
                <td className={td + " text-white/50"}>
                  {b.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </td>
                <td className={td + " text-white/50"}>
                  {b.end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </td>
                <td className={td + " text-white/85 font-medium"}>{b.label}</td>
                <td className={td}>
                  {overlaps(b.start, b.end, tcWin.start, tcWin.end) ? (
                    <span className="text-rose-300/90">Yes</span>
                  ) : (
                    <span className="text-white/25">—</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-rose-950/20">
              <td className={td + " text-rose-200/80"} colSpan={2}>
                TC climatology window
              </td>
              <td className={td + " text-rose-200/90"} colSpan={2}>
                {tcWin.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} →{" "}
                {tcWin.end.toLocaleDateString(undefined, { month: "short", day: "numeric" })} — historically
                busier for cyclones (not a forecast).
              </td>
            </tr>
          </tbody>
        </table>
          </div>
        </details>
      </div>
    </div>
  );
}
