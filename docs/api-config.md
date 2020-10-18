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
  "backgroundColor": "#111111",
  "runtime": {
    "welcomeMessage": "Hello ReNative!"
  }
}
```




---
### common.author

type: `object`

TODO description

path:
`renative.json/#/common.author`






---
### common.backgroundColor

type: `string`

Defines root view backgroundColor for all platforms in HEX format

path:
`renative.json/#/common.backgroundColor`

examples:

```json
"backgroundColor": "#FFFFFF"

"backgroundColor": "#222222"
```





---
### common.buildSchemes

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes`





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





##### common.buildSchemes.[object].BrowserWindow.height

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.height`






##### common.buildSchemes.[object].BrowserWindow.webPreferences

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.webPreferences`






##### common.buildSchemes.[object].BrowserWindow.width

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].BrowserWindow.width`







#### common.buildSchemes.[object].Podfile

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].Podfile`






#### common.buildSchemes.[object].aab

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].aab`






#### common.buildSchemes.[object].app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].app/build.gradle`






#### common.buildSchemes.[object].appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods`





##### common.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`






##### common.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didFinishLaunchingWithOptions`






##### common.buildSchemes.[object].appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didReceive`






##### common.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didReceiveRemoteNotification`






##### common.buildSchemes.[object].appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didRegister`






##### common.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`






##### common.buildSchemes.[object].appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.open`






##### common.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateApplicationMethods.supportedInterfaceOrientationsFor`







#### common.buildSchemes.[object].appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateImports`






#### common.buildSchemes.[object].appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appDelegateMethods`






#### common.buildSchemes.[object].appName

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appName`






#### common.buildSchemes.[object].appleId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].appleId`






#### common.buildSchemes.[object].applyPlugin

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].applyPlugin`






#### common.buildSchemes.[object].author

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].author`






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






#### common.buildSchemes.[object].bundleAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].bundleAssets`






#### common.buildSchemes.[object].bundleIsDev

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].bundleIsDev`






#### common.buildSchemes.[object].certificateProfile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].certificateProfile`






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






#### common.buildSchemes.[object].deploy

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploy`





##### common.buildSchemes.[object].deploy.type

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploy.type`







#### common.buildSchemes.[object].deploymentTarget

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].deploymentTarget`






#### common.buildSchemes.[object].description

type: `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

path:
`renative.json/#/common.buildSchemes.[object].description`

examples:

```json
"description": "This app does awesome things"
```





#### common.buildSchemes.[object].devServerHost

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].devServerHost`






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






#### common.buildSchemes.[object].enableHermes

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].enableHermes`






#### common.buildSchemes.[object].enabled

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].enabled`






#### common.buildSchemes.[object].engine

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].engine`






#### common.buildSchemes.[object].entitlements

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].entitlements`






#### common.buildSchemes.[object].entryFile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].entryFile`






#### common.buildSchemes.[object].environment

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].environment`






#### common.buildSchemes.[object].excludedFeatures

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].excludedFeatures`






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





##### common.buildSchemes.[object].exportOptions.compileBitcode

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.compileBitcode`






##### common.buildSchemes.[object].exportOptions.method

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.method`






##### common.buildSchemes.[object].exportOptions.provisioningProfiles

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.provisioningProfiles`






##### common.buildSchemes.[object].exportOptions.signingCertificate

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.signingCertificate`






##### common.buildSchemes.[object].exportOptions.signingStyle

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.signingStyle`






##### common.buildSchemes.[object].exportOptions.teamID

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.teamID`






##### common.buildSchemes.[object].exportOptions.uploadBitcode

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.uploadBitcode`






##### common.buildSchemes.[object].exportOptions.uploadSymbols

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].exportOptions.uploadSymbols`







#### common.buildSchemes.[object].ext

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ext`






#### common.buildSchemes.[object].firebaseId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].firebaseId`






#### common.buildSchemes.[object].gradle.properties

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].gradle.properties`






#### common.buildSchemes.[object].id

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].id`






#### common.buildSchemes.[object].ignoreLogs

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ignoreLogs`






#### common.buildSchemes.[object].ignoreWarnings

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].ignoreWarnings`






#### common.buildSchemes.[object].includedFeatures

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].includedFeatures`






#### common.buildSchemes.[object].includedFonts

type: `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

