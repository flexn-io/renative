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
| `macos.desktop.jsx` | `form factor` | 1 |
| `macos.desktop.js` | `form factor` | 2 |
| `macos.desktop.tsx` | `form factor` | 3 |
| `macos.desktop.ts` | `form factor` | 4 |
| `desktop.jsx` | `form factor` | 5 |
| `desktop.js` | `form factor` | 6 |
| `desktop.tsx` | `form factor` | 7 |
| `desktop.ts` | `form factor` | 8 |
| `macos.jsx` | `platform` | 9 |
| `macos.js` | `platform` | 10 |
| `macos.tsx` | `platform` | 11 |
| `macos.ts` | `platform` | 12 |
| `desktop.web.jsx` | `fallback` | 13 |
| `desktop.web.js` | `fallback` | 14 |
| `desktop.web.tsx` | `fallback` | 15 |
| `desktop.web.ts` | `fallback` | 16 |
| `electron.jsx` | `fallback` | 17 |
| `electron.js` | `fallback` | 18 |
| `electron.tsx` | `fallback` | 19 |
| `electron.ts` | `fallback` | 20 |
| `web.jsx` | `fallback` | 21 |
| `web.js` | `fallback` | 22 |
| `web.tsx` | `fallback` | 23 |
| `web.ts` | `fallback` | 24 |
| `mjs` | `fallback` | 25 |
| `jsx` | `fallback` | 26 |
| `js` | `fallback` | 27 |
| `json` | `fallback` | 28 |
| `wasm` | `fallback` | 29 |
| `tsx` | `fallback` | 30 |
| `ts` | `fallback` | 31 |

<!--EXTENSION_SUPPORT_END-->

#### Requirements

-   n/a


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
