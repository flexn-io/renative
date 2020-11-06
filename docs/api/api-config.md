---
id: config
title: renative.json API Reference
sidebar_label: renative.json
---

Following Config reference applies to all `renative.json` files, including:

`./renative.json`

`./appConfigs/base/renative.json`

`./appConfigs/\<APP_ID\>/renative.json`

`\<WORKSPACE\>/renative.json`

`\<WORKSPACE\>/\<PROJECT_ID\>/renative.json`

`\<WORKSPACE\>/\<PROJECT_ID\>/appConfigs/base/renative.json`

`\<WORKSPACE\>/\<PROJECT_ID\>/appConfigs/\<APP_ID\>/renative.json`


---
## common

**path**
`renative.json/#/common`

**type** `object`

Common config props used as default props for all available buildSchemes

**examples**


```json
{
  "common": {
    "author": {
      "name": "Pavel Jacko",
      "email": "Pavel Jacko <pavel.jacko@gmail.com>",
      "url": "https://github.com/pavjacko"
    },
    "license": "MIT",
    "includedPlugins": [
      "*"
    ],
    "includedFonts": [
      "*"
    ],
    "backgroundColor": "#111111",
    "runtime": {
      "welcomeMessage": "Hello ReNative!"
    }
  }
}
```






---
### common.author

**path**
`renative.json/#/common.author`

**type** `object`








---
### common.backgroundColor

**path**
`renative.json/#/common.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







---
### common.buildSchemes

**path**
`renative.json/#/common.buildSchemes`

**type** `object`







#### common.buildSchemes.[object].author

**path**
`renative.json/#/common.buildSchemes.[object].author`

**type** `object`








#### common.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/common.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### common.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/common.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### common.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/common.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### common.buildSchemes.[object].deploy

**path**
`renative.json/#/common.buildSchemes.[object].deploy`

**type** `object`







#### common.buildSchemes.[object].deploy.type

**path**
`renative.json/#/common.buildSchemes.[object].deploy.type`

**type** `string`









#### common.buildSchemes.[object].description

**path**
`renative.json/#/common.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### common.buildSchemes.[object].enabled

**path**
`renative.json/#/common.buildSchemes.[object].enabled`

**type** `boolean`








#### common.buildSchemes.[object].engine

**path**
`renative.json/#/common.buildSchemes.[object].engine`

**type** `string`








#### common.buildSchemes.[object].entryFile

**path**
`renative.json/#/common.buildSchemes.[object].entryFile`

**type** `string`








#### common.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/common.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### common.buildSchemes.[object].ext

**path**
`renative.json/#/common.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### common.buildSchemes.[object].id

**path**
`renative.json/#/common.buildSchemes.[object].id`

**type** `string`








#### common.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/common.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### common.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/common.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### common.buildSchemes.[object].includedFonts

**path**
`renative.json/#/common.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### common.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/common.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### common.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/common.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### common.buildSchemes.[object].license

**path**
`renative.json/#/common.buildSchemes.[object].license`

**type** `string`








#### common.buildSchemes.[object].permissions

**path**
`renative.json/#/common.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### common.buildSchemes.[object].runtime

**path**
`renative.json/#/common.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### common.buildSchemes.[object].splashScreen

**path**
`renative.json/#/common.buildSchemes.[object].splashScreen`

**type** `boolean`








#### common.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/common.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### common.buildSchemes.[object].title

**path**
`renative.json/#/common.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### common.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/common.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








---
### common.description

**path**
`renative.json/#/common.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







---
### common.excludedPlugins

**path**
`renative.json/#/common.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







---
### common.ext

**path**
`renative.json/#/common.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







---
### common.id

**path**
`renative.json/#/common.id`

**type** `string`








---
### common.ignoreLogs

**path**
`renative.json/#/common.ignoreLogs`

**type** `boolean`








---
### common.ignoreWarnings

**path**
`renative.json/#/common.ignoreWarnings`

**type** `boolean`








---
### common.includedFonts

**path**
`renative.json/#/common.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







---
### common.includedPermissions

**path**
`renative.json/#/common.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







---
### common.includedPlugins

**path**
`renative.json/#/common.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







---
### common.license

**path**
`renative.json/#/common.license`

**type** `string`








---
### common.permissions

**path**
`renative.json/#/common.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






---
### common.runtime

**path**
`renative.json/#/common.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







---
### common.splashScreen

**path**
`renative.json/#/common.splashScreen`

**type** `boolean`








---
### common.timestampAssets

**path**
`renative.json/#/common.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







---
### common.title

**path**
`renative.json/#/common.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







---
### common.versionedAssets

**path**
`renative.json/#/common.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```










---
## crypto

**path**
`renative.json/#/crypto`

**type** `object`

This prop enables automatic encrypt and decrypt of sensitive information in your project





---
### crypto.decrypt

**path**
`renative.json/#/crypto.decrypt`

**type** `object`







#### crypto.decrypt.source

**path**
`renative.json/#/crypto.decrypt.source`

**type** `string`

Location of encrypted file in your project used as source of decryption into your workspace

**examples**


```json
{
  "source": "PROJECT_HOME/ci/privateConfigs.enc"
}
```








---
### crypto.encrypt

**path**
`renative.json/#/crypto.encrypt`

**type** `object`







#### crypto.encrypt.dest

**path**
`renative.json/#/crypto.encrypt.dest`

**type** `string`

Location of encrypted file in your project used as destination of encryption from your workspace

**examples**


```json
{
  "dest": "PROJECT_HOME/ci/privateConfigs.enc"
}
```








---
### crypto.optional

**path**
`renative.json/#/crypto.optional`

**type** `boolean`











---
## currentTemplate

**path**
`renative.json/#/currentTemplate`

**type** `string`

Currently active template used in this project. this allows you to re-bootstrap whole project by running `rnv template apply`

**examples**


```json
{
  "currentTemplate": "renative-template-hello-world"
}
```









---
## defaultTargets

**path**
`renative.json/#/defaultTargets`

**type** `object`

List of default target simulators and emulators

**examples**


```json
{
  "defaultTargets": {
    "android": "Nexus_5X_API_26",
    "androidtv": "Android_TV_1080p_API_22",
    "androidwear": "Android_Wear_Round_API_28",
    "ios": "iPhone 8",
    "tvos": "Apple TV 4K",
    "tizen": "T-samsung-5.5-x86",
    "tizenwatch": "W-5.5-circle-x86",
    "tizenmobile": "M-5.5-x86",
    "webos": "emulator"
  }
}
```









---
## defaults

**path**
`renative.json/#/defaults`

**type** `object`

Default system config for this project





---
### defaults.ports

**path**
`renative.json/#/defaults.ports`

**type** `object`

Allows you to assign custom port per each supported platform specific to this project. this is useful if you foten switch between multiple projects and do not want to experience constant port conflicts

**examples**


```json
{
  "ports": {
    "ios": 8182,
    "android": 8183,
    "androidtv": 8184,
    "tvos": 8185,
    "macos": 8186,
    "web": 8180,
    "tizen": 8187,
    "webos": 8188,
    "androidwear": 8189,
    "tizenwatch": 8190,
    "tizenmobile": 8191,
    "windows": 8192,
    "kaios": 8193,
    "firefoxos": 8194,
    "firefoxtv": 8114
  }
}
```







---
### defaults.schemes

**path**
`renative.json/#/defaults.schemes`

**type** `object`

List of default schemes for each platform. This is useful if you want to avoid specifying `-s ...` every time your run rnv command. bu default rnv uses `-s debug`. NOTE: you can only use schemes you defined in `buildSchemes`

**examples**


```json
{
  "schemes": {
    "ios": "myCustomScheme",
    "android": "otherCustomScheme"
  }
}
```







---
### defaults.supportedPlatforms

**path**
`renative.json/#/defaults.supportedPlatforms`

**type** `array`

Array list of all supported platforms in current project

**examples**


```json
{
  "supportedPlatforms": [
    "ios",
    "android",
    "androidtv",
    "web",
    "macos",
    "tvos",
    "androidwear"
  ]
}
```







---
### defaults.targets

**path**
`renative.json/#/defaults.targets`

**type** `object`

Override of default targets specific to this project

**examples**


```json
{
  "targets": {
    "ios": "iPhone 8",
    "tvos": "Apple TV 4K"
  }
}
```










---
## description

**path**
`renative.json/#/description`

**type** `string`










---
## enableAnalytics

**path**
`renative.json/#/enableAnalytics`

**type** `boolean`

Enable or disable sending analytics to improve ReNative

**examples**


```json
{
  "enableAnalytics": "true"
}
```



```json
{
  "enableAnalytics": "false"
}
```









---
## enableHookRebuild

**path**
`renative.json/#/enableHookRebuild`

**type** `boolean`

If set to true in `./renative.json` build hooks will be compiled at each rnv command run. If set to `false` (default) rebuild will be triggered only if `dist` folder is missing, `-r` has been passed or you run `rnv hooks run` directly making your rnv commands faster

**examples**


```json
{
  "enableHookRebuild": "true"
}
```



```json
{
  "enableHookRebuild": "false"
}
```









---
## engines

**path**
`renative.json/#/engines`

**type** `object`

List of engines available in this project

**examples**


```json
{
  "engines": {
    "@rnv/engine-rn": "source:rnv",
    "@rnv/engine-rn-web": "source:rnv",
    "@rnv/engine-rn-next": "source:rnv",
    "@rnv/engine-rn-electron": "source:rnv"
  }
}
```



```json
{
  "engines": {
    "@rnv/engine-rn": "source:rnv",
    "custom-engine": {
      "version": "1.0.0"
    }
  }
}
```









---
## ext

**path**
`renative.json/#/ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```









---
## extend

**path**
`renative.json/#/extend`

**type** `string`










---
## hidden

**path**
`renative.json/#/hidden`

**type** `boolean`

If set to true in `./appConfigs/[APP_ID]/renative.json` the APP_ID will be hidden from list of appConfigs `-c`

**examples**


```json
{
  "hidden": "true"
}
```



```json
{
  "hidden": "false"
}
```









---
## id

**path**
`renative.json/#/id`

**type** `string`

ID of the app in `./appConfigs/[APP_ID]/renative.json`. MUST match APP_ID name of the folder

**examples**


```json
{
  "id": "helloworld"
}
```



```json
{
  "id": "someapp"
}
```









---
## integrations

**path**
`renative.json/#/integrations`

**type** `object`










---
## isMonorepo

**path**
`renative.json/#/isMonorepo`

**type** `boolean`










---
## isWrapper

**path**
`renative.json/#/isWrapper`

**type** `boolean`










---
## paths

**path**
`renative.json/#/paths`

**type** `object`

Define custom paths for RNV to look into





---
### paths.appConfigsDir

**path**
`renative.json/#/paths.appConfigsDir`

**type** `string`

Custom path to appConfigs. defaults to `./appConfigs`

**examples**


```json
{
  "appConfigsDir": "./appConfigs"
}
```







---
### paths.platformAssetsDir

**path**
`renative.json/#/paths.platformAssetsDir`

**type** `string`

Custom path to platformAssets folder. defaults to `./platformAssets`

**examples**


```json
{
  "platformAssetsDir": "./platformAssets"
}
```







---
### paths.platformBuildsDir

**path**
`renative.json/#/paths.platformBuildsDir`

**type** `string`

Custom path to platformBuilds folder. defaults to `./platformBuilds`

**examples**


```json
{
  "platformBuildsDir": "./platformBuilds"
}
```







---
### paths.pluginTemplates

**path**
`renative.json/#/paths.pluginTemplates`

**type** `object`


Allows you to define custom plugin template scopes. default scope for all plugins is `rnv`.
this custom scope can then be used by plugin via `"source:myCustomScope"` value

those will allow you to use direct pointer to preconfigured plugin:

```
"plugin-name": "source:myCustomScope"
```

NOTE: by default every plugin you define with scope will also merge any
files defined in overrides automatically to your project.
To skip file overrides coming from source plugin you need to detach it from the scope:

```
{
    "plugins": {
        "plugin-name": {
            "source": ""
        }
    }
}
```


**examples**


```json
{
  "pluginTemplates": {
    "myCustomScope": {
      "npm": "some-renative-template-package",
      "path": "./pluginTemplates"
    }
  }
}
```










---
## permissions

**path**
`renative.json/#/permissions`

**type** `object`

Permission definititions which can be used by app configs via `includedPermissions` and `excludedPermissions` to customize permissions for each app

**examples**


```json
{
  "permissions": {
    "ios": {},
    "android": {}
  }
}
```






---
### permissions.android

**path**
`renative.json/#/permissions.android`

**type** `object`

Android SDK specific permissions

**examples**


```json
{
  "android": {
    "INTERNET": {
      "key": "android.permission.INTERNET",
      "security": "normal"
    },
    "SYSTEM_ALERT_WINDOW": {
      "key": "android.permission.SYSTEM_ALERT_WINDOW",
      "security": "signature"
    }
  }
}
```







---
### permissions.ios

**path**
`renative.json/#/permissions.ios`

**type** `object`

iOS SDK specific permissions

**examples**


```json
{
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
  }
}
```










---
## pipes

**path**
`renative.json/#/pipes`

**type** `array`

To avoid rnv building `buildHooks/src` every time you can specify which specific pipes should trigger recompile of buildHooks

**examples**


```json
{
  "pipes": [
    "configure:after",
    "start:before",
    "deploy:after",
    "export:before",
    "export:after"
  ]
}
```









---
## platforms

**path**
`renative.json/#/platforms`

**type** `object`







---
### platforms.android

**path**
`renative.json/#/platforms.android`

**type** `object`







#### platforms.android.AndroidManifest

**path**
`renative.json/#/platforms.android.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.android.aab

**path**
`renative.json/#/platforms.android.aab`

**type** `boolean`








#### platforms.android.app/build.gradle

**path**
`renative.json/#/platforms.android.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.android.applyPlugin

**path**
`renative.json/#/platforms.android.applyPlugin`

**type** `array`








#### platforms.android.author

**path**
`renative.json/#/platforms.android.author`

**type** `object`








#### platforms.android.backgroundColor

**path**
`renative.json/#/platforms.android.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.android.build.gradle

**path**
`renative.json/#/platforms.android.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.android.buildSchemes

**path**
`renative.json/#/platforms.android.buildSchemes`

**type** `object`







#### platforms.android.buildSchemes.[object].AndroidManifest

**path**
`renative.json/#/platforms.android.buildSchemes.[object].AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.android.buildSchemes.[object].aab

**path**
`renative.json/#/platforms.android.buildSchemes.[object].aab`

**type** `boolean`








#### platforms.android.buildSchemes.[object].app/build.gradle

**path**
`renative.json/#/platforms.android.buildSchemes.[object].app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.android.buildSchemes.[object].applyPlugin

**path**
`renative.json/#/platforms.android.buildSchemes.[object].applyPlugin`

**type** `array`








#### platforms.android.buildSchemes.[object].author

**path**
`renative.json/#/platforms.android.buildSchemes.[object].author`

**type** `object`








#### platforms.android.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.android.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.android.buildSchemes.[object].build.gradle

**path**
`renative.json/#/platforms.android.buildSchemes.[object].build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.android.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.android.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.android.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.android.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.android.buildSchemes.[object].compileSdkVersion

**path**
`renative.json/#/platforms.android.buildSchemes.[object].compileSdkVersion`

**type** `integer`








#### platforms.android.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.android.buildSchemes.[object].deploy`

**type** `object`







#### platforms.android.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.android.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.android.buildSchemes.[object].description

**path**
`renative.json/#/platforms.android.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.android.buildSchemes.[object].enableAndroidX

**path**
`renative.json/#/platforms.android.buildSchemes.[object].enableAndroidX`

**type** `boolean`








#### platforms.android.buildSchemes.[object].enableHermes

**path**
`renative.json/#/platforms.android.buildSchemes.[object].enableHermes`

**type** `boolean`








#### platforms.android.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.android.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.android.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.android.buildSchemes.[object].engine`

**type** `string`








#### platforms.android.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.android.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.android.buildSchemes.[object].excludedFeatures

**path**
`renative.json/#/platforms.android.buildSchemes.[object].excludedFeatures`

**type** `array`








#### platforms.android.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.android.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.android.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.android.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.android.buildSchemes.[object].gradle.properties

**path**
`renative.json/#/platforms.android.buildSchemes.[object].gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.android.buildSchemes.[object].id

**path**
`renative.json/#/platforms.android.buildSchemes.[object].id`

**type** `string`








#### platforms.android.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.android.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.android.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.android.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.android.buildSchemes.[object].includedFeatures

**path**
`renative.json/#/platforms.android.buildSchemes.[object].includedFeatures`

**type** `array`








#### platforms.android.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.android.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.android.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.android.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.android.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.android.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.android.buildSchemes.[object].keyAlias

**path**
`renative.json/#/platforms.android.buildSchemes.[object].keyAlias`

**type** `string`








#### platforms.android.buildSchemes.[object].keyPassword

**path**
`renative.json/#/platforms.android.buildSchemes.[object].keyPassword`

**type** `string`








#### platforms.android.buildSchemes.[object].license

**path**
`renative.json/#/platforms.android.buildSchemes.[object].license`

**type** `string`








#### platforms.android.buildSchemes.[object].minSdkVersion

**path**
`renative.json/#/platforms.android.buildSchemes.[object].minSdkVersion`

**type** `integer`








#### platforms.android.buildSchemes.[object].multipleAPKs

