---
id: version-0.30-platform-firefoxos
title: Firefox OS Platform
sidebar_label: Firefox OS
original_id: platform-firefoxos
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

<img src="https://renative.org/img/rnv_firefoxos.gif" height="250"/>

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `firefoxos.mobile.jsx` | `form factor` | 1 |
| `firefoxos.mobile.js` | `form factor` | 2 |
| `firefoxos.mobile.tsx` | `form factor` | 3 |
| `firefoxos.mobile.ts` | `form factor` | 4 |
| `mobile.jsx` | `form factor` | 5 |
| `mobile.js` | `form factor` | 6 |
| `mobile.tsx` | `form factor` | 7 |
| `mobile.ts` | `form factor` | 8 |
| `firefoxos.jsx` | `platform` | 9 |
| `firefoxos.js` | `platform` | 10 |
| `firefoxos.tsx` | `platform` | 11 |
| `firefoxos.ts` | `platform` | 12 |
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

-   [FirefoxDeveloperEdition](https://www.mozilla.org/en-US/firefox/developer/) for IDE + Emulator

After installation you can launch it via Applications:

`Tools -> Web Developer -> WebIDE`

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/firefoxos.png" />
    </th>
  </tr>
</table>

## Run

Run on Simulator

```
rnv run -p firefoxos
```

Run on Device

```
rnv run -p firefoxos -d
```

Run in Browser

```
rnv run -p firefoxos --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
