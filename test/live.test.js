// Live checks against looot's public, free, no-token routes only. Run with: npm run test:live
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_MCP_URL } from "../src/bridge.js";

const API = "https://api.looot.ai";

test("the public MCP descriptor points at the URL this bridge uses", async () => {
  const res = await fetch(`${API}/.well-known/mcp.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.mcpUrl, DEFAULT_MCP_URL);
  assert.equal(body.transport, "streamable-http");
});

test("the MCP endpoint asks for OAuth and publishes its resource metadata", async () => {
  const res = await fetch(DEFAULT_MCP_URL, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "looot-mcp-test", version: "0" } },
    }),
  });
  assert.equal(res.status, 401);
  assert.match(res.headers.get("www-authenticate") ?? "", /resource_metadata=/);
  const meta = await fetch(`${API}/.well-known/oauth-protected-resource`);
  assert.equal(meta.status, 200);
});
