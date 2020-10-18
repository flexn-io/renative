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

---
## common

type: `object`

Common config props used as default props for all available buildSchemes

path:
`renative.json/#/common`

examples:

```json
"common": {
  "author": {
    "name": "Pavel Jacko",
    "email": "Pavel Jacko <i@pavjacko.com>",
    "url": "https://github.com/pavjacko"
  },
  "license": "MIT",
  "includedPlugins": [
    "*"
  ],
  "includedFonts": [
    "*"
  ],
  "buildSchemes": {
    "debug": {
      "description": "Use for local development"
    },
    "test": {
      "description": "Use to run automation"
    },
    "release": {
      "description": "Use for production deployments"
    }
  },
  "backgroundColor": "#111111",
  "runtime": {
    "welcomeMessage": "Hello ReNative!"
  }
}
```



### author

type: `object`

TODO description

path:
`renative.json/#/common.author`

examples:

```json

```




### backgroundColor

type: `string`

Defines root view backgroundColor for all platforms in HEX format

path:
`renative.json/#/common.backgroundColor`

examples:

```json
"backgroundColor": "#FFFFFF"

"backgroundColor": "#222222"
```




### buildSchemes

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes`

examples:

```json

```



#### common.buildSchemes.[object].AndroidManifest

type: `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

path:
`renative.json/#/common.buildSchemes.[object].AndroidManifest`

examples:

```json
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
```




#### common.buildSchemes.[object].BrowserWindow

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow`

examples:

```json

```



##### common.buildSchemes.[object].BrowserWindow.height

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.height`

examples:

```json

```




##### common.buildSchemes.[object].BrowserWindow.webPreferences

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.webPreferences`

examples:

```json

```




##### common.buildSchemes.[object].BrowserWindow.width

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.width`

examples:

```json

```





#### common.buildSchemes.[object].Podfile

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].Podfile`

examples:

```json

```




#### common.buildSchemes.[object].aab

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].aab`

examples:

```json

```




#### common.buildSchemes.[object].app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].app/build.gradle`

examples:

```json

```




#### common.buildSchemes.[object].appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods`

examples:

```json

```



##### common.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didReceive`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didRegister`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.open`

examples:

```json

```




##### common.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

examples:

```json

```





#### common.buildSchemes.[object].appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateImports`

examples:

```json

```




#### common.buildSchemes.[object].appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateMethods`

examples:

```json

```




#### common.buildSchemes.[object].appName

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appName`

examples:

```json

```




#### common.buildSchemes.[object].appleId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appleId`

examples:

```json

```




#### common.buildSchemes.[object].applyPlugin

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].applyPlugin`

examples:

```json

```




#### common.buildSchemes.[object].author

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].author`

examples:

```json

```




#### common.buildSchemes.[object].backgroundColor

type: `string`

Defines root view backgroundColor for all platforms in HEX format

path:
`renative.json/#/common.buildSchemes.[object].backgroundColor`

examples:

```json
"backgroundColor": "#FFFFFF"

"backgroundColor": "#222222"
```




#### common.buildSchemes.[object].build.gradle

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].build.gradle`

examples:

```json

```




#### common.buildSchemes.[object].bundleAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].bundleAssets`

examples:

```json

```




#### common.buildSchemes.[object].bundleIsDev

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].bundleIsDev`

examples:

```json

```




#### common.buildSchemes.[object].certificateProfile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].certificateProfile`

examples:

```json

```




#### common.buildSchemes.[object].codeSignIdentity

type: `string`

Special property which tells Xcode how to build your project

path:
`renative.json/#/common.buildSchemes.[object].codeSignIdentity`

examples:

```json
"codeSignIdentity": "iPhone Developer"

"codeSignIdentity": "iPhone Distribution"
```




#### common.buildSchemes.[object].compileSdkVersion

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].compileSdkVersion`

examples:

```json

```




#### common.buildSchemes.[object].deploy

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploy`

examples:

```json

```



##### common.buildSchemes.[object].deploy.type

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploy.type`

examples:

```json

