---
id: platform-kaios
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
| `kaios.mobile.js` | `form factor` | 1 |
| `kaios.mobile.ts` | `form factor` | 2 |
| `mobile.js` | `form factor` | 3 |
| `mobile.ts` | `form factor` | 4 |
| `kaios.js` | `platform` | 5 |
| `kaios.ts` | `platform` | 6 |
| `mobile.web.js` | `fallback` | 7 |
| `mobile.web.ts` | `fallback` | 8 |
| `web.js` | `fallback` | 9 |
| `web.ts` | `fallback` | 10 |
| `mjs` | `fallback` | 11 |
| `js` | `fallback` | 12 |
| `tsx` | `fallback` | 13 |
| `ts` | `fallback` | 14 |

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