path:
`renative.json/#/common.buildSchemes.[object].includedFonts`

examples:

```json
"includedFonts": [
  "*"
]

"includedFonts": [
  "TimeBurner",
  "Entypo"
]
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






#### common.buildSchemes.[object].keyPassword

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].keyPassword`






#### common.buildSchemes.[object].license

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].license`






#### common.buildSchemes.[object].minSdkVersion

type: `integer`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].minSdkVersion`






#### common.buildSchemes.[object].multipleAPKs

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].multipleAPKs`






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






##### common.buildSchemes.[object].orientationSupport.tab

type: `array`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].orientationSupport.tab`







#### common.buildSchemes.[object].package

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].package`






#### common.buildSchemes.[object].pagesDir

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].pagesDir`






#### common.buildSchemes.[object].permissions

type: `array`

> DEPRECATED in favor of includedPermissions

path:
`renative.json/#/common.buildSchemes.[object].permissions`






#### common.buildSchemes.[object].plist

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].plist`






#### common.buildSchemes.[object].provisionProfileSpecifier

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisionProfileSpecifier`






#### common.buildSchemes.[object].provisioningProfiles

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisioningProfiles`






#### common.buildSchemes.[object].provisioningStyle

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].provisioningStyle`






#### common.buildSchemes.[object].runScheme

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].runScheme`






#### common.buildSchemes.[object].runtime

type: `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

path:
`renative.json/#/common.buildSchemes.[object].runtime`

examples:

```json
"runtime": {
  "someRuntimeProperty": "foo"
}
```





#### common.buildSchemes.[object].scheme

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].scheme`






#### common.buildSchemes.[object].sdk

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].sdk`






#### common.buildSchemes.[object].signingConfig

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].signingConfig`






#### common.buildSchemes.[object].splashScreen

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].splashScreen`






#### common.buildSchemes.[object].storeFile

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].storeFile`






#### common.buildSchemes.[object].storePassword

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].storePassword`






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






#### common.buildSchemes.[object].teamID

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].teamID`






#### common.buildSchemes.[object].teamIdentifier

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].teamIdentifier`






#### common.buildSchemes.[object].testFlightId

type: `string`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].testFlightId`






#### common.buildSchemes.[object].timestampAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].timestampAssets`






#### common.buildSchemes.[object].title

type: `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

path:
`renative.json/#/common.buildSchemes.[object].title`

examples:

```json
"title": "Awesome App"
```





#### common.buildSchemes.[object].universalApk

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].universalApk`






#### common.buildSchemes.[object].versionedAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].versionedAssets`






#### common.buildSchemes.[object].webpackConfig

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].webpackConfig`






#### common.buildSchemes.[object].xcodeproj

type: `object`

TODO description

path:
`renative.json/#/common.buildSchemes.[object].xcodeproj`







---
### common.description

type: `string`

General description of your app. This prop will be injected to actual projects where description field is applicable

path:
`renative.json/#/common.description`

examples:

```json
"description": "This app does awesome things"
```





---
### common.excludedPlugins

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





---
### common.ext

type: `object`

TODO description

path:
`renative.json/#/common.ext`






---
### common.id

type: `string`

TODO description

path:
`renative.json/#/common.id`






---
### common.ignoreLogs

type: `boolean`

TODO description

path:
`renative.json/#/common.ignoreLogs`






---
### common.ignoreWarnings

type: `boolean`

TODO description

path:
`renative.json/#/common.ignoreWarnings`






---
### common.includedFonts

type: `array`

Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all

path:
`renative.json/#/common.includedFonts`

examples:

```json
"includedFonts": [
  "*"
]

"includedFonts": [
  "TimeBurner",
  "Entypo"
]
```





---
### common.includedPermissions

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





---
### common.includedPlugins

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





---
### common.license

type: `string`

TODO description

path:
`renative.json/#/common.license`






---
### common.permissions

type: `array`

> DEPRECATED in favor of includedPermissions

path:
`renative.json/#/common.permissions`






---
### common.runtime

type: `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

path:
`renative.json/#/common.runtime`

examples:

```json
"runtime": {
  "someRuntimeProperty": "foo"
}
```





---
### common.splashScreen

type: `boolean`

TODO description