```





#### common.buildSchemes.[object].deploymentTarget

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploymentTarget`

examples:

```json

```




#### common.buildSchemes.[object].description

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].description`

examples:

```json

```




#### common.buildSchemes.[object].devServerHost

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].devServerHost`

examples:

```json

```




#### common.buildSchemes.[object].electronConfig

type: `object`

Allows you to configure electron app as per https://www.electron.build/

path:
`renative.json/#/common.buildSchemes.[object].electronConfig`

examples:

```json
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
```




#### common.buildSchemes.[object].enableAndroidX

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].enableAndroidX`

examples:

```json

```




#### common.buildSchemes.[object].enableHermes

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].enableHermes`

examples:

```json

```




#### common.buildSchemes.[object].enabled

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].enabled`

examples:

```json

```




#### common.buildSchemes.[object].engine

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].engine`

examples:

```json

```




#### common.buildSchemes.[object].entitlements

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].entitlements`

examples:

```json

```




#### common.buildSchemes.[object].entryFile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].entryFile`

examples:

```json

```




#### common.buildSchemes.[object].environment

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].environment`

examples:

```json

```




#### common.buildSchemes.[object].excludedFeatures

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].excludedFeatures`

examples:

```json

```




#### common.buildSchemes.[object].excludedPlugins

type: `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

path:
`renative.json/#/common.buildSchemes.[object].excludedPlugins`

examples:

```json
"excludedPlugins": [
  "*"
]

"excludedPlugins": [
  "react-native-google-cast",
  "react-navigation-tabs"
]
```




#### common.buildSchemes.[object].exportOptions

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions`

examples:

```json

```



##### common.buildSchemes.[object].exportOptions.compileBitcode

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.compileBitcode`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.method

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.method`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.provisioningProfiles

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.provisioningProfiles`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.signingCertificate

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.signingCertificate`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.signingStyle

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.signingStyle`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.teamID

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.teamID`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.uploadBitcode

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.uploadBitcode`

examples:

```json

```




##### common.buildSchemes.[object].exportOptions.uploadSymbols

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.uploadSymbols`

examples:

```json

```





#### common.buildSchemes.[object].ext

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ext`

examples:

```json

```




#### common.buildSchemes.[object].firebaseId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].firebaseId`

examples:

```json

```




#### common.buildSchemes.[object].gradle.properties

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].gradle.properties`

examples:

```json

```




#### common.buildSchemes.[object].id

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].id`

examples:

```json

```




#### common.buildSchemes.[object].ignoreLogs

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ignoreLogs`

examples:

```json

```




#### common.buildSchemes.[object].ignoreWarnings

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ignoreWarnings`

examples:

```json

```




#### common.buildSchemes.[object].includedFeatures

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].includedFeatures`

examples:

```json

```




#### common.buildSchemes.[object].includedFonts

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].includedFonts`

examples:

```json

```




#### common.buildSchemes.[object].includedPermissions

type: `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

path:
`renative.json/#/common.buildSchemes.[object].includedPermissions`

examples:

```json
"includedPermissions": [
  "*"
]

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
```




#### common.buildSchemes.[object].includedPlugins

type: `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

path:
`renative.json/#/common.buildSchemes.[object].includedPlugins`

examples:

```json
"includedPlugins": [
  "*"
]

"includedPlugins": [
  "react-native-google-cast",
  "react-navigation-tabs"
]
```




#### common.buildSchemes.[object].keyAlias

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].keyAlias`

examples:

```json

```




#### common.buildSchemes.[object].keyPassword

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].keyPassword`

examples:

```json

```




#### common.buildSchemes.[object].license

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].license`

examples:

```json

```




#### common.buildSchemes.[object].minSdkVersion

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].minSdkVersion`

examples:

```json

```




#### common.buildSchemes.[object].multipleAPKs

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].multipleAPKs`

examples:

```json

```




#### common.buildSchemes.[object].orientationSupport

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].orientationSupport`

examples:

```json
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
```



