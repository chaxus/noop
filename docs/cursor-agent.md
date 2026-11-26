# Cursor Agent as a Noop CLI

This fork treats **Cursor Agent** (`cursor-agent` / `agent`) as a first-class engine beside Claude Code and Codex.

## Install the CLI

```bash
curl https://cursor.com/install -fsS | bash
# ensure ~/.local/bin is on PATH (the launchd agent already includes it)
agent login   # or: export CURSOR_API_KEY=…
```

## Point the primary at this fork

The installed daemon runs from `~/.noop/app`. Either:

```bash
cd ~/.noop/app
git remote set-url origin https://github.com/chaxus/noop.git
git fetch origin && git checkout main && git pull --ff-only
noop restart
```

or replace `~/.noop/app` with a clone of the fork (keep `~/.noop/data` and `~/.noop/noop.toml`).

## Choose Cursor for chat and/or tasks

**In the app / web Settings → Members:**

- **Chat assistant** — Claude or Cursor for instant replies
- **Default models** — preference order for unpinned tasks (includes Cursor-only)
- **Members** — per-role CLI (Claude / Codex / Cursor and failover chains)

Or edit `~/.noop/data/config.toml`:

```toml
[clis]
preference = ["cursor"]          # task default when cli=auto
# preference = ["cursor", "claude"]

[clis.agents]
# lead = ["cursor"]

[clis.cursor]
# model = "gpt-5"

[router]
cli = "cursor"                   # browser / app chat brain
# model = ""
# timeout_seconds = 45
```

Then `noop restart` (or save from Settings; chat router is picked up on the next brain message after settings sync). Chat uses ask/print mode (JSON tool protocol, no repo edits). Tasks use `--print --output-format stream-json`; unlocked runs add `--force`, gated runs use `--sandbox enabled`.

## Pin a single task

```bash
noop add "Investigate flaky test" --cli cursor
```