path:
`renative.json/#/common.splashScreen`






---
### common.timestampAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.timestampAssets`






---
### common.title

type: `string`

Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website

path:
`renative.json/#/common.title`

examples:

```json
"title": "Awesome App"
```





---
### common.versionedAssets

type: `boolean`

TODO description

path:
`renative.json/#/common.versionedAssets`









---
## crypto

type: `object`

This prop enables automatic encryp and decrypt of sensitive information in your project

path:
`renative.json/#/crypto`





---
### crypto.decrypt

type: `object`

TODO description

path:
`renative.json/#/crypto.decrypt`





#### crypto.decrypt.source

type: `string`

Location of encrypted file in your project used as source of decryption into your workspace

path:
`renative.json/#/crypto.decrypt.source`

examples:

```json
"source": "PROJECT_HOME/ci/privateConfigs.enc"
```






---
### crypto.encrypt

type: `object`

TODO description

path:
`renative.json/#/crypto.encrypt`





#### crypto.encrypt.dest

type: `string`

Location of encrypted file in your project used as destination of encryption from your workspace

path:
`renative.json/#/crypto.encrypt.dest`

examples:

```json
"dest": "PROJECT_HOME/ci/privateConfigs.enc"
```









---
## currentTemplate

type: `string`

TODO description

path:
`renative.json/#/currentTemplate`








---
## defaultTargets

type: `object`

List of default target simulators and emulators

path:
`renative.json/#/defaultTargets`

examples:

```json
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
```







---
## defaults

type: `object`

TODO description

path:
`renative.json/#/defaults`





---
### defaults.ports

type: `object`

TODO description

path:
`renative.json/#/defaults.ports`






---
### defaults.schemes

type: `object`

TODO description

path:
`renative.json/#/defaults.schemes`






---
### defaults.supportedPlatforms

type: `array`

TODO description

path:
`renative.json/#/defaults.supportedPlatforms`






---
### defaults.targets

type: `object`

TODO description

path:
`renative.json/#/defaults.targets`






---
### defaults.template

type: `string`

TODO description

path:
`renative.json/#/defaults.template`









---
## description

type: `string`

TODO description

path:
`renative.json/#/description`








---
## enableAnalytics

type: `boolean`

TODO description

path:
`renative.json/#/enableAnalytics`








---
## ext

type: `object`

TODO description

path:
`renative.json/#/ext`








---
## extend

type: `string`

TODO description

path:
`renative.json/#/extend`








---
## hidden

type: `boolean`

TODO description

path:
`renative.json/#/hidden`








---
## id

type: `string`

TODO description

path:
`renative.json/#/id`








---
## integrations

type: `object`

TODO description

path:
`renative.json/#/integrations`








---
## isWrapper

type: `boolean`

TODO description

path:
`renative.json/#/isWrapper`








---
## paths

type: `object`

TODO description

path:
`renative.json/#/paths`





---
### paths.appConfigsDir

type: `string`

TODO description

path:
`renative.json/#/paths.appConfigsDir`






---
### paths.entryDir

type: `string`

TODO description

path:
`renative.json/#/paths.entryDir`






---
### paths.platformAssetsDir

type: `string`

TODO description

path:
`renative.json/#/paths.platformAssetsDir`






---
### paths.platformBuildsDir

type: `string`

TODO description

path:
`renative.json/#/paths.platformBuildsDir`






---
### paths.pluginTemplates

type: `object`

TODO description

path:
`renative.json/#/paths.pluginTemplates`






---
### paths.projectConfigDir

type: `string`

TODO description

path:
`renative.json/#/paths.projectConfigDir`









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




---
### permissions.android

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





---
### permissions.ios

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








---
## platforms

type: `object`

TODO description

path:
`renative.json/#/platforms`





---
### platforms.android

type: `undefined`

TODO description

path:
`renative.json/#/platforms.android`






---
### platforms.androidtv

type: `undefined`

TODO description

path:
`renative.json/#/platforms.androidtv`






---
### platforms.androidwear

type: `undefined`

TODO description

path:
`renative.json/#/platforms.androidwear`






---
### platforms.chromecast

type: `undefined`

TODO description

path:
`renative.json/#/platforms.chromecast`






---
### platforms.firefoxos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.firefoxos`






---
### platforms.firefoxtv

