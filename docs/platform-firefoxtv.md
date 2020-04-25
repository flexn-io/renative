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
| `web.tv.js` | `form factor` | 2 |
| `tv.js` | `form factor` | 3 |
| `firefoxtv.js` | `platform` | 4 |
| `tv.web.js` | `fallback` | 5 |
| `web.js` | `fallback` | 6 |
| `mjs` | `fallback` | 7 |
| `js` | `fallback` | 8 |
| `tsx` | `fallback` | 9 |
| `ts` | `fallback` | 10 |

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
