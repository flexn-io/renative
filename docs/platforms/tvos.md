---
id: tvos
title: tvOS Platform
sidebar_label: tvOS
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

<img src="https://renative.org/img/rnv_tvos.gif" height="250"/>

## Overview

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

Extenstions are defined via engines. Engines with tvos support: 

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [CocoaPods](https://cocoapods.org) `1.5.3` or newer
-   [Xcode](https://developer.apple.com/xcode/) for iOS development

## Project Configuration

| Feature           | Version |
| ----------------- | :-----: |
| Swift             |  `4.1`  |
| Deployment Target | `11.4`  |

## Run

```
rnv start
rnv run -p tvos
```

## Advanced

Clean and Re-build platform project

```
rnv run -p tvos -r
```

Launch with specific tvOS simulator

```
rnv run -p tvos -t "Apple TV 4K"
```

## App Config

[see: iOS based config](api-config.md#ios-props)
