import assert from "node:assert/strict";
import test from "node:test";
import { addDays, endOfWeekKey, formatExact, formatRelativeLabel, madridDayKey } from "./time";

const at = (iso: string) => new Date(iso);

test("en 20 min", () => {
  const label = formatRelativeLabel(
    at("2026-10-13T17:11:00+02:00"),
    at("2026-10-13T16:51:00+02:00"),
  );
  assert.equal(label, "en 20 min");
});

test("en 2 h", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T16:11:00+02:00"),
    at("2026-10-12T14:11:00+02:00"),
  );
  assert.equal(label, "en 2 h");
});

test("en 1 h 30 min when the remainder is at least 10", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T15:41:00+02:00"),
    at("2026-10-12T14:11:00+02:00"),
  );
  assert.equal(label, "en 1 h 30 min");
});

test("hoy 16:11 when it is later the same day", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T16:11:00+02:00"),
    at("2026-10-12T12:00:00+02:00"),
  );
  assert.equal(label, "hoy 16:11");
});

test("pads morning hours", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T09:05:00+02:00"),
    at("2026-10-12T05:00:00+02:00"),
  );
  assert.equal(label, "hoy 09:05");
});

test("mañana 14:23", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T14:23:00+02:00"),
    at("2026-10-11T18:00:00+02:00"),
  );
  assert.equal(label, "mañana 14:23");
});

test("weekday within the next six days", () => {
  const label = formatRelativeLabel(
    at("2026-10-14T17:11:00+02:00"),
    at("2026-10-12T10:00:00+02:00"),
  );
  assert.equal(label, "miércoles 17:11");
});

test("calendar date beyond a week", () => {
  const label = formatRelativeLabel(
    at("2026-10-23T17:11:00+02:00"),
    at("2026-10-12T10:00:00+02:00"),
  );
  assert.equal(label, "23 oct 17:11");
});

test("ahora around the instant", () => {
  assert.equal(
    formatRelativeLabel(at("2026-10-12T16:11:20+02:00"), at("2026-10-12T16:11:00+02:00")),
    "ahora",
  );
  assert.equal(
    formatRelativeLabel(at("2026-10-12T16:10:30+02:00"), at("2026-10-12T16:11:00+02:00")),
    "ahora",
  );
});

test("hace 20 min", () => {
  const label = formatRelativeLabel(
    at("2026-10-12T16:11:00+02:00"),
    at("2026-10-12T16:31:00+02:00"),
  );
  assert.equal(label, "hace 20 min");
});

test("a span that crosses midnight stays relative", () => {
  const label = formatRelativeLabel(
    at("2026-10-13T00:30:00+02:00"),
    at("2026-10-12T23:00:00+02:00"),
  );
  assert.equal(label, "en 1 h 30 min");
});

test("formatExact uses Madrid", () => {
  assert.equal(formatExact(at("2026-10-12T17:11:00+02:00")), "lunes 12 oct · 17:11");
});

test("week ends on Sunday", () => {
  assert.equal(endOfWeekKey("2026-10-11"), "2026-10-11");
  assert.equal(endOfWeekKey("2026-10-12"), "2026-10-18");
  assert.equal(addDays("2026-10-11", 1), "2026-10-12");
});

test("Madrid day key survives the October clock change", () => {
  assert.equal(madridDayKey(at("2026-10-25T01:30:00+02:00")), "2026-10-25");
  assert.equal(madridDayKey(at("2026-10-25T02:30:00+01:00")), "2026-10-25");
});