**path**
`renative.json/#/platforms.android.buildSchemes.[object].multipleAPKs`

**type** `boolean`








#### platforms.android.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.android.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.android.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.android.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.android.buildSchemes.[object].signingConfig

**path**
`renative.json/#/platforms.android.buildSchemes.[object].signingConfig`

**type** `string`








#### platforms.android.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.android.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.android.buildSchemes.[object].storeFile

**path**
`renative.json/#/platforms.android.buildSchemes.[object].storeFile`

**type** `string`








#### platforms.android.buildSchemes.[object].storePassword

**path**
`renative.json/#/platforms.android.buildSchemes.[object].storePassword`

**type** `string`








#### platforms.android.buildSchemes.[object].targetSdkVersion

**path**
`renative.json/#/platforms.android.buildSchemes.[object].targetSdkVersion`

**type** `integer`








#### platforms.android.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.android.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.android.buildSchemes.[object].title

**path**
`renative.json/#/platforms.android.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.android.buildSchemes.[object].universalApk

**path**
`renative.json/#/platforms.android.buildSchemes.[object].universalApk`

**type** `boolean`








#### platforms.android.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.android.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








#### platforms.android.bundleAssets

**path**
`renative.json/#/platforms.android.bundleAssets`

**type** `boolean`








#### platforms.android.bundleIsDev

**path**
`renative.json/#/platforms.android.bundleIsDev`

**type** `boolean`








#### platforms.android.compileSdkVersion

**path**
`renative.json/#/platforms.android.compileSdkVersion`

**type** `integer`








#### platforms.android.deploy

**path**
`renative.json/#/platforms.android.deploy`

**type** `object`







#### platforms.android.deploy.type

**path**
`renative.json/#/platforms.android.deploy.type`

**type** `string`









#### platforms.android.description

**path**
`renative.json/#/platforms.android.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.android.enableAndroidX

**path**
`renative.json/#/platforms.android.enableAndroidX`

**type** `boolean`








#### platforms.android.enableHermes

**path**
`renative.json/#/platforms.android.enableHermes`

**type** `boolean`








#### platforms.android.engine

**path**
`renative.json/#/platforms.android.engine`

**type** `string`








#### platforms.android.entryFile

**path**
`renative.json/#/platforms.android.entryFile`

**type** `string`








#### platforms.android.excludedFeatures

**path**
`renative.json/#/platforms.android.excludedFeatures`

**type** `array`








#### platforms.android.excludedPlugins

**path**
`renative.json/#/platforms.android.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.android.ext

**path**
`renative.json/#/platforms.android.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.android.gradle.properties

**path**
`renative.json/#/platforms.android.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.android.id

**path**
`renative.json/#/platforms.android.id`

**type** `string`








#### platforms.android.ignoreLogs

**path**
`renative.json/#/platforms.android.ignoreLogs`

**type** `boolean`








#### platforms.android.ignoreWarnings

**path**
`renative.json/#/platforms.android.ignoreWarnings`

**type** `boolean`








#### platforms.android.includedFeatures

**path**
`renative.json/#/platforms.android.includedFeatures`

**type** `array`








#### platforms.android.includedFonts

**path**
`renative.json/#/platforms.android.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.android.includedPermissions

**path**
`renative.json/#/platforms.android.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.android.includedPlugins

**path**
`renative.json/#/platforms.android.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.android.keyAlias

**path**
`renative.json/#/platforms.android.keyAlias`

**type** `string`








#### platforms.android.keyPassword

**path**
`renative.json/#/platforms.android.keyPassword`

**type** `string`








#### platforms.android.license

**path**
`renative.json/#/platforms.android.license`

**type** `string`








#### platforms.android.minSdkVersion

**path**
`renative.json/#/platforms.android.minSdkVersion`

**type** `integer`








#### platforms.android.multipleAPKs

**path**
`renative.json/#/platforms.android.multipleAPKs`

**type** `boolean`








#### platforms.android.permissions

**path**
`renative.json/#/platforms.android.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.android.runtime

**path**
`renative.json/#/platforms.android.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.android.signingConfig

**path**
`renative.json/#/platforms.android.signingConfig`

**type** `string`








#### platforms.android.splashScreen

**path**
`renative.json/#/platforms.android.splashScreen`

**type** `boolean`








#### platforms.android.storeFile

**path**
`renative.json/#/platforms.android.storeFile`

**type** `string`








#### platforms.android.storePassword

**path**
`renative.json/#/platforms.android.storePassword`

**type** `string`








#### platforms.android.targetSdkVersion

**path**
`renative.json/#/platforms.android.targetSdkVersion`

**type** `integer`








#### platforms.android.timestampAssets

**path**
`renative.json/#/platforms.android.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.android.title

**path**
`renative.json/#/platforms.android.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.android.universalApk

**path**
`renative.json/#/platforms.android.universalApk`

**type** `boolean`








#### platforms.android.versionedAssets

**path**
`renative.json/#/platforms.android.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








---
### platforms.androidtv

**path**
`renative.json/#/platforms.androidtv`

**type** `object`







#### platforms.androidtv.AndroidManifest

**path**
`renative.json/#/platforms.androidtv.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.androidtv.aab

**path**
`renative.json/#/platforms.androidtv.aab`

**type** `boolean`








#### platforms.androidtv.app/build.gradle

**path**
`renative.json/#/platforms.androidtv.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.androidtv.applyPlugin

**path**
`renative.json/#/platforms.androidtv.applyPlugin`

**type** `array`








#### platforms.androidtv.author

**path**
`renative.json/#/platforms.androidtv.author`

**type** `object`








#### platforms.androidtv.backgroundColor

**path**
`renative.json/#/platforms.androidtv.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.androidtv.build.gradle

**path**
`renative.json/#/platforms.androidtv.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.androidtv.buildSchemes

**path**
`renative.json/#/platforms.androidtv.buildSchemes`

**type** `object`







#### platforms.androidtv.buildSchemes.[object].AndroidManifest

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.androidtv.buildSchemes.[object].aab

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].aab`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].app/build.gradle

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.androidtv.buildSchemes.[object].applyPlugin

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].applyPlugin`

**type** `array`








#### platforms.androidtv.buildSchemes.[object].author

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].author`

**type** `object`








#### platforms.androidtv.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.androidtv.buildSchemes.[object].build.gradle

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.androidtv.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].compileSdkVersion

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].compileSdkVersion`

**type** `integer`








#### platforms.androidtv.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].deploy`

**type** `object`







#### platforms.androidtv.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.androidtv.buildSchemes.[object].description

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.androidtv.buildSchemes.[object].enableAndroidX

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].enableAndroidX`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].enableHermes

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].enableHermes`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].engine`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].excludedFeatures

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].excludedFeatures`

**type** `array`








#### platforms.androidtv.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidtv.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.androidtv.buildSchemes.[object].gradle.properties

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.androidtv.buildSchemes.[object].id

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].id`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].includedFeatures

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].includedFeatures`

**type** `array`








#### platforms.androidtv.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.androidtv.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.androidtv.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidtv.buildSchemes.[object].keyAlias

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].keyAlias`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].keyPassword

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].keyPassword`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].license

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].license`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].minSdkVersion

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].minSdkVersion`

**type** `integer`








#### platforms.androidtv.buildSchemes.[object].multipleAPKs

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].multipleAPKs`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.androidtv.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.androidtv.buildSchemes.[object].signingConfig

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].signingConfig`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].storeFile

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].storeFile`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].storePassword

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].storePassword`

**type** `string`








#### platforms.androidtv.buildSchemes.[object].targetSdkVersion

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].targetSdkVersion`

**type** `integer`








#### platforms.androidtv.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.androidtv.buildSchemes.[object].title

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.androidtv.buildSchemes.[object].universalApk

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].universalApk`

**type** `boolean`








#### platforms.androidtv.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.androidtv.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








#### platforms.androidtv.bundleAssets

**path**
`renative.json/#/platforms.androidtv.bundleAssets`

**type** `boolean`








#### platforms.androidtv.bundleIsDev

**path**
`renative.json/#/platforms.androidtv.bundleIsDev`

**type** `boolean`








#### platforms.androidtv.compileSdkVersion

**path**
`renative.json/#/platforms.androidtv.compileSdkVersion`

**type** `integer`








#### platforms.androidtv.deploy

**path**
`renative.json/#/platforms.androidtv.deploy`

**type** `object`







#### platforms.androidtv.deploy.type

**path**
`renative.json/#/platforms.androidtv.deploy.type`

**type** `string`









#### platforms.androidtv.description

**path**
`renative.json/#/platforms.androidtv.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.androidtv.enableAndroidX

**path**
`renative.json/#/platforms.androidtv.enableAndroidX`

**type** `boolean`








#### platforms.androidtv.enableHermes

**path**
`renative.json/#/platforms.androidtv.enableHermes`

**type** `boolean`








#### platforms.androidtv.engine

**path**
`renative.json/#/platforms.androidtv.engine`

**type** `string`








#### platforms.androidtv.entryFile

**path**
`renative.json/#/platforms.androidtv.entryFile`

**type** `string`








#### platforms.androidtv.excludedFeatures

**path**
`renative.json/#/platforms.androidtv.excludedFeatures`

**type** `array`








#### platforms.androidtv.excludedPlugins

**path**
`renative.json/#/platforms.androidtv.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidtv.ext

**path**
`renative.json/#/platforms.androidtv.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.androidtv.gradle.properties

**path**
`renative.json/#/platforms.androidtv.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.androidtv.id

**path**
`renative.json/#/platforms.androidtv.id`

**type** `string`








#### platforms.androidtv.ignoreLogs

**path**
`renative.json/#/platforms.androidtv.ignoreLogs`

**type** `boolean`








#### platforms.androidtv.ignoreWarnings

**path**
`renative.json/#/platforms.androidtv.ignoreWarnings`

**type** `boolean`








#### platforms.androidtv.includedFeatures

**path**
`renative.json/#/platforms.androidtv.includedFeatures`

**type** `array`








#### platforms.androidtv.includedFonts

**path**
`renative.json/#/platforms.androidtv.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.androidtv.includedPermissions

**path**
`renative.json/#/platforms.androidtv.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.androidtv.includedPlugins

**path**
`renative.json/#/platforms.androidtv.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidtv.keyAlias

**path**
`renative.json/#/platforms.androidtv.keyAlias`

**type** `string`








#### platforms.androidtv.keyPassword

**path**
`renative.json/#/platforms.androidtv.keyPassword`

**type** `string`








#### platforms.androidtv.license

**path**
`renative.json/#/platforms.androidtv.license`

**type** `string`








#### platforms.androidtv.minSdkVersion

**path**
`renative.json/#/platforms.androidtv.minSdkVersion`

**type** `integer`








#### platforms.androidtv.multipleAPKs

**path**
`renative.json/#/platforms.androidtv.multipleAPKs`

**type** `boolean`








#### platforms.androidtv.permissions

**path**
`renative.json/#/platforms.androidtv.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.androidtv.runtime

**path**
`renative.json/#/platforms.androidtv.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.androidtv.signingConfig

**path**
`renative.json/#/platforms.androidtv.signingConfig`

**type** `string`








#### platforms.androidtv.splashScreen

**path**
`renative.json/#/platforms.androidtv.splashScreen`

**type** `boolean`








#### platforms.androidtv.storeFile

**path**
`renative.json/#/platforms.androidtv.storeFile`

**type** `string`








#### platforms.androidtv.storePassword

**path**
`renative.json/#/platforms.androidtv.storePassword`

**type** `string`








#### platforms.androidtv.targetSdkVersion

**path**
`renative.json/#/platforms.androidtv.targetSdkVersion`

**type** `integer`








#### platforms.androidtv.timestampAssets

**path**
`renative.json/#/platforms.androidtv.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.androidtv.title

**path**
`renative.json/#/platforms.androidtv.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.androidtv.universalApk

**path**
`renative.json/#/platforms.androidtv.universalApk`

**type** `boolean`








#### platforms.androidtv.versionedAssets

**path**
`renative.json/#/platforms.androidtv.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








---
### platforms.androidwear

**path**
`renative.json/#/platforms.androidwear`

**type** `object`







#### platforms.androidwear.AndroidManifest

**path**
`renative.json/#/platforms.androidwear.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.androidwear.aab

**path**
`renative.json/#/platforms.androidwear.aab`

**type** `boolean`








#### platforms.androidwear.app/build.gradle

**path**
`renative.json/#/platforms.androidwear.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.androidwear.applyPlugin

**path**
`renative.json/#/platforms.androidwear.applyPlugin`

**type** `array`








#### platforms.androidwear.author

**path**
`renative.json/#/platforms.androidwear.author`

**type** `object`








#### platforms.androidwear.backgroundColor

**path**
`renative.json/#/platforms.androidwear.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.androidwear.build.gradle

**path**
`renative.json/#/platforms.androidwear.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.androidwear.buildSchemes

**path**
`renative.json/#/platforms.androidwear.buildSchemes`

**type** `object`







#### platforms.androidwear.buildSchemes.[object].AndroidManifest

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### platforms.androidwear.buildSchemes.[object].aab

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].aab`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].app/build.gradle

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### platforms.androidwear.buildSchemes.[object].applyPlugin

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].applyPlugin`

**type** `array`








#### platforms.androidwear.buildSchemes.[object].author

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].author`

**type** `object`








#### platforms.androidwear.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.androidwear.buildSchemes.[object].build.gradle

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### platforms.androidwear.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].compileSdkVersion

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].compileSdkVersion`

**type** `integer`








#### platforms.androidwear.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].deploy`

**type** `object`







#### platforms.androidwear.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.androidwear.buildSchemes.[object].description

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.androidwear.buildSchemes.[object].enableAndroidX

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].enableAndroidX`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].enableHermes

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].enableHermes`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].engine`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].excludedFeatures

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].excludedFeatures`

**type** `array`








#### platforms.androidwear.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidwear.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.androidwear.buildSchemes.[object].gradle.properties

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.androidwear.buildSchemes.[object].id

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].id`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].includedFeatures

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].includedFeatures`

**type** `array`








#### platforms.androidwear.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.androidwear.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.androidwear.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidwear.buildSchemes.[object].keyAlias

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].keyAlias`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].keyPassword

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].keyPassword`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].license

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].license`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].minSdkVersion

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].minSdkVersion`

**type** `integer`








#### platforms.androidwear.buildSchemes.[object].multipleAPKs

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].multipleAPKs`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.androidwear.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.androidwear.buildSchemes.[object].signingConfig

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].signingConfig`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].storeFile

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].storeFile`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].storePassword

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].storePassword`

**type** `string`








#### platforms.androidwear.buildSchemes.[object].targetSdkVersion

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].targetSdkVersion`

**type** `integer`








#### platforms.androidwear.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.androidwear.buildSchemes.[object].title

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.androidwear.buildSchemes.[object].universalApk

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].universalApk`

**type** `boolean`








#### platforms.androidwear.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.androidwear.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








#### platforms.androidwear.bundleAssets

**path**
`renative.json/#/platforms.androidwear.bundleAssets`

**type** `boolean`








#### platforms.androidwear.bundleIsDev

**path**
`renative.json/#/platforms.androidwear.bundleIsDev`

**type** `boolean`








#### platforms.androidwear.compileSdkVersion

**path**
`renative.json/#/platforms.androidwear.compileSdkVersion`

**type** `integer`








#### platforms.androidwear.deploy

**path**
`renative.json/#/platforms.androidwear.deploy`

**type** `object`







#### platforms.androidwear.deploy.type

**path**
`renative.json/#/platforms.androidwear.deploy.type`

**type** `string`









#### platforms.androidwear.description

**path**
`renative.json/#/platforms.androidwear.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.androidwear.enableAndroidX

**path**
`renative.json/#/platforms.androidwear.enableAndroidX`

**type** `boolean`








#### platforms.androidwear.enableHermes

**path**
`renative.json/#/platforms.androidwear.enableHermes`

**type** `boolean`








#### platforms.androidwear.engine

**path**
`renative.json/#/platforms.androidwear.engine`

**type** `string`








#### platforms.androidwear.entryFile

**path**
`renative.json/#/platforms.androidwear.entryFile`

**type** `string`








#### platforms.androidwear.excludedFeatures

**path**
`renative.json/#/platforms.androidwear.excludedFeatures`

**type** `array`








#### platforms.androidwear.excludedPlugins

**path**
`renative.json/#/platforms.androidwear.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidwear.ext

**path**
`renative.json/#/platforms.androidwear.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.androidwear.gradle.properties

**path**
`renative.json/#/platforms.androidwear.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### platforms.androidwear.id

**path**
`renative.json/#/platforms.androidwear.id`

**type** `string`








#### platforms.androidwear.ignoreLogs

**path**
`renative.json/#/platforms.androidwear.ignoreLogs`

**type** `boolean`








#### platforms.androidwear.ignoreWarnings

**path**
`renative.json/#/platforms.androidwear.ignoreWarnings`

**type** `boolean`








#### platforms.androidwear.includedFeatures

**path**
`renative.json/#/platforms.androidwear.includedFeatures`

**type** `array`








#### platforms.androidwear.includedFonts

**path**
`renative.json/#/platforms.androidwear.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.androidwear.includedPermissions

**path**
`renative.json/#/platforms.androidwear.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.androidwear.includedPlugins

**path**
`renative.json/#/platforms.androidwear.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.androidwear.keyAlias

**path**
`renative.json/#/platforms.androidwear.keyAlias`

