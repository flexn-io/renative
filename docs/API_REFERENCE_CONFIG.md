# API Reference for Config


App configs are ReNative compliant app configuration folders which follow prescribed structure

## Structure

`DEV_PATH_X`

    .
    └── ProjectX
        ├── appConfigs                 
        │   └── AppX              
        │       ├── renative.json
        │       └── renative.local.json             
        ├── platformAssets              
        │   └── renative.json
        ├── renative.json
        └── renative.local.json

`~/.rnv`

    .
    └── ProjectX
        ├── appConfigs                 
        │   └── AppX              
        │       ├── renative.json
        │       └── renative.private.json             
        ├── renative.json
        └── renative.private.json                        

## Merges

Following is the order of merges of various renative configs (if present) producing final `platformAssets/renative.json` config file.


`./renative.json`</br>
⬇️
`./renative.private.json`</br>
⬇️
`./renative.local.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/renative.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/renative.private.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/renative.local.json`</br>
⬇️
`./appConfigs/[APP_ID]/renative.json`</br>
⬇️
`./appConfigs/[APP_ID]/renative.private.json`</br>
⬇️
`./appConfigs/[APP_ID]/renative.local.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/renative.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/renative.private.json`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/renative.local.json`</br>
`platformAssets/renative.json`


## Config Spec

Applies for:

`renative.json`, `renative.private.json`, `renative.local.json`


CONFIG_ROOT

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

### Common Props

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



### Platform Specific Props


#### iOS Props

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

#### Android Props

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

#### Tizen Props

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
