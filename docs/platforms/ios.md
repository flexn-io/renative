---
id: ios
title: iOS Platform
sidebar_label: iOS
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

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

Extenstions are defined via engines. Engines with ios support: 

<!--EXTENSION_SUPPORT_END-->

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

`renative.json` scheme snippet for ad-hoc build (capable to run on device) with Automatic Signing

```json
{
    "platforms": {
        "ios": {
            "buildSchemes": {
                "ad-hoc": {
                    "teamID": "YOUR_APPLE_TEAM_ID",
                    "provisioningStyle": "Automatic",
                    "runScheme": "Release",
                    "bundleAssets": true,
                    "bundleIsDev": false
                }
            }
        }
    }
}
```

`renative.json` scheme snippet for ad-hoc build (capable to run on device) with Manual Signing

```json
{
    "platforms": {
        "ios": {
            "buildSchemes": {
                "ad-hoc": {
                    "teamID": "YOUR_APPLE_TEAM_ID",
                    "provisioningStyle": "Manual",
                    "codeSignIdentity": "iPhone Developer",
                    "provisionProfileSpecifier": "YOUR_PROVISIONING_PROFILE_NAME"
                }
            }
        }
    }
}
```

```
rnv start
rnv run -p ios -s ad-hoc -d
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

## App Store Releases

`renative.json` scheme snippet for automatic signing releases

```json
{
    "platforms": {
        "ios": {
            "buildSchemes": {
                "appstore": {
                    "teamID": "YOUR_APPLE_TEAM_ID",
                    "runScheme": "Release",
                    "bundleAssets": true,
                    "bundleIsDev": false,
                    "exportOptions": {
                        "method": "app-store",
                        "uploadBitcode": true,
                        "compileBitcode": false,
                        "uploadSymbols": true,
                        "signingStyle": "automatic",
                        "signingCertificate": "iPhone Distribution"
                    }
                }
            }
        }
    }
}
```

`renative.json` scheme snippet for manual signing releases

```json
{
    "platforms": {
        "ios": {
            "buildSchemes": {
                "appstore": {
                    "teamID": "YOUR_APPLE_TEAM_ID",
                    "runScheme": "Release",
                    "bundleAssets": true,
                    "provisioningStyle": "Manual",
                    "codeSignIdentity": "iPhone Distribution",
                    "provisionProfileSpecifier": "YOUR_PROVISIONING_PROFILE_NAME",
                    "exportOptions": {
                        "method": "app-store",
                        "uploadBitcode": true,
                        "compileBitcode": false,
                        "uploadSymbols": true,
                        "signingStyle": "manual",
                        "signingCertificate": "iPhone Distribution",
                        "provisioningProfiles": {
                            "YOUR_BUNDLE_ID": "YOUR_PROVISIONING_PROFILE_NAME"
                        }
                    }
                }
            }
        }
    }
}
```

Create IPA:

```
rnv export -p ios -s appstore
```

## Advanced configuration examples

Adding new props to plist:

```json
{
    "platforms": {
        "ios": {
            "plist": {
                "UIBackgroundModes": ["audio", "remote-notification"],
                "ITSAppUsesNonExemptEncryption": false
            }
        }
    }
}
```

## App Config

[see: iOS based config](api-config.md#ios-props)
