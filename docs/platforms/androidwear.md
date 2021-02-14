---
id: androidwear
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

Extenstions are defined via engines. Engines with androidwear support: 

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

Hermes can be enabled or disabled with `"reactNativeEngine": "hermes"` prop in `renative.json:platforms.android.reactNativeEngine`
or `renative.json:platforms.android.buildSchemes.[SCHEME].reactNativeEngine`

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

Hermes can be enabled or disabled with `"reactNativeEngine": "hermes"` prop in `renative.json:platforms.android.reactNativeEngine`
or `renative.json:platforms.android.buildSchemes.[SCHEME].reactNativeEngine`

## App Config

[see: Android based config](api-config.md#android-props)
