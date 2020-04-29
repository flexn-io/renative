---
id: api-cli-build
title: rnv build
sidebar_label: build
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

> runs build / archive commands on selected platform

## Task Order

🔥 `configure` ➡️ `package` ➡️ `build` ✅

## build

Get interactive options for build

```bash
rnv build
```

### help

Display build help

```bash
rnv build help
```

## Options

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-i`, `--info` - Show full stack trace

`--analyzer` - Show app size analysis report

`--xcodebuildArchiveArgs` - Pass down standard xcodebuild arguments (`ios`, `tvos` only)

Example:

`--xcodebuildArchiveArgs "CODE_SIGN_IDENTITY=iPhone\ Distribution\ (XXX) OTHER_CODE_SIGN_FLAGS=--keychain SOME_PATH_TO_KEYCHAIN"`

`--mono` - Monochromatic output to terminal (no colors)
