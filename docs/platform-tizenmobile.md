---
id: platform-tizenmobile
title: Tizen Mobile Platform
sidebar_label: Tizen Mobile
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

<img src="https://renative.org/img/rnv_tizenmobile.gif" height="250"/>

## Overview

-   Latest Tizen project
-   Support for Tizen 5.0, 4.0, 3.0

## File Extension Support

<!--EXTENSION_SUPPORT_START-->


<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`
-   Make sure your CPU supports virtualization. Otherwise Tizen emulator might not start.
-   If you are deploying to a TV, follow this guide to set your TV in developer mode [Link](https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device)

## Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

## Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/tizen_mobile1.png" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenmobile -t M-5.0-x86
```

## Run

Run on Simulator

```
rnv run -p tizenmobile
```

Run on Device

```
rnv run -p tizenmobile -d
```

Run in Browser

```
rnv run -p tizenmobile --hosted
```

## Advanced

Clean and Re-build platform project

```
rnv run -p tizenmobile -r
```

Launch with specific Tizen simulator:

```
rnv run -p tizenmobile -t M-5.0-x86
```

## App Config

[see: Web based config](api-config.md#web-props)
