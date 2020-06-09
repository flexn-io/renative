---
id: platform-firefoxtv
title: Firefox TV Platform
sidebar_label: Firefox TV
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
| `firefoxtv.tv.js` | `form factor` | 1 |
| `firefoxtv.tv.ts` | `form factor` | 2 |
| `web.tv.js` | `form factor` | 3 |
| `web.tv.ts` | `form factor` | 4 |
| `tv.js` | `form factor` | 5 |
| `tv.ts` | `form factor` | 6 |
| `firefoxtv.js` | `platform` | 7 |
| `firefoxtv.ts` | `platform` | 8 |
| `tv.web.js` | `fallback` | 9 |
| `tv.web.ts` | `fallback` | 10 |
| `web.js` | `fallback` | 11 |
| `web.ts` | `fallback` | 12 |
| `mjs` | `fallback` | 13 |
| `js` | `fallback` | 14 |
| `tsx` | `fallback` | 15 |
| `ts` | `fallback` | 16 |

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