type: `undefined`

TODO description

path:
`renative.json/#/platforms.firefoxtv`






---
### platforms.ios

type: `undefined`

TODO description

path:
`renative.json/#/platforms.ios`






---
### platforms.kaios

type: `undefined`

TODO description

path:
`renative.json/#/platforms.kaios`






---
### platforms.macos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.macos`






---
### platforms.tizen

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizen`






---
### platforms.tizenmobile

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizenmobile`






---
### platforms.tizenwatch

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tizenwatch`






---
### platforms.tvos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.tvos`






---
### platforms.web

type: `undefined`

TODO description

path:
`renative.json/#/platforms.web`






---
### platforms.webos

type: `undefined`

TODO description

path:
`renative.json/#/platforms.webos`






---
### platforms.windows

type: `undefined`

TODO description

path:
`renative.json/#/platforms.windows`









---
## pluginTemplates

type: `object`

TODO description

path:
`renative.json/#/pluginTemplates`








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




---
### plugins.[object].android

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android`





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






#### plugins.[object].android.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.app/build.gradle`






#### plugins.[object].android.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].android.applyPlugin`






#### plugins.[object].android.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.build.gradle`






#### plugins.[object].android.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].android.enabled`






#### plugins.[object].android.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.gradle.properties`






#### plugins.[object].android.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].android.package`






#### plugins.[object].android.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].android.projectName`






#### plugins.[object].android.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].android.skipImplementation`






#### plugins.[object].android.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].android.webpackConfig`







---
### plugins.[object].androidtv

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv`





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






#### plugins.[object].androidtv.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.app/build.gradle`






#### plugins.[object].androidtv.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.applyPlugin`






#### plugins.[object].androidtv.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.build.gradle`






#### plugins.[object].androidtv.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.enabled`






#### plugins.[object].androidtv.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.gradle.properties`






#### plugins.[object].androidtv.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.package`






#### plugins.[object].androidtv.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.projectName`






#### plugins.[object].androidtv.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.skipImplementation`






#### plugins.[object].androidtv.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidtv.webpackConfig`







---
### plugins.[object].androidwear

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear`





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






#### plugins.[object].androidwear.app/build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.app/build.gradle`






#### plugins.[object].androidwear.applyPlugin

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.applyPlugin`






#### plugins.[object].androidwear.build.gradle

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.build.gradle`






#### plugins.[object].androidwear.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.enabled`






#### plugins.[object].androidwear.gradle.properties

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.gradle.properties`






#### plugins.[object].androidwear.package

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.package`






#### plugins.[object].androidwear.projectName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.projectName`






#### plugins.[object].androidwear.skipImplementation

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.skipImplementation`






#### plugins.[object].androidwear.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].androidwear.webpackConfig`







---
### plugins.[object].chromecast

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].chromecast`





#### plugins.[object].chromecast.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].chromecast.enabled`






#### plugins.[object].chromecast.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].chromecast.webpackConfig`







---
### plugins.[object].enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].enabled`






---
### plugins.[object].firefox

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].firefox`





#### plugins.[object].firefox.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].firefox.enabled`






#### plugins.[object].firefox.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].firefox.webpackConfig`







---
### plugins.[object].ios

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios`





#### plugins.[object].ios.Podfile

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.Podfile`






#### plugins.[object].ios.appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods`





##### plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`






##### plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didFinishLaunchingWithOptions`






##### plugins.[object].ios.appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceive`






##### plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didReceiveRemoteNotification`






##### plugins.[object].ios.appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegister`






##### plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`






##### plugins.[object].ios.appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.open`






##### plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`







#### plugins.[object].ios.appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateImports`






#### plugins.[object].ios.appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.appDelegateMethods`






#### plugins.[object].ios.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].ios.enabled`






#### plugins.[object].ios.plist

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.plist`






#### plugins.[object].ios.podName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].ios.podName`






#### plugins.[object].ios.podNames

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].ios.podNames`






#### plugins.[object].ios.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.webpackConfig`






#### plugins.[object].ios.xcodeproj

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].ios.xcodeproj`







---
### plugins.[object].macos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].macos`





#### plugins.[object].macos.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].macos.enabled`






#### plugins.[object].macos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].macos.webpackConfig`







