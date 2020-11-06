---
id: platform-androidtv
title: Android TV Platform
sidebar_label: Android TV
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

<img src="https://renative.org/img/rnv_android-tv.gif" height="250"/>

## Overview

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

## File Extension Support

<!--EXTENSION_SUPPORT_START-->


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
rnv run -p androidtv
```

## Run on Device

```
rnv run -p androidtv -d
```

## Deploy on Device

This will run production version on your device (not connected to metro bundler)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p androidtv -s release -d
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

Hermes can be enabled or disabled with `enableHermes` prop in `renative.json:platforms.androidtv.enableHermes`
or `renative.json:platforms.androidtv.buildSchemes.[SCHEME].enableHermes`

## Advanced

Clean and Re-build platform project

```
rnv run -p androidtv -r
```

Launch specific emulator:

```
rnv target launch -p androidtv -t Android_TV_720p_API_22
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

Hermes can be enabled or disabled with `enableHermes` prop in `renative.json:platforms.androidtv.enableHermes`
or `renative.json:platforms.androidtv.buildSchemes.[SCHEME].enableHermes`

## App Config

[see: Android based config](api-config.md#android-props)