##### common.buildSchemes.[object].orientationSupport.phone

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].orientationSupport.phone`

examples:

```json

```




##### common.buildSchemes.[object].orientationSupport.tab

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].orientationSupport.tab`

examples:

```json

```





#### common.buildSchemes.[object].package

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].package`

examples:

```json

```




#### common.buildSchemes.[object].pagesDir

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].pagesDir`

examples:

```json

```




#### common.buildSchemes.[object].permissions

type: `array`

> DEPRECATED in favor of includedPermissions

path:
`renative.json/#/common.buildSchemes.[object].permissions`

examples:

```json

```




#### common.buildSchemes.[object].plist

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].plist`

examples:

```json

```




#### common.buildSchemes.[object].provisionProfileSpecifier

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisionProfileSpecifier`

examples:

```json

```




#### common.buildSchemes.[object].provisioningProfiles

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisioningProfiles`

examples:

```json

```




#### common.buildSchemes.[object].provisioningStyle

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisioningStyle`

examples:

```json

```




#### common.buildSchemes.[object].runScheme

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].runScheme`

examples:

```json

```




#### common.buildSchemes.[object].runtime

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].runtime`

examples:

```json

```




#### common.buildSchemes.[object].scheme

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].scheme`

examples:

```json

```




#### common.buildSchemes.[object].sdk

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].sdk`

examples:

```json

```




#### common.buildSchemes.[object].signingConfig

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].signingConfig`

examples:

```json

```




#### common.buildSchemes.[object].splashScreen

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].splashScreen`

examples:

```json

```




#### common.buildSchemes.[object].storeFile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].storeFile`

examples:

```json

```




#### common.buildSchemes.[object].storePassword

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].storePassword`

examples:

```json

```




#### common.buildSchemes.[object].systemCapabilities

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].systemCapabilities`

examples:

```json
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
```




#### common.buildSchemes.[object].targetSdkVersion

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].targetSdkVersion`

examples:

```json

```




#### common.buildSchemes.[object].teamID

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].teamID`

examples:

```json

```




#### common.buildSchemes.[object].teamIdentifier

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].teamIdentifier`

examples:

```json

```




#### common.buildSchemes.[object].testFlightId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].testFlightId`

examples:

```json

```




#### common.buildSchemes.[object].timestampAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].timestampAssets`

examples:

```json

```




#### common.buildSchemes.[object].title

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].title`

examples:

```json

```




#### common.buildSchemes.[object].universalApk

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].universalApk`

examples:

```json

```




#### common.buildSchemes.[object].versionedAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].versionedAssets`

examples:

```json

```




#### common.buildSchemes.[object].webpackConfig

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].webpackConfig`

examples:

```json

```




#### common.buildSchemes.[object].xcodeproj

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].xcodeproj`

examples:

```json

```





### description

type: `string`

TODO description

path:
`renative.json/#/common.description`

examples:

```json

```




### excludedPlugins

type: `array`

Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: excludedPlugins is evaluated after includedPlugins

path:
`renative.json/#/common.excludedPlugins`

examples:

```json
"excludedPlugins": [
  "*"
]

"excludedPlugins": [
  "react-native-google-cast",
  "react-navigation-tabs"
]
```




### ext

type: `object`

TODO description

path:
`renative.json/#/common.ext`

examples:

```json

```




### id

type: `string`

TODO description

path:
`renative.json/#/common.id`

examples:

```json

```




### ignoreLogs

type: `boolean`

TODO description

path:
`renative.json/#/common.ignoreLogs`

examples:

```json

```




### ignoreWarnings

type: `boolean`

TODO description

path:
`renative.json/#/common.ignoreWarnings`

examples:

```json

```




### includedFonts

type: `array`

TODO description

path:
`renative.json/#/common.includedFonts`

examples:

```json

```




### includedPermissions

type: `array`

Allows you to include specific permissions by their KEY defined in `permissions` object

path:
`renative.json/#/common.includedPermissions`

examples:

```json
"includedPermissions": [
  "*"
]

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
```




### includedPlugins

