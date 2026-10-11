export const TIME_ZONE = "Europe/Madrid";

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

type MadridParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
};

function readParts(date: Date): MadridParts {
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  let hour = Number(map.hour);
  if (hour === 24) hour = 0;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    weekday: (map.weekday ?? "").toLocaleLowerCase("es-ES"),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function madridDayKey(date: Date): string {
  const parts = readParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function addDays(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

/** Sunday that closes the Monday–Sunday week containing `todayKey`. */
export function endOfWeekKey(todayKey: string): string {
  const [year, month, day] = todayKey.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const untilSunday = weekday === 0 ? 0 : 7 - weekday;
  return addDays(todayKey, untilSunday);
}

function daysBetween(fromKey: string, toKey: string): number {
  const [y1, m1, d1] = fromKey.split("-").map(Number);
  const [y2, m2, d2] = toKey.split("-").map(Number);
  const from = Date.UTC(y1, m1 - 1, d1);
  const to = Date.UTC(y2, m2 - 1, d2);
  return Math.round((to - from) / 86_400_000);
}

function clock(parts: MadridParts): string {
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

function span(minutes: number, prefix: "en" | "hace"): string {
  const abs = Math.abs(minutes);
  if (abs < 60) return `${prefix} ${abs} min`;
  const hours = Math.floor(abs / 60);
  const remainder = abs % 60;
  if (remainder < 10) return `${prefix} ${hours} h`;
  return `${prefix} ${hours} h ${remainder} min`;
}

export function formatRelativeLabel(when: Date, now: Date): string {
  const diffMs = when.getTime() - now.getTime();

  if (diffMs >= -60_000 && diffMs < 60_000) return "ahora";

  if (diffMs < 0) {
    const agoMin = Math.max(1, Math.round(Math.abs(diffMs) / 60_000));
    if (agoMin < 180) return span(agoMin, "hace");
  } else {
    const inMin = Math.floor(diffMs / 60_000);
    if (inMin < 180) return span(inMin, "en");
  }

  const whenKey = madridDayKey(when);
  const todayKey = madridDayKey(now);
  const parts = readParts(when);
  const time = clock(parts);

  if (whenKey === todayKey) return `hoy ${time}`;
  if (whenKey === addDays(todayKey, 1)) return `mañana ${time}`;
  if (whenKey === addDays(todayKey, -1)) return `ayer ${time}`;

  const ahead = daysBetween(todayKey, whenKey);
  if (ahead >= 2 && ahead <= 6) return `${parts.weekday} ${time}`;

  return `${parts.day} ${MONTHS[parts.month - 1]} ${time}`;
}

export function formatExact(when: Date): string {
  const parts = readParts(when);
  return `${parts.weekday} ${parts.day} ${MONTHS[parts.month - 1]} · ${clock(parts)}`;
}
