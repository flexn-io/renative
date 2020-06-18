---
id: platform-androidwear
title: Android Wear Platform
sidebar_label: Android Wear
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Linux-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/HostMode-n/a-lightgrey.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_androidwear.gif" height="250"/>

## Overview

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `androidwear.watch.jsx` | `form factor` | 1 |
| `androidwear.watch.js` | `form factor` | 2 |
| `androidwear.watch.tsx` | `form factor` | 3 |
| `androidwear.watch.ts` | `form factor` | 4 |
| `watch.jsx` | `form factor` | 5 |
| `watch.js` | `form factor` | 6 |
| `watch.tsx` | `form factor` | 7 |
| `watch.ts` | `form factor` | 8 |
| `androidwear.jsx` | `platform` | 9 |
| `androidwear.js` | `platform` | 10 |
| `androidwear.tsx` | `platform` | 11 |
| `androidwear.ts` | `platform` | 12 |
| `android.jsx` | `platform` | 13 |
| `android.js` | `platform` | 14 |
| `android.tsx` | `platform` | 15 |
| `android.ts` | `platform` | 16 |
| `watch.native.jsx` | `fallback` | 17 |
| `watch.native.js` | `fallback` | 18 |
| `watch.native.tsx` | `fallback` | 19 |
| `watch.native.ts` | `fallback` | 20 |
| `native.jsx` | `fallback` | 21 |
| `native.js` | `fallback` | 22 |
| `native.tsx` | `fallback` | 23 |
| `native.ts` | `fallback` | 24 |
| `mjs` | `fallback` | 25 |
| `jsx` | `fallback` | 26 |
| `js` | `fallback` | 27 |
| `json` | `fallback` | 28 |
| `wasm` | `fallback` | 29 |
| `tsx` | `fallback` | 30 |
| `ts` | `fallback` | 31 |

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

## Project Configuration

| Feature        | Version  |
| -------------- | :------: |
| Gradle         | `4.10.1` |
| Android Gradle | `3.3.1`  |
| Kotlin         | `1.3.20` |
| Target SDK     |   `27`   |

## Run on Simulator

```
rnv run -p androidwear
```

## Run on Device

```
rnv run -p androidwear -d
```

## Deploy on Device

This will run production version on your device (not connected to metro bundler)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p androidwear -s release -d
```

## Android X support

androidX is enabled by default

make sure you have this piece of script in package.json

```
"scripts" : {
  "postinstall": "jetify"
}
```

## Hermes support

Hermes can be enabled or disabled with `enableHermes` prop in `renative.json:platforms.androidwear.enableHermes`
or `renative.json:platforms.androidwear.buildSchemes.[SCHEME].enableHermes`

NOTE: There is a bug in RN. for now you must NOT have running bundler (`$ rnv start`) in order for wear sim to work

## Advanced

Clean and Re-build platform project

```
rnv run -p androidwear -r
```

Launch specific emulator:

```
rnv target launch -p androidwear -t Android_Wear_Round_API_28
```

## Android X support

androidX is enabled by default

make sure you have this piece of script in package.json

```
"scripts" : {
  "postinstall": "jetify"
}
```

## Hermes support

Hermes can be enabled or disabled with `enableHermes` prop in `renative.json:platforms.androidwear.enableHermes`
or `renative.json:platforms.androidwear.buildSchemes.[SCHEME].enableHermes`

## App Config

[see: Android based config](api-config.md#android-props)
