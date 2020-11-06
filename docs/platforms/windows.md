---
id: windows
title: Windows Platform
sidebar_label: Windows
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/Windows-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Linux-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/HostMode-yes-brightgreen.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_windows.gif" height="250"/>

## Overview

-   support for Windows 10+
-   Based on Electron

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `windows.desktop.jsx` | `form factor` | 1 |
| `windows.desktop.js` | `form factor` | 2 |
| `windows.desktop.tsx` | `form factor` | 3 |
| `windows.desktop.ts` | `form factor` | 4 |
| `desktop.jsx` | `form factor` | 5 |
| `desktop.js` | `form factor` | 6 |
| `desktop.tsx` | `form factor` | 7 |
| `desktop.ts` | `form factor` | 8 |
| `windows.jsx` | `platform` | 9 |
| `windows.js` | `platform` | 10 |
| `windows.tsx` | `platform` | 11 |
| `windows.ts` | `platform` | 12 |
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

## Requirements

-   Windows dev environment


## Run

Run on Simulator

```
rnv run -p windows
```

Run in Browser

```
rnv run -p windows --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