type: `array`

Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.

NOTE: includedPlugins is evaluated before excludedPlugins

path:
`renative.json/#/common.includedPlugins`

examples:

```json
"includedPlugins": [
  "*"
]

"includedPlugins": [
  "react-native-google-cast",
  "react-navigation-tabs"
]
```




### license

type: `string`

TODO description

path:
`renative.json/#/common.license`

examples:

```json

```




### permissions

type: `array`

> DEPRECATED in favor of includedPermissions

path:
`renative.json/#/common.permissions`

examples:

```json

```




### runtime

type: `object`

TODO description

path:
`renative.json/#/common.runtime`

examples:

```json

```




### splashScreen

type: `boolean`

TODO description

path:
`renative.json/#/common.splashScreen`

examples:

```json

```




### timestampAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.timestampAssets`

examples:

```json

```




### title

type: `string`

TODO description

path:
`renative.json/#/common.title`

examples:

```json

```




### versionedAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.versionedAssets`

examples:

```json

```






---

## crypto

type: `object`

TODO description

path:
`renative.json/#/crypto`

examples:

```json

```





---

## currentTemplate

type: `string`

TODO description

path:
`renative.json/#/currentTemplate`

examples:

```json

```





---

## defaultTargets

type: `object`

TODO description

path:
`renative.json/#/defaultTargets`

examples:

```json

```





---

## defaults

type: `object`

TODO description

path:
`renative.json/#/defaults`

examples:

```json

```



### ports

type: `object`

TODO description

path:
`renative.json/#/defaults.ports`

examples:

```json

```




### schemes

type: `object`

TODO description

path:
`renative.json/#/defaults.schemes`

examples:

```json

```




### supportedPlatforms

type: `array`

TODO description

path:
`renative.json/#/defaults.supportedPlatforms`

examples:

```json

```




### targets

type: `object`

TODO description

path:
`renative.json/#/defaults.targets`

examples:

```json

```




### template

type: `string`

TODO description

path:
`renative.json/#/defaults.template`

examples:

```json

```






---

## description

type: `string`

TODO description

path:
`renative.json/#/description`

examples:

```json

```





---

## enableAnalytics

type: `boolean`

TODO description

path:
`renative.json/#/enableAnalytics`

examples:

```json

```





---

## env

type: `object`

TODO description

path:
`renative.json/#/env`

examples:

```json

```





---

## ext

type: `object`

TODO description

path:
`renative.json/#/ext`

examples:

```json

```





---

## extend

type: `string`

TODO description

path:
`renative.json/#/extend`

examples:

```json

```





---

## hidden

type: `boolean`

TODO description

path:
`renative.json/#/hidden`

examples:

```json

```





---

## id

type: `string`

TODO description

path:
`renative.json/#/id`

examples:

```json

```





---

## integrations

type: `object`

TODO description

path:
`renative.json/#/integrations`

examples:

```json

```





---

## isWrapper

type: `boolean`

TODO description

path:
`renative.json/#/isWrapper`

examples:

```json

```





---

## paths

type: `object`

TODO description

path:
`renative.json/#/paths`

examples:

```json

```



### appConfigsDir

type: `string`

TODO description

path:
`renative.json/#/paths.appConfigsDir`

examples:

```json

```




### entryDir

type: `string`

TODO description

path:
`renative.json/#/paths.entryDir`

examples:

```json

```




### platformAssetsDir

type: `string`

TODO description

path:
`renative.json/#/paths.platformAssetsDir`

examples:

```json

```




### platformBuildsDir

type: `string`

TODO description

path:
`renative.json/#/paths.platformBuildsDir`

examples:

```json

```




### pluginTemplates

type: `object`

TODO description

path:
`renative.json/#/paths.pluginTemplates`

examples:

```json

```




### projectConfigDir

type: `string`

TODO description

path:
`renative.json/#/paths.projectConfigDir`

examples:

```json

```






---

## permissions

type: `object`

Permission definititions which can be used by app configs via `includedPermissions` and `excludedPermissions` to customize permissions for each app

