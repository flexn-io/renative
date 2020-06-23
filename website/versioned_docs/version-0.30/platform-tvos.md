---
id: version-0.30-platform-tvos
title: tvOS Platform
sidebar_label: tvOS
original_id: platform-tvos
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

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `tvos.tv.jsx` | `form factor` | 1 |
| `tvos.tv.js` | `form factor` | 2 |
| `tvos.tv.tsx` | `form factor` | 3 |
| `tvos.tv.ts` | `form factor` | 4 |
| `tv.jsx` | `form factor` | 5 |
| `tv.js` | `form factor` | 6 |
| `tv.tsx` | `form factor` | 7 |
| `tv.ts` | `form factor` | 8 |
| `tvos.jsx` | `platform` | 9 |
| `tvos.js` | `platform` | 10 |
| `tvos.tsx` | `platform` | 11 |
| `tvos.ts` | `platform` | 12 |
| `ios.jsx` | `platform` | 13 |
| `ios.js` | `platform` | 14 |
| `ios.tsx` | `platform` | 15 |
| `ios.ts` | `platform` | 16 |
| `tv.native.jsx` | `fallback` | 17 |
| `tv.native.js` | `fallback` | 18 |
| `tv.native.tsx` | `fallback` | 19 |
| `tv.native.ts` | `fallback` | 20 |
| `native.jsx` | `fallback` | 21 |
| `native.js` | `fallback` | 22 |
| `native.tsx` | `fallback` | 23 |
| `native.ts` | `fallback` | 24 |
| `jsx` | `fallback` | 25 |
| `js` | `fallback` | 26 |
| `json` | `fallback` | 27 |
| `wasm` | `fallback` | 28 |
| `tsx` | `fallback` | 29 |
| `ts` | `fallback` | 30 |

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
