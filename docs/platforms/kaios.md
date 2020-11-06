---
id: kaios
title: KaiOS Platform
sidebar_label: KaiOS
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

<img src="https://renative.org/img/rnv_kaios.gif" height="250"/>

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `kaios.mobile.jsx` | `form factor` | 1 |
| `kaios.mobile.js` | `form factor` | 2 |
| `kaios.mobile.tsx` | `form factor` | 3 |
| `kaios.mobile.ts` | `form factor` | 4 |
| `mobile.jsx` | `form factor` | 5 |
| `mobile.js` | `form factor` | 6 |
| `mobile.tsx` | `form factor` | 7 |
| `mobile.ts` | `form factor` | 8 |
| `kaios.jsx` | `platform` | 9 |
| `kaios.js` | `platform` | 10 |
| `kaios.tsx` | `platform` | 11 |
| `kaios.ts` | `platform` | 12 |
| `mobile.web.jsx` | `fallback` | 13 |
| `mobile.web.js` | `fallback` | 14 |
| `mobile.web.tsx` | `fallback` | 15 |
| `mobile.web.ts` | `fallback` | 16 |
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

-   [KaiOSrt](https://developer.kaiostech.com/simulator) for emulator

After installation you can launch it via Applications:

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/kaios1.png" />
    </th>
  </tr>
</table>

## Run

Run on Simulator

```
rnv run -p kaios
```

Run on Device

```
rnv run -p kaios -d
```

Run in Browser

```
rnv run -p kaios --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