path:
`renative.json/#/permissions`

examples:

```json
"permissions": {
  "ios": {},
  "android": {}
}
```



### android

type: `object`

Android SDK specific permissions

path:
`renative.json/#/permissions.android`

examples:

```json
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
```




### ios

type: `object`

iOS SDK specific permissions

path:
`renative.json/#/permissions.ios`

examples:

```json
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
```






---

## pipes

type: `array`

TODO description

path:
`renative.json/#/pipes`

examples:

```json

```





---

## platforms

type: `object`

TODO description

path:
`renative.json/#/platforms`

examples:

```json

```



### android

type: `undefined`

TODO description

path:
`renative.json/#/platforms.android`

examples:

```json

```




### androidtv

type: `undefined`

TODO description

path:
`renative.json/#/platforms.androidtv`

examples:

```json

```




### androidwear

type: `undefined`

TODO description

path:
`renative.json/#/platforms.androidwear`

examples:

```json

```




### chromecast

type: `undefined`

TODO description

path:
`renative.json/#/platforms.chromecast`

examples:

```json

```




### firefoxos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.firefoxos`

examples:

```json

```




### firefoxtv

type: `undefined`

TODO description

path:
`renative.json/#/platforms.firefoxtv`

examples:

```json

```




### ios

type: `undefined`

TODO description

path:
`renative.json/#/platforms.ios`

examples:

```json

```




### kaios

type: `undefined`

TODO description

path:
`renative.json/#/platforms.kaios`

examples:

```json

```




### macos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.macos`

examples:

```json

```




### tizen

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizen`

examples:

```json

```




### tizenmobile

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizenmobile`

examples:

```json

```




### tizenwatch

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizenwatch`

examples:

```json

```




### tvos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tvos`

examples:

```json

```




### web

type: `undefined`

TODO description

path:
`renative.json/#/platforms.web`

examples:

```json

```




### webos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.webos`

examples:

```json

```




### windows

type: `undefined`

TODO description

path:
`renative.json/#/platforms.windows`

examples:

```json

```






---

## pluginTemplates

type: `object`

TODO description

path:
`renative.json/#/pluginTemplates`

examples:

```json

```





---

## plugins

type: `object`

Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config

path:
`renative.json/#/plugins`

examples:

```json
"plugins": {
  "renative": "source:rnv",
  "react": "source:rnv",
  "react-native-cached-image": "source:rnv",
  "react-native-web-image-loader": "source:rnv",
  "react-native-gesture-handler": {
    "version": "1.0.0"
  }
}
```



### android

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android`

examples:

```json

```



#### plugins.[object].android.AndroidManifest

type: `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

path:
`renative.json/#/plugins.[object].android.AndroidManifest`

examples:

```json
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
```




#### plugins.[object].android.afterEvaluate

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].android.afterEvaluate`

examples:

```json

```




#### plugins.[object].android.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.app/build.gradle`

examples:

```json

```




#### plugins.[object].android.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].android.applyPlugin`

examples:

```json

```




#### plugins.[object].android.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.build.gradle`

examples:

```json

```




#### plugins.[object].android.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].android.enabled`

examples:

```json

```




#### plugins.[object].android.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.gradle.properties`

examples:

```json

```




#### plugins.[object].android.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].android.package`

examples:

```json

```




#### plugins.[object].android.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].android.projectName`

examples:

```json

```




#### plugins.[object].android.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].android.skipImplementation`

examples:

```json

```




#### plugins.[object].android.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.webpackConfig`

examples:

```json

```





### androidtv

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv`

examples:

```json

```



#### plugins.[object].androidtv.AndroidManifest

type: `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

path:
`renative.json/#/plugins.[object].androidtv.AndroidManifest`

examples:

```json
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
```




#### plugins.[object].androidtv.afterEvaluate

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.afterEvaluate`

examples:

```json

```




#### plugins.[object].androidtv.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.app/build.gradle`

examples:

```json

```




#### plugins.[object].androidtv.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.applyPlugin`

