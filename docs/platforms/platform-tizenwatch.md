---
id: platform-tizenwatch
title: Tizen Watch Platform
sidebar_label: Tizen Watch
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Linux-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/HostMode-yes-brightgreen.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_tizenwatch.gif" height="250"/>

## Overview

-   Latest Tizen project
-   Support for Tizen 5.0

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `tizenwatch.watch.jsx` | `form factor` | 1 |
| `tizenwatch.watch.js` | `form factor` | 2 |
| `tizenwatch.watch.tsx` | `form factor` | 3 |
| `tizenwatch.watch.ts` | `form factor` | 4 |
| `watch.jsx` | `form factor` | 5 |
| `watch.js` | `form factor` | 6 |
| `watch.tsx` | `form factor` | 7 |
| `watch.ts` | `form factor` | 8 |
| `tizenwatch.jsx` | `platform` | 9 |
| `tizenwatch.js` | `platform` | 10 |
| `tizenwatch.tsx` | `platform` | 11 |
| `tizenwatch.ts` | `platform` | 12 |
| `watch.web.jsx` | `fallback` | 13 |
| `watch.web.js` | `fallback` | 14 |
| `watch.web.tsx` | `fallback` | 15 |
| `watch.web.ts` | `fallback` | 16 |
| `web.jsx` | `fallback` | 17 |
| `web.js` | `fallback` | 18 |
| `web.tsx` | `fallback` | 19 |
| `web.ts` | `fallback` | 20 |
| `mjs` | `fallback` | 21 |
| `jsx` | `fallback` | 22 |
| `js` | `fallback` | 23 |
| `json` | `fallback` | 24 |
| `wasm` | `fallback` | 25 |
| `tsx` | `fallback` | 26 |
| `ts` | `fallback` | 27 |

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`

## Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

## Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/tizenwatch1.png" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenwatch -t W-5.0-circle-x86
```

## Run

```
rnv run -p tizenwatch
```

Run on Device

```
rnv run -p tizenwatch -d
```

Run in Browser

```
rnv run -p tizenwatch --hosted
```

## Advanced

Clean and Re-build platform project

```
rnv run -p tizenwatch -r
```

Launch with specific Tizen Watch simulator:

```
rnv run -p tizenwatch -t W-5.0-circle-x86
```

## App Config

[see: Web based config](api-config.md#web-props)
