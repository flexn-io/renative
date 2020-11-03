---
id: platform-android
title: Android Platform
sidebar_label: Android
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

<img src="https://renative.org/img/rnv_android.gif" height="250"/>

## Overview

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

| Extension | Type    | Priority  |
| --------- | --------- | :-------: |
| `android.mobile.jsx` | `form factor` | 1 |
| `android.mobile.js` | `form factor` | 2 |
| `android.mobile.tsx` | `form factor` | 3 |
| `android.mobile.ts` | `form factor` | 4 |
| `mobile.jsx` | `form factor` | 5 |
| `mobile.js` | `form factor` | 6 |
| `mobile.tsx` | `form factor` | 7 |
| `mobile.ts` | `form factor` | 8 |
| `android.jsx` | `platform` | 9 |
| `android.js` | `platform` | 10 |
| `android.tsx` | `platform` | 11 |
| `android.ts` | `platform` | 12 |
| `mobile.native.jsx` | `fallback` | 13 |
| `mobile.native.js` | `fallback` | 14 |
| `mobile.native.tsx` | `fallback` | 15 |
| `mobile.native.ts` | `fallback` | 16 |
| `native.jsx` | `fallback` | 17 |
| `native.js` | `fallback` | 18 |
| `native.tsx` | `fallback` | 19 |
| `native.ts` | `fallback` | 20 |
| `jsx` | `fallback` | 21 |
| `js` | `fallback` | 22 |
| `json` | `fallback` | 23 |
| `wasm` | `fallback` | 24 |
| `tsx` | `fallback` | 25 |
| `ts` | `fallback` | 26 |

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development
-   Windows 10 Pro or a better variant if you want to start the emulator on a Windows machine. Windows Home or Educational do not support Hyper-V and that's required for starting the Android emulators

## Project Configuration

| Feature        | Version  |
| -------------- | :------: |
| Gradle         | `4.10.1` |
| Android Gradle | `3.3.1`  |
| Kotlin         | `1.3.20` |
| Target SDK     |   `27`   |

## Emulators

You can create variety of emulators via Android Studio IDE

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/android1.png" />
    </th>
  </tr>
</table>

## Run on Simulator

```
rnv run -p android
```

## Run on Device

```
rnv run -p android -d
```

## Deploy on Device

This will run production version on your device (not connected to metro bundler)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p android -s release -d
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

Hermes can be enabled or disabled with `enableHermes` prop in `renative.json:platforms.android.enableHermes`
or `renative.json:platforms.android.buildSchemes.[SCHEME].enableHermes`

## Advanced

Clean and Re-build platform project

```
rnv run -p android -r
```

Launch specific android emulator:

```
rnv target launch -p android -t Nexus_5X_API_26
```

Launch app with specific iOS simulator (let ReNative to give you the list of available options):

```
rnv run -p android -t ?
```

Launch specific emulator :

```
rnv target launch -p android -t Nexus_5X_API_26
```

Launch specific emulator (let ReNative to give you the list of available options):

```
rnv target launch -p android -t ?
```

Get list of all available devices

```
rnv target list -p android
```

Get device/simulator logs

```
rnv log -p android
```

Get device/simulator logs with filter

```
rnv log -p android -f com.myapp
```

## App Config

[see: Android based config](api-config.md#android-props)