examples:

```json

```




#### plugins.[object].androidtv.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.build.gradle`

examples:

```json

```




#### plugins.[object].androidtv.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.enabled`

examples:

```json

```




#### plugins.[object].androidtv.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.gradle.properties`

examples:

```json

```




#### plugins.[object].androidtv.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.package`

examples:

```json

```




#### plugins.[object].androidtv.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.projectName`

examples:

```json

```




#### plugins.[object].androidtv.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.skipImplementation`

examples:

```json

```




#### plugins.[object].androidtv.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.webpackConfig`

examples:

```json

```





### androidwear

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear`

examples:

```json

```



#### plugins.[object].androidwear.AndroidManifest

type: `object`

Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism

path:
`renative.json/#/plugins.[object].androidwear.AndroidManifest`

examples:

```json
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
```




#### plugins.[object].androidwear.afterEvaluate

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.afterEvaluate`

examples:

```json

```




#### plugins.[object].androidwear.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.app/build.gradle`

examples:

```json

```




#### plugins.[object].androidwear.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.applyPlugin`

examples:

```json

```




#### plugins.[object].androidwear.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.build.gradle`

examples:

```json

```




#### plugins.[object].androidwear.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.enabled`

examples:

```json

```




#### plugins.[object].androidwear.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.gradle.properties`

examples:

```json

```




#### plugins.[object].androidwear.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.package`

examples:

```json

```




#### plugins.[object].androidwear.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.projectName`

examples:

```json

```




#### plugins.[object].androidwear.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.skipImplementation`

examples:

```json

```




#### plugins.[object].androidwear.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.webpackConfig`

examples:

```json

```





### chromecast

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].chromecast`

examples:

```json

```



#### plugins.[object].chromecast.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].chromecast.webpackConfig`

examples:

```json

```





### enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].enabled`

examples:

```json

```




### firefox

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].firefox`

examples:

```json

```



#### plugins.[object].firefox.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].firefox.webpackConfig`

examples:

```json

```





### ios

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios`

examples:

```json

```



#### plugins.[object].ios.Podfile

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.Podfile`

examples:

```json

```




#### plugins.[object].ios.appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods`

examples:

```json

```



##### plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceive`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegister`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.open`

examples:

```json

```




##### plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

examples:

```json

```





#### plugins.[object].ios.appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateImports`

examples:

```json

```




#### plugins.[object].ios.appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateMethods`

examples:

```json

```




#### plugins.[object].ios.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].ios.enabled`

examples:

```json

```




#### plugins.[object].ios.plist

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.plist`

examples:

```json

```




#### plugins.[object].ios.podName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].ios.podName`

examples:

```json

```




#### plugins.[object].ios.podNames

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.podNames`

examples:

```json

```




#### plugins.[object].ios.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.webpackConfig`

examples:

```json

```




#### plugins.[object].ios.xcodeproj

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.xcodeproj`

examples:

```json

```





### macos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].macos`

examples:

```json

```



#### plugins.[object].macos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].macos.webpackConfig`

examples:

```json

```





### no-npm

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].no-npm`

examples:

```json

```




### npm

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].npm`

examples:

```json

```




### pluginDependencies

type: `array,null`

TODO description

path:
`renative.json/#/plugins.[object].pluginDependencies`

examples:

```json

```




### props

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].props`

examples:

```json

```




### source

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].source`

examples:

```json

```




### tizen

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tizen`

examples:

```json

```



#### plugins.[object].tizen.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tizen.webpackConfig`

examples:

```json

```





### tvos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos`

examples:

```json

```



#### plugins.[object].tvos.Podfile

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.Podfile`

examples:

```json

```




#### plugins.[object].tvos.appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods`

examples:

```json

```



##### plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceive`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegister`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.open`

examples:

```json

```




##### plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`

examples:

```json

```





#### plugins.[object].tvos.appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateImports`

examples:

```json

```




#### plugins.[object].tvos.appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateMethods`

examples:

```json

```




