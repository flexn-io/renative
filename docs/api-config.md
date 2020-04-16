---
id: api-config
title: renative.json API Reference
sidebar_label: renative.json
---

# Config Spec

```json
{
  "env": {},
  "hidden": false,
  "definitions": {},
  "sdks": {
    ...SDK_PROPS
  },
  "paths": {
    ...PATH_PROPS
  },
  "defaults": {
    ...DEFAULTS_PROPS
  },
  "plugins": {
    "[PLUGIN_KEY]": {
      ...PLUGIN_PROPS
    }
  },
  "permissions": {
    "[PLATFORM]": {}
  },
  "common": {
    ...COMMON_PROPS
    ...BUILD_SCHEME_PROPS
  },
  "platforms": {
    "[PLATFORM]": {
      ...COMMON_PROPS
      ...[PLATFORM]_COMMON_PROPS
      ...BUILD_SCHEME_PROPS
    }
  },
  "runtime": {}
}
```

## env

Define environment variables

## hidden

Hide app config from available options in CLI. Used mostly to hide base configs other would inherit from

## definitions

Define injectable props to be reused across config file

## sdks

Define paths to your SDK Configurations

```json
{
    "sdks": {
        "ANDROID_SDK": "",
        "ANDROID_NDK": "",
        "IOS_SDK": "",
        "TIZEN_SDK": "",
        "WEBOS_SDK": "",
        "KAIOS_SDK": ""
    }
}
```

## workspaceID

Current workspace this project belongs to

```json
{
    "workspaceID": "rnv"
}
```

## paths

Define custom paths for RNV to look into

```json
{
    "paths": {
        "entryDir": "./",
        "platformAssetsDir": "./platformAssets",
        "platformBuildsDir": "./platformBuilds"
    }
}
```

## defaults

Default system config for this project

```json
{
    "defaults": {
        "supportedPlatforms": [
            "ios",
            "android",
            "androidtv",
            "web",
            "macos",
            "tvos",
            "androidwear"
        ],
        "template": "",
        "schemes": {},
        "targets": {}
    }
}
```

## enableAnalytics

Enable or disable sending analytics to improve ReNative

## plugins

Plugin configurations

```json
{
    "plugins": {
        "plugin-name": {
            "version": "",
            "enabled": true,
            "no-npm": false,
            "ios": {
                "isStatic": false
            },
            "android": {},
            "webpack": {
                "modulePaths": [],
                "moduleAliases": {}
            }
        }
    }
}
```

### ios

```json
{
    "plugins": {
        "plugin-name": {
            "ios": {
                "isStatic": false,
                "appDelegateMethods": {},
                "podName": "",
                "path": ""
            }
        }
    }
}
```

## permissions

Define list of permissions to be used in project

```json
{
    "permissions": {
        "ios": {
            "NSAppleMusicUsageDescription": {
                "desc": "Get favorite music"
            },
            "NSBluetoothPeripheralUsageDescription": {
                "desc": "Allow you to use your bluetooth to play music"
            },
            "NSCalendarsUsageDescription": {
                "desc": "Calendar for add events"
            },
            "NSCameraUsageDescription": {
                "desc": "Need camera to scan QR Codes"
            },
            "NSLocationWhenInUseUsageDescription": {
                "desc": "Geolocation tags for photos"
            },
            "NSMicrophoneUsageDescription": {
                "desc": "Need microphone for videos"
            },
            "NSMotionUsageDescription": {
                "desc": "To know when device is moving"
            },
            "NSPhotoLibraryAddUsageDescription": {
                "desc": "Need library to save images"
            },
            "NSPhotoLibraryUsageDescription": {
                "desc": "Allows to upload images from photo library"
            },
            "NSSpeechRecognitionUsageDescription": {
                "desc": "Speech Recognition to run in app commands"
            },
            "NSContactsUsageDescription": {
                "desc": "Get contacts list"
            },
            "NSFaceIDUsageDescription": {
                "desc": "Requires FaceID access to allows you quick and secure access."
            },
            "NSLocationAlwaysUsageDescription": {
                "desc": "Geolocation tags for photos"
            },
            "NSBluetoothAlwaysUsageDescription": {
                "desc": "Allow you to use your bluetooth to play music"
            },
            "NSLocationAlwaysAndWhenInUseUsageDescription": {
                "desc": "Geolocation tags for photos"
            }
        },
        "android": {
            "WAKE_LOCK": {
                "key": "android.permission.WAKE_LOCK"
            },
            "INTERNET": {
                "key": "android.permission.INTERNET"
            },
            "SYSTEM_ALERT_WINDOW": {
                "key": "android.permission.SYSTEM_ALERT_WINDOW"
            },
            "CAMERA": {
                "key": "android.permission.CAMERA"
            },
            "RECORD_AUDIO": {
                "key": "android.permission.RECORD_AUDIO"
            },
            "RECORD_VIDEO": {
                "key": "android.permission.RECORD_VIDEO"
            },
            "READ_EXTERNAL_STORAGE": {
                "key": "android.permission.READ_EXTERNAL_STORAGE"
            },
            "WRITE_EXTERNAL_STORAGE": {
                "key": "android.permission.WRITE_EXTERNAL_STORAGE"
            },
            "ACCESS_FINE_LOCATION": {
                "key": "android.permission.ACCESS_FINE_LOCATION"
            },
            "ACCESS_COARSE_LOCATION": {
                "key": "android.permission.ACCESS_COARSE_LOCATION"
            },
            "VIBRATE": {
                "key": "android.permission.VIBRATE"
            },
            "ACCESS_NETWORK_STATE": {
                "key": "android.permission.ACCESS_NETWORK_STATE"
            },
            "ACCESS_WIFI_STATE": {
                "key": "android.permission.ACCESS_WIFI_STATE"
            },
            "RECEIVE_BOOT_COMPLETED": {
                "key": "android.permission.RECEIVE_BOOT_COMPLETED"
            },
            "WRITE_CONTACTS": {
                "key": "android.permission.WRITE_CONTACTS"
            },
            "READ_CALL_LOG": {
                "key": "android.permission.READ_CALL_LOG"
            },
            "USE_FINGERPRINT": {
                "key": "android.permission.USE_FINGERPRINT"
            }
        }
    }
}
```