---
### plugins.[object].no-npm

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].no-npm`






---
### plugins.[object].npm

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].npm`






---
### plugins.[object].pluginDependencies

type: `array,null`

TODO description

path:
`renative.json/#/plugins.[object].pluginDependencies`






---
### plugins.[object].props

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].props`






---
### plugins.[object].source

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].source`






---
### plugins.[object].tizen

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tizen`





#### plugins.[object].tizen.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].tizen.enabled`






#### plugins.[object].tizen.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tizen.webpackConfig`







---
### plugins.[object].tvos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos`





#### plugins.[object].tvos.Podfile

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.Podfile`






#### plugins.[object].tvos.appDelegateApplicationMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods`





##### plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFailToRegisterForRemoteNotificationsWithError`






##### plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didFinishLaunchingWithOptions`






##### plugins.[object].tvos.appDelegateApplicationMethods.didReceive

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceive`






##### plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didReceiveRemoteNotification`






##### plugins.[object].tvos.appDelegateApplicationMethods.didRegister

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegister`






##### plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.didRegisterForRemoteNotificationsWithDeviceToken`






##### plugins.[object].tvos.appDelegateApplicationMethods.open

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.open`






##### plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateApplicationMethods.supportedInterfaceOrientationsFor`







#### plugins.[object].tvos.appDelegateImports

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateImports`






#### plugins.[object].tvos.appDelegateMethods

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.appDelegateMethods`






#### plugins.[object].tvos.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].tvos.enabled`






#### plugins.[object].tvos.plist

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.plist`






#### plugins.[object].tvos.podName

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].tvos.podName`






#### plugins.[object].tvos.podNames

type: `array`

TODO description

path:
`renative.json/#/plugins.[object].tvos.podNames`






#### plugins.[object].tvos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.webpackConfig`






#### plugins.[object].tvos.xcodeproj

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].tvos.xcodeproj`







---
### plugins.[object].version

type: `string`

TODO description

path:
`renative.json/#/plugins.[object].version`






---
### plugins.[object].web

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].web`





#### plugins.[object].web.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].web.enabled`






#### plugins.[object].web.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].web.webpackConfig`







---
### plugins.[object].webos

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].webos`





#### plugins.[object].webos.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].webos.enabled`






#### plugins.[object].webos.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].webos.webpackConfig`







---
### plugins.[object].webpack

type: `object`

> DEPRECATED in favour of `webpackConfig`

path:
`renative.json/#/plugins.[object].webpack`






---
### plugins.[object].webpackConfig

type: `object`

Allows you to configure webpack bahaviour per each individual plugin

path:
`renative.json/#/plugins.[object].webpackConfig`





#### plugins.[object].webpackConfig.moduleAliases

type: `boolean,object`

TODO description

path:
`renative.json/#/plugins.[object].webpackConfig.moduleAliases`






#### plugins.[object].webpackConfig.modulePaths

type: `boolean,object`

TODO description

path:
`renative.json/#/plugins.[object].webpackConfig.modulePaths`







---
### plugins.[object].windows

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].windows`





#### plugins.[object].windows.enabled

type: `boolean`

TODO description

path:
`renative.json/#/plugins.[object].windows.enabled`






#### plugins.[object].windows.webpackConfig

type: `object`

TODO description

path:
`renative.json/#/plugins.[object].windows.webpackConfig`










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








---
## runtime

type: `object`

This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code

path:
`renative.json/#/runtime`

examples:

```json
"runtime": {
  "someRuntimeProperty": "foo"
}
```







---
## sdks

type: `object`

List of SDK locations used by RNV. This property is usually located in your `WORKSPACE/renative.json`

path:
`renative.json/#/sdks`

examples:

```json
"sdks": {
  "ANDROID_SDK": "/Users/paveljacko/Library/Android/sdk",
  "ANDROID_NDK": "/Users/paveljacko/Library/Android/sdk/ndk-bundle",
  "TIZEN_SDK": "/Users/paveljacko/tizen-studio",
  "WEBOS_SDK": "/opt/webOS_TV_SDK",
  "KAIOS_SDK": "/Applications/Kaiosrt.app"
}
```







---
## tasks

type: `object`

TODO description

path:
`renative.json/#/tasks`








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







