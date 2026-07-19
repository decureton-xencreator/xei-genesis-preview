import { describe, expect, it } from "vitest";
import { conservativeAnthropicEstimate, decideBudget } from "../src/governor";

describe("adaptive concurrency and cost governor", () => {
  const base = { missionLimitUsd: 0.1, dailyLimitUsd: 5, monthlyLimitUsd: 50, dailyActualUsd: 0, monthlyActualUsd: 0, estimatedCallUsd: 0.01, providerCallsUsed: 0, providerCallLimit: 1 };

  it("allows a bounded first provider call", () => {
    const decision = decideBudget(base);
    expect(decision.allowed).toBe(true);
    expect(decision.remainingMissionUsd).toBeCloseTo(0.09, 8);
  });

  it.each([
    [{ ...base, estimatedCallUsd: 0.11 }, "mission_budget"],
    [{ ...base, dailyActualUsd: 4.995 }, "daily_budget"],
    [{ ...base, monthlyActualUsd: 49.995 }, "monthly_budget"],
    [{ ...base, providerCallsUsed: 1 }, "provider_call_limit"],
  ] as const)("fails closed before provider invocation", (envelope, reason) => {
    expect(decideBudget(envelope)).toMatchObject({ allowed: false, reason });
  });

  it("estimates a worst-case call before authorization", () => {
    expect(conservativeAnthropicEstimate("x".repeat(300), 1024)).toBeCloseTo(0.010952, 6);
  });
});