**type** `string`








#### platforms.androidwear.keyPassword

**path**
`renative.json/#/platforms.androidwear.keyPassword`

**type** `string`








#### platforms.androidwear.license

**path**
`renative.json/#/platforms.androidwear.license`

**type** `string`








#### platforms.androidwear.minSdkVersion

**path**
`renative.json/#/platforms.androidwear.minSdkVersion`

**type** `integer`








#### platforms.androidwear.multipleAPKs

**path**
`renative.json/#/platforms.androidwear.multipleAPKs`

**type** `boolean`








#### platforms.androidwear.permissions

**path**
`renative.json/#/platforms.androidwear.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.androidwear.runtime

**path**
`renative.json/#/platforms.androidwear.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.androidwear.signingConfig

**path**
`renative.json/#/platforms.androidwear.signingConfig`

**type** `string`








#### platforms.androidwear.splashScreen

**path**
`renative.json/#/platforms.androidwear.splashScreen`

**type** `boolean`








#### platforms.androidwear.storeFile

**path**
`renative.json/#/platforms.androidwear.storeFile`

**type** `string`








#### platforms.androidwear.storePassword

**path**
`renative.json/#/platforms.androidwear.storePassword`

**type** `string`








#### platforms.androidwear.targetSdkVersion

**path**
`renative.json/#/platforms.androidwear.targetSdkVersion`

**type** `integer`








#### platforms.androidwear.timestampAssets

**path**
`renative.json/#/platforms.androidwear.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.androidwear.title

**path**
`renative.json/#/platforms.androidwear.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.androidwear.universalApk

**path**
`renative.json/#/platforms.androidwear.universalApk`

**type** `boolean`








#### platforms.androidwear.versionedAssets

**path**
`renative.json/#/platforms.androidwear.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```








---
### platforms.chromecast

**path**
`renative.json/#/platforms.chromecast`

**type** `object`







#### platforms.chromecast.author

**path**
`renative.json/#/platforms.chromecast.author`

**type** `object`








#### platforms.chromecast.backgroundColor

**path**
`renative.json/#/platforms.chromecast.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.chromecast.buildSchemes

**path**
`renative.json/#/platforms.chromecast.buildSchemes`

**type** `object`







#### platforms.chromecast.buildSchemes.[object].author

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].author`

**type** `object`








#### platforms.chromecast.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.chromecast.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].deploy`

**type** `object`







#### platforms.chromecast.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.chromecast.buildSchemes.[object].description

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.chromecast.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].engine`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.chromecast.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.chromecast.buildSchemes.[object].id

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].id`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.chromecast.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.chromecast.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.chromecast.buildSchemes.[object].license

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].license`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.chromecast.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.chromecast.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.chromecast.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.chromecast.buildSchemes.[object].title

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.chromecast.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.chromecast.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.chromecast.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.chromecast.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.chromecast.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.chromecast.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.chromecast.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.chromecast.bundleAssets

**path**
`renative.json/#/platforms.chromecast.bundleAssets`

**type** `boolean`








#### platforms.chromecast.bundleIsDev

**path**
`renative.json/#/platforms.chromecast.bundleIsDev`

**type** `boolean`








#### platforms.chromecast.deploy

**path**
`renative.json/#/platforms.chromecast.deploy`

**type** `object`







#### platforms.chromecast.deploy.type

**path**
`renative.json/#/platforms.chromecast.deploy.type`

**type** `string`









#### platforms.chromecast.description

**path**
`renative.json/#/platforms.chromecast.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.chromecast.devServerHost

**path**
`renative.json/#/platforms.chromecast.devServerHost`

**type** `string`








#### platforms.chromecast.engine

**path**
`renative.json/#/platforms.chromecast.engine`

**type** `string`








#### platforms.chromecast.entryFile

**path**
`renative.json/#/platforms.chromecast.entryFile`

**type** `string`








#### platforms.chromecast.excludedPlugins

**path**
`renative.json/#/platforms.chromecast.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.chromecast.ext

**path**
`renative.json/#/platforms.chromecast.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.chromecast.id

**path**
`renative.json/#/platforms.chromecast.id`

**type** `string`








#### platforms.chromecast.ignoreLogs

**path**
`renative.json/#/platforms.chromecast.ignoreLogs`

**type** `boolean`








#### platforms.chromecast.ignoreWarnings

**path**
`renative.json/#/platforms.chromecast.ignoreWarnings`

**type** `boolean`








#### platforms.chromecast.includedFonts

**path**
`renative.json/#/platforms.chromecast.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.chromecast.includedPermissions

**path**
`renative.json/#/platforms.chromecast.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.chromecast.includedPlugins

**path**
`renative.json/#/platforms.chromecast.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.chromecast.license

**path**
`renative.json/#/platforms.chromecast.license`

**type** `string`








#### platforms.chromecast.permissions

**path**
`renative.json/#/platforms.chromecast.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.chromecast.runtime

**path**
`renative.json/#/platforms.chromecast.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.chromecast.splashScreen

**path**
`renative.json/#/platforms.chromecast.splashScreen`

**type** `boolean`








#### platforms.chromecast.timestampAssets

**path**
`renative.json/#/platforms.chromecast.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.chromecast.title

**path**
`renative.json/#/platforms.chromecast.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.chromecast.versionedAssets

**path**
`renative.json/#/platforms.chromecast.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.chromecast.webpackConfig

**path**
`renative.json/#/platforms.chromecast.webpackConfig`

**type** `object`







#### platforms.chromecast.webpackConfig.customScripts

**path**
`renative.json/#/platforms.chromecast.webpackConfig.customScripts`

**type** `array`








#### platforms.chromecast.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.chromecast.webpackConfig.devServerHost`

**type** `string`








#### platforms.chromecast.webpackConfig.extend

**path**
`renative.json/#/platforms.chromecast.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.chromecast.webpackConfig.metaTags

**path**
`renative.json/#/platforms.chromecast.webpackConfig.metaTags`

**type** `object`










---
### platforms.firefoxos

**path**
`renative.json/#/platforms.firefoxos`

**type** `object`







#### platforms.firefoxos.author

**path**
`renative.json/#/platforms.firefoxos.author`

**type** `object`








#### platforms.firefoxos.backgroundColor

**path**
`renative.json/#/platforms.firefoxos.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.firefoxos.buildSchemes

**path**
`renative.json/#/platforms.firefoxos.buildSchemes`

**type** `object`







#### platforms.firefoxos.buildSchemes.[object].author

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].author`

**type** `object`








#### platforms.firefoxos.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.firefoxos.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].deploy`

**type** `object`







#### platforms.firefoxos.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.firefoxos.buildSchemes.[object].description

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.firefoxos.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].engine`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxos.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.firefoxos.buildSchemes.[object].id

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].id`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.firefoxos.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.firefoxos.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxos.buildSchemes.[object].license

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].license`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.firefoxos.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.firefoxos.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.firefoxos.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.firefoxos.buildSchemes.[object].title

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.firefoxos.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.firefoxos.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.firefoxos.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.firefoxos.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.firefoxos.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.firefoxos.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.firefoxos.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.firefoxos.bundleAssets

**path**
`renative.json/#/platforms.firefoxos.bundleAssets`

**type** `boolean`








#### platforms.firefoxos.bundleIsDev

**path**
`renative.json/#/platforms.firefoxos.bundleIsDev`

**type** `boolean`








#### platforms.firefoxos.deploy

**path**
`renative.json/#/platforms.firefoxos.deploy`

**type** `object`







#### platforms.firefoxos.deploy.type

**path**
`renative.json/#/platforms.firefoxos.deploy.type`

**type** `string`









#### platforms.firefoxos.description

**path**
`renative.json/#/platforms.firefoxos.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.firefoxos.devServerHost

**path**
`renative.json/#/platforms.firefoxos.devServerHost`

**type** `string`








#### platforms.firefoxos.engine

**path**
`renative.json/#/platforms.firefoxos.engine`

**type** `string`








#### platforms.firefoxos.entryFile

**path**
`renative.json/#/platforms.firefoxos.entryFile`

**type** `string`








#### platforms.firefoxos.excludedPlugins

**path**
`renative.json/#/platforms.firefoxos.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxos.ext

**path**
`renative.json/#/platforms.firefoxos.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.firefoxos.id

**path**
`renative.json/#/platforms.firefoxos.id`

**type** `string`








#### platforms.firefoxos.ignoreLogs

**path**
`renative.json/#/platforms.firefoxos.ignoreLogs`

**type** `boolean`








#### platforms.firefoxos.ignoreWarnings

**path**
`renative.json/#/platforms.firefoxos.ignoreWarnings`

**type** `boolean`








#### platforms.firefoxos.includedFonts

**path**
`renative.json/#/platforms.firefoxos.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.firefoxos.includedPermissions

**path**
`renative.json/#/platforms.firefoxos.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.firefoxos.includedPlugins

**path**
`renative.json/#/platforms.firefoxos.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxos.license

**path**
`renative.json/#/platforms.firefoxos.license`

**type** `string`








#### platforms.firefoxos.permissions

**path**
`renative.json/#/platforms.firefoxos.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.firefoxos.runtime

**path**
`renative.json/#/platforms.firefoxos.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.firefoxos.splashScreen

**path**
`renative.json/#/platforms.firefoxos.splashScreen`

**type** `boolean`








#### platforms.firefoxos.timestampAssets

**path**
`renative.json/#/platforms.firefoxos.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.firefoxos.title

**path**
`renative.json/#/platforms.firefoxos.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.firefoxos.versionedAssets

**path**
`renative.json/#/platforms.firefoxos.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.firefoxos.webpackConfig

**path**
`renative.json/#/platforms.firefoxos.webpackConfig`

**type** `object`







#### platforms.firefoxos.webpackConfig.customScripts

**path**
`renative.json/#/platforms.firefoxos.webpackConfig.customScripts`

**type** `array`








#### platforms.firefoxos.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.firefoxos.webpackConfig.devServerHost`

**type** `string`








#### platforms.firefoxos.webpackConfig.extend

**path**
`renative.json/#/platforms.firefoxos.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.firefoxos.webpackConfig.metaTags

**path**
`renative.json/#/platforms.firefoxos.webpackConfig.metaTags`

**type** `object`










---
### platforms.firefoxtv

**path**
`renative.json/#/platforms.firefoxtv`

**type** `object`







#### platforms.firefoxtv.author

**path**
`renative.json/#/platforms.firefoxtv.author`

**type** `object`








#### platforms.firefoxtv.backgroundColor

**path**
`renative.json/#/platforms.firefoxtv.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.firefoxtv.buildSchemes

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes`

**type** `object`







#### platforms.firefoxtv.buildSchemes.[object].author

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].author`

**type** `object`








#### platforms.firefoxtv.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.firefoxtv.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].deploy`

**type** `object`







#### platforms.firefoxtv.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.firefoxtv.buildSchemes.[object].description

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.firefoxtv.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].engine`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxtv.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.firefoxtv.buildSchemes.[object].id

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].id`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.firefoxtv.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.firefoxtv.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxtv.buildSchemes.[object].license

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].license`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.firefoxtv.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.firefoxtv.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.firefoxtv.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.firefoxtv.buildSchemes.[object].title

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.firefoxtv.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.firefoxtv.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.firefoxtv.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.firefoxtv.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.firefoxtv.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.firefoxtv.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.firefoxtv.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.firefoxtv.bundleAssets

**path**
`renative.json/#/platforms.firefoxtv.bundleAssets`

**type** `boolean`








#### platforms.firefoxtv.bundleIsDev

**path**
`renative.json/#/platforms.firefoxtv.bundleIsDev`

**type** `boolean`








#### platforms.firefoxtv.deploy

**path**
`renative.json/#/platforms.firefoxtv.deploy`

**type** `object`







#### platforms.firefoxtv.deploy.type

**path**
`renative.json/#/platforms.firefoxtv.deploy.type`

**type** `string`









#### platforms.firefoxtv.description

**path**
`renative.json/#/platforms.firefoxtv.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.firefoxtv.devServerHost

**path**
`renative.json/#/platforms.firefoxtv.devServerHost`

**type** `string`








#### platforms.firefoxtv.engine

**path**
`renative.json/#/platforms.firefoxtv.engine`

**type** `string`








#### platforms.firefoxtv.entryFile

**path**
`renative.json/#/platforms.firefoxtv.entryFile`

**type** `string`








#### platforms.firefoxtv.excludedPlugins

**path**
`renative.json/#/platforms.firefoxtv.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxtv.ext

**path**
`renative.json/#/platforms.firefoxtv.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.firefoxtv.id

**path**
`renative.json/#/platforms.firefoxtv.id`

**type** `string`








#### platforms.firefoxtv.ignoreLogs

**path**
`renative.json/#/platforms.firefoxtv.ignoreLogs`

**type** `boolean`








#### platforms.firefoxtv.ignoreWarnings

**path**
`renative.json/#/platforms.firefoxtv.ignoreWarnings`

**type** `boolean`








#### platforms.firefoxtv.includedFonts

**path**
`renative.json/#/platforms.firefoxtv.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.firefoxtv.includedPermissions

**path**
`renative.json/#/platforms.firefoxtv.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.firefoxtv.includedPlugins

**path**
`renative.json/#/platforms.firefoxtv.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.firefoxtv.license

**path**
`renative.json/#/platforms.firefoxtv.license`

**type** `string`








#### platforms.firefoxtv.permissions

**path**
`renative.json/#/platforms.firefoxtv.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.firefoxtv.runtime

**path**
`renative.json/#/platforms.firefoxtv.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.firefoxtv.splashScreen

**path**
`renative.json/#/platforms.firefoxtv.splashScreen`

**type** `boolean`








#### platforms.firefoxtv.timestampAssets

**path**
`renative.json/#/platforms.firefoxtv.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.firefoxtv.title

**path**
`renative.json/#/platforms.firefoxtv.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.firefoxtv.versionedAssets

**path**
`renative.json/#/platforms.firefoxtv.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.firefoxtv.webpackConfig

**path**
`renative.json/#/platforms.firefoxtv.webpackConfig`

**type** `object`







#### platforms.firefoxtv.webpackConfig.customScripts

**path**
`renative.json/#/platforms.firefoxtv.webpackConfig.customScripts`

**type** `array`








#### platforms.firefoxtv.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.firefoxtv.webpackConfig.devServerHost`

**type** `string`








#### platforms.firefoxtv.webpackConfig.extend

**path**
`renative.json/#/platforms.firefoxtv.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.firefoxtv.webpackConfig.metaTags

**path**
`renative.json/#/platforms.firefoxtv.webpackConfig.metaTags`

**type** `object`










---
### platforms.ios

**path**
`renative.json/#/platforms.ios`

**type** `object`







#### platforms.ios.Podfile

**path**
`renative.json/#/platforms.ios.Podfile`

**type** `object`








#### platforms.ios.appDelegateApplicationMethods

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods`

**type** `object`







#### platforms.ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didReceive`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didRegister`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.open

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.open`

**type** `array`








#### platforms.ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/platforms.ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### platforms.ios.appDelegateImports

**path**
`renative.json/#/platforms.ios.appDelegateImports`

**type** `array`








#### platforms.ios.appDelegateMethods

**path**
`renative.json/#/platforms.ios.appDelegateMethods`

**type** `object`








#### platforms.ios.appleId

**path**
`renative.json/#/platforms.ios.appleId`

**type** `string`








#### platforms.ios.author

**path**
`renative.json/#/platforms.ios.author`

**type** `object`








#### platforms.ios.backgroundColor

**path**
`renative.json/#/platforms.ios.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.ios.buildSchemes

**path**
`renative.json/#/platforms.ios.buildSchemes`

**type** `object`







#### platforms.ios.buildSchemes.[object].Podfile

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].Podfile`

**type** `object`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods`

**type** `object`







#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didReceive`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didRegister`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.open

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.open`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### platforms.ios.buildSchemes.[object].appDelegateImports

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateImports`

**type** `array`








#### platforms.ios.buildSchemes.[object].appDelegateMethods

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appDelegateMethods`

**type** `object`








#### platforms.ios.buildSchemes.[object].appleId

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].appleId`

**type** `string`








#### platforms.ios.buildSchemes.[object].author

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].author`

**type** `object`








#### platforms.ios.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.ios.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].codeSignIdentity

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].codeSignIdentity`

**type** `string`

Special property which tells Xcode how to build your project

**examples**


```json
{
  "codeSignIdentity": "iPhone Developer"
}
```



```json
{
  "codeSignIdentity": "iPhone Distribution"
}
```







#### platforms.ios.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].deploy`

**type** `object`







#### platforms.ios.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.ios.buildSchemes.[object].deploymentTarget

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].deploymentTarget`

**type** `string`








#### platforms.ios.buildSchemes.[object].description

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.ios.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].engine`

**type** `string`








#### platforms.ios.buildSchemes.[object].entitlements

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].entitlements`

**type** `object`








#### platforms.ios.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.ios.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.ios.buildSchemes.[object].exportOptions

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions`

**type** `object`







#### platforms.ios.buildSchemes.[object].exportOptions.compileBitcode

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.compileBitcode`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].exportOptions.method

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.method`

**type** `string`








#### platforms.ios.buildSchemes.[object].exportOptions.provisioningProfiles

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.provisioningProfiles`

**type** `object`








#### platforms.ios.buildSchemes.[object].exportOptions.signingCertificate

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.signingCertificate`

