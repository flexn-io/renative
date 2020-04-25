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
| `desktop.js` | `form factor` | 2 |
| `windows.js` | `platform` | 3 |
| `desktop.web.js` | `fallback` | 4 |
| `electron.js` | `fallback` | 5 |
| `web.js` | `fallback` | 6 |
| `mjs` | `fallback` | 7 |
| `js` | `fallback` | 8 |
| `tsx` | `fallback` | 9 |
| `ts` | `fallback` | 10 |

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
