---
id: version-0.29-platform-chromecast
title: Chromecast Platform
sidebar_label: Chromecast
original_id: platform-chromecast
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

<img src="https://renative.org/img/rnv_chromecast.gif" height="250"/>

## Overview

-   Supports Chromecast devices

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `chromecast.tv.js` | `form factor` | 1 |
| `web.tv.js` | `form factor` | 2 |
| `tv.js` | `form factor` | 3 |
| `chromecast.js` | `platform` | 4 |
| `tv.web.js` | `fallback` | 5 |
| `web.js` | `fallback` | 6 |
| `mjs` | `fallback` | 7 |
| `js` | `fallback` | 8 |
| `tsx` | `fallback` | 9 |
| `ts` | `fallback` | 10 |

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
rnv run -p chromecast
```

RNV will run local server at URL: http://0.0.0.0:8095/

If you only want to run server:

```
rnv start -p chromecast
```

## Build

```
rnv build -p chromecast
```

your deployable chromecast app folder will be located in `./platformBuilds/<APP_ID>_chromecast/public`

## Advanced

Clean and Re-build platform project

```
rnv run -p chromecast -r
```

Run with verbose logging:

```
rnv run -p chromecast --info
```

Run app on custom port `9999`:

```
rnv run -p chromecast --port 9999
```

## Modifying index.html

In order for you to do that you'll need to run the project first, so it generates the files you need first. Then you can copy `platformBuilds/_shared/template.js` to `platformConfig/builds/_shared/template.js` and modify it. If `platformConfig` or other folders do not exist manually create them.

## App Config

[see: Web based config](api-config.md#web-props)