## common

Common properties inherited for every platform

```json
{
    "common": {
        "id": "",
        "title": "",
        "description": "",
        "author": {
            "name": "",
            "email": "",
            "url": ""
        },
        "license": "",
        "runScheme": "",
        "bundleAssets": false,
        "entryFile": "",
        "scheme": "",
        "bundleAssets": true,
        "bundleIsDev": true,
        "includedPlugins": [],
        "excludedPlugins": [],
        "includedPermissions": [],
        "excludedPermissions": [],
        "includedFonts": [],
        "excludedFonts": [],
        "backgroundColor": "",
        "port": 1111,
        "versionCodeOffset": 0,
        "runtime": {}
    }
}
```

## platforms

Platform specififc configurations

```json
{
    "platforms": {
        "ios": {},
        "android": {},
        "tvos": {},
        "web": {}
    }
}
```

### ios

```json
{
    "platforms": {
        "ios": {
            "appDelegateImports": [],
            "appDelegateMethods": {},
            "Podfile": {
                "sources": []
            },
            "plist": {},
            "xcodeproj": {},
            "appDelegateApplicationMethods": {
                "didFinishLaunchingWithOptions": [],
                "open": [],
                "supportedInterfaceOrientationsFor": [],
                "didReceiveRemoteNotification": [],
                "didFailToRegisterForRemoteNotificationsWithError": [],
                "didReceive": [],
                "didRegister": [],
                "didRegisterForRemoteNotificationsWithDeviceToken": []
            }
        }
    }
}
```

### buildSchemes

```json
{
    "[PLATFORM]": {
        "buildSchemes": {
            "[BUILD_SCHEME_KEY]": {}
        }
    }
}
```

## runtime

Special runtime injection object to be available for runtime code via `platformAssets/runtime.json`

```json
{
    "runtime": {
        "foo": "bar"
    }
}
```

### iOS Config Props

```json
{
    "teamID": "",
    "deploymentTarget": "",
    "provisioningStyle": "",
    "systemCapabilities": {},
    "scheme": "",
    "entitlements": {},
    "orientationSupport": {
        "phone": [],
        "tab": []
    }
}
```

## \*.android

```json
{
    "gradle.properties": {},
    "AndroidManifest": {},
    "BuildGradle": {},
    "AppBuildGradle": {},
    "implementation": ""
}
```

## plugins.android

```json
{
    "path": "",
    "package": ""
}
```

## platforms.android

```json
{
    "universalApk": false,
    "multipleAPKs": false,
    "minSdkVersion": 21,
    "signingConfig": "",
    "aab": false,
    "storeFile": "",
    "storePassword": "",
    "keyAlias": "",
    "keyPassword": "",
    "enableHermes": false
}
```

## platforms.web

```json
{
    "environment": "",
    "webpackConfig": {
        "devServerHost": "",
        "customScripts": []
    }
}
```

## platforms.tizen

```json
{
    "appName": "",
    "package": "",
    "certificateProfile": ""
}
```
