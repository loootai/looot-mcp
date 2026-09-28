// Builds the mcp-remote command line that bridges stdio to the looot remote MCP server.
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

/** The hosted looot MCP endpoint (streamable HTTP, OAuth or bearer token). */
export const DEFAULT_MCP_URL = "https://api.looot.ai/mcp";

/**
 * Returns the MCP URL to bridge to: LOOOT_MCP_URL when set, else the hosted endpoint.
 * Only https URLs are accepted, plus http://localhost for local testing.
 */
export function resolveMcpUrl(env = process.env) {
  const raw = (env.LOOOT_MCP_URL || DEFAULT_MCP_URL).trim();
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`LOOOT_MCP_URL is not a valid URL: ${raw}`);
  }
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) {
    throw new Error(`LOOOT_MCP_URL must use https (got ${url.protocol}//${url.hostname})`);
  }
  return url.toString();
}

/**
 * Builds the argument list for mcp-remote. With LOOOT_TOKEN set, it adds an
 * Authorization header whose value mcp-remote reads from the environment, so the
 * token never appears in the process list. Without it, mcp-remote runs the
 * browser OAuth sign-in on first use.
 */
export function buildArgs(env = process.env, extra = []) {
  const url = resolveMcpUrl(env);
  const args = [url, "--transport", "http-only"];
  if (env.LOOOT_TOKEN && env.LOOOT_TOKEN.trim() !== "") {
    // Literal ${LOOOT_TOKEN}: mcp-remote substitutes it from its own environment.
    args.push("--header", "Authorization:Bearer ${LOOOT_TOKEN}");
  }
  if (url.startsWith("http://")) args.push("--allow-http");
  return args.concat(extra);
}

/** Finds the pinned mcp-remote proxy script inside node_modules. */
export function resolveProxyScript() {
  const require = createRequire(import.meta.url);
  const pkgJson = require.resolve("mcp-remote/package.json");
  const pkg = require(pkgJson);
  return join(dirname(pkgJson), pkg.bin["mcp-remote"]);
}
