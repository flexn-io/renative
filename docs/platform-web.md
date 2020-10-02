---
id: platform-web
title: Web Platform
sidebar_label: Web
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

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `browser.jsx` | `form factor` | 1 |
| `browser.js` | `form factor` | 2 |
| `browser.tsx` | `form factor` | 3 |
| `browser.ts` | `form factor` | 4 |
| `server.web.jsx` | `platform` | 5 |
| `server.web.js` | `platform` | 6 |
| `server.web.tsx` | `platform` | 7 |
| `server.web.ts` | `platform` | 8 |
| `web.jsx` | `platform` | 9 |
| `web.js` | `platform` | 10 |
| `web.tsx` | `platform` | 11 |
| `web.ts` | `platform` | 12 |
| `mjs` | `fallback` | 13 |
| `jsx` | `fallback` | 14 |
| `js` | `fallback` | 15 |
| `json` | `fallback` | 16 |
| `wasm` | `fallback` | 17 |
| `tsx` | `fallback` | 18 |
| `ts` | `fallback` | 19 |

<!--EXTENSION_SUPPORT_END-->

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

## Modifying index.html

In order for you to do that you'll need to run the project first, so it generates the files you need first. Then you can copy `platformBuilds/<APP_ID>_web/template.js` to `appConfigs/base/builds/template.js` and modify it. 

## App Config

[see: Web based config](api-config.md#web-props)
