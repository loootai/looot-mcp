# looot MCP

<p>
  <a href="https://cursor.com/en/install-mcp?name=looot&config=eyJ1cmwiOiJodHRwczovL2FwaS5sb29vdC5haS9tY3AifQ=="><img src="https://img.shields.io/badge/Install_in_Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white" alt="Install in Cursor" /></a>
  <a href="https://vscode.dev/redirect/mcp/install?name=looot&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.looot.ai%2Fmcp%22%7D"><img src="https://img.shields.io/badge/Install_in_VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Install in VS Code" /></a>
  <a href="https://insiders.vscode.dev/redirect/mcp/install?name=looot&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.looot.ai%2Fmcp%22%7D&quality=insiders"><img src="https://img.shields.io/badge/VS_Code_Insiders-24bfa5?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Install in VS Code Insiders" /></a>
</p>

looot is one gateway to about 2,500 data provider operations: email find and verify, company
enrichment, SEO and SERP data, social profiles, web scraping and more. One token, one prepaid
balance, one run contract.

## Install for agents

```bash
claude mcp add --transport http looot https://api.looot.ai/mcp
```

See also: [awesome-looot-use-cases](https://github.com/loootai/awesome-looot-use-cases) (copy-paste recipes) and [awesome-gtm](https://github.com/loootai/awesome-gtm) (open-source GTM tools).

The server is hosted at `https://api.looot.ai/mcp` (streamable HTTP). Most clients connect to it
directly and sign in with the browser. This repo adds two things:

- `looot-mcp`, a small npm bin that bridges stdio to the hosted server, for clients that only
  speak stdio. It runs a pinned `mcp-remote` (0.14.3) and adds nothing else.
- `server.json`, the MCP Registry entry (`ai.looot/looot`), remote first.
- `gemini-extension.json` and `GEMINI.md`, the Gemini CLI extension (remote server plus the looot skill as context).
- `llms-install.md`, setup steps an AI agent such as Cline can follow on its own.

> `looot-mcp` is not on npm yet, so the `npx looot-mcp` lines below work only after a release.
> Every remote setup works today.

## Install

Pick your client. Each one connects to the hosted server and opens a browser sign-in the first
time. To use an agent token instead, see [Authentication](#authentication).

### Claude Code

```bash
claude mcp add --transport http looot https://api.looot.ai/mcp
```

Then run `/mcp`, pick `looot` and choose Authenticate.

### Claude (claude.ai and Claude Desktop connector)

Settings, Connectors, Add custom connector. Name `looot`, URL `https://api.looot.ai/mcp`.
Connect, then sign in with your looot account in the browser window that opens.

### Cursor

Click the Install in Cursor button above, or add this to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "looot": { "url": "https://api.looot.ai/mcp" }
  }
}
```

### VS Code

Click the Install in VS Code button above, or run:

```bash
code --add-mcp '{"name":"looot","type":"http","url":"https://api.looot.ai/mcp"}'
```

or add it to `.vscode/mcp.json`:

```json
{
  "servers": {
    "looot": { "type": "http", "url": "https://api.looot.ai/mcp" }
  }
}
```

### Codex

```bash
codex mcp add looot --url https://api.looot.ai/mcp
codex mcp login looot
```

Or in `~/.codex/config.toml`:

```toml
[mcp_servers.looot]
url = "https://api.looot.ai/mcp"
```

### Gemini CLI

As an extension (adds the server and the looot usage guide):

```bash
gemini extensions install https://github.com/loootai/looot-mcp
```

Or only the server:

```bash
gemini mcp add --transport http looot https://api.looot.ai/mcp
```

Or in `~/.gemini/settings.json` (`httpUrl` is Gemini's key for streamable HTTP):

```json
{
  "mcpServers": {
    "looot": { "httpUrl": "https://api.looot.ai/mcp" }
  }
}
```

Then `/mcp auth looot` inside Gemini CLI.

### ChatGPT (developer mode)

Settings, Apps and Connectors, Advanced settings, turn on Developer mode. Then Create, name
`looot`, MCP server URL `https://api.looot.ai/mcp`, authentication OAuth.

