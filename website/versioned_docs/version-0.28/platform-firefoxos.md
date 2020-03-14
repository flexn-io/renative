---
id: version-0.28-platform-firefoxos
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

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `firefoxos.mobile.js` | `form factor` | 1 |
| `mobile.js` | `form factor` | 2 |
| `firefoxos.js` | `platform` | 3 |
| `mobile.web.js` | `fallback` | 4 |
| `web.js` | `fallback` | 5 |
| `js` | `fallback` | 6 |
| `tsx` | `fallback` | 7 |
| `ts` | `fallback` | 8 |


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
