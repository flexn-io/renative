# API Reference for Config


App configs are ReNative compliant app configuration folders which follow prescribed structure

## Structure

    .
    └── clientX
        ├── assets
        │   ├── ios
        │   ├── android
        │   └── web
        ├── plugins
        │   └── some-plugin
        │       └── builds
        │            ├── android@release
        │            │   └── fileToBeInjectedInReleaseMode.txt
        │            └── android@debug
        │                └── fileToBeInjectedInDebugMode.txt
        ├── builds
        │   ├── android@release
        │   │   └── fileToBeInjectedInReleaseMode.txt
        │   └── android@debug
        │       └── fileToBeInjectedInDebugMode.txt
        └── config.json


## Config.json       

Override rules:

- https://github.com/pavjacko/renative/tree/develop#config-values-overrides


## Config Spec

EXTRA_PROPS

```json
{
  ...ANY_VALUES
}
```

PLUGIN_PROPS

```json
{
  "version": "",
  "no-npm": false,
  "ios": {
    ...IOS_PLUGIN_PROPS
    ...IOS_COMMON_PROPS
  },
  "android": {
    ...ANDROID_PLUGIN_PROPS
    ...ANDROID_COMMON_PROPS
  },
  "tizen": {
    ...TIZEN_PLUGIN_PROPS
    ...TIZEN_COMMON_PROPS
  },
  "webpack": {
    "modulePaths": false,
    "moduleAliases": {}
  }
}
```

IOS_COMMON_PROPS

```json
{
  "appDelegateImports": [],
  "appDelegateMethods": {},
  "plist": {}
}
```

IOS_PLUGIN_PROPS

```json
{
  "reactSubSpecs": [],
  "appDelegateMethods": {},
  "podName": "",
  "path": ""
}
```

IOS_CONFIG_PROPS

```json
{
  "teamID": "",
  "deploymentTarget": "",
  "provisioningStyle": "",
  "systemCapabilities": {},
  "entitlements": {}
}
```

ANDROID_COMMON_PROPS

```json
{
  "gradle.properties": {},
  "AndroidManifest": {}
}
```

ANDROID_PLUGIN_PROPS

```json
{
  "gradle.properties": {},
  "AndroidManifest": {}
}
```

ANDROID_CONFIG_PROPS

```json
{
  "universalApk": false,
  "multipleAPKs": false,
  "minSdkVersion": 21,
  "signingConfig": ""
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
  "backgroundColor": ""
}
```

BUILD_SCHEMES

```json
{
  "ios": {
    ...COMMON_PROPS
    ...IOS_COMMON_PROPS
    ...EXTRA_PROPS
  },
  "android": {
    ...COMMON_PROPS
    ...ANDROID_COMMON_PROPS
    ...EXTRA_PROPS
  },
}
```

PATH_PROPS

```json
{
    "globalConfigFolder": "",
    "appConfigsFolder": "",
    "platformTemplatesFolder": "",
    "entryFolder": "./",
    "platformAssetsFolder": "",
    "platformBuildsFolder": "",
    "projectPlugins": "",
    "projectConfigFolder": ""
}
```


ROOT_CONFIG

```json
{
  "env": {},
  "isWrapper": true,
  "paths": {
    ...PATH_PROPS
  },
  "defaults": {
    "ports": {},
    "template": "",
    "supportedPlatforms": [],
    "schemes": {},
    "targets": {}
  },
  "plugins": {
    "[PLUGIN_KEY]": {
      ...PLUGIN_PROPS
    }
  },
  "permissions": {
    "ios": {},
    "android": {}
  },
  "common": {
    ...COMMON_PROPS
    ...EXTRA_PROPS
    "buildSchemes": {
      ...BUILD_SCHEMES
    },
  },
  "platforms": {
    "ios": {
      ...COMMON_PROPS
      ...EXTRA_PROPS
      ...IOS_COMMON_PROPS
      "buildSchemes": {
        ...BUILD_SCHEMES
      }
    },
    "android": {
      ...COMMON_PROPS
      ...EXTRA_PROPS
      ...ANDROID_COMMON_PROPS
      "buildSchemes": {
        ...BUILD_SCHEMES
      }
    }
  },
  ...EXTRA_PROPS
}
```

## Files / Assets

Override Rules:

- https://github.com/pavjacko/renative/tree/develop#platform-builds-overrides
- https://github.com/pavjacko/renative/tree/develop#platform-assets-overrides


#### ✅ What to add to appConfig

- icon assets
- splash screens
- runtime configs

#### ❌ What NOT to add to appConfig

- passwords
- production keys
- keystores, p12
- googleservice-info.json
- fabric keys
- any other sensitive data
