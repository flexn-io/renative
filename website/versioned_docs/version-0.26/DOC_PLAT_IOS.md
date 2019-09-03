---
id: version-0.26-ios
title: iOS Platform
sidebar_label: iOS
original_id: ios
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

<img src="https://renative.org/img/rnv_ios.gif" height="250"/>

## Overview


-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

## Requirements

-   [CocoaPods](https://cocoapods.org) `1.5.3` or newer
-   [Xcode](https://developer.apple.com/xcode/) for iOS development

## Project Configuration

| Feature           | Version |
| ----------------- | :-----: |
| Swift             |  `4.1`  |
| Deployment Target | `11.4`  |

## Run on Simulator

```
rnv start
rnv run -p ios
```

## Run on Device

IMPORTANT: before you run ReNative app on the actual iOS device you MUST:

1. Have ios device connected on the same network as your dev machine
2. Have ios developer account properly configured with ability to generate provisioning profiles dynamically (Dynamic Signing)
3. Have correct TeamID assigned `..platforms.ios.teamID` in your `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

You can configure each `buldScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv start
rnv run -p ios -d
```

## Deploy on Device

This will run production version on your device (not connected to metro bundler)
Same prerequisite as above applies here

```
rnv start
rnv run -p ios -s release -d
```

## Advanced

Clean and Re-build platform project

```
rnv run -p ios -r
```

Launch app with specific iOS simulator

```
rnv run -p ios -t "iPhone 6 Plus"
```

Launch app with specific iOS simulator (let ReNative to give you the list of available options):

```
rnv run -p ios -t ?
```

Launch specific emulator :

```
rnv target launch -p ios -t "iPhone 8"
```

Launch specific emulator (let ReNative to give you the list of available options):

```
rnv target launch -p ios -t ?
```

Get list of all available devices

```
rnv target list -p ios
```

Get device/simulator logs

```
rnv log -p ios
```

Get device/simulator logs with filter

```
rnv log -p ios -f com.myapp
```

## App Config

<a href="#apple-based-config">see: Apple based config</a>