**type** `string`








#### platforms.ios.buildSchemes.[object].exportOptions.signingStyle

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.signingStyle`

**type** `string`








#### platforms.ios.buildSchemes.[object].exportOptions.teamID

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.teamID`

**type** `string`








#### platforms.ios.buildSchemes.[object].exportOptions.uploadBitcode

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.uploadBitcode`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].exportOptions.uploadSymbols

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].exportOptions.uploadSymbols`

**type** `boolean`









#### platforms.ios.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.ios.buildSchemes.[object].firebaseId

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].firebaseId`

**type** `string`








#### platforms.ios.buildSchemes.[object].id

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].id`

**type** `string`








#### platforms.ios.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.ios.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.ios.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.ios.buildSchemes.[object].license

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].license`

**type** `string`








#### platforms.ios.buildSchemes.[object].orientationSupport

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].orientationSupport`

**type** `object`



**examples**


```json
{
  "orientationSupport": {
    "phone": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ],
    "tab": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ]
  }
}
```






#### platforms.ios.buildSchemes.[object].orientationSupport.phone

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].orientationSupport.phone`

**type** `array`








#### platforms.ios.buildSchemes.[object].orientationSupport.tab

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].orientationSupport.tab`

**type** `array`









#### platforms.ios.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.ios.buildSchemes.[object].plist

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].plist`

**type** `object`








#### platforms.ios.buildSchemes.[object].provisionProfileSpecifier

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].provisionProfileSpecifier`

**type** `string`








#### platforms.ios.buildSchemes.[object].provisioningProfiles

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].provisioningProfiles`

**type** `object`








#### platforms.ios.buildSchemes.[object].provisioningStyle

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].provisioningStyle`

**type** `string`








#### platforms.ios.buildSchemes.[object].runScheme

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].runScheme`

**type** `string`








#### platforms.ios.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.ios.buildSchemes.[object].scheme

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].scheme`

**type** `string`








#### platforms.ios.buildSchemes.[object].sdk

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].sdk`

**type** `string`








#### platforms.ios.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.ios.buildSchemes.[object].systemCapabilities

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].systemCapabilities`

**type** `object`



**examples**


```json
{
  "systemCapabilities": {
    "com.apple.SafariKeychain": false,
    "com.apple.Wallet": false,
    "com.apple.HealthKit": false,
    "com.apple.ApplicationGroups.iOS": false,
    "com.apple.iCloud": true,
    "com.apple.DataProtection": false,
    "com.apple.HomeKit": false,
    "com.apple.ClassKit": false,
    "com.apple.VPNLite": false,
    "com.apple.AutoFillCredentialProvider": false,
    "com.apple.AccessWiFi": false,
    "com.apple.InAppPurchase": false,
    "com.apple.HotspotConfiguration": false,
    "com.apple.Multipath": false,
    "com.apple.GameCenter.iOS": false,
    "com.apple.BackgroundModes": false,
    "com.apple.InterAppAudio": false,
    "com.apple.WAC": false,
    "com.apple.Push": true,
    "com.apple.NearFieldCommunicationTagReading": false,
    "com.apple.ApplePay": false,
    "com.apple.Keychain": false,
    "com.apple.Maps.iOS": false,
    "com.apple.Siri": false,
    "com.apple.NetworkExtensions.iOS": false
  }
}
```







#### platforms.ios.buildSchemes.[object].teamID

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].teamID`

**type** `string`








#### platforms.ios.buildSchemes.[object].teamIdentifier

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].teamIdentifier`

**type** `string`








#### platforms.ios.buildSchemes.[object].testFlightId

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].testFlightId`

**type** `string`








#### platforms.ios.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.ios.buildSchemes.[object].title

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.ios.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.ios.buildSchemes.[object].xcodeproj

**path**
`renative.json/#/platforms.ios.buildSchemes.[object].xcodeproj`

**type** `object`









#### platforms.ios.bundleAssets

**path**
`renative.json/#/platforms.ios.bundleAssets`

**type** `boolean`








#### platforms.ios.bundleIsDev

**path**
`renative.json/#/platforms.ios.bundleIsDev`

**type** `boolean`








#### platforms.ios.codeSignIdentity

**path**
`renative.json/#/platforms.ios.codeSignIdentity`

**type** `string`

Special property which tells Xcode how to build your project

**examples**


```json
{
  "codeSignIdentity": "iPhone Developer"
}
```



```json
{
  "codeSignIdentity": "iPhone Distribution"
}
```







#### platforms.ios.deploy

**path**
`renative.json/#/platforms.ios.deploy`

**type** `object`







#### platforms.ios.deploy.type

**path**
`renative.json/#/platforms.ios.deploy.type`

**type** `string`









#### platforms.ios.deploymentTarget

**path**
`renative.json/#/platforms.ios.deploymentTarget`

**type** `string`








#### platforms.ios.description

**path**
`renative.json/#/platforms.ios.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.ios.engine

**path**
`renative.json/#/platforms.ios.engine`

**type** `string`








#### platforms.ios.entitlements

**path**
`renative.json/#/platforms.ios.entitlements`

**type** `object`








#### platforms.ios.entryFile

**path**
`renative.json/#/platforms.ios.entryFile`

**type** `string`








#### platforms.ios.excludedPlugins

**path**
`renative.json/#/platforms.ios.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.ios.exportOptions

**path**
`renative.json/#/platforms.ios.exportOptions`

**type** `object`







#### platforms.ios.exportOptions.compileBitcode

**path**
`renative.json/#/platforms.ios.exportOptions.compileBitcode`

**type** `boolean`








#### platforms.ios.exportOptions.method

**path**
`renative.json/#/platforms.ios.exportOptions.method`

**type** `string`








#### platforms.ios.exportOptions.provisioningProfiles

**path**
`renative.json/#/platforms.ios.exportOptions.provisioningProfiles`

**type** `object`








#### platforms.ios.exportOptions.signingCertificate

**path**
`renative.json/#/platforms.ios.exportOptions.signingCertificate`

**type** `string`








#### platforms.ios.exportOptions.signingStyle

**path**
`renative.json/#/platforms.ios.exportOptions.signingStyle`

**type** `string`








#### platforms.ios.exportOptions.teamID

**path**
`renative.json/#/platforms.ios.exportOptions.teamID`

**type** `string`








#### platforms.ios.exportOptions.uploadBitcode

**path**
`renative.json/#/platforms.ios.exportOptions.uploadBitcode`

**type** `boolean`








#### platforms.ios.exportOptions.uploadSymbols

**path**
`renative.json/#/platforms.ios.exportOptions.uploadSymbols`

**type** `boolean`









#### platforms.ios.ext

**path**
`renative.json/#/platforms.ios.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.ios.firebaseId

**path**
`renative.json/#/platforms.ios.firebaseId`

**type** `string`








#### platforms.ios.id

**path**
`renative.json/#/platforms.ios.id`

**type** `string`








#### platforms.ios.ignoreLogs

**path**
`renative.json/#/platforms.ios.ignoreLogs`

**type** `boolean`








#### platforms.ios.ignoreWarnings

**path**
`renative.json/#/platforms.ios.ignoreWarnings`

**type** `boolean`








#### platforms.ios.includedFonts

**path**
`renative.json/#/platforms.ios.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.ios.includedPermissions

**path**
`renative.json/#/platforms.ios.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.ios.includedPlugins

**path**
`renative.json/#/platforms.ios.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.ios.license

**path**
`renative.json/#/platforms.ios.license`

**type** `string`








#### platforms.ios.orientationSupport

**path**
`renative.json/#/platforms.ios.orientationSupport`

**type** `object`



**examples**


```json
{
  "orientationSupport": {
    "phone": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ],
    "tab": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ]
  }
}
```






#### platforms.ios.orientationSupport.phone

**path**
`renative.json/#/platforms.ios.orientationSupport.phone`

**type** `array`








#### platforms.ios.orientationSupport.tab

**path**
`renative.json/#/platforms.ios.orientationSupport.tab`

**type** `array`









#### platforms.ios.permissions

**path**
`renative.json/#/platforms.ios.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.ios.plist

**path**
`renative.json/#/platforms.ios.plist`

**type** `object`








#### platforms.ios.provisionProfileSpecifier

**path**
`renative.json/#/platforms.ios.provisionProfileSpecifier`

**type** `string`








#### platforms.ios.provisioningProfiles

**path**
`renative.json/#/platforms.ios.provisioningProfiles`

**type** `object`








#### platforms.ios.provisioningStyle

**path**
`renative.json/#/platforms.ios.provisioningStyle`

**type** `string`








#### platforms.ios.runScheme

**path**
`renative.json/#/platforms.ios.runScheme`

**type** `string`








#### platforms.ios.runtime

**path**
`renative.json/#/platforms.ios.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.ios.scheme

**path**
`renative.json/#/platforms.ios.scheme`

**type** `string`








#### platforms.ios.sdk

**path**
`renative.json/#/platforms.ios.sdk`

**type** `string`








#### platforms.ios.splashScreen

**path**
`renative.json/#/platforms.ios.splashScreen`

**type** `boolean`








#### platforms.ios.systemCapabilities

**path**
`renative.json/#/platforms.ios.systemCapabilities`

**type** `object`



**examples**


```json
{
  "systemCapabilities": {
    "com.apple.SafariKeychain": false,
    "com.apple.Wallet": false,
    "com.apple.HealthKit": false,
    "com.apple.ApplicationGroups.iOS": false,
    "com.apple.iCloud": true,
    "com.apple.DataProtection": false,
    "com.apple.HomeKit": false,
    "com.apple.ClassKit": false,
    "com.apple.VPNLite": false,
    "com.apple.AutoFillCredentialProvider": false,
    "com.apple.AccessWiFi": false,
    "com.apple.InAppPurchase": false,
    "com.apple.HotspotConfiguration": false,
    "com.apple.Multipath": false,
    "com.apple.GameCenter.iOS": false,
    "com.apple.BackgroundModes": false,
    "com.apple.InterAppAudio": false,
    "com.apple.WAC": false,
    "com.apple.Push": true,
    "com.apple.NearFieldCommunicationTagReading": false,
    "com.apple.ApplePay": false,
    "com.apple.Keychain": false,
    "com.apple.Maps.iOS": false,
    "com.apple.Siri": false,
    "com.apple.NetworkExtensions.iOS": false
  }
}
```







#### platforms.ios.teamID

**path**
`renative.json/#/platforms.ios.teamID`

**type** `string`








#### platforms.ios.teamIdentifier

**path**
`renative.json/#/platforms.ios.teamIdentifier`

**type** `string`








#### platforms.ios.testFlightId

**path**
`renative.json/#/platforms.ios.testFlightId`

**type** `string`








#### platforms.ios.timestampAssets

**path**
`renative.json/#/platforms.ios.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.ios.title

**path**
`renative.json/#/platforms.ios.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.ios.versionedAssets

**path**
`renative.json/#/platforms.ios.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.ios.xcodeproj

**path**
`renative.json/#/platforms.ios.xcodeproj`

**type** `object`









---
### platforms.kaios

**path**
`renative.json/#/platforms.kaios`

**type** `object`







#### platforms.kaios.author

**path**
`renative.json/#/platforms.kaios.author`

**type** `object`








#### platforms.kaios.backgroundColor

**path**
`renative.json/#/platforms.kaios.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.kaios.buildSchemes

**path**
`renative.json/#/platforms.kaios.buildSchemes`

**type** `object`







#### platforms.kaios.buildSchemes.[object].author

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].author`

**type** `object`








#### platforms.kaios.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.kaios.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].deploy`

**type** `object`







#### platforms.kaios.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.kaios.buildSchemes.[object].description

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.kaios.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.kaios.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].engine`

**type** `string`








#### platforms.kaios.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.kaios.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.kaios.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.kaios.buildSchemes.[object].id

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].id`

**type** `string`








#### platforms.kaios.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.kaios.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.kaios.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.kaios.buildSchemes.[object].license

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].license`

**type** `string`








#### platforms.kaios.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.kaios.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.kaios.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.kaios.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.kaios.buildSchemes.[object].title

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.kaios.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.kaios.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.kaios.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.kaios.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.kaios.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.kaios.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.kaios.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.kaios.bundleAssets

**path**
`renative.json/#/platforms.kaios.bundleAssets`

**type** `boolean`








#### platforms.kaios.bundleIsDev

**path**
`renative.json/#/platforms.kaios.bundleIsDev`

**type** `boolean`








#### platforms.kaios.deploy

**path**
`renative.json/#/platforms.kaios.deploy`

**type** `object`







#### platforms.kaios.deploy.type

**path**
`renative.json/#/platforms.kaios.deploy.type`

**type** `string`









#### platforms.kaios.description

**path**
`renative.json/#/platforms.kaios.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.kaios.devServerHost

**path**
`renative.json/#/platforms.kaios.devServerHost`

**type** `string`








#### platforms.kaios.engine

**path**
`renative.json/#/platforms.kaios.engine`

**type** `string`








#### platforms.kaios.entryFile

**path**
`renative.json/#/platforms.kaios.entryFile`

**type** `string`








#### platforms.kaios.excludedPlugins

**path**
`renative.json/#/platforms.kaios.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.kaios.ext

**path**
`renative.json/#/platforms.kaios.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.kaios.id

**path**
`renative.json/#/platforms.kaios.id`

**type** `string`








#### platforms.kaios.ignoreLogs

**path**
`renative.json/#/platforms.kaios.ignoreLogs`

**type** `boolean`








#### platforms.kaios.ignoreWarnings

**path**
`renative.json/#/platforms.kaios.ignoreWarnings`

**type** `boolean`








#### platforms.kaios.includedFonts

**path**
`renative.json/#/platforms.kaios.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.kaios.includedPermissions

**path**
`renative.json/#/platforms.kaios.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.kaios.includedPlugins

**path**
`renative.json/#/platforms.kaios.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.kaios.license

**path**
`renative.json/#/platforms.kaios.license`

**type** `string`








#### platforms.kaios.permissions

**path**
`renative.json/#/platforms.kaios.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.kaios.runtime

**path**
`renative.json/#/platforms.kaios.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.kaios.splashScreen

**path**
`renative.json/#/platforms.kaios.splashScreen`

**type** `boolean`








#### platforms.kaios.timestampAssets

**path**
`renative.json/#/platforms.kaios.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.kaios.title

**path**
`renative.json/#/platforms.kaios.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.kaios.versionedAssets

**path**
`renative.json/#/platforms.kaios.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.kaios.webpackConfig

**path**
`renative.json/#/platforms.kaios.webpackConfig`

**type** `object`







#### platforms.kaios.webpackConfig.customScripts

**path**
`renative.json/#/platforms.kaios.webpackConfig.customScripts`

**type** `array`








#### platforms.kaios.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.kaios.webpackConfig.devServerHost`

**type** `string`








#### platforms.kaios.webpackConfig.extend

**path**
`renative.json/#/platforms.kaios.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.kaios.webpackConfig.metaTags

**path**
`renative.json/#/platforms.kaios.webpackConfig.metaTags`

**type** `object`










---
### platforms.macos

**path**
`renative.json/#/platforms.macos`

**type** `object`







#### platforms.macos.BrowserWindow

**path**
`renative.json/#/platforms.macos.BrowserWindow`

**type** `object`

Allows you to configure electron wrapper app window

**examples**


```json
{
  "BrowserWindow": {
    "width": 1310,
    "height": 800,
    "webPreferences": {
      "devTools": true
    }
  }
}
```






#### platforms.macos.BrowserWindow.height

**path**
`renative.json/#/platforms.macos.BrowserWindow.height`

**type** `integer`

Default height of electron app






#### platforms.macos.BrowserWindow.webPreferences

**path**
`renative.json/#/platforms.macos.BrowserWindow.webPreferences`

**type** `object`

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```







#### platforms.macos.BrowserWindow.width

**path**
`renative.json/#/platforms.macos.BrowserWindow.width`

**type** `integer`

Default width of electron app







#### platforms.macos.appleId

**path**
`renative.json/#/platforms.macos.appleId`

**type** `string`








#### platforms.macos.author

**path**
`renative.json/#/platforms.macos.author`

**type** `object`








#### platforms.macos.backgroundColor

**path**
`renative.json/#/platforms.macos.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.macos.buildSchemes

**path**
`renative.json/#/platforms.macos.buildSchemes`

**type** `object`







#### platforms.macos.buildSchemes.[object].BrowserWindow

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].BrowserWindow`

**type** `object`

Allows you to configure electron wrapper app window

**examples**


```json
{
  "BrowserWindow": {
    "width": 1310,
    "height": 800,
    "webPreferences": {
      "devTools": true
    }
  }
}
```






#### platforms.macos.buildSchemes.[object].BrowserWindow.height

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].BrowserWindow.height`

**type** `integer`

Default height of electron app






#### platforms.macos.buildSchemes.[object].BrowserWindow.webPreferences

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].BrowserWindow.webPreferences`

**type** `object`

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```







#### platforms.macos.buildSchemes.[object].BrowserWindow.width

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].BrowserWindow.width`

**type** `integer`

Default width of electron app







#### platforms.macos.buildSchemes.[object].appleId

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].appleId`

**type** `string`








#### platforms.macos.buildSchemes.[object].author

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].author`

**type** `object`








#### platforms.macos.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.macos.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].deploy`

**type** `object`







