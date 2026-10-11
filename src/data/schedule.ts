import raw from "./schedule.json";
import { parseSchedule } from "../lib/schedule";
import type { ScheduleItem } from "../types";

export const schedule: ScheduleItem[] = parseSchedule(raw);
