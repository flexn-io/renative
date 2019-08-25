# Documentation for ReNative Config

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_configuration.png?raw=true" width=50 height=50 />

## JSON Configurations

App configs are ReNative compliant app configuration folders which follow prescribed structure

Applies for:

- `renative.json` - standard config (commited to git)
- `renative.private.json` - config containing sensitive values (ignored from git)
- `renative.local.json` - config containing local values (ignored from git)
- `renative.build.json` - final merged config located in `./platformBuilds/renative.build.json` (ignored from git)
- `renative.runtime.json` - final merged config available to app runtime located in `./platformBuilds/renative.runtime.json` (ignored from git)
- `renative.template.json` - config for renative template projects used to generate new projects (commited to git)
- `renative.plugin.json` - config for renative plugin projects (commited to git)

## Structure

`DEV_PATH_X`

    .
    └── [PROJECT_NAME]
        ├── appConfigs                 
        │   └── [APP_ID]              
        │       ├── renative.json
        │       └── renative.local.json             
        ├── platformBuilds              
        │   └── renative.build.json
        ├── renative.json
        └── renative.local.json

`~/.rnv`

    .
    └── [PROJECT_NAME]
        ├── appConfigs                 
        │   └── [APP_ID]              
        │       ├── renative.json
        │       └── renative.private.json             
        ├── renative.json
        └── renative.private.json                        

## Merges

Following is the order of merges of various renative configs (if present) producing final `platformAssets/renative.json` config file.

`~/.rnv/renative.json`</br>
⬇️
`~/.rnv/renative.private.json`</br>
⬇️
`~/.rnv/renative.local.json`</br>
⬇️
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
`./appConfigs/[APP_ID_BASE]/renative.json`</br>
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



- `./platformBuilds/renative.build.json`

- `./platformAssets/renative.runtime.json` - (subset of renative config available at runtime and packaged with final app)


## Config Spec

CONFIG_ROOT

```json
{
  "env": {},
  "definitions": {},
  "profiles": {},
  "isWrapper": true,
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

### Common Props

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
  "port": 1111
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
    "projectConfigFolder": ""
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



### Platform Specific Props


#### iOS Props

IOS_COMMON_PROPS

```json
{
  "appDelegateImports": [],
  "appDelegateMethods": {},
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
  "scheme": "",
  "entitlements": {},
  "orientationSupport": {
    "phone": [],
    "tab": []
  },
}
```

#### Android Props

ANDROID_COMMON_PROPS

```json
{
  "gradle.properties": {},
  "AndroidManifest": {},
  "BuildGradle": {},
  "AppBuildGradle": {},
  "implementation": "",
}
```

ANDROID_PLUGIN_PROPS

```json
{
  "path": "",
  "package": ""
}
```

ANDROID_CONFIG_PROPS

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
  "keyPassword": ""
}
```

#### Web Props

WEB_COMMON_PROPS

```json
{

}
```

WEB_PLUGIN_PROPS

```json
{

}
```

WEB_CONFIG_PROPS

```json
{
  "environment": "",
  "webpackConfig": {
    "devServerHost": "",
    "customScripts": []
  }
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
  "appName": "",
  "package": "",
  "certificateProfile": ""
}
```

## Config Values Overrides


There are 3 levels of override entry objects for your props to fine-tune your app config:

1) `.common` //Applies for all platforms + all schemes
2) `.platforms.YOUR_PLATFORM` //Applies specific platforms + all schemes
3) `.platforms.YOUR_PLATFORM.buildSchemes.YOUR_SCHEME` //Applies for specific platform + specific scheme

Example:

```json
{
  "common": {
    "MY_PROP": "Value1"
  },
  "platforms": {
    "ios": {
      "MY_PROP": "Value2 overrides Value1",
      "buildSchemes": {
        "debug": {
          "MY_PROP": "Value3 overrides Value 2"
        }
      }
    }
  }
}
```

Override Rules for json props:

- `Strings` => Replaced
- `Numbers` => Replaced
- `Arrays` => Replaced
- `Objects` => Merged by top level (not deep merge)

Example:
https://github.com/pavjacko/renative/blob/develop/packages/renative-template-hello-world/appConfigs/helloWorld/renative.json#L4

Will be overridden by:
https://github.com/pavjacko/renative/blob/develop/packages/renative-template-hello-world/appConfigs/helloWorld/renative.json#L59


Output config will be decorated with few extra props to help with debugging:

```
{
  "_timestamp": "",
  "_mergeSources": []
}
```


#### Build Flavours

You can configure different app ID, Title etc. with buildScheme field in you appConfig file.

Example:

```
"buildSchemes": {
  "debug": {
    "id": "renative.helloworld.debug",
    "runScheme": "Debug",
    "bundleAssets": false,
    "bundleIsDev": true
  },
  "release": {
    "id": "renative.helloworld.release",
    "runScheme": "Release",
    "bundleAssets": true,
    "bundleIsDev": false
  }
}
```

this will allow you to build 2 separate iOS apps with slightly different configurations:

`$ rnv run -p ios -s debug` (`-s debug` is DEFAULT option so you don't have to add it every time)

and

`$ rnv run -p ios -s release`