#### platforms.macos.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.macos.buildSchemes.[object].description

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.macos.buildSchemes.[object].electronConfig

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].electronConfig`

**type** `object`

Allows you to configure electron app as per https://www.electron.build/

**examples**


```json
{
  "electronConfig": {
    "mac": {
      "target": [
        "dmg",
        "mas",
        "mas-dev"
      ],
      "hardenedRuntime": true
    },
    "dmg": {
      "sign": false
    },
    "mas": {
      "type": "distribution",
      "hardenedRuntime": false
    }
  }
}
```







#### platforms.macos.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].engine`

**type** `string`








#### platforms.macos.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.macos.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.macos.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.macos.buildSchemes.[object].id

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].id`

**type** `string`








#### platforms.macos.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.macos.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.macos.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.macos.buildSchemes.[object].license

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].license`

**type** `string`








#### platforms.macos.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.macos.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.macos.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.macos.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.macos.buildSchemes.[object].title

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.macos.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.macos.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.macos.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.macos.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.macos.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.macos.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.macos.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.macos.bundleAssets

**path**
`renative.json/#/platforms.macos.bundleAssets`

**type** `boolean`








#### platforms.macos.bundleIsDev

**path**
`renative.json/#/platforms.macos.bundleIsDev`

**type** `boolean`








#### platforms.macos.deploy

**path**
`renative.json/#/platforms.macos.deploy`

**type** `object`







#### platforms.macos.deploy.type

**path**
`renative.json/#/platforms.macos.deploy.type`

**type** `string`









#### platforms.macos.description

**path**
`renative.json/#/platforms.macos.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.macos.electronConfig

**path**
`renative.json/#/platforms.macos.electronConfig`

**type** `object`

Allows you to configure electron app as per https://www.electron.build/

**examples**


```json
{
  "electronConfig": {
    "mac": {
      "target": [
        "dmg",
        "mas",
        "mas-dev"
      ],
      "hardenedRuntime": true
    },
    "dmg": {
      "sign": false
    },
    "mas": {
      "type": "distribution",
      "hardenedRuntime": false
    }
  }
}
```







#### platforms.macos.engine

**path**
`renative.json/#/platforms.macos.engine`

**type** `string`








#### platforms.macos.entryFile

**path**
`renative.json/#/platforms.macos.entryFile`

**type** `string`








#### platforms.macos.excludedPlugins

**path**
`renative.json/#/platforms.macos.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.macos.ext

**path**
`renative.json/#/platforms.macos.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.macos.id

**path**
`renative.json/#/platforms.macos.id`

**type** `string`








#### platforms.macos.ignoreLogs

**path**
`renative.json/#/platforms.macos.ignoreLogs`

**type** `boolean`








#### platforms.macos.ignoreWarnings

**path**
`renative.json/#/platforms.macos.ignoreWarnings`

**type** `boolean`








#### platforms.macos.includedFonts

**path**
`renative.json/#/platforms.macos.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.macos.includedPermissions

**path**
`renative.json/#/platforms.macos.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.macos.includedPlugins

**path**
`renative.json/#/platforms.macos.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.macos.license

**path**
`renative.json/#/platforms.macos.license`

**type** `string`








#### platforms.macos.permissions

**path**
`renative.json/#/platforms.macos.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.macos.runtime

**path**
`renative.json/#/platforms.macos.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.macos.splashScreen

**path**
`renative.json/#/platforms.macos.splashScreen`

**type** `boolean`








#### platforms.macos.timestampAssets

**path**
`renative.json/#/platforms.macos.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.macos.title

**path**
`renative.json/#/platforms.macos.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.macos.versionedAssets

**path**
`renative.json/#/platforms.macos.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.macos.webpackConfig

**path**
`renative.json/#/platforms.macos.webpackConfig`

**type** `object`







#### platforms.macos.webpackConfig.customScripts

**path**
`renative.json/#/platforms.macos.webpackConfig.customScripts`

**type** `array`








#### platforms.macos.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.macos.webpackConfig.devServerHost`

**type** `string`








#### platforms.macos.webpackConfig.extend

**path**
`renative.json/#/platforms.macos.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.macos.webpackConfig.metaTags

**path**
`renative.json/#/platforms.macos.webpackConfig.metaTags`

**type** `object`










---
### platforms.tizen

**path**
`renative.json/#/platforms.tizen`

**type** `object`







#### platforms.tizen.appName

**path**
`renative.json/#/platforms.tizen.appName`

**type** `string`








#### platforms.tizen.author

**path**
`renative.json/#/platforms.tizen.author`

**type** `object`








#### platforms.tizen.backgroundColor

**path**
`renative.json/#/platforms.tizen.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizen.buildSchemes

**path**
`renative.json/#/platforms.tizen.buildSchemes`

**type** `object`







#### platforms.tizen.buildSchemes.[object].appName

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].appName`

**type** `string`








#### platforms.tizen.buildSchemes.[object].author

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].author`

**type** `object`








#### platforms.tizen.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizen.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].certificateProfile

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].certificateProfile`

**type** `string`








#### platforms.tizen.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].deploy`

**type** `object`







#### platforms.tizen.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.tizen.buildSchemes.[object].description

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizen.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.tizen.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].engine`

**type** `string`








#### platforms.tizen.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.tizen.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizen.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizen.buildSchemes.[object].id

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].id`

**type** `string`








#### platforms.tizen.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizen.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizen.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizen.buildSchemes.[object].license

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].license`

**type** `string`








#### platforms.tizen.buildSchemes.[object].package

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].package`

**type** `string`








#### platforms.tizen.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizen.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizen.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.tizen.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizen.buildSchemes.[object].title

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizen.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizen.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.tizen.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.tizen.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.tizen.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizen.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizen.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.tizen.bundleAssets

**path**
`renative.json/#/platforms.tizen.bundleAssets`

**type** `boolean`








#### platforms.tizen.bundleIsDev

**path**
`renative.json/#/platforms.tizen.bundleIsDev`

**type** `boolean`








#### platforms.tizen.certificateProfile

**path**
`renative.json/#/platforms.tizen.certificateProfile`

**type** `string`








#### platforms.tizen.deploy

**path**
`renative.json/#/platforms.tizen.deploy`

**type** `object`







#### platforms.tizen.deploy.type

**path**
`renative.json/#/platforms.tizen.deploy.type`

**type** `string`









#### platforms.tizen.description

**path**
`renative.json/#/platforms.tizen.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizen.devServerHost

**path**
`renative.json/#/platforms.tizen.devServerHost`

**type** `string`








#### platforms.tizen.engine

**path**
`renative.json/#/platforms.tizen.engine`

**type** `string`








#### platforms.tizen.entryFile

**path**
`renative.json/#/platforms.tizen.entryFile`

**type** `string`








#### platforms.tizen.excludedPlugins

**path**
`renative.json/#/platforms.tizen.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizen.ext

**path**
`renative.json/#/platforms.tizen.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizen.id

**path**
`renative.json/#/platforms.tizen.id`

**type** `string`








#### platforms.tizen.ignoreLogs

**path**
`renative.json/#/platforms.tizen.ignoreLogs`

**type** `boolean`








#### platforms.tizen.ignoreWarnings

**path**
`renative.json/#/platforms.tizen.ignoreWarnings`

**type** `boolean`








#### platforms.tizen.includedFonts

**path**
`renative.json/#/platforms.tizen.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizen.includedPermissions

**path**
`renative.json/#/platforms.tizen.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizen.includedPlugins

**path**
`renative.json/#/platforms.tizen.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizen.license

**path**
`renative.json/#/platforms.tizen.license`

**type** `string`








#### platforms.tizen.package

**path**
`renative.json/#/platforms.tizen.package`

**type** `string`








#### platforms.tizen.permissions

**path**
`renative.json/#/platforms.tizen.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizen.runtime

**path**
`renative.json/#/platforms.tizen.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizen.splashScreen

**path**
`renative.json/#/platforms.tizen.splashScreen`

**type** `boolean`








#### platforms.tizen.timestampAssets

**path**
`renative.json/#/platforms.tizen.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizen.title

**path**
`renative.json/#/platforms.tizen.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizen.versionedAssets

**path**
`renative.json/#/platforms.tizen.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizen.webpackConfig

**path**
`renative.json/#/platforms.tizen.webpackConfig`

**type** `object`







#### platforms.tizen.webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizen.webpackConfig.customScripts`

**type** `array`








#### platforms.tizen.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizen.webpackConfig.devServerHost`

**type** `string`








#### platforms.tizen.webpackConfig.extend

**path**
`renative.json/#/platforms.tizen.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizen.webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizen.webpackConfig.metaTags`

**type** `object`










---
### platforms.tizenmobile

**path**
`renative.json/#/platforms.tizenmobile`

**type** `object`







#### platforms.tizenmobile.appName

**path**
`renative.json/#/platforms.tizenmobile.appName`

**type** `string`








#### platforms.tizenmobile.author

**path**
`renative.json/#/platforms.tizenmobile.author`

**type** `object`








#### platforms.tizenmobile.backgroundColor

**path**
`renative.json/#/platforms.tizenmobile.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizenmobile.buildSchemes

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes`

**type** `object`







#### platforms.tizenmobile.buildSchemes.[object].appName

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].appName`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].author

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].author`

**type** `object`








#### platforms.tizenmobile.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizenmobile.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].certificateProfile

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].certificateProfile`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].deploy`

**type** `object`







#### platforms.tizenmobile.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.tizenmobile.buildSchemes.[object].description

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizenmobile.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].engine`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenmobile.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizenmobile.buildSchemes.[object].id

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].id`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizenmobile.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizenmobile.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenmobile.buildSchemes.[object].license

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].license`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].package

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].package`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizenmobile.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizenmobile.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.tizenmobile.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizenmobile.buildSchemes.[object].title

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizenmobile.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizenmobile.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.tizenmobile.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.tizenmobile.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.tizenmobile.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizenmobile.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizenmobile.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.tizenmobile.bundleAssets

**path**
`renative.json/#/platforms.tizenmobile.bundleAssets`

**type** `boolean`








#### platforms.tizenmobile.bundleIsDev

**path**
`renative.json/#/platforms.tizenmobile.bundleIsDev`

**type** `boolean`








#### platforms.tizenmobile.certificateProfile

**path**
`renative.json/#/platforms.tizenmobile.certificateProfile`

**type** `string`








#### platforms.tizenmobile.deploy

**path**
`renative.json/#/platforms.tizenmobile.deploy`

**type** `object`







#### platforms.tizenmobile.deploy.type

**path**
`renative.json/#/platforms.tizenmobile.deploy.type`

**type** `string`









#### platforms.tizenmobile.description

**path**
`renative.json/#/platforms.tizenmobile.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizenmobile.devServerHost

**path**
`renative.json/#/platforms.tizenmobile.devServerHost`

**type** `string`








#### platforms.tizenmobile.engine

**path**
`renative.json/#/platforms.tizenmobile.engine`

**type** `string`








#### platforms.tizenmobile.entryFile

**path**
`renative.json/#/platforms.tizenmobile.entryFile`

**type** `string`








#### platforms.tizenmobile.excludedPlugins

**path**
`renative.json/#/platforms.tizenmobile.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenmobile.ext

**path**
`renative.json/#/platforms.tizenmobile.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizenmobile.id

**path**
`renative.json/#/platforms.tizenmobile.id`

**type** `string`








#### platforms.tizenmobile.ignoreLogs

**path**
`renative.json/#/platforms.tizenmobile.ignoreLogs`

**type** `boolean`








#### platforms.tizenmobile.ignoreWarnings

**path**
`renative.json/#/platforms.tizenmobile.ignoreWarnings`

**type** `boolean`








#### platforms.tizenmobile.includedFonts

**path**
`renative.json/#/platforms.tizenmobile.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizenmobile.includedPermissions

**path**
`renative.json/#/platforms.tizenmobile.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizenmobile.includedPlugins

**path**
`renative.json/#/platforms.tizenmobile.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenmobile.license

**path**
`renative.json/#/platforms.tizenmobile.license`

**type** `string`








#### platforms.tizenmobile.package

**path**
`renative.json/#/platforms.tizenmobile.package`

**type** `string`








#### platforms.tizenmobile.permissions

**path**
`renative.json/#/platforms.tizenmobile.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizenmobile.runtime

**path**
`renative.json/#/platforms.tizenmobile.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizenmobile.splashScreen

**path**
`renative.json/#/platforms.tizenmobile.splashScreen`

**type** `boolean`








#### platforms.tizenmobile.timestampAssets

**path**
`renative.json/#/platforms.tizenmobile.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizenmobile.title

**path**
`renative.json/#/platforms.tizenmobile.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizenmobile.versionedAssets

**path**
`renative.json/#/platforms.tizenmobile.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizenmobile.webpackConfig

**path**
`renative.json/#/platforms.tizenmobile.webpackConfig`

**type** `object`







#### platforms.tizenmobile.webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizenmobile.webpackConfig.customScripts`

**type** `array`








#### platforms.tizenmobile.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizenmobile.webpackConfig.devServerHost`

**type** `string`








#### platforms.tizenmobile.webpackConfig.extend

**path**
`renative.json/#/platforms.tizenmobile.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizenmobile.webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizenmobile.webpackConfig.metaTags`

**type** `object`










---
### platforms.tizenwatch

**path**
`renative.json/#/platforms.tizenwatch`

**type** `object`







#### platforms.tizenwatch.appName

**path**
`renative.json/#/platforms.tizenwatch.appName`

**type** `string`








#### platforms.tizenwatch.author

**path**
`renative.json/#/platforms.tizenwatch.author`

**type** `object`








#### platforms.tizenwatch.backgroundColor

**path**
`renative.json/#/platforms.tizenwatch.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizenwatch.buildSchemes

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes`

**type** `object`







#### platforms.tizenwatch.buildSchemes.[object].appName

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].appName`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].author

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].author`

**type** `object`








#### platforms.tizenwatch.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tizenwatch.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].certificateProfile

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].certificateProfile`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].deploy`

**type** `object`







#### platforms.tizenwatch.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.tizenwatch.buildSchemes.[object].description

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizenwatch.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].engine`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenwatch.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizenwatch.buildSchemes.[object].id

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].id`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizenwatch.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizenwatch.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenwatch.buildSchemes.[object].license

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].license`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].package

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].package`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizenwatch.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizenwatch.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.tizenwatch.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizenwatch.buildSchemes.[object].title

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizenwatch.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizenwatch.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.tizenwatch.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.tizenwatch.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.tizenwatch.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizenwatch.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizenwatch.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.tizenwatch.bundleAssets

**path**
`renative.json/#/platforms.tizenwatch.bundleAssets`

**type** `boolean`








#### platforms.tizenwatch.bundleIsDev

**path**
`renative.json/#/platforms.tizenwatch.bundleIsDev`

**type** `boolean`








#### platforms.tizenwatch.certificateProfile

**path**
`renative.json/#/platforms.tizenwatch.certificateProfile`

**type** `string`








#### platforms.tizenwatch.deploy

**path**
`renative.json/#/platforms.tizenwatch.deploy`

**type** `object`







#### platforms.tizenwatch.deploy.type

**path**
`renative.json/#/platforms.tizenwatch.deploy.type`

**type** `string`









#### platforms.tizenwatch.description

**path**
`renative.json/#/platforms.tizenwatch.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tizenwatch.devServerHost

**path**
`renative.json/#/platforms.tizenwatch.devServerHost`

**type** `string`








#### platforms.tizenwatch.engine

**path**
`renative.json/#/platforms.tizenwatch.engine`

**type** `string`








#### platforms.tizenwatch.entryFile

**path**
`renative.json/#/platforms.tizenwatch.entryFile`

**type** `string`








#### platforms.tizenwatch.excludedPlugins

**path**
`renative.json/#/platforms.tizenwatch.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenwatch.ext

**path**
`renative.json/#/platforms.tizenwatch.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tizenwatch.id

**path**
`renative.json/#/platforms.tizenwatch.id`

**type** `string`








#### platforms.tizenwatch.ignoreLogs

**path**
`renative.json/#/platforms.tizenwatch.ignoreLogs`

**type** `boolean`








#### platforms.tizenwatch.ignoreWarnings

**path**
`renative.json/#/platforms.tizenwatch.ignoreWarnings`

**type** `boolean`








#### platforms.tizenwatch.includedFonts

**path**
`renative.json/#/platforms.tizenwatch.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tizenwatch.includedPermissions

**path**
`renative.json/#/platforms.tizenwatch.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tizenwatch.includedPlugins

**path**
`renative.json/#/platforms.tizenwatch.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tizenwatch.license

**path**
`renative.json/#/platforms.tizenwatch.license`

**type** `string`








#### platforms.tizenwatch.package

**path**
`renative.json/#/platforms.tizenwatch.package`

**type** `string`








#### platforms.tizenwatch.permissions

**path**
`renative.json/#/platforms.tizenwatch.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tizenwatch.runtime

**path**
`renative.json/#/platforms.tizenwatch.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tizenwatch.splashScreen

**path**
`renative.json/#/platforms.tizenwatch.splashScreen`

**type** `boolean`








#### platforms.tizenwatch.timestampAssets

**path**
`renative.json/#/platforms.tizenwatch.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tizenwatch.title

**path**
`renative.json/#/platforms.tizenwatch.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tizenwatch.versionedAssets

**path**
`renative.json/#/platforms.tizenwatch.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tizenwatch.webpackConfig

**path**
`renative.json/#/platforms.tizenwatch.webpackConfig`

**type** `object`







