---
id: webos
title: LG WebOS Platform
sidebar_label: LG WebOS
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

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `webos.tv.js` | `form factor` | 1 |
| `tv.js` | `form factor` | 2 |
| `webos.js` | `platform` | 3 |
| `tv.web.js` | `fallback` | 4 |
| `web.js` | `fallback` | 5 |
| `js` | `fallback` | 6 |
| `tsx` | `fallback` | 7 |
| `ts` | `fallback` | 8 |

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
