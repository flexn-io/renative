---
id: version-0.31-api-cli-run
title: rnv run
sidebar_label: run
original_id: api-cli-run
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

> runs app on emulator / device on selected platform.
> This command also triggers concurrent server / bundler is configured

## Task Order

🔥 `configure` ➡️ `package` ➡️ `compile` ➡️ `run` ➡️ `install` ➡️ `launch` ✅

## run

Runs specific app of specific platform

```bash
rnv run
```

### help

Display help

```bash
rnv run help
```

## Options

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)
