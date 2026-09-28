import { test } from "node:test";
import assert from "node:assert/strict";
import { buildArgs, resolveMcpUrl, DEFAULT_MCP_URL } from "../src/bridge.js";

test("defaults to the hosted looot MCP URL over streamable HTTP", () => {
  assert.deepEqual(buildArgs({}), [DEFAULT_MCP_URL, "--transport", "http-only"]);
});

test("adds an Authorization header that references LOOOT_TOKEN, never the token itself", () => {
  const args = buildArgs({ LOOOT_TOKEN: "fake-token-for-this-test" });
  assert.ok(args.includes("Authorization:Bearer ${LOOOT_TOKEN}"));
  assert.ok(!args.some((a) => a.includes("fake-token-for-this-test")));
});

test("ignores an empty LOOOT_TOKEN", () => {
  assert.ok(!buildArgs({ LOOOT_TOKEN: "  " }).includes("--header"));
});

test("rejects a plain http URL that is not localhost", () => {
  assert.throws(() => resolveMcpUrl({ LOOOT_MCP_URL: "http://example.com/mcp" }), /https/);
});

test("allows http://localhost for local testing and passes --allow-http", () => {
  const args = buildArgs({ LOOOT_MCP_URL: "http://localhost:8787/mcp" });
  assert.equal(args[0], "http://localhost:8787/mcp");
  assert.ok(args.includes("--allow-http"));
});

test("passes extra flags through to mcp-remote", () => {
  assert.deepEqual(buildArgs({}, ["--debug"]).slice(-1), ["--debug"]);
});
