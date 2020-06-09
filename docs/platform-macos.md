---
id: platform-macos
title: macOS Platform
sidebar_label: macOS
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/Linux-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/HostMode-n/a-lightgrey.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_macos.gif" height="250"/>

## Overview

-   support for OSX/macOS
-   Based on Electron

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `macos.desktop.js` | `form factor` | 1 |
| `macos.desktop.ts` | `form factor` | 2 |
| `desktop.js` | `form factor` | 3 |
| `desktop.ts` | `form factor` | 4 |
| `macos.js` | `platform` | 5 |
| `macos.ts` | `platform` | 6 |
| `desktop.web.js` | `fallback` | 7 |
| `desktop.web.ts` | `fallback` | 8 |
| `electron.js` | `fallback` | 9 |
| `electron.ts` | `fallback` | 10 |
| `web.js` | `fallback` | 11 |
| `web.ts` | `fallback` | 12 |
| `mjs` | `fallback` | 13 |
| `js` | `fallback` | 14 |
| `tsx` | `fallback` | 15 |
| `ts` | `fallback` | 16 |

<!--EXTENSION_SUPPORT_END-->

#### Requirements

-   n/a

#### Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.9`  |
| electron-builder | `20.28.2` |

#### Run

Run on Simulator

```
rnv run -p macos
```

Run in Browser

```
rnv run -p macos --hosted
```

#### Deploy on Electron Simulator

This will run production version on your simulator (not connected to devserver)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p macos -s release
```

#### Export

```
rnv export -p macos -s release
```

## App Config

[see: Web based config](api-config.md#web-props)
