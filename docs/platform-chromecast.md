---
id: platform-chromecast
title: Chromecast Platform
sidebar_label: Chromecast
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

In order for you to do that you'll need to run the project first, so it generates the files you need first. Then you can copy `platformBuilds/<APP_ID>_chromecast/template.js` to `appConfigs/base/builds/template.js` and modify it. 

## App Config

[see: Web based config](api-config.md#web-props)
