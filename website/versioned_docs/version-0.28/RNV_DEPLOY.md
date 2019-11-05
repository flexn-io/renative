---
id: version-0.28-rnv-deploy
title: rnv deploy
sidebar_label: deploy
original_id: rnv-deploy
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

> runs deploy commands on selected platform

## Task Order

🔥 `configure` ➡️ `package` ➡️ `build` ➡️ `export` ➡️ `deploy`  ✅

## deploy

Get interactive options for deploy

```bash
rnv deploy
```

### help

Display deploy help

```bash
rnv deploy help
```

## Options

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-i`, `--info` - Show full stack trace

`--xcodebuildArchiveArgs` - Pass down standard xcodebuild arguments (`ios`, `tvos` only)

Example:

`--xcodebuildArchiveArgs "CODE_SIGN_IDENTITY=iPhone\ Distribution\ (XXX) OTHER_CODE_SIGN_FLAGS=--keychain SOME_PATH_TO_KEYCHAIN"`

`--xcodebuildExportArgs` - Pass down custom xcodebuild arguments (`ios`, `tvos` only)

`--mono` - Monochromatic output to terminal (no colors)
