---
id: version-0.29-platform-macos
title: macOS Platform
sidebar_label: macOS
original_id: platform-macos
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/Linux-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/HostMode-n/a-lightgrey.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_macos.gif" height="250"/>

## Overview

-   support for OSX/macOS
-   Based on Electron

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `macos.desktop.js` | `form factor` | 1 |
| `desktop.js` | `form factor` | 2 |
| `macos.js` | `platform` | 3 |
| `desktop.web.js` | `fallback` | 4 |
| `electron.js` | `fallback` | 5 |
| `web.js` | `fallback` | 6 |
| `mjs` | `fallback` | 7 |
| `js` | `fallback` | 8 |
| `tsx` | `fallback` | 9 |
| `ts` | `fallback` | 10 |

<!--EXTENSION_SUPPORT_END-->

#### Requirements

-   n/a

#### Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.9`  |
| electron-builder | `20.28.2` |

#### Run

Run on Simulator

```
rnv run -p macos
```

Run in Browser

```
rnv run -p macos --hosted
```

#### Deploy on Electron Simulator

This will run production version on your simulator (not connected to devserver)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p macos -s release
```

#### Export

```
rnv export -p macos -s release
```

## App Config

[see: Web based config](api-config.md#web-props)
