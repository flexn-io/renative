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

EXTRA_PROPS

```
{
  ...ANY_VALUES
}
```

PLUGIN_PROPS

```
{

}
```

IOS_PROPS

```
{
  "teamID": "",
  "deploymentTarget": "",
  "provisioningStyle": "",
  "systemCapabilities": {},
  "entitlements": {}
}
```

ANDROID_PROPS

```
{
  "universalApk": false,
  "multipleAPKs": false,
  "minSdkVersion": 21,
  "signingConfig": ""
}
```

COMMON_PROPS

```
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

```
{
  "ios": {
    ...COMMON_PROPS
    ...IOS_PROPS
    ...EXTRA_PROPS
  },
  "android": {
    ...COMMON_PROPS
    ...ANDROID_PROPS
    ...EXTRA_PROPS
  },
}
```

PATH_PROPS

```
{
    "globalConfigFolder": "~/.rnv",
    "appConfigsFolder": "./appConfigs",
    "platformTemplatesFolder": "RNV_HOME/platformTemplates",
    "entryFolder": "./",
    "platformAssetsFolder": "./platformAssets",
    "platformBuildsFolder": "./platformBuilds",
    "projectPlugins": "./projectConfig/plugins",
    "projectConfigFolder": "./projectConfig"
}
```


ROOT_CONFIG

```
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
    "schemes": {}
  },
  "plugins": {
    [PLUGIN_ID]: {
      ...PLUGIN_PROPS
    }
  },
  "permissions": {
    "ios": {},
    "android": {}
  },
  "common": {
    ...COMMON_PROPS
    buildSchemes: {
      ...BUILD_SCHEMES
    },
    ...EXTRA_PROPS
  },
  "platforms": {
    "ios": {
      ...COMMON_PROPS
      ...IOS_PROPS
      buildSchemes: {
        ...BUILD_SCHEMES
      }
    },
    "android": {
      ...COMMON_PROPS
      ...ANDROID_PROPS
      buildSchemes: {
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
