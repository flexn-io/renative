---
id: rnv-build
title: rnv build
sidebar_label: build
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

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

`--xcodebuildArchiveArgs "CODE_SIGN_IDENTITY=\"IDENTITY\" OTHER_CODE_SIGN_FLAGS=\"--keychain KEYCHAIN\""`

`--mono` - Monochromatic output to terminal (no colors)
