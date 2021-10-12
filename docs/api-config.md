---
id: api-config
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



## common


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `common` | `object` |  | `common` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `common.author` |





---





### common.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `common.backgroundColor` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `common.buildSchemes` |





---





### common.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `common.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---





### common.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `common.excludedPlugins` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `common.ext` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `common.id` |





---





### common.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `common.ignoreLogs` |





---





### common.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `common.ignoreWarnings` |





---





### common.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `common.includedFonts` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `common.includedPermissions` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `common.includedPlugins` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `common.license` |





---





### common.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `common.permissions` |

> DEPRECATED in favor of includedPermissions



---





### common.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `common.runtime` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `common.splashScreen` |





---





### common.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `common.timestampAssets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `common.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---





### common.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `common.versionedAssets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `crypto` | `object` |  | `crypto` |

This prop enables automatic encrypt and decrypt of sensitive information in your project



---




### crypto.decrypt


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `decrypt` | `object` |  | `crypto.decrypt` |





---



#### crypto.decrypt.source


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `source` | `string` |  | `crypto.decrypt.source` |

Location of encrypted file in your project used as source of decryption into your workspace

**examples**


```json
{
  "source": "PROJECT_HOME/ci/privateConfigs.enc"
}
```




---






### crypto.encrypt


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `encrypt` | `object` |  | `crypto.encrypt` |





---



#### crypto.encrypt.dest


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `dest` | `string` |  | `crypto.encrypt.dest` |

Location of encrypted file in your project used as destination of encryption from your workspace

**examples**


```json
{
  "dest": "PROJECT_HOME/ci/privateConfigs.enc"
}
```




---






### crypto.optional


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `optional` | `boolean` |  | `crypto.optional` |





---








## currentTemplate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `currentTemplate` | `string` |  | `currentTemplate` |

Currently active template used in this project. this allows you to re-bootstrap whole project by running `rnv template apply`

**examples**


```json
{
  "currentTemplate": "renative-template-hello-world"
}
```




---







## defaultTargets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `defaultTargets` | `object` |  | `defaultTargets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `defaults` | `object` |  | `defaults` |

Default system config for this project



---




### defaults.ports


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ports` | `object` |  | `defaults.ports` |

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
    "firefoxtv": 8114,
    "webtv": 8195
  }
}
```




---





### defaults.schemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `schemes` | `object` |  | `defaults.schemes` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `supportedPlatforms` | `array` |  | `defaults.supportedPlatforms` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `targets` | `object` |  | `defaults.targets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `description` |





---







