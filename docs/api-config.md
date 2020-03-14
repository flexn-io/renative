---
id: api-config
title: renative.json API Reference
sidebar_label: renative.json
---


## Config Spec

CONFIG_ROOT

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

#### env

Define environment variables

#### hidden

Hide app config from available options in CLI. Used mostly to hide base configs other would inherit from


#### definitions

Define injectable props to be reused across config file


#### sdks

Define paths to your SDK Configurations

#### workspaceID

Current workspace this project belongs to

#### paths

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

#### defaults

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
        ]
    },
}
```

#### enableAnalytics

Enable or disable sending analytics to improve ReNative

#### plugins

Plugin configurations

#### permissions

Define list of permissions to be used in project

#### common

Common properties inherited for every platform

#### platforms

Platform specififc configurations

#### runtime

Special runtime injection object to be available for runtime code via `platformAssets/runtime.json`

## Common Props

PLUGIN_PROPS

```json
{
  "version": "",
  "no-npm": false,
  "enabled": true,
  "[PLATFORM]": {
    ...[PLATFORM]_PLUGIN_PROPS
    ...[PLATFORM]_COMMON_PROPS
  },
  "webpack": {
    "modulePaths": false,
    "moduleAliases": {}
  }
}
```

COMMON_PROPS

```json
{
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
```

BUILD_SCHEME_PROPS

```json
{
  "buildSchemes": {
    "[BUILD_SCHEME_KEY]": {
      "[PLATFORM]": {
        ...COMMON_PROPS
        ...[PLATFORM]_COMMON_PROPS
      }
    }
  }
}
```

PATH_PROPS

```json
{
    "appConfigsDir": "",
    "appConfigsDirs": "",
    "platformTemplatesDir": "",
    "entryDir": "",
    "platformAssetsDir": "",
    "platformBuildsDir": ""
}
```

SDK_PROPS

```json
{
    "ANDROID_SDK": "",
    "ANDROID_NDK": "",
    "IOS_SDK": "",
    "TIZEN_SDK": "",
    "WEBOS_SDK": "",
    "KAIOS_SDK": ""
}
```

DEFAULTS_PROPS

```json
{
  "template": "",
  "supportedPlatforms": ["[PLATFORM]"],
  "schemes": {},
  "targets": {
    "[PLATFORM]": ""
  }
}
```



## Platform Specific Props

Following props are only accepted per specific platform


## iOS Props

### iOS Common Props


```json
{
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
```

### iOS Plugin Props

```json
{
  "appDelegateMethods": {},
  "podName": "",
  "path": ""
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
  },
}
```

## Android Props

### Android Common Props

```json
{
  "gradle.properties": {},
  "AndroidManifest": {},
  "BuildGradle": {},
  "AppBuildGradle": {},
  "implementation": "",
}
```

### Android Plugin Props

```json
{
  "path": "",
  "package": ""
}
```

### Android Config Props

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

## Web Props

### Web Common Props

```json
{

}
```

### Web Plugin Props

```json
{

}
```

### Web Config Props

```json
{
  "environment": "",
  "webpackConfig": {
    "devServerHost": "",
    "customScripts": []
  }
}
```


## Tizen Props

### Tizen Common Props

```json
{

}
```

### Tizen Plugin Props

```json
{

}
```

### Tizen Config Props

```json
{
  "appName": "",
  "package": "",
  "certificateProfile": ""
}
```