#### platforms.tizenwatch.webpackConfig.customScripts

**path**
`renative.json/#/platforms.tizenwatch.webpackConfig.customScripts`

**type** `array`








#### platforms.tizenwatch.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.tizenwatch.webpackConfig.devServerHost`

**type** `string`








#### platforms.tizenwatch.webpackConfig.extend

**path**
`renative.json/#/platforms.tizenwatch.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.tizenwatch.webpackConfig.metaTags

**path**
`renative.json/#/platforms.tizenwatch.webpackConfig.metaTags`

**type** `object`










---
### platforms.tvos

**path**
`renative.json/#/platforms.tvos`

**type** `object`







#### platforms.tvos.Podfile

**path**
`renative.json/#/platforms.tvos.Podfile`

**type** `object`








#### platforms.tvos.appDelegateApplicationMethods

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods`

**type** `object`







#### platforms.tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didReceive`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didRegister`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.open

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.open`

**type** `array`








#### platforms.tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/platforms.tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### platforms.tvos.appDelegateImports

**path**
`renative.json/#/platforms.tvos.appDelegateImports`

**type** `array`








#### platforms.tvos.appDelegateMethods

**path**
`renative.json/#/platforms.tvos.appDelegateMethods`

**type** `object`








#### platforms.tvos.appleId

**path**
`renative.json/#/platforms.tvos.appleId`

**type** `string`








#### platforms.tvos.author

**path**
`renative.json/#/platforms.tvos.author`

**type** `object`








#### platforms.tvos.backgroundColor

**path**
`renative.json/#/platforms.tvos.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tvos.buildSchemes

**path**
`renative.json/#/platforms.tvos.buildSchemes`

**type** `object`







#### platforms.tvos.buildSchemes.[object].Podfile

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].Podfile`

**type** `object`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods`

**type** `object`







#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didReceive`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didRegister`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.open

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.open`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### platforms.tvos.buildSchemes.[object].appDelegateImports

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateImports`

**type** `array`








#### platforms.tvos.buildSchemes.[object].appDelegateMethods

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appDelegateMethods`

**type** `object`








#### platforms.tvos.buildSchemes.[object].appleId

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].appleId`

**type** `string`








#### platforms.tvos.buildSchemes.[object].author

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].author`

**type** `object`








#### platforms.tvos.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.tvos.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].codeSignIdentity

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].codeSignIdentity`

**type** `string`

Special property which tells Xcode how to build your project

**examples**


```json
{
  "codeSignIdentity": "iPhone Developer"
}
```



```json
{
  "codeSignIdentity": "iPhone Distribution"
}
```







#### platforms.tvos.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].deploy`

**type** `object`







#### platforms.tvos.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.tvos.buildSchemes.[object].deploymentTarget

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].deploymentTarget`

**type** `string`








#### platforms.tvos.buildSchemes.[object].description

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tvos.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].engine`

**type** `string`








#### platforms.tvos.buildSchemes.[object].entitlements

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].entitlements`

**type** `object`








#### platforms.tvos.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.tvos.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tvos.buildSchemes.[object].exportOptions

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions`

**type** `object`







#### platforms.tvos.buildSchemes.[object].exportOptions.compileBitcode

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.compileBitcode`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].exportOptions.method

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.method`

**type** `string`








#### platforms.tvos.buildSchemes.[object].exportOptions.provisioningProfiles

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.provisioningProfiles`

**type** `object`








#### platforms.tvos.buildSchemes.[object].exportOptions.signingCertificate

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.signingCertificate`

**type** `string`








#### platforms.tvos.buildSchemes.[object].exportOptions.signingStyle

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.signingStyle`

**type** `string`








#### platforms.tvos.buildSchemes.[object].exportOptions.teamID

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.teamID`

**type** `string`








#### platforms.tvos.buildSchemes.[object].exportOptions.uploadBitcode

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.uploadBitcode`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].exportOptions.uploadSymbols

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].exportOptions.uploadSymbols`

**type** `boolean`









#### platforms.tvos.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tvos.buildSchemes.[object].firebaseId

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].firebaseId`

**type** `string`








#### platforms.tvos.buildSchemes.[object].id

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].id`

**type** `string`








#### platforms.tvos.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tvos.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tvos.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tvos.buildSchemes.[object].license

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].license`

**type** `string`








#### platforms.tvos.buildSchemes.[object].orientationSupport

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].orientationSupport`

**type** `object`



**examples**


```json
{
  "orientationSupport": {
    "phone": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ],
    "tab": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ]
  }
}
```






#### platforms.tvos.buildSchemes.[object].orientationSupport.phone

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].orientationSupport.phone`

**type** `array`








#### platforms.tvos.buildSchemes.[object].orientationSupport.tab

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].orientationSupport.tab`

**type** `array`









#### platforms.tvos.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tvos.buildSchemes.[object].plist

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].plist`

**type** `object`








#### platforms.tvos.buildSchemes.[object].provisionProfileSpecifier

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].provisionProfileSpecifier`

**type** `string`








#### platforms.tvos.buildSchemes.[object].provisioningProfiles

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].provisioningProfiles`

**type** `object`








#### platforms.tvos.buildSchemes.[object].provisioningStyle

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].provisioningStyle`

**type** `string`








#### platforms.tvos.buildSchemes.[object].runScheme

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].runScheme`

**type** `string`








#### platforms.tvos.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tvos.buildSchemes.[object].scheme

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].scheme`

**type** `string`








#### platforms.tvos.buildSchemes.[object].sdk

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].sdk`

**type** `string`








#### platforms.tvos.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.tvos.buildSchemes.[object].systemCapabilities

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].systemCapabilities`

**type** `object`



**examples**


```json
{
  "systemCapabilities": {
    "com.apple.SafariKeychain": false,
    "com.apple.Wallet": false,
    "com.apple.HealthKit": false,
    "com.apple.ApplicationGroups.iOS": false,
    "com.apple.iCloud": true,
    "com.apple.DataProtection": false,
    "com.apple.HomeKit": false,
    "com.apple.ClassKit": false,
    "com.apple.VPNLite": false,
    "com.apple.AutoFillCredentialProvider": false,
    "com.apple.AccessWiFi": false,
    "com.apple.InAppPurchase": false,
    "com.apple.HotspotConfiguration": false,
    "com.apple.Multipath": false,
    "com.apple.GameCenter.iOS": false,
    "com.apple.BackgroundModes": false,
    "com.apple.InterAppAudio": false,
    "com.apple.WAC": false,
    "com.apple.Push": true,
    "com.apple.NearFieldCommunicationTagReading": false,
    "com.apple.ApplePay": false,
    "com.apple.Keychain": false,
    "com.apple.Maps.iOS": false,
    "com.apple.Siri": false,
    "com.apple.NetworkExtensions.iOS": false
  }
}
```







#### platforms.tvos.buildSchemes.[object].teamID

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].teamID`

**type** `string`








#### platforms.tvos.buildSchemes.[object].teamIdentifier

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].teamIdentifier`

**type** `string`








#### platforms.tvos.buildSchemes.[object].testFlightId

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].testFlightId`

**type** `string`








#### platforms.tvos.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tvos.buildSchemes.[object].title

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tvos.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tvos.buildSchemes.[object].xcodeproj

**path**
`renative.json/#/platforms.tvos.buildSchemes.[object].xcodeproj`

**type** `object`









#### platforms.tvos.bundleAssets

**path**
`renative.json/#/platforms.tvos.bundleAssets`

**type** `boolean`








#### platforms.tvos.bundleIsDev

**path**
`renative.json/#/platforms.tvos.bundleIsDev`

**type** `boolean`








#### platforms.tvos.codeSignIdentity

**path**
`renative.json/#/platforms.tvos.codeSignIdentity`

**type** `string`

Special property which tells Xcode how to build your project

**examples**


```json
{
  "codeSignIdentity": "iPhone Developer"
}
```



```json
{
  "codeSignIdentity": "iPhone Distribution"
}
```







#### platforms.tvos.deploy

**path**
`renative.json/#/platforms.tvos.deploy`

**type** `object`







#### platforms.tvos.deploy.type

**path**
`renative.json/#/platforms.tvos.deploy.type`

**type** `string`









#### platforms.tvos.deploymentTarget

**path**
`renative.json/#/platforms.tvos.deploymentTarget`

**type** `string`








#### platforms.tvos.description

**path**
`renative.json/#/platforms.tvos.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.tvos.engine

**path**
`renative.json/#/platforms.tvos.engine`

**type** `string`








#### platforms.tvos.entitlements

**path**
`renative.json/#/platforms.tvos.entitlements`

**type** `object`








#### platforms.tvos.entryFile

**path**
`renative.json/#/platforms.tvos.entryFile`

**type** `string`








#### platforms.tvos.excludedPlugins

**path**
`renative.json/#/platforms.tvos.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tvos.exportOptions

**path**
`renative.json/#/platforms.tvos.exportOptions`

**type** `object`







#### platforms.tvos.exportOptions.compileBitcode

**path**
`renative.json/#/platforms.tvos.exportOptions.compileBitcode`

**type** `boolean`








#### platforms.tvos.exportOptions.method

**path**
`renative.json/#/platforms.tvos.exportOptions.method`

**type** `string`








#### platforms.tvos.exportOptions.provisioningProfiles

**path**
`renative.json/#/platforms.tvos.exportOptions.provisioningProfiles`

**type** `object`








#### platforms.tvos.exportOptions.signingCertificate

**path**
`renative.json/#/platforms.tvos.exportOptions.signingCertificate`

**type** `string`








#### platforms.tvos.exportOptions.signingStyle

**path**
`renative.json/#/platforms.tvos.exportOptions.signingStyle`

**type** `string`








#### platforms.tvos.exportOptions.teamID

**path**
`renative.json/#/platforms.tvos.exportOptions.teamID`

**type** `string`








#### platforms.tvos.exportOptions.uploadBitcode

**path**
`renative.json/#/platforms.tvos.exportOptions.uploadBitcode`

**type** `boolean`








#### platforms.tvos.exportOptions.uploadSymbols

**path**
`renative.json/#/platforms.tvos.exportOptions.uploadSymbols`

**type** `boolean`









#### platforms.tvos.ext

**path**
`renative.json/#/platforms.tvos.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.tvos.firebaseId

**path**
`renative.json/#/platforms.tvos.firebaseId`

**type** `string`








#### platforms.tvos.id

**path**
`renative.json/#/platforms.tvos.id`

**type** `string`








#### platforms.tvos.ignoreLogs

**path**
`renative.json/#/platforms.tvos.ignoreLogs`

**type** `boolean`








#### platforms.tvos.ignoreWarnings

**path**
`renative.json/#/platforms.tvos.ignoreWarnings`

**type** `boolean`








#### platforms.tvos.includedFonts

**path**
`renative.json/#/platforms.tvos.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.tvos.includedPermissions

**path**
`renative.json/#/platforms.tvos.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.tvos.includedPlugins

**path**
`renative.json/#/platforms.tvos.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.tvos.license

**path**
`renative.json/#/platforms.tvos.license`

**type** `string`








#### platforms.tvos.orientationSupport

**path**
`renative.json/#/platforms.tvos.orientationSupport`

**type** `object`



**examples**


```json
{
  "orientationSupport": {
    "phone": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ],
    "tab": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ]
  }
}
```






#### platforms.tvos.orientationSupport.phone

**path**
`renative.json/#/platforms.tvos.orientationSupport.phone`

**type** `array`








#### platforms.tvos.orientationSupport.tab

**path**
`renative.json/#/platforms.tvos.orientationSupport.tab`

**type** `array`









#### platforms.tvos.permissions

**path**
`renative.json/#/platforms.tvos.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.tvos.plist

**path**
`renative.json/#/platforms.tvos.plist`

**type** `object`








#### platforms.tvos.provisionProfileSpecifier

**path**
`renative.json/#/platforms.tvos.provisionProfileSpecifier`

**type** `string`








#### platforms.tvos.provisioningProfiles

**path**
`renative.json/#/platforms.tvos.provisioningProfiles`

**type** `object`








#### platforms.tvos.provisioningStyle

**path**
`renative.json/#/platforms.tvos.provisioningStyle`

**type** `string`








#### platforms.tvos.runScheme

**path**
`renative.json/#/platforms.tvos.runScheme`

**type** `string`








#### platforms.tvos.runtime

**path**
`renative.json/#/platforms.tvos.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.tvos.scheme

**path**
`renative.json/#/platforms.tvos.scheme`

**type** `string`








#### platforms.tvos.sdk

**path**
`renative.json/#/platforms.tvos.sdk`

**type** `string`








#### platforms.tvos.splashScreen

**path**
`renative.json/#/platforms.tvos.splashScreen`

**type** `boolean`








#### platforms.tvos.systemCapabilities

**path**
`renative.json/#/platforms.tvos.systemCapabilities`

**type** `object`



**examples**


```json
{
  "systemCapabilities": {
    "com.apple.SafariKeychain": false,
    "com.apple.Wallet": false,
    "com.apple.HealthKit": false,
    "com.apple.ApplicationGroups.iOS": false,
    "com.apple.iCloud": true,
    "com.apple.DataProtection": false,
    "com.apple.HomeKit": false,
    "com.apple.ClassKit": false,
    "com.apple.VPNLite": false,
    "com.apple.AutoFillCredentialProvider": false,
    "com.apple.AccessWiFi": false,
    "com.apple.InAppPurchase": false,
    "com.apple.HotspotConfiguration": false,
    "com.apple.Multipath": false,
    "com.apple.GameCenter.iOS": false,
    "com.apple.BackgroundModes": false,
    "com.apple.InterAppAudio": false,
    "com.apple.WAC": false,
    "com.apple.Push": true,
    "com.apple.NearFieldCommunicationTagReading": false,
    "com.apple.ApplePay": false,
    "com.apple.Keychain": false,
    "com.apple.Maps.iOS": false,
    "com.apple.Siri": false,
    "com.apple.NetworkExtensions.iOS": false
  }
}
```







#### platforms.tvos.teamID

**path**
`renative.json/#/platforms.tvos.teamID`

**type** `string`








#### platforms.tvos.teamIdentifier

**path**
`renative.json/#/platforms.tvos.teamIdentifier`

**type** `string`








#### platforms.tvos.testFlightId

**path**
`renative.json/#/platforms.tvos.testFlightId`

**type** `string`








#### platforms.tvos.timestampAssets

**path**
`renative.json/#/platforms.tvos.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.tvos.title

**path**
`renative.json/#/platforms.tvos.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.tvos.versionedAssets

**path**
`renative.json/#/platforms.tvos.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.tvos.xcodeproj

**path**
`renative.json/#/platforms.tvos.xcodeproj`

**type** `object`









---
### platforms.web

**path**
`renative.json/#/platforms.web`

**type** `object`







#### platforms.web.author

**path**
`renative.json/#/platforms.web.author`

**type** `object`








#### platforms.web.backgroundColor

**path**
`renative.json/#/platforms.web.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.web.buildSchemes

**path**
`renative.json/#/platforms.web.buildSchemes`

**type** `object`







#### platforms.web.buildSchemes.[object].author

**path**
`renative.json/#/platforms.web.buildSchemes.[object].author`

**type** `object`








#### platforms.web.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.web.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.web.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.web.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.web.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.web.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.web.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.web.buildSchemes.[object].deploy`

**type** `object`







#### platforms.web.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.web.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.web.buildSchemes.[object].description

**path**
`renative.json/#/platforms.web.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.web.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.web.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.web.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.web.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.web.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.web.buildSchemes.[object].engine`

**type** `string`








#### platforms.web.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.web.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.web.buildSchemes.[object].environment

**path**
`renative.json/#/platforms.web.buildSchemes.[object].environment`

**type** `string`








#### platforms.web.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.web.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.web.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.web.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.web.buildSchemes.[object].id

**path**
`renative.json/#/platforms.web.buildSchemes.[object].id`

**type** `string`








#### platforms.web.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.web.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.web.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.web.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.web.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.web.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.web.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.web.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.web.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.web.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.web.buildSchemes.[object].license

**path**
`renative.json/#/platforms.web.buildSchemes.[object].license`

**type** `string`








#### platforms.web.buildSchemes.[object].pagesDir

**path**
`renative.json/#/platforms.web.buildSchemes.[object].pagesDir`

**type** `string`








#### platforms.web.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.web.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.web.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.web.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.web.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.web.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.web.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.web.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.web.buildSchemes.[object].title

**path**
`renative.json/#/platforms.web.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.web.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.web.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.web.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.web.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.web.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.web.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.web.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.web.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.web.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.web.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.web.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.web.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.web.bundleAssets

**path**
`renative.json/#/platforms.web.bundleAssets`

**type** `boolean`








#### platforms.web.bundleIsDev

**path**
`renative.json/#/platforms.web.bundleIsDev`

**type** `boolean`








#### platforms.web.deploy

**path**
`renative.json/#/platforms.web.deploy`

**type** `object`







#### platforms.web.deploy.type

**path**
`renative.json/#/platforms.web.deploy.type`

**type** `string`









#### platforms.web.description

**path**
`renative.json/#/platforms.web.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.web.devServerHost

**path**
`renative.json/#/platforms.web.devServerHost`

**type** `string`








#### platforms.web.engine

**path**
`renative.json/#/platforms.web.engine`

**type** `string`








#### platforms.web.entryFile

**path**
`renative.json/#/platforms.web.entryFile`

**type** `string`








#### platforms.web.environment

