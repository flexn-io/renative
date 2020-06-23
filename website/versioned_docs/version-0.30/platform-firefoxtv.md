---
id: version-0.30-platform-firefoxtv
title: Firefox TV Platform
sidebar_label: Firefox TV
original_id: platform-firefoxtv
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

<img src="https://renative.org/img/rnv_firefoxtv.gif" height="250"/>

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `firefoxtv.tv.jsx` | `form factor` | 1 |
| `firefoxtv.tv.js` | `form factor` | 2 |
| `firefoxtv.tv.tsx` | `form factor` | 3 |
| `firefoxtv.tv.ts` | `form factor` | 4 |
| `web.tv.jsx` | `form factor` | 5 |
| `web.tv.js` | `form factor` | 6 |
| `web.tv.tsx` | `form factor` | 7 |
| `web.tv.ts` | `form factor` | 8 |
| `tv.jsx` | `form factor` | 9 |
| `tv.js` | `form factor` | 10 |
| `tv.tsx` | `form factor` | 11 |
| `tv.ts` | `form factor` | 12 |
| `firefoxtv.jsx` | `platform` | 13 |
| `firefoxtv.js` | `platform` | 14 |
| `firefoxtv.tsx` | `platform` | 15 |
| `firefoxtv.ts` | `platform` | 16 |
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

#### Requirements

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

#### Run

Run on Simulator

```
rnv run -p firefoxtv
```

Run on Device

```
rnv run -p firefoxtv -d
```

Run in Browser

```
rnv run -p firefoxtv --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
