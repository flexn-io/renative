---
id: version-0.27.0-android
title: Android Platform
sidebar_label: Android
original_id: android
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

## Android X support

Requires:

0) Install Jetifier:

`npm i -S -E jetifier`

1) renative.json

```
"platforms": {
    "android": {
      "enableAndroidX": true,
      "gradle.properties": {
         "android.useDeprecatedNdk": true,
         "android.enableJetifier": true,
         "android.useAndroidX": true
      }
   }
}
```


2) package.json

```
"scripts" : {
  "postinstall": "jetify"
}
```

## Run on Simulator

```
rnv start
rnv run -p android
```

## Run on Device

```
rnv start
rnv run -p android -d
```

## Deploy on Device

This will run production version on your device (not connected to metro bundler)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv start
rnv run -p android -s release -d
```

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

<a href="#android-based-config">see: Android based config</a>
