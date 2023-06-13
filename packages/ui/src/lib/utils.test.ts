import test from "node:test";
import { byInstalledStatus } from "./utils";
import assert from "node:assert";

test("sorting by installed", async () => {
  const walletAdapters = [
    {
      name: "two",
      readyState: "Installed",
    },
    {
      name: "one",
      readyState: "Installed",
    },
    {
      name: "three",
      readyState: "Something else",
    },
    {
      name: "four",
      readyState: "Something else",
    },
  ];
  const results = walletAdapters.sort(byInstalledStatus);
  assert.strictEqual(results, []);
});