## enableAnalytics


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableAnalytics` | `boolean` |  | `enableAnalytics` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableHookRebuild` | `boolean` |  | `enableHookRebuild` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engines` | `object` |  | `engines` |

List of engines available in this project

**examples**


```json
{
  "engines": {
    "@rnv/engine-rn": "source:rnv",
    "@rnv/engine-rn-tvos": "source:rnv",
    "@rnv/engine-rn-web": "source:rnv",
    "@rnv/engine-rn-next": "source:rnv",
    "@rnv/engine-lightning": "source:rnv",
    "@rnv/engine-rn-electron": "source:rnv",
    "@rnv/engine-rn-windows": "source:rnv"
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







## env


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `env` | `object` |  | `env` |





---







## ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `ext` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `string` |  | `extend` |





---







## hidden


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `hidden` | `boolean` |  | `hidden` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `id` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `integrations` | `object` |  | `integrations` |





---







## isMonorepo


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `isMonorepo` | `boolean` |  | `isMonorepo` |





---







## isWrapper


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `isWrapper` | `boolean` |  | `isWrapper` |





---







## monoRepo


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `monoRepo` | `string` |  | `monoRepo` |

Define custom path to monorepo root where starting point is project directory



---







## paths


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `paths` | `object` |  | `paths` |

Define custom paths for RNV to look into



---




### paths.appConfigsDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appConfigsDir` | `string` |  | `paths.appConfigsDir` |

Custom path to appConfigs. defaults to `./appConfigs`

**examples**


```json
{
  "appConfigsDir": "./appConfigs"
}
```




---





### paths.platformAssetsDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `platformAssetsDir` | `string` |  | `paths.platformAssetsDir` |

Custom path to platformAssets folder. defaults to `./platformAssets`

**examples**


```json
{
  "platformAssetsDir": "./platformAssets"
}
```




---





### paths.platformBuildsDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `platformBuildsDir` | `string` |  | `paths.platformBuildsDir` |

Custom path to platformBuilds folder. defaults to `./platformBuilds`

**examples**


```json
{
  "platformBuildsDir": "./platformBuilds"
}
```




---





### paths.pluginTemplates


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `pluginTemplates` | `object` |  | `paths.pluginTemplates` |


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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `object` |  | `permissions` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `android` | `object` |  | `permissions.android` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ios` | `object` |  | `permissions.ios` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `pipes` | `array` |  | `pipes` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `platforms` | `object` |  | `platforms` |





---




### platforms.android


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `android` | `object` |  | `platforms.android` |





---



#### platforms.android.AndroidManifest


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `AndroidManifest` | `object` |  | `platforms.android.AndroidManifest` |

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




---




#### platforms.android.BuildGradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BuildGradle` | `object` |  | `platforms.android.BuildGradle` |

Allows you to customize `build.gradle` file



---



#### platforms.android.BuildGradle.allprojects


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `allprojects` | `object` |  | `platforms.android.BuildGradle.allprojects` |





---



#### platforms.android.BuildGradle.allprojects.repositories


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `repositories` | `object` |  | `platforms.android.BuildGradle.allprojects.repositories` |

Customize repositories section of build.gradle

**examples**


```json
{
  "repositories": {
    "flatDir { dirs 'libs'}": true
  }
}
```




---






#### platforms.android.aab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `aab` | `boolean` |  | `platforms.android.aab` |

If set to true, android project will generate app.aab instead of apk

**examples**


```json
{
  "aab": "false"
}
```



```json
{
  "aab": "true"
}
```




---




#### platforms.android.app/build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `app/build.gradle` | `object` |  | `platforms.android.app/build.gradle` |

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




---




#### platforms.android.applyPlugin


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `applyPlugin` | `array` |  | `platforms.android.applyPlugin` |





---




#### platforms.android.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.android.author` |





---




#### platforms.android.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.android.backgroundColor` |

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




#### platforms.android.build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build.gradle` | `object` |  | `platforms.android.build.gradle` |

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




---




#### platforms.android.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.android.buildSchemes` |





---




#### platforms.android.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.android.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.android.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.android.bundleIsDev` |





---




#### platforms.android.compileSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileSdkVersion` | `integer` |  | `platforms.android.compileSdkVersion` |

Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` 

**examples**


```json
{
  "compileSdkVersion": "28"
}
```



```json
{
  "compileSdkVersion": "29"
}
```




---




#### platforms.android.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.android.deploy` |





---



#### platforms.android.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.android.deploy.type` |





---





#### platforms.android.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.android.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.android.enableAndroidX


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableAndroidX` | `boolean` | `true` | `platforms.android.enableAndroidX` |



**examples**


```json
{
  "enableAndroidX": "true"
}
```



```json
{
  "enableAndroidX": "false"
}
```




---




#### platforms.android.enableHermes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableHermes` | `boolean` |  | `platforms.android.enableHermes` |

> DEPRECATED in favour of `reactNativeEngine`

**examples**


```json
{
  "enableHermes": "true"
}
```



```json
{
  "enableHermes": "false"
}
```




---




#### platforms.android.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.android.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.android.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.android.engine` |





---




#### platforms.android.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.android.entryFile` |





---




#### platforms.android.excludedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedFeatures` | `array` |  | `platforms.android.excludedFeatures` |





---




#### platforms.android.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.android.excludedPlugins` |

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




#### platforms.android.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.android.ext` |

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




#### platforms.android.gradle.properties


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradle.properties` | `object` |  | `platforms.android.gradle.properties` |

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




---




#### platforms.android.gradleBuildToolsVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleBuildToolsVersion` | `integer` | `3.3.1` | `platforms.android.gradleBuildToolsVersion` |

Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`

**examples**


```json
{
  "gradleBuildToolsVersion": "3.3.1"
}
```



```json
{
  "gradleBuildToolsVersion": "4.1.0"
}
```




---




#### platforms.android.gradleWrapperVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleWrapperVersion` | `integer` | `5.5` | `platforms.android.gradleWrapperVersion` |

Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`

**examples**


```json
{
  "gradleWrapperVersion": "5.5"
}
```



```json
{
  "gradleWrapperVersion": "6.7.1"
}
```




---




#### platforms.android.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.android.id` |





---




#### platforms.android.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.android.ignoreLogs` |





---




#### platforms.android.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.android.ignoreWarnings` |





---




#### platforms.android.implementation


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `implementation` | `object` |  | `platforms.android.implementation` |





---




#### platforms.android.includedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFeatures` | `array` |  | `platforms.android.includedFeatures` |





---




#### platforms.android.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.android.includedFonts` |

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




#### platforms.android.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.android.includedPermissions` |

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




#### platforms.android.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.android.includedPlugins` |

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




#### platforms.android.keyAlias


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyAlias` | `string` |  | `platforms.android.keyAlias` |





---




#### platforms.android.keyPassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyPassword` | `string` |  | `platforms.android.keyPassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

keyPassword for keystore file



---




#### platforms.android.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.android.license` |





---




#### platforms.android.mainActivity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `mainActivity` | `object` | `{}` | `platforms.android.mainActivity` |

Allows you to configure behaviour of MainActivity.kt



---



#### platforms.android.mainActivity.onCreate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `onCreate` | `string` | `super.onCreate(savedInstanceState)` | `platforms.android.mainActivity.onCreate` |

Overrides super.onCreate method handler of MainActivity.kt

**examples**


```json
{
  "onCreate": "super.onCreate(null)"
}
```



```json
{
  "onCreate": "super.onCreate(savedInstanceState)"
}
```




---





#### platforms.android.minSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minSdkVersion` | `integer` | `21` | `platforms.android.minSdkVersion` |



**examples**


```json
{
  "minSdkVersion": "21"
}
```



```json
{
  "minSdkVersion": "22"
}
```




---




#### platforms.android.minifyEnabled


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minifyEnabled` | `boolean` |  | `platforms.android.minifyEnabled` |

Sets minifyEnabled buildType property in app/build.gradle

**examples**


```json
{
  "minifyEnabled": "false"
}
```



```json
{
  "minifyEnabled": "true"
}
```




---




#### platforms.android.multipleAPKs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `multipleAPKs` | `boolean` |  | `platforms.android.multipleAPKs` |

If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"

**examples**


```json
{
  "multipleAPKs": "true"
}
```



```json
{
  "multipleAPKs": "false"
}
```




---




#### platforms.android.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.android.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.android.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` | `default` | `platforms.android.reactNativeEngine` |

Allows you to define specific native render engine to be used

**examples**


```json
{
  "reactNativeEngine": "true"
}
```



```json
{
  "reactNativeEngine": "false"
}
```




---




#### platforms.android.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.android.runtime` |

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




#### platforms.android.signingConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingConfig` | `string` | `Debug` | `platforms.android.signingConfig` |

Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`

**examples**


```json
{
  "signingConfig": "default"
}
```



```json
{
  "signingConfig": "v8-android"
}
```



```json
{
  "signingConfig": "v8-android-nointl"
}
```



```json
{
  "signingConfig": "v8-android-jit"
}
```



```json
{
  "signingConfig": "v8-android-jit-nointl"
}
```



```json
{
  "signingConfig": "hermes"
}
```




---




#### platforms.android.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.android.splashScreen` |





---




#### platforms.android.storeFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storeFile` | `string` |  | `platforms.android.storeFile` |





---




#### platforms.android.storePassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storePassword` | `string` |  | `platforms.android.storePassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

storePassword for keystore file



---




#### platforms.android.targetSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `targetSdkVersion` | `integer` |  | `platforms.android.targetSdkVersion` |

Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` 

**examples**


```json
{
  "targetSdkVersion": "28"
}
```



```json
{
  "targetSdkVersion": "29"
}
```




---




#### platforms.android.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.android.timestampAssets` |

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




#### platforms.android.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.android.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.android.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.android.versionedAssets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `androidtv` | `object` |  | `platforms.androidtv` |





---



#### platforms.androidtv.AndroidManifest


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `AndroidManifest` | `object` |  | `platforms.androidtv.AndroidManifest` |

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




---




#### platforms.androidtv.BuildGradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BuildGradle` | `object` |  | `platforms.androidtv.BuildGradle` |

Allows you to customize `build.gradle` file



---



#### platforms.androidtv.BuildGradle.allprojects


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `allprojects` | `object` |  | `platforms.androidtv.BuildGradle.allprojects` |





---



#### platforms.androidtv.BuildGradle.allprojects.repositories


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `repositories` | `object` |  | `platforms.androidtv.BuildGradle.allprojects.repositories` |

Customize repositories section of build.gradle

**examples**


```json
{
  "repositories": {
    "flatDir { dirs 'libs'}": true
  }
}
```




---






#### platforms.androidtv.aab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `aab` | `boolean` |  | `platforms.androidtv.aab` |

If set to true, android project will generate app.aab instead of apk

**examples**


```json
{
  "aab": "false"
}
```



```json
{
  "aab": "true"
}
```




---




#### platforms.androidtv.app/build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `app/build.gradle` | `object` |  | `platforms.androidtv.app/build.gradle` |

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




---




#### platforms.androidtv.applyPlugin


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `applyPlugin` | `array` |  | `platforms.androidtv.applyPlugin` |





---




#### platforms.androidtv.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.androidtv.author` |





---




#### platforms.androidtv.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.androidtv.backgroundColor` |

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




#### platforms.androidtv.build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build.gradle` | `object` |  | `platforms.androidtv.build.gradle` |

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




---




#### platforms.androidtv.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.androidtv.buildSchemes` |





---




#### platforms.androidtv.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.androidtv.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.androidtv.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.androidtv.bundleIsDev` |





---




#### platforms.androidtv.compileSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileSdkVersion` | `integer` |  | `platforms.androidtv.compileSdkVersion` |

Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` 

**examples**


```json
{
  "compileSdkVersion": "28"
}
```



```json
{
  "compileSdkVersion": "29"
}
```




---




#### platforms.androidtv.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.androidtv.deploy` |





---



#### platforms.androidtv.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.androidtv.deploy.type` |





---





#### platforms.androidtv.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.androidtv.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.androidtv.enableAndroidX


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableAndroidX` | `boolean` | `true` | `platforms.androidtv.enableAndroidX` |



**examples**


```json
{
  "enableAndroidX": "true"
}
```



```json
{
  "enableAndroidX": "false"
}
```




---




#### platforms.androidtv.enableHermes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableHermes` | `boolean` |  | `platforms.androidtv.enableHermes` |

> DEPRECATED in favour of `reactNativeEngine`

**examples**


```json
{
  "enableHermes": "true"
}
```



```json
{
  "enableHermes": "false"
}
```




---




#### platforms.androidtv.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.androidtv.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.androidtv.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.androidtv.engine` |





---




#### platforms.androidtv.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.androidtv.entryFile` |





---




#### platforms.androidtv.excludedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedFeatures` | `array` |  | `platforms.androidtv.excludedFeatures` |





---




#### platforms.androidtv.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.androidtv.excludedPlugins` |

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




#### platforms.androidtv.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.androidtv.ext` |

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




#### platforms.androidtv.gradle.properties


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradle.properties` | `object` |  | `platforms.androidtv.gradle.properties` |

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




---




#### platforms.androidtv.gradleBuildToolsVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleBuildToolsVersion` | `integer` | `3.3.1` | `platforms.androidtv.gradleBuildToolsVersion` |

Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`

**examples**


```json
{
  "gradleBuildToolsVersion": "3.3.1"
}
```



```json
{
  "gradleBuildToolsVersion": "4.1.0"
}
```




---




#### platforms.androidtv.gradleWrapperVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleWrapperVersion` | `integer` | `5.5` | `platforms.androidtv.gradleWrapperVersion` |

Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`

**examples**


```json
{
  "gradleWrapperVersion": "5.5"
}
```



```json
{
  "gradleWrapperVersion": "6.7.1"
}
```




---




#### platforms.androidtv.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.androidtv.id` |





---




#### platforms.androidtv.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.androidtv.ignoreLogs` |





---




#### platforms.androidtv.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.androidtv.ignoreWarnings` |





---




#### platforms.androidtv.implementation


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `implementation` | `object` |  | `platforms.androidtv.implementation` |





---




#### platforms.androidtv.includedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFeatures` | `array` |  | `platforms.androidtv.includedFeatures` |





---




#### platforms.androidtv.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.androidtv.includedFonts` |

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




#### platforms.androidtv.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.androidtv.includedPermissions` |

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




#### platforms.androidtv.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.androidtv.includedPlugins` |

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




#### platforms.androidtv.keyAlias


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyAlias` | `string` |  | `platforms.androidtv.keyAlias` |





---




#### platforms.androidtv.keyPassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyPassword` | `string` |  | `platforms.androidtv.keyPassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

keyPassword for keystore file



---




#### platforms.androidtv.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.androidtv.license` |





---




#### platforms.androidtv.mainActivity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `mainActivity` | `object` | `{}` | `platforms.androidtv.mainActivity` |

Allows you to configure behaviour of MainActivity.kt



---



#### platforms.androidtv.mainActivity.onCreate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `onCreate` | `string` | `super.onCreate(savedInstanceState)` | `platforms.androidtv.mainActivity.onCreate` |

Overrides super.onCreate method handler of MainActivity.kt

**examples**


```json
{
  "onCreate": "super.onCreate(null)"
}
```



```json
{
  "onCreate": "super.onCreate(savedInstanceState)"
}
```




---





#### platforms.androidtv.minSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minSdkVersion` | `integer` | `21` | `platforms.androidtv.minSdkVersion` |



**examples**


```json
{
  "minSdkVersion": "21"
}
```



```json
{
  "minSdkVersion": "22"
}
```




---




#### platforms.androidtv.minifyEnabled


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minifyEnabled` | `boolean` |  | `platforms.androidtv.minifyEnabled` |

Sets minifyEnabled buildType property in app/build.gradle

**examples**


```json
{
  "minifyEnabled": "false"
}
```



```json
{
  "minifyEnabled": "true"
}
```




---




#### platforms.androidtv.multipleAPKs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `multipleAPKs` | `boolean` |  | `platforms.androidtv.multipleAPKs` |

If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"

**examples**


```json
{
  "multipleAPKs": "true"
}
```



```json
{
  "multipleAPKs": "false"
}
```




---




#### platforms.androidtv.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.androidtv.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.androidtv.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` | `default` | `platforms.androidtv.reactNativeEngine` |

Allows you to define specific native render engine to be used

**examples**


```json
{
  "reactNativeEngine": "true"
}
```



```json
{
  "reactNativeEngine": "false"
}
```




---




#### platforms.androidtv.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.androidtv.runtime` |

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




#### platforms.androidtv.signingConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingConfig` | `string` | `Debug` | `platforms.androidtv.signingConfig` |

Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`

**examples**


```json
{
  "signingConfig": "default"
}
```



```json
{
  "signingConfig": "v8-android"
}
```



```json
{
  "signingConfig": "v8-android-nointl"
}
```



```json
{
  "signingConfig": "v8-android-jit"
}
```



```json
{
  "signingConfig": "v8-android-jit-nointl"
}
```



```json
{
  "signingConfig": "hermes"
}
```




---




#### platforms.androidtv.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.androidtv.splashScreen` |





---




#### platforms.androidtv.storeFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storeFile` | `string` |  | `platforms.androidtv.storeFile` |





---




#### platforms.androidtv.storePassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storePassword` | `string` |  | `platforms.androidtv.storePassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

storePassword for keystore file



---




#### platforms.androidtv.targetSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `targetSdkVersion` | `integer` |  | `platforms.androidtv.targetSdkVersion` |

Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` 

**examples**


```json
{
  "targetSdkVersion": "28"
}
```



```json
{
  "targetSdkVersion": "29"
}
```




---




#### platforms.androidtv.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.androidtv.timestampAssets` |

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




#### platforms.androidtv.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.androidtv.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.androidtv.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.androidtv.versionedAssets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `androidwear` | `object` |  | `platforms.androidwear` |





---



#### platforms.androidwear.AndroidManifest


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `AndroidManifest` | `object` |  | `platforms.androidwear.AndroidManifest` |

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




---




#### platforms.androidwear.BuildGradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BuildGradle` | `object` |  | `platforms.androidwear.BuildGradle` |

Allows you to customize `build.gradle` file



---



#### platforms.androidwear.BuildGradle.allprojects


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `allprojects` | `object` |  | `platforms.androidwear.BuildGradle.allprojects` |





---



#### platforms.androidwear.BuildGradle.allprojects.repositories


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `repositories` | `object` |  | `platforms.androidwear.BuildGradle.allprojects.repositories` |

Customize repositories section of build.gradle

**examples**


```json
{
  "repositories": {
    "flatDir { dirs 'libs'}": true
  }
}
```




---






#### platforms.androidwear.aab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `aab` | `boolean` |  | `platforms.androidwear.aab` |

If set to true, android project will generate app.aab instead of apk

**examples**


```json
{
  "aab": "false"
}
```



```json
{
  "aab": "true"
}
```




---




#### platforms.androidwear.app/build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `app/build.gradle` | `object` |  | `platforms.androidwear.app/build.gradle` |

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




---




#### platforms.androidwear.applyPlugin


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `applyPlugin` | `array` |  | `platforms.androidwear.applyPlugin` |





---




#### platforms.androidwear.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.androidwear.author` |





---




#### platforms.androidwear.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.androidwear.backgroundColor` |

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




#### platforms.androidwear.build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build.gradle` | `object` |  | `platforms.androidwear.build.gradle` |

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




---




#### platforms.androidwear.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.androidwear.buildSchemes` |





---




#### platforms.androidwear.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.androidwear.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.androidwear.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.androidwear.bundleIsDev` |





---




#### platforms.androidwear.compileSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileSdkVersion` | `integer` |  | `platforms.androidwear.compileSdkVersion` |

Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` 

**examples**


```json
{
  "compileSdkVersion": "28"
}
```



```json
{
  "compileSdkVersion": "29"
}
```




---




#### platforms.androidwear.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.androidwear.deploy` |





---



#### platforms.androidwear.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.androidwear.deploy.type` |





---





#### platforms.androidwear.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.androidwear.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.androidwear.enableAndroidX


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableAndroidX` | `boolean` | `true` | `platforms.androidwear.enableAndroidX` |



**examples**


```json
{
  "enableAndroidX": "true"
}
```



```json
{
  "enableAndroidX": "false"
}
```




---




#### platforms.androidwear.enableHermes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableHermes` | `boolean` |  | `platforms.androidwear.enableHermes` |

> DEPRECATED in favour of `reactNativeEngine`

**examples**


```json
{
  "enableHermes": "true"
}
```



```json
{
  "enableHermes": "false"
}
```




---




#### platforms.androidwear.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.androidwear.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.androidwear.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.androidwear.engine` |





---




#### platforms.androidwear.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.androidwear.entryFile` |





---




#### platforms.androidwear.excludedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedFeatures` | `array` |  | `platforms.androidwear.excludedFeatures` |





---




#### platforms.androidwear.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.androidwear.excludedPlugins` |

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




#### platforms.androidwear.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.androidwear.ext` |

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




#### platforms.androidwear.gradle.properties


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradle.properties` | `object` |  | `platforms.androidwear.gradle.properties` |

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




---




#### platforms.androidwear.gradleBuildToolsVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleBuildToolsVersion` | `integer` | `3.3.1` | `platforms.androidwear.gradleBuildToolsVersion` |

Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`

**examples**


```json
{
  "gradleBuildToolsVersion": "3.3.1"
}
```



```json
{
  "gradleBuildToolsVersion": "4.1.0"
}
```




---




#### platforms.androidwear.gradleWrapperVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleWrapperVersion` | `integer` | `5.5` | `platforms.androidwear.gradleWrapperVersion` |

Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`

**examples**


```json
{
  "gradleWrapperVersion": "5.5"
}
```



```json
{
  "gradleWrapperVersion": "6.7.1"
}
```




---




#### platforms.androidwear.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.androidwear.id` |





---




#### platforms.androidwear.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.androidwear.ignoreLogs` |





---




#### platforms.androidwear.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.androidwear.ignoreWarnings` |





---




#### platforms.androidwear.implementation


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `implementation` | `object` |  | `platforms.androidwear.implementation` |





---




#### platforms.androidwear.includedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFeatures` | `array` |  | `platforms.androidwear.includedFeatures` |





---




#### platforms.androidwear.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.androidwear.includedFonts` |

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




#### platforms.androidwear.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.androidwear.includedPermissions` |

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




#### platforms.androidwear.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.androidwear.includedPlugins` |

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




#### platforms.androidwear.keyAlias


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyAlias` | `string` |  | `platforms.androidwear.keyAlias` |





---




#### platforms.androidwear.keyPassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyPassword` | `string` |  | `platforms.androidwear.keyPassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

keyPassword for keystore file



---




#### platforms.androidwear.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.androidwear.license` |





---




#### platforms.androidwear.mainActivity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `mainActivity` | `object` | `{}` | `platforms.androidwear.mainActivity` |

Allows you to configure behaviour of MainActivity.kt



---



#### platforms.androidwear.mainActivity.onCreate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `onCreate` | `string` | `super.onCreate(savedInstanceState)` | `platforms.androidwear.mainActivity.onCreate` |

Overrides super.onCreate method handler of MainActivity.kt

**examples**


```json
{
  "onCreate": "super.onCreate(null)"
}
```



```json
{
  "onCreate": "super.onCreate(savedInstanceState)"
}
```




---





#### platforms.androidwear.minSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minSdkVersion` | `integer` | `21` | `platforms.androidwear.minSdkVersion` |



**examples**


```json
{
  "minSdkVersion": "21"
}
```



```json
{
  "minSdkVersion": "22"
}
```




---




#### platforms.androidwear.minifyEnabled


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minifyEnabled` | `boolean` |  | `platforms.androidwear.minifyEnabled` |

Sets minifyEnabled buildType property in app/build.gradle

**examples**


```json
{
  "minifyEnabled": "false"
}
```



```json
{
  "minifyEnabled": "true"
}
```




---




#### platforms.androidwear.multipleAPKs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `multipleAPKs` | `boolean` |  | `platforms.androidwear.multipleAPKs` |

If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"

**examples**


```json
{
  "multipleAPKs": "true"
}
```



```json
{
  "multipleAPKs": "false"
}
```




---




#### platforms.androidwear.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.androidwear.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.androidwear.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` | `default` | `platforms.androidwear.reactNativeEngine` |

Allows you to define specific native render engine to be used

**examples**


```json
{
  "reactNativeEngine": "true"
}
```



```json
{
  "reactNativeEngine": "false"
}
```




---




#### platforms.androidwear.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.androidwear.runtime` |

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




#### platforms.androidwear.signingConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingConfig` | `string` | `Debug` | `platforms.androidwear.signingConfig` |

Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`

**examples**


```json
{
  "signingConfig": "default"
}
```



```json
{
  "signingConfig": "v8-android"
}
```



```json
{
  "signingConfig": "v8-android-nointl"
}
```



```json
{
  "signingConfig": "v8-android-jit"
}
```



```json
{
  "signingConfig": "v8-android-jit-nointl"
}
```



```json
{
  "signingConfig": "hermes"
}
```




---




#### platforms.androidwear.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.androidwear.splashScreen` |





---




#### platforms.androidwear.storeFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storeFile` | `string` |  | `platforms.androidwear.storeFile` |





---




#### platforms.androidwear.storePassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storePassword` | `string` |  | `platforms.androidwear.storePassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

storePassword for keystore file



---




#### platforms.androidwear.targetSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `targetSdkVersion` | `integer` |  | `platforms.androidwear.targetSdkVersion` |

Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` 

**examples**


```json
{
  "targetSdkVersion": "28"
}
```



```json
{
  "targetSdkVersion": "29"
}
```




---




#### platforms.androidwear.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.androidwear.timestampAssets` |

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




#### platforms.androidwear.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.androidwear.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.androidwear.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.androidwear.versionedAssets` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `chromecast` | `object` |  | `platforms.chromecast` |





---



#### platforms.chromecast.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.chromecast.author` |





---




#### platforms.chromecast.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.chromecast.backgroundColor` |

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




#### platforms.chromecast.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.chromecast.buildSchemes` |





---




#### platforms.chromecast.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.chromecast.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.chromecast.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.chromecast.bundleIsDev` |





---




#### platforms.chromecast.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.chromecast.deploy` |





---



#### platforms.chromecast.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.chromecast.deploy.type` |





---





#### platforms.chromecast.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.chromecast.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.chromecast.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.chromecast.devServerHost` |





---




#### platforms.chromecast.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.chromecast.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.chromecast.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.chromecast.engine` |





---




#### platforms.chromecast.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.chromecast.entryFile` |





---




#### platforms.chromecast.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.chromecast.excludedPlugins` |

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




#### platforms.chromecast.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.chromecast.ext` |

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




#### platforms.chromecast.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.chromecast.id` |





---




#### platforms.chromecast.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.chromecast.ignoreLogs` |





---




#### platforms.chromecast.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.chromecast.ignoreWarnings` |





---




#### platforms.chromecast.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.chromecast.includedFonts` |

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




#### platforms.chromecast.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.chromecast.includedPermissions` |

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




#### platforms.chromecast.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.chromecast.includedPlugins` |

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




#### platforms.chromecast.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.chromecast.license` |





---




#### platforms.chromecast.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.chromecast.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.chromecast.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.chromecast.runtime` |

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




#### platforms.chromecast.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.chromecast.splashScreen` |





---




#### platforms.chromecast.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.chromecast.timestampAssets` |

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




#### platforms.chromecast.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.chromecast.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.chromecast.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.chromecast.versionedAssets` |

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




#### platforms.chromecast.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.chromecast.webpackConfig` |





---



#### platforms.chromecast.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.chromecast.webpackConfig.customScripts` |





---




#### platforms.chromecast.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.chromecast.webpackConfig.devServerHost` |





---




#### platforms.chromecast.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.chromecast.webpackConfig.extend` |

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




---




#### platforms.chromecast.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.chromecast.webpackConfig.metaTags` |





---







### platforms.firefoxos


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `firefoxos` | `object` |  | `platforms.firefoxos` |





---



#### platforms.firefoxos.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.firefoxos.author` |





---




#### platforms.firefoxos.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.firefoxos.backgroundColor` |

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




#### platforms.firefoxos.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.firefoxos.buildSchemes` |





---




#### platforms.firefoxos.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.firefoxos.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.firefoxos.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.firefoxos.bundleIsDev` |





---




#### platforms.firefoxos.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.firefoxos.deploy` |





---



#### platforms.firefoxos.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.firefoxos.deploy.type` |





---





#### platforms.firefoxos.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.firefoxos.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.firefoxos.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.firefoxos.devServerHost` |





---




#### platforms.firefoxos.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.firefoxos.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.firefoxos.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.firefoxos.engine` |





---




#### platforms.firefoxos.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.firefoxos.entryFile` |





---




#### platforms.firefoxos.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.firefoxos.excludedPlugins` |

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




#### platforms.firefoxos.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.firefoxos.ext` |

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




#### platforms.firefoxos.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.firefoxos.id` |





---




#### platforms.firefoxos.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.firefoxos.ignoreLogs` |





---




#### platforms.firefoxos.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.firefoxos.ignoreWarnings` |





---




#### platforms.firefoxos.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.firefoxos.includedFonts` |

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




#### platforms.firefoxos.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.firefoxos.includedPermissions` |

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




#### platforms.firefoxos.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.firefoxos.includedPlugins` |

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




#### platforms.firefoxos.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.firefoxos.license` |





---




#### platforms.firefoxos.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.firefoxos.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.firefoxos.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.firefoxos.runtime` |

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




#### platforms.firefoxos.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.firefoxos.splashScreen` |





---




#### platforms.firefoxos.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.firefoxos.timestampAssets` |

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




#### platforms.firefoxos.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.firefoxos.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.firefoxos.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.firefoxos.versionedAssets` |

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




#### platforms.firefoxos.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.firefoxos.webpackConfig` |





---



#### platforms.firefoxos.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.firefoxos.webpackConfig.customScripts` |





---




#### platforms.firefoxos.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.firefoxos.webpackConfig.devServerHost` |





---




#### platforms.firefoxos.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.firefoxos.webpackConfig.extend` |

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




---




#### platforms.firefoxos.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.firefoxos.webpackConfig.metaTags` |





---







### platforms.firefoxtv


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `firefoxtv` | `object` |  | `platforms.firefoxtv` |





---



#### platforms.firefoxtv.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.firefoxtv.author` |





---




#### platforms.firefoxtv.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.firefoxtv.backgroundColor` |

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




#### platforms.firefoxtv.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.firefoxtv.buildSchemes` |





---




#### platforms.firefoxtv.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.firefoxtv.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.firefoxtv.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.firefoxtv.bundleIsDev` |





---




#### platforms.firefoxtv.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.firefoxtv.deploy` |





---



#### platforms.firefoxtv.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.firefoxtv.deploy.type` |





---





#### platforms.firefoxtv.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.firefoxtv.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.firefoxtv.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.firefoxtv.devServerHost` |





---




#### platforms.firefoxtv.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.firefoxtv.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.firefoxtv.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.firefoxtv.engine` |





---




#### platforms.firefoxtv.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.firefoxtv.entryFile` |





---




#### platforms.firefoxtv.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.firefoxtv.excludedPlugins` |

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




#### platforms.firefoxtv.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.firefoxtv.ext` |

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




#### platforms.firefoxtv.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.firefoxtv.id` |





---




#### platforms.firefoxtv.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.firefoxtv.ignoreLogs` |





---




#### platforms.firefoxtv.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.firefoxtv.ignoreWarnings` |





---




#### platforms.firefoxtv.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.firefoxtv.includedFonts` |

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




#### platforms.firefoxtv.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.firefoxtv.includedPermissions` |

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




#### platforms.firefoxtv.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.firefoxtv.includedPlugins` |

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




#### platforms.firefoxtv.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.firefoxtv.license` |





---




#### platforms.firefoxtv.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.firefoxtv.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.firefoxtv.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.firefoxtv.runtime` |

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




#### platforms.firefoxtv.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.firefoxtv.splashScreen` |





---




#### platforms.firefoxtv.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.firefoxtv.timestampAssets` |

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




#### platforms.firefoxtv.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.firefoxtv.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.firefoxtv.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.firefoxtv.versionedAssets` |

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




#### platforms.firefoxtv.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.firefoxtv.webpackConfig` |





---



#### platforms.firefoxtv.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.firefoxtv.webpackConfig.customScripts` |





---




#### platforms.firefoxtv.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.firefoxtv.webpackConfig.devServerHost` |





---




#### platforms.firefoxtv.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.firefoxtv.webpackConfig.extend` |

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




---




#### platforms.firefoxtv.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.firefoxtv.webpackConfig.metaTags` |





---







### platforms.firetv


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `firetv` | `object` |  | `platforms.firetv` |





---



#### platforms.firetv.AndroidManifest


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `AndroidManifest` | `object` |  | `platforms.firetv.AndroidManifest` |

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




---




#### platforms.firetv.BuildGradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BuildGradle` | `object` |  | `platforms.firetv.BuildGradle` |

Allows you to customize `build.gradle` file



---



#### platforms.firetv.BuildGradle.allprojects


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `allprojects` | `object` |  | `platforms.firetv.BuildGradle.allprojects` |





---



#### platforms.firetv.BuildGradle.allprojects.repositories


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `repositories` | `object` |  | `platforms.firetv.BuildGradle.allprojects.repositories` |

Customize repositories section of build.gradle

**examples**


```json
{
  "repositories": {
    "flatDir { dirs 'libs'}": true
  }
}
```




---






#### platforms.firetv.aab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `aab` | `boolean` |  | `platforms.firetv.aab` |

If set to true, android project will generate app.aab instead of apk

**examples**


```json
{
  "aab": "false"
}
```



```json
{
  "aab": "true"
}
```




---




#### platforms.firetv.app/build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `app/build.gradle` | `object` |  | `platforms.firetv.app/build.gradle` |

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




---




#### platforms.firetv.applyPlugin


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `applyPlugin` | `array` |  | `platforms.firetv.applyPlugin` |





---




#### platforms.firetv.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.firetv.author` |





---




#### platforms.firetv.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.firetv.backgroundColor` |

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




#### platforms.firetv.build.gradle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build.gradle` | `object` |  | `platforms.firetv.build.gradle` |

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




---




#### platforms.firetv.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.firetv.buildSchemes` |





---




#### platforms.firetv.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.firetv.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.firetv.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.firetv.bundleIsDev` |





---




#### platforms.firetv.compileSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileSdkVersion` | `integer` |  | `platforms.firetv.compileSdkVersion` |

Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` 

**examples**


```json
{
  "compileSdkVersion": "28"
}
```



```json
{
  "compileSdkVersion": "29"
}
```




---




#### platforms.firetv.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.firetv.deploy` |





---



#### platforms.firetv.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.firetv.deploy.type` |





---





#### platforms.firetv.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.firetv.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.firetv.enableAndroidX


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableAndroidX` | `boolean` | `true` | `platforms.firetv.enableAndroidX` |



**examples**


```json
{
  "enableAndroidX": "true"
}
```



```json
{
  "enableAndroidX": "false"
}
```




---




#### platforms.firetv.enableHermes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableHermes` | `boolean` |  | `platforms.firetv.enableHermes` |

> DEPRECATED in favour of `reactNativeEngine`

**examples**


```json
{
  "enableHermes": "true"
}
```



```json
{
  "enableHermes": "false"
}
```




---




#### platforms.firetv.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.firetv.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.firetv.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.firetv.engine` |





---




#### platforms.firetv.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.firetv.entryFile` |





---




#### platforms.firetv.excludedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedFeatures` | `array` |  | `platforms.firetv.excludedFeatures` |





---




#### platforms.firetv.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.firetv.excludedPlugins` |

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




#### platforms.firetv.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.firetv.ext` |

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




#### platforms.firetv.gradle.properties


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradle.properties` | `object` |  | `platforms.firetv.gradle.properties` |

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




---




#### platforms.firetv.gradleBuildToolsVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleBuildToolsVersion` | `integer` | `3.3.1` | `platforms.firetv.gradleBuildToolsVersion` |

Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`

**examples**


```json
{
  "gradleBuildToolsVersion": "3.3.1"
}
```



```json
{
  "gradleBuildToolsVersion": "4.1.0"
}
```




---




#### platforms.firetv.gradleWrapperVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `gradleWrapperVersion` | `integer` | `5.5` | `platforms.firetv.gradleWrapperVersion` |

Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`

**examples**


```json
{
  "gradleWrapperVersion": "5.5"
}
```



```json
{
  "gradleWrapperVersion": "6.7.1"
}
```




---




#### platforms.firetv.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.firetv.id` |





---




#### platforms.firetv.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.firetv.ignoreLogs` |





---




#### platforms.firetv.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.firetv.ignoreWarnings` |





---




#### platforms.firetv.implementation


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `implementation` | `object` |  | `platforms.firetv.implementation` |





---




#### platforms.firetv.includedFeatures


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFeatures` | `array` |  | `platforms.firetv.includedFeatures` |





---




#### platforms.firetv.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.firetv.includedFonts` |

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




#### platforms.firetv.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.firetv.includedPermissions` |

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




#### platforms.firetv.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.firetv.includedPlugins` |

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




#### platforms.firetv.keyAlias


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyAlias` | `string` |  | `platforms.firetv.keyAlias` |





---




#### platforms.firetv.keyPassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `keyPassword` | `string` |  | `platforms.firetv.keyPassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

keyPassword for keystore file



---




#### platforms.firetv.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.firetv.license` |





---




#### platforms.firetv.mainActivity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `mainActivity` | `object` | `{}` | `platforms.firetv.mainActivity` |

Allows you to configure behaviour of MainActivity.kt



---



#### platforms.firetv.mainActivity.onCreate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `onCreate` | `string` | `super.onCreate(savedInstanceState)` | `platforms.firetv.mainActivity.onCreate` |

Overrides super.onCreate method handler of MainActivity.kt

**examples**


```json
{
  "onCreate": "super.onCreate(null)"
}
```



```json
{
  "onCreate": "super.onCreate(savedInstanceState)"
}
```




---





#### platforms.firetv.minSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minSdkVersion` | `integer` | `21` | `platforms.firetv.minSdkVersion` |



**examples**


```json
{
  "minSdkVersion": "21"
}
```



```json
{
  "minSdkVersion": "22"
}
```




---




#### platforms.firetv.minifyEnabled


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `minifyEnabled` | `boolean` |  | `platforms.firetv.minifyEnabled` |

Sets minifyEnabled buildType property in app/build.gradle

**examples**


```json
{
  "minifyEnabled": "false"
}
```



```json
{
  "minifyEnabled": "true"
}
```




---




#### platforms.firetv.multipleAPKs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `multipleAPKs` | `boolean` |  | `platforms.firetv.multipleAPKs` |

If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"

**examples**


```json
{
  "multipleAPKs": "true"
}
```



```json
{
  "multipleAPKs": "false"
}
```




---




#### platforms.firetv.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.firetv.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.firetv.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` | `default` | `platforms.firetv.reactNativeEngine` |

Allows you to define specific native render engine to be used

**examples**


```json
{
  "reactNativeEngine": "true"
}
```



```json
{
  "reactNativeEngine": "false"
}
```




---




#### platforms.firetv.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.firetv.runtime` |

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




#### platforms.firetv.signingConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingConfig` | `string` | `Debug` | `platforms.firetv.signingConfig` |

Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`

**examples**


```json
{
  "signingConfig": "default"
}
```



```json
{
  "signingConfig": "v8-android"
}
```



```json
{
  "signingConfig": "v8-android-nointl"
}
```



```json
{
  "signingConfig": "v8-android-jit"
}
```



```json
{
  "signingConfig": "v8-android-jit-nointl"
}
```



```json
{
  "signingConfig": "hermes"
}
```




---




#### platforms.firetv.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.firetv.splashScreen` |





---




#### platforms.firetv.storeFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storeFile` | `string` |  | `platforms.firetv.storeFile` |





---




#### platforms.firetv.storePassword


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `storePassword` | `string` |  | `platforms.firetv.storePassword` |

> WARNING. this prop is sensitive and should not be stored in standard `renative.json` configs. use `renative.private.json` files instead!

storePassword for keystore file



---




#### platforms.firetv.targetSdkVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `targetSdkVersion` | `integer` |  | `platforms.firetv.targetSdkVersion` |

Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` 

**examples**


```json
{
  "targetSdkVersion": "28"
}
```



```json
{
  "targetSdkVersion": "29"
}
```




---




#### platforms.firetv.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.firetv.timestampAssets` |

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




#### platforms.firetv.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.firetv.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.firetv.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.firetv.versionedAssets` |

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






### platforms.ios


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ios` | `object` |  | `platforms.ios` |





---



#### platforms.ios.Podfile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `Podfile` | `object` |  | `platforms.ios.Podfile` |





---




#### platforms.ios.appDelegateApplicationMethods


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateApplicationMethods` | `object` |  | `platforms.ios.appDelegateApplicationMethods` |





---



#### platforms.ios.appDelegateApplicationMethods.didConnectCarInterfaceController


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didConnectCarInterfaceController` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didConnectCarInterfaceController` |





---




#### platforms.ios.appDelegateApplicationMethods.didDisconnectCarInterfaceController


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didDisconnectCarInterfaceController` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didDisconnectCarInterfaceController` |





---




#### platforms.ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didFailToRegisterForRemoteNotificationsWithError` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError` |





---




#### platforms.ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didFinishLaunchingWithOptions` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions` |





---




#### platforms.ios.appDelegateApplicationMethods.didReceive


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didReceive` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didReceive` |





---




#### platforms.ios.appDelegateApplicationMethods.didReceiveRemoteNotification


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didReceiveRemoteNotification` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didReceiveRemoteNotification` |





---




#### platforms.ios.appDelegateApplicationMethods.didRegister


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didRegister` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didRegister` |





---




#### platforms.ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didRegisterForRemoteNotificationsWithDeviceToken` | `array` |  | `platforms.ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken` |





---




#### platforms.ios.appDelegateApplicationMethods.open


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `open` | `array` |  | `platforms.ios.appDelegateApplicationMethods.open` |





---




#### platforms.ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `supportedInterfaceOrientationsFor` | `array` |  | `platforms.ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor` |





---





#### platforms.ios.appDelegateExtensions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateExtensions` | `array` |  | `platforms.ios.appDelegateExtensions` |





---




#### platforms.ios.appDelegateImports


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateImports` | `array` |  | `platforms.ios.appDelegateImports` |





---




#### platforms.ios.appDelegateMethods


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateMethods` | `object` |  | `platforms.ios.appDelegateMethods` |





---




#### platforms.ios.appleId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appleId` | `string` |  | `platforms.ios.appleId` |





---




#### platforms.ios.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.ios.author` |





---




#### platforms.ios.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.ios.backgroundColor` |

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




#### platforms.ios.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.ios.buildSchemes` |





---




#### platforms.ios.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.ios.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.ios.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.ios.bundleIsDev` |





---




#### platforms.ios.codeSignIdentity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `codeSignIdentity` | `string` |  | `platforms.ios.codeSignIdentity` |

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




---




#### platforms.ios.commandLineArguments


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `commandLineArguments` | `array` |  | `platforms.ios.commandLineArguments` |

Allows you to pass launch arguments to active scheme

**examples**


```json
{
  "commandLineArguments": [
    "-FIRAnalyticsDebugEnabled",
    "MyCustomLaunchArgument"
  ]
}
```




---




#### platforms.ios.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.ios.deploy` |





---



#### platforms.ios.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.ios.deploy.type` |





---





#### platforms.ios.deploymentTarget


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploymentTarget` | `string` |  | `platforms.ios.deploymentTarget` |





---




#### platforms.ios.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.ios.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.ios.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.ios.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.ios.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.ios.engine` |





---




#### platforms.ios.entitlements


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entitlements` | `object` |  | `platforms.ios.entitlements` |





---




#### platforms.ios.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.ios.entryFile` |





---




#### platforms.ios.excludedArchs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedArchs` | `array` |  | `platforms.ios.excludedArchs` |

Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`

**examples**


```json
{
  "excludedArchs": [
    "arm64"
  ]
}
```




---




#### platforms.ios.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.ios.excludedPlugins` |

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




#### platforms.ios.exportOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `exportOptions` | `object` |  | `platforms.ios.exportOptions` |





---



#### platforms.ios.exportOptions.compileBitcode


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileBitcode` | `boolean` |  | `platforms.ios.exportOptions.compileBitcode` |





---




#### platforms.ios.exportOptions.method


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `method` | `string` |  | `platforms.ios.exportOptions.method` |





---




#### platforms.ios.exportOptions.provisioningProfiles


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningProfiles` | `object` |  | `platforms.ios.exportOptions.provisioningProfiles` |





---




#### platforms.ios.exportOptions.signingCertificate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingCertificate` | `string` |  | `platforms.ios.exportOptions.signingCertificate` |





---




#### platforms.ios.exportOptions.signingStyle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingStyle` | `string` |  | `platforms.ios.exportOptions.signingStyle` |





---




#### platforms.ios.exportOptions.teamID


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamID` | `string` |  | `platforms.ios.exportOptions.teamID` |





---




#### platforms.ios.exportOptions.uploadBitcode


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `uploadBitcode` | `boolean` |  | `platforms.ios.exportOptions.uploadBitcode` |





---




#### platforms.ios.exportOptions.uploadSymbols


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `uploadSymbols` | `boolean` |  | `platforms.ios.exportOptions.uploadSymbols` |





---





#### platforms.ios.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.ios.ext` |

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




#### platforms.ios.firebaseId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `firebaseId` | `string` |  | `platforms.ios.firebaseId` |





---




#### platforms.ios.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.ios.id` |





---




#### platforms.ios.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.ios.ignoreLogs` |





---




#### platforms.ios.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.ios.ignoreWarnings` |





---




#### platforms.ios.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.ios.includedFonts` |

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




#### platforms.ios.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.ios.includedPermissions` |

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




#### platforms.ios.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.ios.includedPlugins` |

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




#### platforms.ios.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.ios.license` |





---




#### platforms.ios.orientationSupport


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `orientationSupport` | `object` |  | `platforms.ios.orientationSupport` |



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




---



#### platforms.ios.orientationSupport.phone


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `phone` | `array` |  | `platforms.ios.orientationSupport.phone` |





---




#### platforms.ios.orientationSupport.tab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tab` | `array` |  | `platforms.ios.orientationSupport.tab` |





---





#### platforms.ios.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.ios.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.ios.plist


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `plist` | `object` |  | `platforms.ios.plist` |





---




#### platforms.ios.provisionProfileSpecifier


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisionProfileSpecifier` | `string` |  | `platforms.ios.provisionProfileSpecifier` |





---




#### platforms.ios.provisioningProfiles


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningProfiles` | `object` |  | `platforms.ios.provisioningProfiles` |





---




#### platforms.ios.provisioningStyle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningStyle` | `string` |  | `platforms.ios.provisioningStyle` |





---




#### platforms.ios.runScheme


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runScheme` | `string` |  | `platforms.ios.runScheme` |





---




#### platforms.ios.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.ios.runtime` |

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




#### platforms.ios.scheme


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `scheme` | `string` |  | `platforms.ios.scheme` |





---




#### platforms.ios.sdk


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `sdk` | `string` |  | `platforms.ios.sdk` |





---




#### platforms.ios.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.ios.splashScreen` |





---




#### platforms.ios.systemCapabilities


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `systemCapabilities` | `object` |  | `platforms.ios.systemCapabilities` |



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




---




#### platforms.ios.teamID


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamID` | `string` |  | `platforms.ios.teamID` |





---




#### platforms.ios.teamIdentifier


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamIdentifier` | `string` |  | `platforms.ios.teamIdentifier` |





---




#### platforms.ios.testFlightId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `testFlightId` | `string` |  | `platforms.ios.testFlightId` |





---




#### platforms.ios.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.ios.timestampAssets` |

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




#### platforms.ios.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.ios.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.ios.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.ios.versionedAssets` |

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




#### platforms.ios.xcodeproj


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `xcodeproj` | `object` |  | `platforms.ios.xcodeproj` |





---






### platforms.kaios


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `kaios` | `object` |  | `platforms.kaios` |





---



#### platforms.kaios.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.kaios.author` |





---




#### platforms.kaios.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.kaios.backgroundColor` |

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




#### platforms.kaios.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.kaios.buildSchemes` |





---




#### platforms.kaios.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.kaios.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.kaios.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.kaios.bundleIsDev` |





---




#### platforms.kaios.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.kaios.deploy` |





---



#### platforms.kaios.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.kaios.deploy.type` |





---





#### platforms.kaios.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.kaios.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.kaios.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.kaios.devServerHost` |





---




#### platforms.kaios.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.kaios.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.kaios.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.kaios.engine` |





---




#### platforms.kaios.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.kaios.entryFile` |





---




#### platforms.kaios.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.kaios.excludedPlugins` |

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




#### platforms.kaios.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.kaios.ext` |

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




#### platforms.kaios.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.kaios.id` |





---




#### platforms.kaios.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.kaios.ignoreLogs` |





---




#### platforms.kaios.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.kaios.ignoreWarnings` |





---




#### platforms.kaios.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.kaios.includedFonts` |

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




#### platforms.kaios.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.kaios.includedPermissions` |

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




#### platforms.kaios.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.kaios.includedPlugins` |

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




#### platforms.kaios.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.kaios.license` |





---




#### platforms.kaios.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.kaios.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.kaios.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.kaios.runtime` |

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




#### platforms.kaios.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.kaios.splashScreen` |





---




#### platforms.kaios.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.kaios.timestampAssets` |

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




#### platforms.kaios.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.kaios.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.kaios.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.kaios.versionedAssets` |

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




#### platforms.kaios.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.kaios.webpackConfig` |





---



#### platforms.kaios.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.kaios.webpackConfig.customScripts` |





---




#### platforms.kaios.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.kaios.webpackConfig.devServerHost` |





---




#### platforms.kaios.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.kaios.webpackConfig.extend` |

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




---




#### platforms.kaios.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.kaios.webpackConfig.metaTags` |





---







### platforms.macos


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `macos` | `object` |  | `platforms.macos` |





---



#### platforms.macos.BrowserWindow


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BrowserWindow` | `object` |  | `platforms.macos.BrowserWindow` |

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




---



#### platforms.macos.BrowserWindow.height


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `height` | `integer` |  | `platforms.macos.BrowserWindow.height` |

Default height of electron app



---




#### platforms.macos.BrowserWindow.webPreferences


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webPreferences` | `object` |  | `platforms.macos.BrowserWindow.webPreferences` |

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```




---




#### platforms.macos.BrowserWindow.width


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `width` | `integer` |  | `platforms.macos.BrowserWindow.width` |

Default width of electron app



---





#### platforms.macos.appleId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appleId` | `string` |  | `platforms.macos.appleId` |





---




#### platforms.macos.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.macos.author` |





---




#### platforms.macos.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.macos.backgroundColor` |

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




#### platforms.macos.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.macos.buildSchemes` |





---




#### platforms.macos.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.macos.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.macos.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.macos.bundleIsDev` |





---




#### platforms.macos.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.macos.deploy` |





---



#### platforms.macos.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.macos.deploy.type` |





---





#### platforms.macos.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.macos.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.macos.electronConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `electronConfig` | `object` |  | `platforms.macos.electronConfig` |

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




---




#### platforms.macos.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.macos.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.macos.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.macos.engine` |





---




#### platforms.macos.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.macos.entryFile` |





---




#### platforms.macos.environment


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `environment` | `string` |  | `platforms.macos.environment` |





---




#### platforms.macos.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.macos.excludedPlugins` |

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




#### platforms.macos.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.macos.ext` |

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




#### platforms.macos.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.macos.id` |





---




#### platforms.macos.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.macos.ignoreLogs` |





---




#### platforms.macos.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.macos.ignoreWarnings` |





---




#### platforms.macos.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.macos.includedFonts` |

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




#### platforms.macos.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.macos.includedPermissions` |

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




#### platforms.macos.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.macos.includedPlugins` |

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




#### platforms.macos.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.macos.license` |





---




#### platforms.macos.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.macos.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.macos.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.macos.runtime` |

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




#### platforms.macos.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.macos.splashScreen` |





---




#### platforms.macos.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.macos.timestampAssets` |

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




#### platforms.macos.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.macos.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.macos.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.macos.versionedAssets` |

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




#### platforms.macos.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.macos.webpackConfig` |





---



#### platforms.macos.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.macos.webpackConfig.customScripts` |





---




#### platforms.macos.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.macos.webpackConfig.devServerHost` |





---




#### platforms.macos.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.macos.webpackConfig.extend` |

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




---




#### platforms.macos.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.macos.webpackConfig.metaTags` |





---







### platforms.tizen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tizen` | `object` |  | `platforms.tizen` |





---



#### platforms.tizen.appName


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appName` | `string` |  | `platforms.tizen.appName` |





---




#### platforms.tizen.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.tizen.author` |





---




#### platforms.tizen.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.tizen.backgroundColor` |

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




#### platforms.tizen.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.tizen.buildSchemes` |





---




#### platforms.tizen.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.tizen.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.tizen.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.tizen.bundleIsDev` |





---




#### platforms.tizen.certificateProfile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `certificateProfile` | `string` |  | `platforms.tizen.certificateProfile` |





---




#### platforms.tizen.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.tizen.deploy` |





---



#### platforms.tizen.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.tizen.deploy.type` |





---





#### platforms.tizen.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.tizen.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.tizen.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizen.devServerHost` |





---




#### platforms.tizen.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.tizen.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.tizen.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.tizen.engine` |





---




#### platforms.tizen.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.tizen.entryFile` |





---




#### platforms.tizen.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.tizen.excludedPlugins` |

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




#### platforms.tizen.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.tizen.ext` |

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




#### platforms.tizen.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.tizen.id` |





---




#### platforms.tizen.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.tizen.ignoreLogs` |





---




#### platforms.tizen.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.tizen.ignoreWarnings` |





---




#### platforms.tizen.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.tizen.includedFonts` |

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




#### platforms.tizen.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.tizen.includedPermissions` |

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




#### platforms.tizen.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.tizen.includedPlugins` |

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




#### platforms.tizen.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.tizen.license` |





---




#### platforms.tizen.package


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `package` | `string` |  | `platforms.tizen.package` |





---




#### platforms.tizen.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.tizen.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.tizen.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.tizen.runtime` |

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




#### platforms.tizen.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.tizen.splashScreen` |





---




#### platforms.tizen.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.tizen.timestampAssets` |

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




#### platforms.tizen.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.tizen.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.tizen.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.tizen.versionedAssets` |

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




#### platforms.tizen.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.tizen.webpackConfig` |





---



#### platforms.tizen.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.tizen.webpackConfig.customScripts` |





---




#### platforms.tizen.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizen.webpackConfig.devServerHost` |





---




#### platforms.tizen.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.tizen.webpackConfig.extend` |

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




---




#### platforms.tizen.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.tizen.webpackConfig.metaTags` |





---







### platforms.tizenmobile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tizenmobile` | `object` |  | `platforms.tizenmobile` |





---



#### platforms.tizenmobile.appName


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appName` | `string` |  | `platforms.tizenmobile.appName` |





---




#### platforms.tizenmobile.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.tizenmobile.author` |





---




#### platforms.tizenmobile.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.tizenmobile.backgroundColor` |

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




#### platforms.tizenmobile.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.tizenmobile.buildSchemes` |





---




#### platforms.tizenmobile.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.tizenmobile.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.tizenmobile.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.tizenmobile.bundleIsDev` |





---




#### platforms.tizenmobile.certificateProfile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `certificateProfile` | `string` |  | `platforms.tizenmobile.certificateProfile` |





---




#### platforms.tizenmobile.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.tizenmobile.deploy` |





---



#### platforms.tizenmobile.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.tizenmobile.deploy.type` |





---





#### platforms.tizenmobile.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.tizenmobile.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.tizenmobile.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizenmobile.devServerHost` |





---




#### platforms.tizenmobile.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.tizenmobile.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.tizenmobile.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.tizenmobile.engine` |





---




#### platforms.tizenmobile.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.tizenmobile.entryFile` |





---




#### platforms.tizenmobile.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.tizenmobile.excludedPlugins` |

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




#### platforms.tizenmobile.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.tizenmobile.ext` |

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




#### platforms.tizenmobile.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.tizenmobile.id` |





---




#### platforms.tizenmobile.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.tizenmobile.ignoreLogs` |





---




#### platforms.tizenmobile.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.tizenmobile.ignoreWarnings` |





---




#### platforms.tizenmobile.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.tizenmobile.includedFonts` |

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




#### platforms.tizenmobile.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.tizenmobile.includedPermissions` |

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




#### platforms.tizenmobile.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.tizenmobile.includedPlugins` |

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




#### platforms.tizenmobile.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.tizenmobile.license` |





---




#### platforms.tizenmobile.package


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `package` | `string` |  | `platforms.tizenmobile.package` |





---




#### platforms.tizenmobile.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.tizenmobile.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.tizenmobile.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.tizenmobile.runtime` |

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




#### platforms.tizenmobile.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.tizenmobile.splashScreen` |





---




#### platforms.tizenmobile.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.tizenmobile.timestampAssets` |

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




#### platforms.tizenmobile.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.tizenmobile.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.tizenmobile.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.tizenmobile.versionedAssets` |

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




#### platforms.tizenmobile.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.tizenmobile.webpackConfig` |





---



#### platforms.tizenmobile.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.tizenmobile.webpackConfig.customScripts` |





---




#### platforms.tizenmobile.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizenmobile.webpackConfig.devServerHost` |





---




#### platforms.tizenmobile.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.tizenmobile.webpackConfig.extend` |

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




---




#### platforms.tizenmobile.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.tizenmobile.webpackConfig.metaTags` |





---







### platforms.tizenwatch


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tizenwatch` | `object` |  | `platforms.tizenwatch` |





---



#### platforms.tizenwatch.appName


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appName` | `string` |  | `platforms.tizenwatch.appName` |





---




#### platforms.tizenwatch.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.tizenwatch.author` |





---




#### platforms.tizenwatch.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.tizenwatch.backgroundColor` |

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




#### platforms.tizenwatch.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.tizenwatch.buildSchemes` |





---




#### platforms.tizenwatch.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.tizenwatch.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.tizenwatch.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.tizenwatch.bundleIsDev` |





---




#### platforms.tizenwatch.certificateProfile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `certificateProfile` | `string` |  | `platforms.tizenwatch.certificateProfile` |





---




#### platforms.tizenwatch.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.tizenwatch.deploy` |





---



#### platforms.tizenwatch.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.tizenwatch.deploy.type` |





---





#### platforms.tizenwatch.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.tizenwatch.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.tizenwatch.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizenwatch.devServerHost` |





---




#### platforms.tizenwatch.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.tizenwatch.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.tizenwatch.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.tizenwatch.engine` |





---




#### platforms.tizenwatch.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.tizenwatch.entryFile` |





---




#### platforms.tizenwatch.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.tizenwatch.excludedPlugins` |

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




#### platforms.tizenwatch.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.tizenwatch.ext` |

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




#### platforms.tizenwatch.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.tizenwatch.id` |





---




#### platforms.tizenwatch.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.tizenwatch.ignoreLogs` |





---




#### platforms.tizenwatch.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.tizenwatch.ignoreWarnings` |





---




#### platforms.tizenwatch.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.tizenwatch.includedFonts` |

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




#### platforms.tizenwatch.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.tizenwatch.includedPermissions` |

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




#### platforms.tizenwatch.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.tizenwatch.includedPlugins` |

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




#### platforms.tizenwatch.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.tizenwatch.license` |





---




#### platforms.tizenwatch.package


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `package` | `string` |  | `platforms.tizenwatch.package` |





---




#### platforms.tizenwatch.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.tizenwatch.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.tizenwatch.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.tizenwatch.runtime` |

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




#### platforms.tizenwatch.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.tizenwatch.splashScreen` |





---




#### platforms.tizenwatch.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.tizenwatch.timestampAssets` |

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




#### platforms.tizenwatch.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.tizenwatch.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.tizenwatch.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.tizenwatch.versionedAssets` |

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




#### platforms.tizenwatch.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.tizenwatch.webpackConfig` |





---



#### platforms.tizenwatch.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.tizenwatch.webpackConfig.customScripts` |





---




#### platforms.tizenwatch.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.tizenwatch.webpackConfig.devServerHost` |





---




#### platforms.tizenwatch.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.tizenwatch.webpackConfig.extend` |

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




---




#### platforms.tizenwatch.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.tizenwatch.webpackConfig.metaTags` |





---







### platforms.tvos


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tvos` | `object` |  | `platforms.tvos` |





---



#### platforms.tvos.Podfile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `Podfile` | `object` |  | `platforms.tvos.Podfile` |





---




#### platforms.tvos.appDelegateApplicationMethods


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateApplicationMethods` | `object` |  | `platforms.tvos.appDelegateApplicationMethods` |





---



#### platforms.tvos.appDelegateApplicationMethods.didConnectCarInterfaceController


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didConnectCarInterfaceController` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didConnectCarInterfaceController` |





---




#### platforms.tvos.appDelegateApplicationMethods.didDisconnectCarInterfaceController


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didDisconnectCarInterfaceController` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didDisconnectCarInterfaceController` |





---




#### platforms.tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didFailToRegisterForRemoteNotificationsWithError` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError` |





---




#### platforms.tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didFinishLaunchingWithOptions` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions` |





---




#### platforms.tvos.appDelegateApplicationMethods.didReceive


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didReceive` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didReceive` |





---




#### platforms.tvos.appDelegateApplicationMethods.didReceiveRemoteNotification


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didReceiveRemoteNotification` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didReceiveRemoteNotification` |





---




#### platforms.tvos.appDelegateApplicationMethods.didRegister


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didRegister` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didRegister` |





---




#### platforms.tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `didRegisterForRemoteNotificationsWithDeviceToken` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken` |





---




#### platforms.tvos.appDelegateApplicationMethods.open


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `open` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.open` |





---




#### platforms.tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `supportedInterfaceOrientationsFor` | `array` |  | `platforms.tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor` |





---





#### platforms.tvos.appDelegateExtensions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateExtensions` | `array` |  | `platforms.tvos.appDelegateExtensions` |





---




#### platforms.tvos.appDelegateImports


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateImports` | `array` |  | `platforms.tvos.appDelegateImports` |





---




#### platforms.tvos.appDelegateMethods


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appDelegateMethods` | `object` |  | `platforms.tvos.appDelegateMethods` |





---




#### platforms.tvos.appleId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appleId` | `string` |  | `platforms.tvos.appleId` |





---




#### platforms.tvos.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.tvos.author` |





---




#### platforms.tvos.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.tvos.backgroundColor` |

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




#### platforms.tvos.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.tvos.buildSchemes` |





---




#### platforms.tvos.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.tvos.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.tvos.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.tvos.bundleIsDev` |





---




#### platforms.tvos.codeSignIdentity


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `codeSignIdentity` | `string` |  | `platforms.tvos.codeSignIdentity` |

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




---




#### platforms.tvos.commandLineArguments


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `commandLineArguments` | `array` |  | `platforms.tvos.commandLineArguments` |

Allows you to pass launch arguments to active scheme

**examples**


```json
{
  "commandLineArguments": [
    "-FIRAnalyticsDebugEnabled",
    "MyCustomLaunchArgument"
  ]
}
```




---




#### platforms.tvos.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.tvos.deploy` |





---



#### platforms.tvos.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.tvos.deploy.type` |





---





#### platforms.tvos.deploymentTarget


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploymentTarget` | `string` |  | `platforms.tvos.deploymentTarget` |





---




#### platforms.tvos.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.tvos.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.tvos.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.tvos.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.tvos.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.tvos.engine` |





---




#### platforms.tvos.entitlements


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entitlements` | `object` |  | `platforms.tvos.entitlements` |





---




#### platforms.tvos.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.tvos.entryFile` |





---




#### platforms.tvos.excludedArchs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedArchs` | `array` |  | `platforms.tvos.excludedArchs` |

Defines excluded architectures. This transforms to xcodeproj: `EXCLUDED_ARCHS="<VAL VAL ...>"`

**examples**


```json
{
  "excludedArchs": [
    "arm64"
  ]
}
```




---




#### platforms.tvos.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.tvos.excludedPlugins` |

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




#### platforms.tvos.exportOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `exportOptions` | `object` |  | `platforms.tvos.exportOptions` |





---



#### platforms.tvos.exportOptions.compileBitcode


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `compileBitcode` | `boolean` |  | `platforms.tvos.exportOptions.compileBitcode` |





---




#### platforms.tvos.exportOptions.method


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `method` | `string` |  | `platforms.tvos.exportOptions.method` |





---




#### platforms.tvos.exportOptions.provisioningProfiles


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningProfiles` | `object` |  | `platforms.tvos.exportOptions.provisioningProfiles` |





---




#### platforms.tvos.exportOptions.signingCertificate


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingCertificate` | `string` |  | `platforms.tvos.exportOptions.signingCertificate` |





---




#### platforms.tvos.exportOptions.signingStyle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `signingStyle` | `string` |  | `platforms.tvos.exportOptions.signingStyle` |





---




#### platforms.tvos.exportOptions.teamID


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamID` | `string` |  | `platforms.tvos.exportOptions.teamID` |





---




#### platforms.tvos.exportOptions.uploadBitcode


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `uploadBitcode` | `boolean` |  | `platforms.tvos.exportOptions.uploadBitcode` |





---




#### platforms.tvos.exportOptions.uploadSymbols


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `uploadSymbols` | `boolean` |  | `platforms.tvos.exportOptions.uploadSymbols` |





---





#### platforms.tvos.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.tvos.ext` |

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




#### platforms.tvos.firebaseId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `firebaseId` | `string` |  | `platforms.tvos.firebaseId` |





---




#### platforms.tvos.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.tvos.id` |





---




#### platforms.tvos.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.tvos.ignoreLogs` |





---




#### platforms.tvos.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.tvos.ignoreWarnings` |





---




#### platforms.tvos.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.tvos.includedFonts` |

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




#### platforms.tvos.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.tvos.includedPermissions` |

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




#### platforms.tvos.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.tvos.includedPlugins` |

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




#### platforms.tvos.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.tvos.license` |





---




#### platforms.tvos.orientationSupport


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `orientationSupport` | `object` |  | `platforms.tvos.orientationSupport` |



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




---



#### platforms.tvos.orientationSupport.phone


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `phone` | `array` |  | `platforms.tvos.orientationSupport.phone` |





---




#### platforms.tvos.orientationSupport.tab


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tab` | `array` |  | `platforms.tvos.orientationSupport.tab` |





---





#### platforms.tvos.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.tvos.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.tvos.plist


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `plist` | `object` |  | `platforms.tvos.plist` |





---




#### platforms.tvos.provisionProfileSpecifier


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisionProfileSpecifier` | `string` |  | `platforms.tvos.provisionProfileSpecifier` |





---




#### platforms.tvos.provisioningProfiles


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningProfiles` | `object` |  | `platforms.tvos.provisioningProfiles` |





---




#### platforms.tvos.provisioningStyle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `provisioningStyle` | `string` |  | `platforms.tvos.provisioningStyle` |





---




#### platforms.tvos.runScheme


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runScheme` | `string` |  | `platforms.tvos.runScheme` |





---




#### platforms.tvos.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.tvos.runtime` |

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




#### platforms.tvos.scheme


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `scheme` | `string` |  | `platforms.tvos.scheme` |





---




#### platforms.tvos.sdk


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `sdk` | `string` |  | `platforms.tvos.sdk` |





---




#### platforms.tvos.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.tvos.splashScreen` |





---




#### platforms.tvos.systemCapabilities


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `systemCapabilities` | `object` |  | `platforms.tvos.systemCapabilities` |



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




---




#### platforms.tvos.teamID


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamID` | `string` |  | `platforms.tvos.teamID` |





---




#### platforms.tvos.teamIdentifier


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `teamIdentifier` | `string` |  | `platforms.tvos.teamIdentifier` |





---




#### platforms.tvos.testFlightId


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `testFlightId` | `string` |  | `platforms.tvos.testFlightId` |





---




#### platforms.tvos.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.tvos.timestampAssets` |

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




#### platforms.tvos.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.tvos.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.tvos.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.tvos.versionedAssets` |

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




#### platforms.tvos.xcodeproj


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `xcodeproj` | `object` |  | `platforms.tvos.xcodeproj` |





---






### platforms.web


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `web` | `object` |  | `platforms.web` |





---



#### platforms.web.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.web.author` |





---




#### platforms.web.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.web.backgroundColor` |

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




#### platforms.web.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.web.buildSchemes` |





---




#### platforms.web.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.web.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.web.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.web.bundleIsDev` |





---




#### platforms.web.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.web.deploy` |





---



#### platforms.web.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.web.deploy.type` |





---





#### platforms.web.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.web.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.web.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.web.devServerHost` |





---




#### platforms.web.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.web.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.web.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.web.engine` |





---




#### platforms.web.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.web.entryFile` |





---




#### platforms.web.environment


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `environment` | `string` |  | `platforms.web.environment` |





---




#### platforms.web.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.web.excludedPlugins` |

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




#### platforms.web.exportDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `exportDir` | `string` |  | `platforms.web.exportDir` |

Custom export directory used by nextjs equivalent to "npx next export --outdir <exportDir>". Use relative paths

**examples**


```json
{
  "exportDir": "output"
}
```



```json
{
  "exportDir": "custom/location"
}
```




---




#### platforms.web.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.web.ext` |

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




#### platforms.web.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.web.id` |





---




#### platforms.web.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.web.ignoreLogs` |





---




#### platforms.web.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.web.ignoreWarnings` |





---




#### platforms.web.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.web.includedFonts` |

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




#### platforms.web.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.web.includedPermissions` |

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




#### platforms.web.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.web.includedPlugins` |

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




#### platforms.web.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.web.license` |





---




#### platforms.web.outputDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `outputDir` | `string` |  | `platforms.web.outputDir` |

Custom output directory used by nextjs equivalent to "npx next build" with custom outputDir. Use relative paths

**examples**


```json
{
  "outputDir": ".next"
}
```



```json
{
  "outputDir": "custom/location"
}
```




---




#### platforms.web.pagesDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `pagesDir` | `string` |  | `platforms.web.pagesDir` |

Custom pages directory used by nextjs. Use relative paths

**examples**


```json
{
  "pagesDir": "src/customFolder/pages"
}
```




---




#### platforms.web.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.web.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.web.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.web.runtime` |

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




#### platforms.web.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.web.splashScreen` |





---




#### platforms.web.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.web.timestampAssets` |

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




#### platforms.web.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.web.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.web.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.web.versionedAssets` |

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




#### platforms.web.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.web.webpackConfig` |





---



#### platforms.web.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.web.webpackConfig.customScripts` |





---




#### platforms.web.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.web.webpackConfig.devServerHost` |





---




#### platforms.web.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.web.webpackConfig.extend` |

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




---




#### platforms.web.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.web.webpackConfig.metaTags` |





---







### platforms.webos


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webos` | `object` |  | `platforms.webos` |





---



#### platforms.webos.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.webos.author` |





---




#### platforms.webos.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.webos.backgroundColor` |

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




#### platforms.webos.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.webos.buildSchemes` |





---




#### platforms.webos.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.webos.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.webos.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.webos.bundleIsDev` |





---




#### platforms.webos.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.webos.deploy` |





---



#### platforms.webos.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.webos.deploy.type` |





---





#### platforms.webos.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.webos.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.webos.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.webos.devServerHost` |





---




#### platforms.webos.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.webos.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.webos.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.webos.engine` |





---




#### platforms.webos.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.webos.entryFile` |





---




#### platforms.webos.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.webos.excludedPlugins` |

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




#### platforms.webos.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.webos.ext` |

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




#### platforms.webos.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.webos.id` |





---




#### platforms.webos.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.webos.ignoreLogs` |





---




#### platforms.webos.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.webos.ignoreWarnings` |





---




#### platforms.webos.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.webos.includedFonts` |

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




#### platforms.webos.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.webos.includedPermissions` |

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




#### platforms.webos.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.webos.includedPlugins` |

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




#### platforms.webos.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.webos.license` |





---




#### platforms.webos.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.webos.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.webos.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.webos.runtime` |

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




#### platforms.webos.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.webos.splashScreen` |





---




#### platforms.webos.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.webos.timestampAssets` |

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




#### platforms.webos.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.webos.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.webos.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.webos.versionedAssets` |

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




#### platforms.webos.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.webos.webpackConfig` |





---



#### platforms.webos.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.webos.webpackConfig.customScripts` |





---




#### platforms.webos.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.webos.webpackConfig.devServerHost` |





---




#### platforms.webos.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.webos.webpackConfig.extend` |

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




---




#### platforms.webos.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.webos.webpackConfig.metaTags` |





---







### platforms.webtv


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webtv` | `object` |  | `platforms.webtv` |





---



#### platforms.webtv.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.webtv.author` |





---




#### platforms.webtv.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.webtv.backgroundColor` |

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




#### platforms.webtv.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.webtv.buildSchemes` |





---




#### platforms.webtv.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.webtv.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.webtv.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.webtv.bundleIsDev` |





---




#### platforms.webtv.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `object` |  | `platforms.webtv.deploy` |





---



#### platforms.webtv.deploy.type


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `type` | `string` |  | `platforms.webtv.deploy.type` |





---





#### platforms.webtv.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.webtv.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.webtv.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.webtv.devServerHost` |





---




#### platforms.webtv.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.webtv.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.webtv.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.webtv.engine` |





---




#### platforms.webtv.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.webtv.entryFile` |





---




#### platforms.webtv.environment


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `environment` | `string` |  | `platforms.webtv.environment` |





---




#### platforms.webtv.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.webtv.excludedPlugins` |

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




#### platforms.webtv.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.webtv.ext` |

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




#### platforms.webtv.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.webtv.id` |





---




#### platforms.webtv.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.webtv.ignoreLogs` |





---




#### platforms.webtv.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.webtv.ignoreWarnings` |





---




#### platforms.webtv.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.webtv.includedFonts` |

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




#### platforms.webtv.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.webtv.includedPermissions` |

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




#### platforms.webtv.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.webtv.includedPlugins` |

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




#### platforms.webtv.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.webtv.license` |





---




#### platforms.webtv.pagesDir


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `pagesDir` | `string` |  | `platforms.webtv.pagesDir` |





---




#### platforms.webtv.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.webtv.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.webtv.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.webtv.runtime` |

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




#### platforms.webtv.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.webtv.splashScreen` |





---




#### platforms.webtv.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.webtv.timestampAssets` |

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




#### platforms.webtv.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.webtv.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.webtv.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.webtv.versionedAssets` |

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




#### platforms.webtv.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.webtv.webpackConfig` |





---



#### platforms.webtv.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.webtv.webpackConfig.customScripts` |





---




#### platforms.webtv.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.webtv.webpackConfig.devServerHost` |





---




#### platforms.webtv.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.webtv.webpackConfig.extend` |

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




---




#### platforms.webtv.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.webtv.webpackConfig.metaTags` |





---







### platforms.windows


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `windows` | `object` |  | `platforms.windows` |





---



#### platforms.windows.BrowserWindow


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BrowserWindow` | `object` |  | `platforms.windows.BrowserWindow` |

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




---



#### platforms.windows.BrowserWindow.height


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `height` | `integer` |  | `platforms.windows.BrowserWindow.height` |

Default height of electron app



---




#### platforms.windows.BrowserWindow.webPreferences


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webPreferences` | `object` |  | `platforms.windows.BrowserWindow.webPreferences` |

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```




---




#### platforms.windows.BrowserWindow.width


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `width` | `integer` |  | `platforms.windows.BrowserWindow.width` |

Default width of electron app



---





#### platforms.windows.additionalMetroOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `additionalMetroOptions` | `object` |  | `platforms.windows.additionalMetroOptions` |





---




#### platforms.windows.appPath


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appPath` | `string` |  | `platforms.windows.appPath` |

Full path to windows plaform build directory



---




#### platforms.windows.arch


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `arch` | `string` |  | `platforms.windows.arch` |

Specification of targeted architecture

**examples**


```json
{
  "arch": "x86"
}
```



```json
{
  "arch": "x64"
}
```



```json
{
  "arch": "ARM"
}
```



```json
{
  "arch": "ARM64"
}
```




---




#### platforms.windows.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.windows.author` |





---




#### platforms.windows.autolink


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `autolink` | `boolean` |  | `platforms.windows.autolink` |

Launches the application once the build process is finished



---




#### platforms.windows.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.windows.backgroundColor` |

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




#### platforms.windows.build


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build` | `boolean` |  | `platforms.windows.build` |

Builds the application before launching it



---




#### platforms.windows.buildLogDirectory


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildLogDirectory` | `string` |  | `platforms.windows.buildLogDirectory` |

Full path to directory where builds logs should be stored, default - project path



---




#### platforms.windows.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.windows.buildSchemes` |





---




#### platforms.windows.bundle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundle` | `boolean` |  | `platforms.windows.bundle` |





---




#### platforms.windows.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.windows.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.windows.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.windows.bundleIsDev` |





---




#### platforms.windows.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `boolean` |  | `platforms.windows.deploy` |





---




#### platforms.windows.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.windows.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.windows.devPort


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devPort` | `string` |  | `platforms.windows.devPort` |





---




#### platforms.windows.device


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `device` | `boolean` |  | `platforms.windows.device` |





---




#### platforms.windows.directDebugging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `directDebugging` | `boolean` |  | `platforms.windows.directDebugging` |





---




#### platforms.windows.electronConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `electronConfig` | `object` |  | `platforms.windows.electronConfig` |

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




---




#### platforms.windows.emulator


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `emulator` | `boolean` |  | `platforms.windows.emulator` |





---




#### platforms.windows.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.windows.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.windows.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.windows.engine` |





---




#### platforms.windows.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.windows.entryFile` |





---




#### platforms.windows.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.windows.excludedPlugins` |

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




#### platforms.windows.experimentalNuGetDependency


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `experimentalNuGetDependency` | `boolean` |  | `platforms.windows.experimentalNuGetDependency` |





---




#### platforms.windows.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.windows.ext` |

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




#### platforms.windows.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.windows.id` |





---




#### platforms.windows.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.windows.ignoreLogs` |





---




#### platforms.windows.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.windows.ignoreWarnings` |





---




#### platforms.windows.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.windows.includedFonts` |

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




#### platforms.windows.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.windows.includedPermissions` |

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




#### platforms.windows.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.windows.includedPlugins` |

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




#### platforms.windows.info


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `info` | `boolean` |  | `platforms.windows.info` |

Print information about the build machine to console



---




#### platforms.windows.language


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `language` | `string` |  | `platforms.windows.language` |

Specify generated project language: cpp for C++ or cs for C#



---




#### platforms.windows.launch


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `launch` | `boolean` |  | `platforms.windows.launch` |

Launches the application once the build process is finished



---




#### platforms.windows.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.windows.license` |





---




#### platforms.windows.logging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `logging` | `boolean` |  | `platforms.windows.logging` |

Logging all the build proccesses to console



---




#### platforms.windows.msbuildprops


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `msbuildprops` | `string` |  | `platforms.windows.msbuildprops` |

Comma separated props to pass to msbuild, eg: prop1=value1,prop2=value2



---




#### platforms.windows.nuGetTestFeed


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `nuGetTestFeed` | `string` |  | `platforms.windows.nuGetTestFeed` |





---




#### platforms.windows.nuGetTestVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `nuGetTestVersion` | `string` |  | `platforms.windows.nuGetTestVersion` |





---




#### platforms.windows.overwrite


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `overwrite` | `boolean` |  | `platforms.windows.overwrite` |

Whether to attempt to override the existing builds files when running a build once more



---




#### platforms.windows.packageExtension


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `packageExtension` | `string` |  | `platforms.windows.packageExtension` |





---




#### platforms.windows.packager


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `packager` | `boolean` |  | `platforms.windows.packager` |





---




#### platforms.windows.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.windows.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.windows.proj


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `proj` | `string` |  | `platforms.windows.proj` |

Root project directory for your React Native Windows project (not Visual Studio project)



---




#### platforms.windows.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` |  | `platforms.windows.reactNativeEngine` |





---




#### platforms.windows.release


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `release` | `boolean` |  | `platforms.windows.release` |

Enables full packaging of the app for release



---




#### platforms.windows.remoteDebugging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `remoteDebugging` | `boolean` |  | `platforms.windows.remoteDebugging` |





---




#### platforms.windows.root


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `root` | `string` |  | `platforms.windows.root` |

Project root folder location (not the app itself, which is in platformBuilds)



---




#### platforms.windows.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.windows.runtime` |

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




#### platforms.windows.singleproc


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `singleproc` | `boolean` |  | `platforms.windows.singleproc` |

Opt out of multi-proc builds (only available in 0.64 and newer versions of react-native-windows)



---




#### platforms.windows.sln


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `sln` | `string` |  | `platforms.windows.sln` |

Location of Visual Studio solution .sln file (wraps multiple projects)



---




#### platforms.windows.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.windows.splashScreen` |





---




#### platforms.windows.target


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `target` | `string` |  | `platforms.windows.target` |





---




#### platforms.windows.telemetry


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `telemetry` | `boolean` |  | `platforms.windows.telemetry` |

Send analytics data of @react-native-windows/cli usage to Microsoft



---




#### platforms.windows.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.windows.timestampAssets` |

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




#### platforms.windows.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.windows.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.windows.useWinUI3


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `useWinUI3` | `boolean` |  | `platforms.windows.useWinUI3` |





---




#### platforms.windows.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.windows.versionedAssets` |

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




#### platforms.windows.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.windows.webpackConfig` |





---



#### platforms.windows.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.windows.webpackConfig.customScripts` |





---




#### platforms.windows.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.windows.webpackConfig.devServerHost` |





---




#### platforms.windows.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.windows.webpackConfig.extend` |

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




---




#### platforms.windows.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.windows.webpackConfig.metaTags` |





---







### platforms.xbox


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `xbox` | `object` |  | `platforms.xbox` |





---



#### platforms.xbox.BrowserWindow


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `BrowserWindow` | `object` |  | `platforms.xbox.BrowserWindow` |

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




---



#### platforms.xbox.BrowserWindow.height


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `height` | `integer` |  | `platforms.xbox.BrowserWindow.height` |

Default height of electron app



---




#### platforms.xbox.BrowserWindow.webPreferences


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webPreferences` | `object` |  | `platforms.xbox.BrowserWindow.webPreferences` |

Extra web preferences of electron app

**examples**


```json
{
  "webPreferences": {
    "devTools": true
  }
}
```




---




#### platforms.xbox.BrowserWindow.width


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `width` | `integer` |  | `platforms.xbox.BrowserWindow.width` |

Default width of electron app



---





#### platforms.xbox.additionalMetroOptions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `additionalMetroOptions` | `object` |  | `platforms.xbox.additionalMetroOptions` |





---




#### platforms.xbox.appPath


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `appPath` | `string` |  | `platforms.xbox.appPath` |

Full path to windows plaform build directory



---




#### platforms.xbox.arch


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `arch` | `string` |  | `platforms.xbox.arch` |

Specification of targeted architecture

**examples**


```json
{
  "arch": "x86"
}
```



```json
{
  "arch": "x64"
}
```



```json
{
  "arch": "ARM"
}
```



```json
{
  "arch": "ARM64"
}
```




---




#### platforms.xbox.author


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `author` | `object,string` |  | `platforms.xbox.author` |





---




#### platforms.xbox.autolink


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `autolink` | `boolean` |  | `platforms.xbox.autolink` |

Launches the application once the build process is finished



---




#### platforms.xbox.backgroundColor


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `backgroundColor` | `string` |  | `platforms.xbox.backgroundColor` |

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




#### platforms.xbox.build


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `build` | `boolean` |  | `platforms.xbox.build` |

Builds the application before launching it



---




#### platforms.xbox.buildLogDirectory


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildLogDirectory` | `string` |  | `platforms.xbox.buildLogDirectory` |

Full path to directory where builds logs should be stored, default - project path



---




#### platforms.xbox.buildSchemes


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `buildSchemes` | `object` |  | `platforms.xbox.buildSchemes` |





---




#### platforms.xbox.bundle


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundle` | `boolean` |  | `platforms.xbox.bundle` |





---




#### platforms.xbox.bundleAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleAssets` | `boolean` |  | `platforms.xbox.bundleAssets` |

If set to `true` compiled js bundle file will generated. this is needed if you want to make production like builds



---




#### platforms.xbox.bundleIsDev


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bundleIsDev` | `boolean` |  | `platforms.xbox.bundleIsDev` |





---




#### platforms.xbox.deploy


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `deploy` | `boolean` |  | `platforms.xbox.deploy` |





---




#### platforms.xbox.description


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `description` | `string` |  | `platforms.xbox.description` |

General description of your app. This prop will be injected to actual projects where description field is applicable

**examples**


```json
{
  "description": "This app does awesome things"
}
```




---




#### platforms.xbox.devPort


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devPort` | `string` |  | `platforms.xbox.devPort` |





---




#### platforms.xbox.device


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `device` | `boolean` |  | `platforms.xbox.device` |





---




#### platforms.xbox.directDebugging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `directDebugging` | `boolean` |  | `platforms.xbox.directDebugging` |





---




#### platforms.xbox.electronConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `electronConfig` | `object` |  | `platforms.xbox.electronConfig` |

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




---




#### platforms.xbox.emulator


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `emulator` | `boolean` |  | `platforms.xbox.emulator` |





---




#### platforms.xbox.enableSourceMaps


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `enableSourceMaps` | `boolean` |  | `platforms.xbox.enableSourceMaps` |

If set to `true` dedicated source map file will be generated alongside of compiled js bundle



---




#### platforms.xbox.engine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `engine` | `string` |  | `platforms.xbox.engine` |





---




#### platforms.xbox.entryFile


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `entryFile` | `string` |  | `platforms.xbox.entryFile` |





---




#### platforms.xbox.excludedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `excludedPlugins` | `array` |  | `platforms.xbox.excludedPlugins` |

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




#### platforms.xbox.experimentalNuGetDependency


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `experimentalNuGetDependency` | `boolean` |  | `platforms.xbox.experimentalNuGetDependency` |





---




#### platforms.xbox.ext


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ext` | `object` |  | `platforms.xbox.ext` |

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




#### platforms.xbox.id


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `id` | `string` |  | `platforms.xbox.id` |





---




#### platforms.xbox.ignoreLogs


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreLogs` | `boolean` |  | `platforms.xbox.ignoreLogs` |





---




#### platforms.xbox.ignoreWarnings


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `ignoreWarnings` | `boolean` |  | `platforms.xbox.ignoreWarnings` |





---




#### platforms.xbox.includedFonts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedFonts` | `array` |  | `platforms.xbox.includedFonts` |

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




#### platforms.xbox.includedPermissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPermissions` | `array` |  | `platforms.xbox.includedPermissions` |

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




#### platforms.xbox.includedPlugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPlugins` | `array` |  | `platforms.xbox.includedPlugins` |

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




#### platforms.xbox.info


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `info` | `boolean` |  | `platforms.xbox.info` |

Print information about the build machine to console



---




#### platforms.xbox.language


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `language` | `string` |  | `platforms.xbox.language` |

Specify generated project language: cpp for C++ or cs for C#



---




#### platforms.xbox.launch


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `launch` | `boolean` |  | `platforms.xbox.launch` |

Launches the application once the build process is finished



---




#### platforms.xbox.license


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `license` | `string` |  | `platforms.xbox.license` |





---




#### platforms.xbox.logging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `logging` | `boolean` |  | `platforms.xbox.logging` |

Logging all the build proccesses to console



---




#### platforms.xbox.msbuildprops


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `msbuildprops` | `string` |  | `platforms.xbox.msbuildprops` |

Comma separated props to pass to msbuild, eg: prop1=value1,prop2=value2



---




#### platforms.xbox.nuGetTestFeed


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `nuGetTestFeed` | `string` |  | `platforms.xbox.nuGetTestFeed` |





---




#### platforms.xbox.nuGetTestVersion


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `nuGetTestVersion` | `string` |  | `platforms.xbox.nuGetTestVersion` |





---




#### platforms.xbox.overwrite


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `overwrite` | `boolean` |  | `platforms.xbox.overwrite` |

Whether to attempt to override the existing builds files when running a build once more



---




#### platforms.xbox.packageExtension


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `packageExtension` | `string` |  | `platforms.xbox.packageExtension` |





---




#### platforms.xbox.packager


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `packager` | `boolean` |  | `platforms.xbox.packager` |





---




#### platforms.xbox.permissions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `permissions` | `array` |  | `platforms.xbox.permissions` |

> DEPRECATED in favor of includedPermissions



---




#### platforms.xbox.proj


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `proj` | `string` |  | `platforms.xbox.proj` |

Root project directory for your React Native Windows project (not Visual Studio project)



---




#### platforms.xbox.reactNativeEngine


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `reactNativeEngine` | `string` |  | `platforms.xbox.reactNativeEngine` |





---




#### platforms.xbox.release


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `release` | `boolean` |  | `platforms.xbox.release` |

Enables full packaging of the app for release



---




#### platforms.xbox.remoteDebugging


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `remoteDebugging` | `boolean` |  | `platforms.xbox.remoteDebugging` |





---




#### platforms.xbox.root


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `root` | `string` |  | `platforms.xbox.root` |

Project root folder location (not the app itself, which is in platformBuilds)



---




#### platforms.xbox.runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `platforms.xbox.runtime` |

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




#### platforms.xbox.singleproc


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `singleproc` | `boolean` |  | `platforms.xbox.singleproc` |

Opt out of multi-proc builds (only available in 0.64 and newer versions of react-native-windows)



---




#### platforms.xbox.sln


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `sln` | `string` |  | `platforms.xbox.sln` |

Location of Visual Studio solution .sln file (wraps multiple projects)



---




#### platforms.xbox.splashScreen


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `splashScreen` | `boolean` |  | `platforms.xbox.splashScreen` |





---




#### platforms.xbox.target


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `target` | `string` |  | `platforms.xbox.target` |





---




#### platforms.xbox.telemetry


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `telemetry` | `boolean` |  | `platforms.xbox.telemetry` |

Send analytics data of @react-native-windows/cli usage to Microsoft



---




#### platforms.xbox.timestampAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `timestampAssets` | `boolean` |  | `platforms.xbox.timestampAssets` |

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




#### platforms.xbox.title


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `title` | `string` |  | `platforms.xbox.title` |

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

**examples**


```json
{
  "title": "Awesome App"
}
```




---




#### platforms.xbox.useWinUI3


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `useWinUI3` | `boolean` |  | `platforms.xbox.useWinUI3` |





---




#### platforms.xbox.versionedAssets


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionedAssets` | `boolean` |  | `platforms.xbox.versionedAssets` |

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




#### platforms.xbox.webpackConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `webpackConfig` | `object` |  | `platforms.xbox.webpackConfig` |





---



#### platforms.xbox.webpackConfig.customScripts


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `customScripts` | `array` |  | `platforms.xbox.webpackConfig.customScripts` |





---




#### platforms.xbox.webpackConfig.devServerHost


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `devServerHost` | `string` |  | `platforms.xbox.webpackConfig.devServerHost` |





---




#### platforms.xbox.webpackConfig.extend


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `extend` | `object` |  | `platforms.xbox.webpackConfig.extend` |

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




---




#### platforms.xbox.webpackConfig.metaTags


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `metaTags` | `object` |  | `platforms.xbox.webpackConfig.metaTags` |





---










## pluginTemplates


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `pluginTemplates` | `object` |  | `pluginTemplates` |





---







## plugins


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `plugins` | `object` |  | `plugins` |

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







## private


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `private` | `object` |  | `private` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `projectName` | `string` |  | `projectName` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `projectTemplates` | `object` |  | `projectTemplates` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `publish` | `object` |  | `publish` |





---







## runtime


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `runtime` | `object` |  | `runtime` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `sdks` | `object` |  | `sdks` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `tasks` | `object` |  | `tasks` |

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







## templateConfig


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `templateConfig` | `object` |  | `templateConfig` |

Used in `renative.template.json` allows you to define template behaviour.



---




### templateConfig.bootstrapQuestions


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `bootstrapQuestions` | `array` |  | `templateConfig.bootstrapQuestions` |

Defines list of custom bootstrap questions

**examples**


```json
{
  "bootstrapQuestions": [
    {
      "title": "Which service to use?",
      "type": "list",
      "configProp": {
        "key": "runtime.myServiceConfig",
        "file": "renative.json"
      },
      "options": [
        {
          "title": "Service 1",
          "value": {
            "id": "xxx1"
          }
        },
        {
          "title": "Service 2",
          "value": {
            "id": "xxx2"
          }
        }
      ]
    }
  ]
}
```




---





### templateConfig.includedPaths


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `includedPaths` | `array` |  | `templateConfig.includedPaths` |

Defines list of all file/dir paths you want to include in template

**examples**


```json
{
  "includedPaths": [
    "next.config.js",
    "babel.config.js",
    "appConfigs",
    "public",
    "src"
  ]
}
```




---








## templates


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `templates` | `object` |  | `templates` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `version` | `string` |  | `version` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionCode` | `string` |  | `versionCode` |

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


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionCodeFormat` | `string` |  | `versionCodeFormat` |

Allows you to fine-tune auto generated version codes.

Version code is autogenerated from app version defined in package.json or renative.json.

NOTE: If you define versionCode manually this formatting will not apply.

EXAMPLE 1:

default value: 00.00.00

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 10203

EXAMPLE 2:

"versionCodeFormat" : "00.00.00.00.00"

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 102030000

EXAMPLE 3:

"versionCodeFormat" : "00.00.00.0000"

IN: 1.0.23-rc.15 OUT: 100230015

IN: 1.0.23 OUT: 100230000



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



```json
{
  "versionCodeFormat": "00.00.00.0000"
}
```




---







## versionFormat


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `versionFormat` | `string` |  | `versionFormat` |

Allows you to fine-tune app version defined in package.json or renative.json.

If you do not define versionFormat, no formatting will apply to version.

"versionFormat" : "0.0.0"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3

IN: 1.2.3 OUT: 1.2.3



"versionFormat" : "0.0.0.0.0"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3.4.56

IN: 1.2.3 OUT: 1.2.3

"versionFormat" : "0.0.0.x.x.x.x"

IN: 1.2.3-rc.4+build.56 OUT: 1.2.3.rc.4.build.56

IN: 1.2.3 OUT: 1.2.3



**examples**


```json
{
  "versionFormat": "0.0.0"
}
```



```json
{
  "versionFormat": "0.0.0.0.0"
}
```



```json
{
  "versionFormat": "0.0.0.x.x.x.x"
}
```




---







## workspaceID


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| `workspaceID` | `string` |  | `workspaceID` |

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




---






