import { describe, it, expect } from "vitest";
import { DoctorChecker } from "../src/core/doctor-checker.js";

describe("DoctorChecker", () => {
  it("should check Node.js version and pass for current node", async () => {
    const res = await DoctorChecker.checkNode();
    expect(res.category).toBe("node");
    expect(res.status).toBe("ok");
    expect(res.value).toBe(process.version);
  });

  it("should run full environment check without unhandled exceptions", async () => {
    const report = await DoctorChecker.checkAll();
    expect(report.items.length).toBeGreaterThanOrEqual(3);
    const nodeItem = report.items.find((i) => i.id === "node");
    expect(nodeItem).toBeDefined();
    expect(nodeItem?.status).toBe("ok");
  });
});
