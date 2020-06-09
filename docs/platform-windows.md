---
id: platform-windows
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
| `windows.desktop.js` | `form factor` | 1 |
| `windows.desktop.ts` | `form factor` | 2 |
| `desktop.js` | `form factor` | 3 |
| `desktop.ts` | `form factor` | 4 |
| `windows.js` | `platform` | 5 |
| `desktop.web.js` | `fallback` | 6 |
| `desktop.web.ts` | `fallback` | 7 |
| `electron.js` | `fallback` | 8 |
| `electron.ts` | `fallback` | 9 |
| `web.js` | `fallback` | 10 |
| `web.ts` | `fallback` | 11 |
| `mjs` | `fallback` | 12 |
| `js` | `fallback` | 13 |
| `tsx` | `fallback` | 14 |
| `ts` | `fallback` | 15 |

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   Windows dev environment

## Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.1`  |
| electron-builder | `20.28.2` |

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
