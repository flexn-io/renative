---
id: firefoxtv
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

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `firefoxtv.tv.js` | `form factor` | 1 |
| `web.tv.js` | `form factor` | 2 |
| `tv.js` | `form factor` | 3 |
| `firefoxtv.js` | `platform` | 4 |
| `tv.web.js` | `fallback` | 5 |
| `web.js` | `fallback` | 6 |
| `js` | `fallback` | 7 |
| `tsx` | `fallback` | 8 |
| `ts` | `fallback` | 9 |

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
