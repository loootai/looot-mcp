#!/usr/bin/env node
// looot-mcp: a stdio MCP server that forwards every message to https://api.looot.ai/mcp.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { buildArgs, resolveProxyScript, DEFAULT_MCP_URL } from "../src/bridge.js";

const HELP = `looot-mcp: stdio bridge to the looot MCP server (${DEFAULT_MCP_URL})

Usage:
  looot-mcp              start the bridge (an MCP client launches this for you)
  looot-mcp --help       show this help
  looot-mcp --version    print the version

Environment:
  LOOOT_TOKEN    optional agent token (cs_ms_...). Without it, the first start opens
                 the browser to sign in with OAuth.
  LOOOT_MCP_URL  optional override of the MCP URL (https only).

Any other flag is passed through to mcp-remote.`;

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) {
  process.stdout.write(HELP + "\n");
  process.exit(0);
}
if (argv.includes("--version") || argv.includes("-v")) {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  process.stdout.write(pkg.version + "\n");
  process.exit(0);
}

let args;
try {
  args = buildArgs(process.env, argv);
} catch (err) {
  process.stderr.write(`looot-mcp: ${err.message}\n`);
  process.exit(2);
}

// stdout carries MCP messages, so everything else goes to stderr.
const child = spawn(process.execPath, [resolveProxyScript(), ...args], {
  stdio: "inherit",
  env: process.env,
});
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
