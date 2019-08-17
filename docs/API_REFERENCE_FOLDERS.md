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


# Renative Config Spec


```json
{
  "env": {},
  "isWrapper": true,
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
  }
}
```

# Common Props

PLUGIN_PROPS

```json
{
  "version": "",
  "no-npm": false,
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
  "backgroundColor": ""
}
```

BUILD_SCHEME_PROPS

```json
{
  "buildSchemes": {
    "[BUILD_SHEME_KEY]": {
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
    "globalConfigFolder": "",
    "appConfigsFolder": "",
    "platformTemplatesFolder": "",
    "entryFolder": "",
    "platformAssetsFolder": "",
    "platformBuildsFolder": "",
    "projectPlugins": "",
    "projectConfigFolder": ""
}
```

DEFAULTS_PROPS

```json
{
  "ports": {
    "[PLATFORM]": 1111
  },
  "template": "",
  "supportedPlatforms": ["[PLATFORM]"],
  "schemes": {},
  "targets": {
    "[PLATFORM]": ""
  }
}
```



# Platform Specific Props


## iOS Props

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

## Android Props

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

## Tizen Props

TIZEN_COMMON_PROPS

```json
{

}
```

TIZEN_PLUGIN_PROPS

```json
{

}
```

TIZEN_CONFIG_PROPS

```json
{

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