**path**
`renative.json/#/platforms.web.environment`

**type** `string`








#### platforms.web.excludedPlugins

**path**
`renative.json/#/platforms.web.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.web.ext

**path**
`renative.json/#/platforms.web.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.web.id

**path**
`renative.json/#/platforms.web.id`

**type** `string`








#### platforms.web.ignoreLogs

**path**
`renative.json/#/platforms.web.ignoreLogs`

**type** `boolean`








#### platforms.web.ignoreWarnings

**path**
`renative.json/#/platforms.web.ignoreWarnings`

**type** `boolean`








#### platforms.web.includedFonts

**path**
`renative.json/#/platforms.web.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.web.includedPermissions

**path**
`renative.json/#/platforms.web.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.web.includedPlugins

**path**
`renative.json/#/platforms.web.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.web.license

**path**
`renative.json/#/platforms.web.license`

**type** `string`








#### platforms.web.pagesDir

**path**
`renative.json/#/platforms.web.pagesDir`

**type** `string`








#### platforms.web.permissions

**path**
`renative.json/#/platforms.web.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.web.runtime

**path**
`renative.json/#/platforms.web.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.web.splashScreen

**path**
`renative.json/#/platforms.web.splashScreen`

**type** `boolean`








#### platforms.web.timestampAssets

**path**
`renative.json/#/platforms.web.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.web.title

**path**
`renative.json/#/platforms.web.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.web.versionedAssets

**path**
`renative.json/#/platforms.web.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.web.webpackConfig

**path**
`renative.json/#/platforms.web.webpackConfig`

**type** `object`







#### platforms.web.webpackConfig.customScripts

**path**
`renative.json/#/platforms.web.webpackConfig.customScripts`

**type** `array`








#### platforms.web.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.web.webpackConfig.devServerHost`

**type** `string`








#### platforms.web.webpackConfig.extend

**path**
`renative.json/#/platforms.web.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.web.webpackConfig.metaTags

**path**
`renative.json/#/platforms.web.webpackConfig.metaTags`

**type** `object`










---
### platforms.webos

**path**
`renative.json/#/platforms.webos`

**type** `object`







#### platforms.webos.author

**path**
`renative.json/#/platforms.webos.author`

**type** `object`








#### platforms.webos.backgroundColor

**path**
`renative.json/#/platforms.webos.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.webos.buildSchemes

**path**
`renative.json/#/platforms.webos.buildSchemes`

**type** `object`







#### platforms.webos.buildSchemes.[object].author

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].author`

**type** `object`








#### platforms.webos.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.webos.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].deploy`

**type** `object`







#### platforms.webos.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.webos.buildSchemes.[object].description

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.webos.buildSchemes.[object].devServerHost

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].devServerHost`

**type** `string`








#### platforms.webos.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].engine`

**type** `string`








#### platforms.webos.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.webos.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.webos.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.webos.buildSchemes.[object].id

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].id`

**type** `string`








#### platforms.webos.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.webos.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.webos.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.webos.buildSchemes.[object].license

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].license`

**type** `string`








#### platforms.webos.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.webos.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.webos.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.webos.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.webos.buildSchemes.[object].title

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.webos.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.webos.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.webos.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.webos.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.webos.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.webos.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.webos.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.webos.bundleAssets

**path**
`renative.json/#/platforms.webos.bundleAssets`

**type** `boolean`








#### platforms.webos.bundleIsDev

**path**
`renative.json/#/platforms.webos.bundleIsDev`

**type** `boolean`








#### platforms.webos.deploy

**path**
`renative.json/#/platforms.webos.deploy`

**type** `object`







#### platforms.webos.deploy.type

**path**
`renative.json/#/platforms.webos.deploy.type`

**type** `string`









#### platforms.webos.description

**path**
`renative.json/#/platforms.webos.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.webos.devServerHost

**path**
`renative.json/#/platforms.webos.devServerHost`

**type** `string`








#### platforms.webos.engine

**path**
`renative.json/#/platforms.webos.engine`

**type** `string`








#### platforms.webos.entryFile

**path**
`renative.json/#/platforms.webos.entryFile`

**type** `string`








#### platforms.webos.excludedPlugins

**path**
`renative.json/#/platforms.webos.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.webos.ext

**path**
`renative.json/#/platforms.webos.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.webos.id

**path**
`renative.json/#/platforms.webos.id`

**type** `string`








#### platforms.webos.ignoreLogs

**path**
`renative.json/#/platforms.webos.ignoreLogs`

**type** `boolean`








#### platforms.webos.ignoreWarnings

**path**
`renative.json/#/platforms.webos.ignoreWarnings`

**type** `boolean`








#### platforms.webos.includedFonts

**path**
`renative.json/#/platforms.webos.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.webos.includedPermissions

**path**
`renative.json/#/platforms.webos.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.webos.includedPlugins

**path**
`renative.json/#/platforms.webos.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.webos.license

**path**
`renative.json/#/platforms.webos.license`

**type** `string`








#### platforms.webos.permissions

**path**
`renative.json/#/platforms.webos.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.webos.runtime

**path**
`renative.json/#/platforms.webos.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.webos.splashScreen

**path**
`renative.json/#/platforms.webos.splashScreen`

**type** `boolean`








#### platforms.webos.timestampAssets

**path**
`renative.json/#/platforms.webos.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.webos.title

**path**
`renative.json/#/platforms.webos.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.webos.versionedAssets

**path**
`renative.json/#/platforms.webos.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.webos.webpackConfig

**path**
`renative.json/#/platforms.webos.webpackConfig`

**type** `object`







#### platforms.webos.webpackConfig.customScripts

**path**
`renative.json/#/platforms.webos.webpackConfig.customScripts`

**type** `array`








#### platforms.webos.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.webos.webpackConfig.devServerHost`

**type** `string`








#### platforms.webos.webpackConfig.extend

**path**
`renative.json/#/platforms.webos.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.webos.webpackConfig.metaTags

**path**
`renative.json/#/platforms.webos.webpackConfig.metaTags`

**type** `object`










---
### platforms.windows

**path**
`renative.json/#/platforms.windows`

**type** `object`







#### platforms.windows.BrowserWindow

**path**
`renative.json/#/platforms.windows.BrowserWindow`

**type** `object`

Allows you to configure electron wrapper app window

**examples**


```json
{
  "BrowserWindow": {
    "width": 1310,
    "height": 800,
    "webPreferences": {
      "devTools": true
    }
  }
}
```






#### platforms.windows.BrowserWindow.height

**path**
`renative.json/#/platforms.windows.BrowserWindow.height`

**type** `integer`

Default height of electron app






#### platforms.windows.BrowserWindow.webPreferences

**path**
`renative.json/#/platforms.windows.BrowserWindow.webPreferences`

**type** `object`

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```







#### platforms.windows.BrowserWindow.width

**path**
`renative.json/#/platforms.windows.BrowserWindow.width`

**type** `integer`

Default width of electron app







#### platforms.windows.appleId

**path**
`renative.json/#/platforms.windows.appleId`

**type** `string`








#### platforms.windows.author

**path**
`renative.json/#/platforms.windows.author`

**type** `object`








#### platforms.windows.backgroundColor

**path**
`renative.json/#/platforms.windows.backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.windows.buildSchemes

**path**
`renative.json/#/platforms.windows.buildSchemes`

**type** `object`







#### platforms.windows.buildSchemes.[object].BrowserWindow

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].BrowserWindow`

**type** `object`

Allows you to configure electron wrapper app window

**examples**


```json
{
  "BrowserWindow": {
    "width": 1310,
    "height": 800,
    "webPreferences": {
      "devTools": true
    }
  }
}
```






#### platforms.windows.buildSchemes.[object].BrowserWindow.height

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].BrowserWindow.height`

**type** `integer`

Default height of electron app






#### platforms.windows.buildSchemes.[object].BrowserWindow.webPreferences

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].BrowserWindow.webPreferences`

**type** `object`

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```







#### platforms.windows.buildSchemes.[object].BrowserWindow.width

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].BrowserWindow.width`

**type** `integer`

Default width of electron app







#### platforms.windows.buildSchemes.[object].appleId

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].appleId`

**type** `string`








#### platforms.windows.buildSchemes.[object].author

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].author`

**type** `object`








#### platforms.windows.buildSchemes.[object].backgroundColor

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].backgroundColor`

**type** `string`

Defines root view backgroundColor for all platforms in HEX format

**examples**


```json
{
  "backgroundColor": "#FFFFFF"
}
```



```json
{
  "backgroundColor": "#222222"
}
```







#### platforms.windows.buildSchemes.[object].bundleAssets

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].bundleAssets`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].bundleIsDev

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].bundleIsDev`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].deploy

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].deploy`

**type** `object`







#### platforms.windows.buildSchemes.[object].deploy.type

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].deploy.type`

**type** `string`









#### platforms.windows.buildSchemes.[object].description

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.windows.buildSchemes.[object].electronConfig

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].electronConfig`

**type** `object`

Allows you to configure electron app as per https://www.electron.build/

**examples**


```json
{
  "electronConfig": {
    "mac": {
      "target": [
        "dmg",
        "mas",
        "mas-dev"
      ],
      "hardenedRuntime": true
    },
    "dmg": {
      "sign": false
    },
    "mas": {
      "type": "distribution",
      "hardenedRuntime": false
    }
  }
}
```







#### platforms.windows.buildSchemes.[object].enabled

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].enabled`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].engine

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].engine`

**type** `string`








#### platforms.windows.buildSchemes.[object].entryFile

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].entryFile`

**type** `string`








#### platforms.windows.buildSchemes.[object].excludedPlugins

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.windows.buildSchemes.[object].ext

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.windows.buildSchemes.[object].id

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].id`

**type** `string`








#### platforms.windows.buildSchemes.[object].ignoreLogs

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].ignoreLogs`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].ignoreWarnings

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].ignoreWarnings`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].includedFonts

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.windows.buildSchemes.[object].includedPermissions

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.windows.buildSchemes.[object].includedPlugins

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.windows.buildSchemes.[object].license

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].license`

**type** `string`








#### platforms.windows.buildSchemes.[object].permissions

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.windows.buildSchemes.[object].runtime

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.windows.buildSchemes.[object].splashScreen

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].splashScreen`

**type** `boolean`








#### platforms.windows.buildSchemes.[object].timestampAssets

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.windows.buildSchemes.[object].title

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.windows.buildSchemes.[object].versionedAssets

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.windows.buildSchemes.[object].webpackConfig

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].webpackConfig`

**type** `object`







#### platforms.windows.buildSchemes.[object].webpackConfig.customScripts

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].webpackConfig.customScripts`

**type** `array`








#### platforms.windows.buildSchemes.[object].webpackConfig.devServerHost

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].webpackConfig.devServerHost`

**type** `string`








#### platforms.windows.buildSchemes.[object].webpackConfig.extend

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.windows.buildSchemes.[object].webpackConfig.metaTags

**path**
`renative.json/#/platforms.windows.buildSchemes.[object].webpackConfig.metaTags`

**type** `object`










#### platforms.windows.bundleAssets

**path**
`renative.json/#/platforms.windows.bundleAssets`

**type** `boolean`








#### platforms.windows.bundleIsDev

**path**
`renative.json/#/platforms.windows.bundleIsDev`

**type** `boolean`








#### platforms.windows.deploy

**path**
`renative.json/#/platforms.windows.deploy`

**type** `object`







#### platforms.windows.deploy.type

**path**
`renative.json/#/platforms.windows.deploy.type`

**type** `string`









#### platforms.windows.description

**path**
`renative.json/#/platforms.windows.description`

**type** `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```







#### platforms.windows.electronConfig

**path**
`renative.json/#/platforms.windows.electronConfig`

**type** `object`

Allows you to configure electron app as per https://www.electron.build/

**examples**


```json
{
  "electronConfig": {
    "mac": {
      "target": [
        "dmg",
        "mas",
        "mas-dev"
      ],
      "hardenedRuntime": true
    },
    "dmg": {
      "sign": false
    },
    "mas": {
      "type": "distribution",
      "hardenedRuntime": false
    }
  }
}
```







#### platforms.windows.engine

**path**
`renative.json/#/platforms.windows.engine`

**type** `string`








#### platforms.windows.entryFile

**path**
`renative.json/#/platforms.windows.entryFile`

**type** `string`








#### platforms.windows.excludedPlugins

**path**
`renative.json/#/platforms.windows.excludedPlugins`

**type** `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

**examples**


```json
{
  "excludedPlugins": [
    "*"
  ]
}
```



```json
{
  "excludedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.windows.ext

**path**
`renative.json/#/platforms.windows.ext`

**type** `object`

Object ysed to extend your renative with custom props. This allows renative json schema to be validated

**examples**


```json
{
  "ext": {
    "myCustomRenativeProp": "foo"
  }
}
```







#### platforms.windows.id

**path**
`renative.json/#/platforms.windows.id`

**type** `string`








#### platforms.windows.ignoreLogs

**path**
`renative.json/#/platforms.windows.ignoreLogs`

**type** `boolean`








#### platforms.windows.ignoreWarnings

**path**
`renative.json/#/platforms.windows.ignoreWarnings`

**type** `boolean`








#### platforms.windows.includedFonts

**path**
`renative.json/#/platforms.windows.includedFonts`

**type** `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

**examples**


```json
{
  "includedFonts": [
    "*"
  ]
}
```



```json
{
  "includedFonts": [
    "TimeBurner",
    "Entypo"
  ]
}
```







#### platforms.windows.includedPermissions

**path**
`renative.json/#/platforms.windows.includedPermissions`

**type** `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

**examples**


```json
{
  "includedPermissions": [
    "*"
  ]
}
```



```json
{
  "includedPermissions": [
    "INTERNET",
    "CAMERA",
    "SYSTEM_ALERT_WINDOW",
    "RECORD_AUDIO",
    "RECORD_VIDEO",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "VIBRATE",
    "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE",
    "RECEIVE_BOOT_COMPLETED",
    "WRITE_CONTACTS",
    "READ_CONTACTS"
  ]
}
```







#### platforms.windows.includedPlugins

**path**
`renative.json/#/platforms.windows.includedPlugins`

**type** `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

**examples**


```json
{
  "includedPlugins": [
    "*"
  ]
}
```



```json
{
  "includedPlugins": [
    "react-native-google-cast",
    "react-navigation-tabs"
  ]
}
```







#### platforms.windows.license

**path**
`renative.json/#/platforms.windows.license`

**type** `string`








#### platforms.windows.permissions

**path**
`renative.json/#/platforms.windows.permissions`

**type** `array`

> DEPRECATED in favor of includedPermissions






#### platforms.windows.runtime

**path**
`renative.json/#/platforms.windows.runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```







#### platforms.windows.splashScreen

**path**
`renative.json/#/platforms.windows.splashScreen`

**type** `boolean`








#### platforms.windows.timestampAssets

**path**
`renative.json/#/platforms.windows.timestampAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-12345678.js) every new build. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new build you deploy

**examples**


```json
{
  "timestampAssets": "true"
}
```



```json
{
  "timestampAssets": "false"
}
```







#### platforms.windows.title

**path**
`renative.json/#/platforms.windows.title`

**type** `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```







#### platforms.windows.versionedAssets

**path**
`renative.json/#/platforms.windows.versionedAssets`

**type** `boolean`

If set to `true` generated js (bundle.js) files will be timestamped and named (bundle-1.0.0.js) every new version. This is useful if you want to enforce invalidate cache agains standard CDN cache policies every new version you deploy

**examples**


```json
{
  "versionedAssets": "true"
}
```



```json
{
  "versionedAssets": "false"
}
```







#### platforms.windows.webpackConfig

**path**
`renative.json/#/platforms.windows.webpackConfig`

**type** `object`







#### platforms.windows.webpackConfig.customScripts

**path**
`renative.json/#/platforms.windows.webpackConfig.customScripts`

**type** `array`








#### platforms.windows.webpackConfig.devServerHost

**path**
`renative.json/#/platforms.windows.webpackConfig.devServerHost`

**type** `string`








#### platforms.windows.webpackConfig.extend

**path**
`renative.json/#/platforms.windows.webpackConfig.extend`

**type** `object`

Allows you to directly extend/override webpack config of your current platform

**examples**


```json
{
  "extend": {
    "devtool": "source-map"
  }
}
```



```json
{
  "extend": {
    "module": {
      "rules": [
        {
          "test": {},
          "use": [
            "source-map-loader"
          ],
          "enforce": "pre"
        }
      ]
    }
  }
}
```







#### platforms.windows.webpackConfig.metaTags

**path**
`renative.json/#/platforms.windows.webpackConfig.metaTags`

**type** `object`













---
## pluginTemplates

**path**
`renative.json/#/pluginTemplates`

**type** `object`










---
## plugins

**path**
`renative.json/#/plugins`

**type** `object`

Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config

**examples**


```json
{
  "plugins": {
    "renative": "source:rnv",
    "react": "source:rnv",
    "react-native-cached-image": "source:rnv",
    "react-native-web-image-loader": "source:rnv",
    "react-native-gesture-handler": {
      "version": "1.0.0"
    }
  }
}
```






---
### plugins.[object].android

**path**
`renative.json/#/plugins.[object].android`

**type** `object`







#### plugins.[object].android.AndroidManifest

**path**
`renative.json/#/plugins.[object].android.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### plugins.[object].android.afterEvaluate

**path**
`renative.json/#/plugins.[object].android.afterEvaluate`

**type** `array`








#### plugins.[object].android.app/build.gradle

**path**
`renative.json/#/plugins.[object].android.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### plugins.[object].android.applyPlugin

**path**
`renative.json/#/plugins.[object].android.applyPlugin`

**type** `array`








#### plugins.[object].android.build.gradle

**path**
`renative.json/#/plugins.[object].android.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### plugins.[object].android.enabled

**path**
`renative.json/#/plugins.[object].android.enabled`

**type** `boolean`








#### plugins.[object].android.gradle.properties

**path**
`renative.json/#/plugins.[object].android.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### plugins.[object].android.package

**path**
`renative.json/#/plugins.[object].android.package`

**type** `string`








#### plugins.[object].android.projectName

**path**
`renative.json/#/plugins.[object].android.projectName`

**type** `string`








#### plugins.[object].android.skipImplementation

**path**
`renative.json/#/plugins.[object].android.skipImplementation`

**type** `boolean`








#### plugins.[object].android.webpackConfig

**path**
`renative.json/#/plugins.[object].android.webpackConfig`

**type** `object`









---
### plugins.[object].androidtv

**path**
`renative.json/#/plugins.[object].androidtv`

**type** `object`







#### plugins.[object].androidtv.AndroidManifest

**path**
`renative.json/#/plugins.[object].androidtv.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### plugins.[object].androidtv.afterEvaluate

**path**
`renative.json/#/plugins.[object].androidtv.afterEvaluate`

**type** `array`








#### plugins.[object].androidtv.app/build.gradle

**path**
`renative.json/#/plugins.[object].androidtv.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### plugins.[object].androidtv.applyPlugin

**path**
`renative.json/#/plugins.[object].androidtv.applyPlugin`

**type** `array`








#### plugins.[object].androidtv.build.gradle

**path**
`renative.json/#/plugins.[object].androidtv.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### plugins.[object].androidtv.enabled

**path**
`renative.json/#/plugins.[object].androidtv.enabled`

**type** `boolean`








#### plugins.[object].androidtv.gradle.properties

**path**
`renative.json/#/plugins.[object].androidtv.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### plugins.[object].androidtv.package

**path**
`renative.json/#/plugins.[object].androidtv.package`

**type** `string`








#### plugins.[object].androidtv.projectName

**path**
`renative.json/#/plugins.[object].androidtv.projectName`

**type** `string`








#### plugins.[object].androidtv.skipImplementation

**path**
`renative.json/#/plugins.[object].androidtv.skipImplementation`

**type** `boolean`








#### plugins.[object].androidtv.webpackConfig

**path**
`renative.json/#/plugins.[object].androidtv.webpackConfig`

**type** `object`









---
### plugins.[object].androidwear

**path**
`renative.json/#/plugins.[object].androidwear`

**type** `object`







#### plugins.[object].androidwear.AndroidManifest

**path**
`renative.json/#/plugins.[object].androidwear.AndroidManifest`

**type** `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

Injects / Overrides values in AndroidManifest.xml file of generated android based project

> IMPORTANT: always ensure that your object contains `tag` and `android:name` to target correct tag to merge into



**examples**


```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "children": [
          {
            "tag": "activity",
            "android:name": "com.ahmedadeltito.photoeditor.PhotoEditorActivity"
          }
        ]
      }
    ]
  }
}
```



```json
{
  "AndroidManifest": {
    "children": [
      {
        "tag": "application",
        "android:name": ".MainApplication",
        "android:allowBackup": true,
        "android:largeHeap": true,
        "android:usesCleartextTraffic": true,
        "tools:targetApi": 28
      }
    ]
  }
}
```







#### plugins.[object].androidwear.afterEvaluate

**path**
`renative.json/#/plugins.[object].androidwear.afterEvaluate`

