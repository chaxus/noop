import { expect, test } from "bun:test";
import { cliExecutable, cliInstalled, defaultPreference } from "../src/core";
import { cliCommand, cursorToolStep } from "../src/runner";
import { CursorModel, routerModel } from "../src/brain";

test("cliCommand(cursor) uses print/stream-json and sandboxes when gates apply", () => {
  const locked = cliCommand("cursor", {} as any, false);
  expect(locked[0]).toMatch(/cursor-agent|agent/);
  expect(locked).toContain("--print");
  expect(locked).toContain("stream-json");
  expect(locked).toContain("--sandbox");
  expect(locked).toContain("enabled");
  expect(locked).not.toContain("--force");

  const open = cliCommand("cursor", { clis: { cursor: { model: "gpt-5" } } } as any, true);
  expect(open).toContain("--force");
  expect(open).not.toContain("--sandbox");
  expect(open).toContain("--model");
  expect(open).toContain("gpt-5");
});

test("cursorToolStep names started tool calls", () => {
  expect(cursorToolStep({
    subtype: "started",
    tool_call: { readToolCall: { args: { path: "README.md" } } },
  })).toContain("README.md");
  expect(cursorToolStep({ subtype: "completed", tool_call: { readToolCall: { args: { path: "x" } } } })).toBeUndefined();
});

test("routerModel picks CursorModel when router.cli is cursor", () => {
  const m = routerModel({ router: { cli: "cursor", model: "sonnet-4" } });
  expect(m).toBeInstanceOf(CursorModel);
});

test("routerModel defaults to Claude stack", () => {
  const m = routerModel({});
  expect(m).not.toBeInstanceOf(CursorModel);
});

test("cursor-only preference and install detection", () => {
  expect(defaultPreference({ clis: { preference: ["cursor"] } })).toEqual(["cursor"]);
  // cliInstalled("cursor") is true on this machine after cursor-agent install; still assert shape
  expect(typeof cliInstalled("cursor")).toBe("boolean");
  if (cliInstalled("cursor")) expect(cliExecutable("cursor")).toBeTruthy();
});
