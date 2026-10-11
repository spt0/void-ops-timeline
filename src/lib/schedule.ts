import type { ScheduleItem } from "../types";
import { endOfWeekKey, madridDayKey } from "./time";

export const FILTERS = [
  { id: "hoy", label: "Hoy" },
  { id: "semana", label: "Esta semana" },
  { id: "todos", label: "Todos" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

const GRACE_MS = 60_000;

function isScheduleItem(value: unknown): value is ScheduleItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || record.id.trim() === "") return false;
  if (typeof record.when !== "string" || Number.isNaN(Date.parse(record.when))) return false;
  if (typeof record.agent !== "string" || record.agent.trim() === "") return false;
  if (typeof record.action !== "string" || record.action.trim() === "") return false;
  if (record.note !== undefined && typeof record.note !== "string") return false;
  return true;
}

export function parseSchedule(raw: unknown): ScheduleItem[] {
  if (!Array.isArray(raw)) return [];

  const items: ScheduleItem[] = [];
  for (const entry of raw) {
    if (!isScheduleItem(entry)) continue;
    const note = entry.note?.trim();
    items.push({
      id: entry.id.trim(),
      when: entry.when.trim(),
      agent: entry.agent.trim(),
      action: entry.action.trim(),
      ...(note ? { note } : {}),
    });
  }
  return items;
}

export function selectItems(items: ScheduleItem[], now: Date, filter: FilterId): ScheduleItem[] {
  const today = madridDayKey(now);
  const weekEnd = endOfWeekKey(today);
  const cutoff = now.getTime() - GRACE_MS;

  return items
    .map((item, index) => ({ item, index, time: Date.parse(item.when) }))
    .filter(({ time }) => !Number.isNaN(time) && time >= cutoff)
    .filter(({ time }) => {
      if (filter === "todos") return true;
      const key = madridDayKey(new Date(time));
      if (filter === "hoy") return key === today;
      return key >= today && key <= weekEnd;
    })
    .sort((a, b) => a.time - b.time || a.index - b.index)
    .map(({ item }) => item);
}

export function emptyCopy(filter: FilterId): string {
  switch (filter) {
    case "hoy":
      return "Hoy no queda nada.";
    case "semana":
      return "Nada más esta semana.";
    case "todos":
      return "No hay nada por venir.";
  }
}