#### plugins.[object].tvos.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].tvos.enabled`

examples:

```json

```




#### plugins.[object].tvos.plist

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.plist`

examples:

```json

```




#### plugins.[object].tvos.podName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].tvos.podName`

examples:

```json

```




#### plugins.[object].tvos.podNames

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.podNames`

examples:

```json

```




#### plugins.[object].tvos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.webpackConfig`

examples:

```json

```




#### plugins.[object].tvos.xcodeproj

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.xcodeproj`

examples:

```json

```





### version

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].version`

examples:

```json

```




### web

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].web`

examples:

```json

```



#### plugins.[object].web.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].web.webpackConfig`

examples:

```json

```





### webos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].webos`

examples:

```json

```



#### plugins.[object].webos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].webos.webpackConfig`

examples:

```json

```





### webpack

type: `object`

> DEPRECATED in favour of `webpackConfig`

path:
`renative.json/#/plugins.[object].webpack`

examples:

```json

```




### webpackConfig

type: `object`

Allows you to configure webpack bahaviour per each individual plugin

path:
`renative.json/#/plugins.[object].webpackConfig`

examples:

```json

```



#### plugins.[object].webpackConfig.moduleAliases

type: `boolean,object`

TODO description

path:
`renative.json/#/plugins.[object].webpackConfig.moduleAliases`

examples:

```json

```




#### plugins.[object].webpackConfig.modulePaths

type: `boolean,object`

TODO description

path:
`renative.json/#/plugins.[object].webpackConfig.modulePaths`

examples:

```json

```





### windows

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].windows`

examples:

```json

```



#### plugins.[object].windows.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].windows.webpackConfig`

examples:

```json

```







---

## private

type: `object`

Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file

path:
`renative.json/#/private`

examples:

```json
"private": {
  "myPrivateKy": "6568347563858739"
}
```





---

## projectName

type: `string`

Name of the project which will be used in workspace as folder name. this will also be used as part of the KEY in crypto env var generator

path:
`renative.json/#/projectName`

examples:

```json
"projectName": "my-project"

"projectName": "myProject"
```





---

## projectTemplates

type: `object`

Custom list of renative templates (NPM package names) which will be displayed during `rnv new` project bootstrap. This prop usually resides in workspace config.

path:
`renative.json/#/projectTemplates`

examples:

```json
"projectTemplates": {
  "my-custom-template": {}
}
```





---

## publish

type: `object`

TODO description

path:
`renative.json/#/publish`

examples:

```json

```





---

## runtime

type: `object`

TODO description

path:
`renative.json/#/runtime`

examples:

```json

```





---

## sdks

type: `object`

TODO description

path:
`renative.json/#/sdks`

examples:

```json

```





---

## tasks

type: `object`

TODO description

path:
`renative.json/#/tasks`

examples:

```json

```





---

## templates

type: `object`

Stores installed templates info in your project.

NOTE: This prop will be updated by rnv if you run `rnv template install`

path:
`renative.json/#/templates`

examples:

```json
"templates": {
  "renative-template-hello-world": {
    "version": "0.31.0"
  }
}
```





---

## version

type: `string`

Semver style version of your app.

path:
`renative.json/#/version`

examples:

```json
"version": "0.1.0"

"version": "1.0.0"

"version": "1.0.0-alpha.1"

"version": "1.0.0-RC.7"

"version": "1.0.0-feature-x.0"
```





---

## versionCode

type: `string`

Manual verride of generated version code

path:
`renative.json/#/versionCode`

examples:

```json
"versionCode": "1000"

"versionCode": "10023"
```





---

## versionCodeFormat

type: `string`

allows you to fine-tune auto generated version codes

path:
`renative.json/#/versionCodeFormat`

examples:

```json
"versionCodeFormat": "00.00.00"

"versionCodeFormat": "00.00.00.00.00"
```





---

## workspaceID

type: `string`

Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS

path:
`renative.json/#/workspaceID`

examples:

```json
"workspaceID": "rnv"

"workspaceID": "myCustomWorkspace"
```





---

