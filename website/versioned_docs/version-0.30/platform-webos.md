---
id: version-0.30-platform-webos
title: LG WebOS Platform
sidebar_label: LG WebOS
original_id: platform-webos
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

<img src="https://renative.org/img/rnv_webos.gif" height="250"/>

## Overview

-   Latest LG webOS Project

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `webos.tv.jsx` | `form factor` | 1 |
| `webos.tv.js` | `form factor` | 2 |
| `webos.tv.tsx` | `form factor` | 3 |
| `webos.tv.ts` | `form factor` | 4 |
| `web.tv.jsx` | `form factor` | 5 |
| `web.tv.js` | `form factor` | 6 |
| `web.tv.tsx` | `form factor` | 7 |
| `web.tv.ts` | `form factor` | 8 |
| `tv.jsx` | `form factor` | 9 |
| `tv.js` | `form factor` | 10 |
| `tv.tsx` | `form factor` | 11 |
| `tv.ts` | `form factor` | 12 |
| `webos.jsx` | `platform` | 13 |
| `webos.js` | `platform` | 14 |
| `webos.tsx` | `platform` | 15 |
| `webos.ts` | `platform` | 16 |
| `tv.web.jsx` | `fallback` | 17 |
| `tv.web.js` | `fallback` | 18 |
| `tv.web.tsx` | `fallback` | 19 |
| `tv.web.ts` | `fallback` | 20 |
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

-   [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0

## Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

## Emulator

-   launch webOS emulator via CLI

```bash
rnv target launch -p webos -t emulator
```

-   launch webOS emulator Manually

usually located in something like:

```
<USER_PATH>/Library/webOS_TV_SDK/Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app
```

## Run

Run on Simulator

```
rnv run -p webos
```

Run on Device

```
rnv run -p webos -d
```

Run in Browser

```
rnv run -p webos --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