Not yet tested end to end with looot. The public page looot.ai/agents/chatgpt still says this
path is not live.

### Windsurf

In `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "looot": { "serverUrl": "https://api.looot.ai/mcp" }
  }
}
```

### Any stdio-only client

```json
{
  "mcpServers": {
    "looot": { "command": "npx", "args": ["-y", "looot-mcp@0.1.0"] }
  }
}
```

Until `looot-mcp` is on npm, the same bridge runs straight from mcp-remote:

```json
{
  "mcpServers": {
    "looot": {
      "command": "npx",
      "args": ["-y", "mcp-remote@0.14.3", "https://api.looot.ai/mcp", "--transport", "http-only"]
    }
  }
}
```

## 60-second quickstart

1. Add the server with one of the setups above and sign in.
2. Ask your agent: "Use looot catalog_overview with topic email, then find the cheapest way to
   verify an email." Browsing is free.
3. Top up before the first paid run. The `balance` tool returns the minimum and a payment link;
   new workspaces start at $0 and there is no trial credit.
4. Ask: "Run job:people.email.verify on jane.doe@example.com with fallback." The agent calls
   `run`, and the result carries the price actually charged.

## Tools

The hosted server lists these tools (source: api.looot.ai/llms.txt):

| Tool | What it does | Cost |
| --- | --- | --- |
| `catalog_overview` | categories, platforms and jobs with counts and cheapest prices | free |
| `search_catalog`, `search`, `discover` | find endpoints for a job, ranked by `prefer` | free |
| `discover_smart` | ranks a shortlist against a plain-English use case | small paid AI call |
| `inspect` | input and output schema, price formula, estimated max cost | free |
| `run` | holds the estimated cost, runs, settles; accepts `job:<id>` and `fallback` | paid |
| `runs_get`, `runs_list`, `runs_cancel`, `runs_evidence` | run status, history, cancel, per-attempt receipts | free |
| `balance`, `top_up` | balance and a Stripe payment link | free |
| `my_tools`, `capability_request` | workspace tools, ask for a missing job | free |

## Authentication

Browser sign-in (OAuth) is the default. The server answers an unauthenticated call with
`401` and `WWW-Authenticate: Bearer resource_metadata=...`, and every client above follows that.

For headless agents, create an agent token at looot.ai (Settings, Agent tokens) with at least
`catalog.read`, `runs.read` and `runs.execute`, then export it:

```bash
export LOOOT_TOKEN=cs_ms_...   # shown once, never commit it
```

- `looot-mcp` picks up `LOOOT_TOKEN` and sends it as a bearer header. The token stays out of
  the process list: the bridge passes `Authorization:Bearer ${LOOOT_TOKEN}` and mcp-remote
  expands it from its own environment.
- Claude Code: add `--header "Authorization: Bearer $LOOOT_TOKEN"` to the `claude mcp add` line.
- Codex: add `bearer_token_env_var = "LOOOT_TOKEN"` under `[mcp_servers.looot]`.

## Develop

```bash
npm install --ignore-scripts
npm test            # unit tests, offline
npm run test:live   # free public routes only: /.well-known/mcp.json and the OAuth metadata
npm run scan        # leak scanner, also run by the pre-commit hook
git config core.hooksPath .githooks
```

## Links

- Website: https://looot.ai
- Agent guide: https://api.looot.ai/llms.txt (full: https://api.looot.ai/llms-full.txt)
- OpenAPI: https://api.looot.ai/openapi.json
- MCP descriptor: https://api.looot.ai/.well-known/mcp.json
- Per-client pages: https://looot.ai/agents.md
- Install guide for agents: [llms-install.md](llms-install.md)

## License

MIT, see [LICENSE](LICENSE). The hosted looot service has its own terms: https://looot.ai/terms
