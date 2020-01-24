---
id: version-0.28-web
title: Web Platform
sidebar_label: Web
original_id: web
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

<img src="https://renative.org/img/rnv_web.gif" height="250"/>


## Overview

-   Supports Chrome, Safari, Firefox, IE10+

## File Extension Support

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `browser.js` | `form factor` | 1 |
| `web.js` | `platform` | 2 |
| `js` | `fallback` | 3 |
| `tsx` | `fallback` | 4 |
| `ts` | `fallback` | 5 |


## Requirements

-   no extra requirements required

## Project Configuration

| Feature          | Version  |
| ---------------- | :------: |
| Webpack          | `3.11.0` |
| react-native-web | `0.9.1`  |
| Babel Core       | `7.1.2`  |

## Run

```
rnv run -p web
```

RNV will run local server and attempt to open browser URL: http://0.0.0.0:8080/

If you only want to run server:

```
rnv start -p web
```

## Build

```
rnv build -p web
```

your deployable web app folder will be located in `./platformBuilds/<APP_ID>_web/public`

## Advanced

Clean and Re-build platform project

```
rnv run -p web -r
```

Run with verbose logging:

```
rnv run -p web --info
```

Run app on custom port `9999`:

```
rnv run -p web --port 9999
```

## App Config

<a href="##web-based-config">see: Web based config</a>
