# Installing the looot MCP server (for AI agents)

Read this when a user asks you to add looot to their MCP client. Follow the steps in order and
stop at the first one that asks the user for something.

## 1. Prefer the hosted server

looot runs a hosted MCP server. Do not clone or build anything.

- URL: `https://api.looot.ai/mcp`
- Transport: streamable HTTP
- Auth: OAuth in the browser (default), or a bearer agent token in `LOOOT_TOKEN`

## 2. Add it to the client you are running in

| Client | Command or config |
| --- | --- |
| Claude Code | `claude mcp add --transport http looot https://api.looot.ai/mcp` |
| Cursor | `~/.cursor/mcp.json`: `{"mcpServers":{"looot":{"url":"https://api.looot.ai/mcp"}}}` |
| VS Code | `code --add-mcp '{"name":"looot","type":"http","url":"https://api.looot.ai/mcp"}'` |
| Codex | `codex mcp add looot --url https://api.looot.ai/mcp` then `codex mcp login looot` |
| Gemini CLI | `gemini mcp add --transport http looot https://api.looot.ai/mcp` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json`: `{"mcpServers":{"looot":{"serverUrl":"https://api.looot.ai/mcp"}}}` |
| Cline, other stdio clients | `{"command":"npx","args":["-y","mcp-remote@0.14.3","https://api.looot.ai/mcp","--transport","http-only"]}` |

Merge into an existing config file. Never overwrite other servers the user already has.

## 3. Sign in

The first tool call opens a browser sign-in. Tell the user to finish it. If the client has no
browser (CI, a remote box), ask the user for an agent token instead:

1. The user creates it at https://looot.ai (Settings, Agent tokens) with `catalog.read`,
   `runs.read` and `runs.execute`, plus `usage.read` for the balance.
2. The user exports it as `LOOOT_TOKEN` in the environment the client runs in.
3. You reference it as `Authorization: Bearer ${LOOOT_TOKEN}`. Never write the token value
   into a file, a commit or a chat message.

## 4. Check it works (free)

Call `catalog_overview` with no arguments. You should get category totals. Then call
`search_catalog` with `query: "verify an email"`. Neither costs anything.

## 5. Before a paid run

Call `balance`. A new workspace starts at $0 with no trial credit. If the balance is below the
minimum, give the user the `top_up` link and wait. Never retry a paid run with the same
`idempotencyKey` and a different input.

## Reference

- https://api.looot.ai/llms.txt
- https://api.looot.ai/llms-full.txt
- https://api.looot.ai/.well-known/mcp.json
