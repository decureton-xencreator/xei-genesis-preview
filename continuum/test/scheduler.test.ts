import { describe, expect, it } from "vitest";
import { effectivePriority, selectAdmissions, type SchedulingCandidate } from "../src/scheduler";

const now = "2026-07-19T18:00:00.000Z";
const candidate = (id: string, overrides: Partial<SchedulingCandidate> = {}): SchedulingCandidate => ({
  id, tenantId: "workspace-a", priority: 50, weightedMissionUnits: 1,
  createdAt: "2026-07-19T17:00:00.000Z", tenantRunning: 0, blocked: false, ...overrides,
});

describe("priority-aware weighted scheduler", () => {
  it("admits higher priority work within both capacity limits", () => {
    const selected = selectAdmissions([
      candidate("low", { priority: 20 }), candidate("high", { priority: 90, weightedMissionUnits: 2 }), candidate("middle", { priority: 50, weightedMissionUnits: 2 }),
    ], { maxMissions: 2, maxWeightedMissionUnits: 3, runningMissions: 0, runningWeightedMissionUnits: 0, now });
    expect(selected).toEqual(["high", "low"]);
  });

  it("excludes blocked work and respects the running envelope", () => {
    expect(selectAdmissions([
      candidate("blocked", { priority: 100, blocked: true }), candidate("ready", { weightedMissionUnits: 2 }),
    ], { maxMissions: 4, maxWeightedMissionUnits: 4, runningMissions: 3, runningWeightedMissionUnits: 3, now })).toEqual([]);
  });

  it("adds bounded aging to prevent starvation", () => {
    const old = candidate("old", { priority: 50, createdAt: "2026-07-14T18:00:00.000Z" });
    expect(effectivePriority(old, now)).toBe(70);
    expect(selectAdmissions([candidate("new", { priority: 65 }), old], {
      maxMissions: 1, maxWeightedMissionUnits: 4, runningMissions: 0, runningWeightedMissionUnits: 0, now,
    })).toEqual(["old"]);
  });

  it("uses tenant activity as a fairness tie-breaker", () => {
    expect(selectAdmissions([
      candidate("busy", { tenantId: "workspace-b", tenantRunning: 2 }), candidate("idle", { tenantId: "workspace-a", tenantRunning: 0 }),
    ], { maxMissions: 1, maxWeightedMissionUnits: 4, runningMissions: 0, runningWeightedMissionUnits: 0, now })).toEqual(["idle"]);
  });
});
