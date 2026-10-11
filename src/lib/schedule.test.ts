import assert from "node:assert/strict";
import test from "node:test";
import raw from "../data/schedule.json";
import { parseSchedule, selectItems } from "./schedule";
import type { ScheduleItem } from "../types";

const at = (iso: string) => new Date(iso);

const fixture: ScheduleItem[] = [
  {
    id: "past",
    when: "2026-10-12T09:00:00+02:00",
    agent: "Elon",
    action: "Ya pasó",
  },
  {
    id: "soon",
    when: "2026-10-12T16:11:00+02:00",
    agent: "Gaudí",
    action: "Confirmación carruseles",
  },
  {
    id: "later",
    when: "2026-10-14T17:11:00+02:00",
    agent: "Elon",
    action: "Sube tweet de carrusel",
  },
  {
    id: "next-week",
    when: "2026-10-19T16:11:00+02:00",
    agent: "Gaudí",
    action: "Confirmación carruseles",
  },
];

test("hoy keeps the rest of today", () => {
  const items = selectItems(fixture, at("2026-10-12T12:00:00+02:00"), "hoy");
  assert.deepEqual(items.map((item) => item.id), ["soon"]);
});

test("esta semana runs through Sunday", () => {
  const items = selectItems(fixture, at("2026-10-12T12:00:00+02:00"), "semana");
  assert.deepEqual(items.map((item) => item.id), ["soon", "later"]);
});

test("on Sunday, esta semana does not include Monday", () => {
  const items = selectItems(fixture, at("2026-10-11T18:00:00+02:00"), "semana");
  assert.deepEqual(items.map((item) => item.id), []);
});

test("todos is every upcoming item, soonest first", () => {
  const items = selectItems(fixture, at("2026-10-12T12:00:00+02:00"), "todos");
  assert.deepEqual(items.map((item) => item.id), ["soon", "later", "next-week"]);
});

test("an event from the last minute is still upcoming", () => {
  const items = selectItems(fixture, at("2026-10-12T16:11:30+02:00"), "hoy");
  assert.deepEqual(items.map((item) => item.id), ["soon"]);
});

test("parseSchedule drops broken rows and blank notes", () => {
  const items = parseSchedule([
    { id: "ok", when: "2026-10-12T10:00:00+02:00", agent: "Claudia", action: "Te quiero", note: "  " },
    { id: "", when: "2026-10-12T10:00:00+02:00", agent: "Claudia", action: "Te quiero" },
    { id: "bad", when: "no-es-una-fecha", agent: "Claudia", action: "Te quiero" },
    { id: "missing" },
    null,
  ]);
  assert.deepEqual(items, [
    {
      id: "ok",
      when: "2026-10-12T10:00:00+02:00",
      agent: "Claudia",
      action: "Te quiero",
    },
  ]);
});

test("starter schedule is valid, unique, and includes the real anchors", () => {
  const items = parseSchedule(raw);
  assert.equal(items.length, (raw as unknown[]).length);
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);

  const byId = new Map(items.map((item) => [item.id, item]));
  assert.equal(byId.get("claudia-fr2495-2026-10-12")?.when, "2026-10-12T12:43:00+02:00");
  assert.equal(byId.get("claudia-fr2495-2026-10-12")?.action, "Check-in FR2495");
  assert.equal(byId.get("gaudi-carruseles-2026-10-12")?.when, "2026-10-12T16:11:00+02:00");
  assert.equal(byId.get("elon-carrusel-2026-10-12")?.when, "2026-10-12T17:11:00+02:00");
  assert.equal(byId.get("elon-carrusel-2026-10-14")?.when, "2026-10-14T17:11:00+02:00");
  assert.equal(byId.get("elon-carrusel-2026-10-16")?.when, "2026-10-16T17:11:00+02:00");
  assert.equal(byId.get("elon-leads-2026-10-12")?.when, "2026-10-12T16:11:00+02:00");
  assert.equal(byId.get("elon-crecimiento-2026-10-12")?.when, "2026-10-12T16:26:00+02:00");
  assert.equal(byId.get("claudia-te-quiero-2026-10-12")?.when, "2026-10-12T14:23:00+02:00");

  for (const agent of ["Elon", "Gaudí", "Claudia", "Jordan"]) {
    assert.ok(items.some((item) => item.agent === agent), agent);
  }
});
