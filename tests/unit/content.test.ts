import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const content = readFileSync("content/formal-models.md", "utf8");
const nuxtConfig = readFileSync("nuxt.config.ts", "utf8");

describe("Formal Models content", () => {
  it("contains metadata and no print-only spacing", () => {
    expect(content).toContain("title: Formal Models");
    expect(content).toContain("order: 1");
    expect(content).toContain("kind: topic");
    expect(content).not.toContain("<br>");
  });

  it("uses concise headings", () => {
    expect(content).toContain("### Properties");
    expect(content).toContain("#### Markings");
    expect(content).toContain(
      "A CEN with $|C|$ conditions has $2^{|C|}$ possible markings.",
    );
    expect(content).not.toMatch(/^#{1,6} .*:$/m);
    expect(content).not.toMatch(/^### \d+\./m);
  });

  it("keeps the subset-check procedure in the example disclosure", () => {
    expect(content).toContain('::machine-example{variant="subset"}');
    expect(content).toContain(
      "Build the complete deterministic power automaton $P(A_2)$.",
    );
    expect(content).not.toContain("TODO: A1 × C(P(A2))");
  });

  it("references every fixed example variant", () => {
    const variants = [
      "basics",
      "power",
      "oracle",
      "oracle-optimized",
      "complement",
      "product",
      "moore",
      "mealy",
      "subset",
      "markings",
      "cen",
      "ptn",
      "lts",
      "combined",
      "alphabet",
      "synchronization",
      "satisfiable",
      "underspecification",
      "operators",
      "action",
      "checking",
    ];

    for (const variant of variants) {
      expect(content).toContain(`variant="${variant}"`);
    }
  });

  it("keeps TLA+ focused on the exercise syntax", () => {
    expect(content).toContain("## TLA+");
    expect(content).toContain("### Structure");
    expect(content).toContain("### Model checking");
    expect(content).toContain("### Fairness");
    expect(content).toContain("Spec == Init /\\ [][Next]_vars");
    expect(content).toContain("Weak fairness");
    expect(content).toContain("Strong fairness");
    expect(content).not.toContain("For the exam");
    expect(content.match(/^```c$/gm)).toHaveLength(1);
    expect(nuxtConfig).toContain('langs: ["c", "haskell", "java"]');
  });
});