**type** `array`








#### plugins.[object].androidwear.app/build.gradle

**path**
`renative.json/#/plugins.[object].androidwear.app/build.gradle`

**type** `object`

Overrides values in `app/build.gradle` file of generated android based project

**examples**


```json
{
  "app/build.gradle": {
    "apply": [
      "plugin: 'io.fabric'"
    ]
  }
}
```







#### plugins.[object].androidwear.applyPlugin

**path**
`renative.json/#/plugins.[object].androidwear.applyPlugin`

**type** `array`








#### plugins.[object].androidwear.build.gradle

**path**
`renative.json/#/plugins.[object].androidwear.build.gradle`

**type** `object`

Overrides values in `build.gradle` file of generated android based project

**examples**


```json
{
  "build.gradle": {
    "allprojects": {
      "repositories": {
        "maven { url \"https://dl.bintray.com/onfido/maven\" }": true
      }
    }
  }
}
```







#### plugins.[object].androidwear.enabled

**path**
`renative.json/#/plugins.[object].androidwear.enabled`

**type** `boolean`








#### plugins.[object].androidwear.gradle.properties

**path**
`renative.json/#/plugins.[object].androidwear.gradle.properties`

**type** `object`

Overrides values in `gradle.properties` file of generated android based project

**examples**


```json
{
  "gradle.properties": {
    "gradle.properties": {
      "android.debug.obsoleteApi": true,
      "debug.keystore": "debug.keystore",
      "org.gradle.daemon": true,
      "org.gradle.parallel": true,
      "org.gradle.configureondemand": true
    }
  }
}
```







#### plugins.[object].androidwear.package

**path**
`renative.json/#/plugins.[object].androidwear.package`

**type** `string`








#### plugins.[object].androidwear.projectName

**path**
`renative.json/#/plugins.[object].androidwear.projectName`

**type** `string`








#### plugins.[object].androidwear.skipImplementation

**path**
`renative.json/#/plugins.[object].androidwear.skipImplementation`

**type** `boolean`








#### plugins.[object].androidwear.webpackConfig

**path**
`renative.json/#/plugins.[object].androidwear.webpackConfig`

**type** `object`









---
### plugins.[object].chromecast

**path**
`renative.json/#/plugins.[object].chromecast`

**type** `object`







#### plugins.[object].chromecast.enabled

**path**
`renative.json/#/plugins.[object].chromecast.enabled`

**type** `boolean`








#### plugins.[object].chromecast.webpackConfig

**path**
`renative.json/#/plugins.[object].chromecast.webpackConfig`

**type** `object`









---
### plugins.[object].enabled

**path**
`renative.json/#/plugins.[object].enabled`

**type** `boolean`








---
### plugins.[object].firefox

**path**
`renative.json/#/plugins.[object].firefox`

**type** `object`







#### plugins.[object].firefox.enabled

**path**
`renative.json/#/plugins.[object].firefox.enabled`

**type** `boolean`








#### plugins.[object].firefox.webpackConfig

**path**
`renative.json/#/plugins.[object].firefox.webpackConfig`

**type** `object`









---
### plugins.[object].ios

**path**
`renative.json/#/plugins.[object].ios`

**type** `object`







#### plugins.[object].ios.Podfile

**path**
`renative.json/#/plugins.[object].ios.Podfile`

**type** `object`








#### plugins.[object].ios.appDelegateApplicationMethods

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods`

**type** `object`







#### plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceive`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegister`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.open

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.open`

**type** `array`








#### plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### plugins.[object].ios.appDelegateImports

**path**
`renative.json/#/plugins.[object].ios.appDelegateImports`

**type** `array`








#### plugins.[object].ios.appDelegateMethods

**path**
`renative.json/#/plugins.[object].ios.appDelegateMethods`

**type** `object`








#### plugins.[object].ios.enabled

**path**
`renative.json/#/plugins.[object].ios.enabled`

**type** `boolean`








#### plugins.[object].ios.isStatic

**path**
`renative.json/#/plugins.[object].ios.isStatic`

**type** `boolean`








#### plugins.[object].ios.plist

**path**
`renative.json/#/plugins.[object].ios.plist`

**type** `object`








#### plugins.[object].ios.podName

**path**
`renative.json/#/plugins.[object].ios.podName`

**type** `string`








#### plugins.[object].ios.podNames

**path**
`renative.json/#/plugins.[object].ios.podNames`

**type** `array`








#### plugins.[object].ios.webpackConfig

**path**
`renative.json/#/plugins.[object].ios.webpackConfig`

**type** `object`








#### plugins.[object].ios.xcodeproj

**path**
`renative.json/#/plugins.[object].ios.xcodeproj`

**type** `object`









---
### plugins.[object].macos

**path**
`renative.json/#/plugins.[object].macos`

**type** `object`







#### plugins.[object].macos.enabled

**path**
`renative.json/#/plugins.[object].macos.enabled`

**type** `boolean`








#### plugins.[object].macos.webpackConfig

**path**
`renative.json/#/plugins.[object].macos.webpackConfig`

**type** `object`









---
### plugins.[object].no-npm

**path**
`renative.json/#/plugins.[object].no-npm`

**type** `boolean`








---
### plugins.[object].npm

**path**
`renative.json/#/plugins.[object].npm`

**type** `object`








---
### plugins.[object].pluginDependencies

**path**
`renative.json/#/plugins.[object].pluginDependencies`

**type** `array,null`








---
### plugins.[object].props

**path**
`renative.json/#/plugins.[object].props`

**type** `object`








---
### plugins.[object].skipMerge

**path**
`renative.json/#/plugins.[object].skipMerge`

**type** `boolean`

Will not attempt to merge with existing plugin configuration (ie. coming form renative pluginTemplates)

NOTE: if set to `true` you need to configure your plugin object fully

**examples**


```json
{
  "skipMerge": "true"
}
```



```json
{
  "skipMerge": "false"
}
```







---
### plugins.[object].source

**path**
`renative.json/#/plugins.[object].source`

**type** `string`

Will define custom scope for your plugin config to extend from.

NOTE: custom scopes can be defined via paths.pluginTemplates.[CUSTOM_SCOPE].{}

**examples**


```json
{
  "source": "rnv"
}
```



```json
{
  "source": "myCustomScope"
}
```







---
### plugins.[object].tizen

**path**
`renative.json/#/plugins.[object].tizen`

**type** `object`







#### plugins.[object].tizen.enabled

**path**
`renative.json/#/plugins.[object].tizen.enabled`

**type** `boolean`








#### plugins.[object].tizen.webpackConfig

**path**
`renative.json/#/plugins.[object].tizen.webpackConfig`

**type** `object`









---
### plugins.[object].tvos

**path**
`renative.json/#/plugins.[object].tvos`

**type** `object`







#### plugins.[object].tvos.Podfile

**path**
`renative.json/#/plugins.[object].tvos.Podfile`

**type** `object`








#### plugins.[object].tvos.appDelegateApplicationMethods

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods`

**type** `object`







#### plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.didReceive

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceive`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.didRegister

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegister`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.open

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.open`

**type** `array`








#### plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

**path**
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

**type** `array`









#### plugins.[object].tvos.appDelegateImports

**path**
`renative.json/#/plugins.[object].tvos.appDelegateImports`

**type** `array`








#### plugins.[object].tvos.appDelegateMethods

**path**
`renative.json/#/plugins.[object].tvos.appDelegateMethods`

**type** `object`








#### plugins.[object].tvos.enabled

**path**
`renative.json/#/plugins.[object].tvos.enabled`

**type** `boolean`








#### plugins.[object].tvos.isStatic

**path**
`renative.json/#/plugins.[object].tvos.isStatic`

**type** `boolean`








#### plugins.[object].tvos.plist

**path**
`renative.json/#/plugins.[object].tvos.plist`

**type** `object`








#### plugins.[object].tvos.podName

**path**
`renative.json/#/plugins.[object].tvos.podName`

**type** `string`








#### plugins.[object].tvos.podNames

**path**
`renative.json/#/plugins.[object].tvos.podNames`

**type** `array`








#### plugins.[object].tvos.webpackConfig

**path**
`renative.json/#/plugins.[object].tvos.webpackConfig`

**type** `object`








#### plugins.[object].tvos.xcodeproj

**path**
`renative.json/#/plugins.[object].tvos.xcodeproj`

**type** `object`









---
### plugins.[object].version

**path**
`renative.json/#/plugins.[object].version`

**type** `string`








---
### plugins.[object].web

**path**
`renative.json/#/plugins.[object].web`

**type** `object`







#### plugins.[object].web.enabled

**path**
`renative.json/#/plugins.[object].web.enabled`

**type** `boolean`








#### plugins.[object].web.webpackConfig

**path**
`renative.json/#/plugins.[object].web.webpackConfig`

**type** `object`









---
### plugins.[object].webos

**path**
`renative.json/#/plugins.[object].webos`

**type** `object`







#### plugins.[object].webos.enabled

**path**
`renative.json/#/plugins.[object].webos.enabled`

**type** `boolean`








#### plugins.[object].webos.webpackConfig

**path**
`renative.json/#/plugins.[object].webos.webpackConfig`

**type** `object`









---
### plugins.[object].webpack

**path**
`renative.json/#/plugins.[object].webpack`

**type** `object`

> DEPRECATED in favour of `webpackConfig`






---
### plugins.[object].webpackConfig

**path**
`renative.json/#/plugins.[object].webpackConfig`

**type** `object`

Allows you to configure webpack bahaviour per each individual plugin





#### plugins.[object].webpackConfig.moduleAliases

**path**
`renative.json/#/plugins.[object].webpackConfig.moduleAliases`

**type** `boolean,object`








#### plugins.[object].webpackConfig.modulePaths

**path**
`renative.json/#/plugins.[object].webpackConfig.modulePaths`

**type** `boolean,object`









---
### plugins.[object].windows

**path**
`renative.json/#/plugins.[object].windows`

**type** `object`







#### plugins.[object].windows.enabled

**path**
`renative.json/#/plugins.[object].windows.enabled`

**type** `boolean`








#### plugins.[object].windows.webpackConfig

**path**
`renative.json/#/plugins.[object].windows.webpackConfig`

**type** `object`












---
## private

**path**
`renative.json/#/private`

**type** `object`

Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file

**examples**


```json
{
  "private": {
    "myPrivateKy": "6568347563858739"
  }
}
```









---
## projectName

**path**
`renative.json/#/projectName`

**type** `string`

Name of the project which will be used in workspace as folder name. this will also be used as part of the KEY in crypto env var generator

**examples**


```json
{
  "projectName": "my-project"
}
```



```json
{
  "projectName": "myProject"
}
```









---
## projectTemplates

**path**
`renative.json/#/projectTemplates`

**type** `object`

Custom list of renative templates (NPM package names) which will be displayed during `rnv new` project bootstrap. This prop usually resides in workspace config.

**examples**


```json
{
  "projectTemplates": {
    "my-custom-template": {}
  }
}
```









---
## publish

**path**
`renative.json/#/publish`

**type** `object`










---
## runtime

**path**
`renative.json/#/runtime`

**type** `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

**examples**


```json
{
  "runtime": {
    "someRuntimeProperty": "foo"
  }
}
```









---
## sdks

**path**
`renative.json/#/sdks`

**type** `object`

List of SDK locations used by RNV. This property is usually located in your `WORKSPACE/renative.json`

**examples**


```json
{
  "sdks": {
    "ANDROID_SDK": "/Users/paveljacko/Library/Android/sdk",
    "ANDROID_NDK": "/Users/paveljacko/Library/Android/sdk/ndk-bundle",
    "TIZEN_SDK": "/Users/paveljacko/tizen-studio",
    "WEBOS_SDK": "/opt/webOS_TV_SDK",
    "KAIOS_SDK": "/Applications/Kaiosrt.app"
  }
}
```









---
## tasks

**path**
`renative.json/#/tasks`

**type** `object`

Allows to override specific task within renative toolchain. (currently only `install` supported). this is useful if you want to change specific behaviour of built-in task. ie install task triggers yarn/npm install by default. but that might not be desirable installation trigger

**examples**


```json
{
  "tasks": {
    "install": {
      "script": "yarn bootstrap"
    }
  }
}
```









---
## templates

**path**
`renative.json/#/templates`

**type** `object`

Stores installed templates info in your project.

NOTE: This prop will be updated by rnv if you run `rnv template install`

**examples**


```json
{
  "templates": {
    "renative-template-hello-world": {
      "version": "0.31.0"
    }
  }
}
```









---
## version

**path**
`renative.json/#/version`

**type** `string`

Semver style version of your app.

**examples**


```json
{
  "version": "0.1.0"
}
```



```json
{
  "version": "1.0.0"
}
```



```json
{
  "version": "1.0.0-alpha.1"
}
```



```json
{
  "version": "1.0.0-RC.7"
}
```



```json
{
  "version": "1.0.0-feature-x.0"
}
```









---
## versionCode

**path**
`renative.json/#/versionCode`

**type** `string`

Manual verride of generated version code

**examples**


```json
{
  "versionCode": "1000"
}
```



```json
{
  "versionCode": "10023"
}
```









---
## versionCodeFormat

**path**
`renative.json/#/versionCodeFormat`

**type** `string`

allows you to fine-tune auto generated version codes

default value: 00.00.00

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 10203



"versionCodeFormat" : "00.00.00.00.00"

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 102030000



**examples**


```json
{
  "versionCodeFormat": "00.00.00"
}
```



```json
{
  "versionCodeFormat": "00.00.00.00.00"
}
```









---
## workspaceID

**path**
`renative.json/#/workspaceID`

**type** `string`

Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS

**examples**


```json
{
  "workspaceID": "rnv"
}
```



```json
{
  "workspaceID": "myCustomWorkspace"
}
```
