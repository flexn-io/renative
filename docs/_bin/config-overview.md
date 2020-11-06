---
id: config-overview
title: Config Overview
sidebar_label: Overview
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

Legend:

-   `[PLATFORM]` - specific platform key like `ios`, `android`, `web`, etc..
-   `[APP_ID]` - name of your folder in `./appConfigs` which contains specific `renative.json` file
-   `[PROJECT_NAME]` - `name` field in the root `package.json` file of your project
-   `[PLUGIN_ID]` - `key` of the plugin defined in one of the `renative.json` files
-   `[WORKSPACE_PATH]` - `path` to your global workspace (`~/.rnv` by default) where local and sensitive information is stored.
-   `[PROJECT_PATH]` - `path` to working copy of your project.
-   `[RNV_PATH]` - `path` to core renative SDK.



## Overview

Renative configs are one of the most powerful feature of ReNative platform.

Their format is `renative.*.json`

They form the bedrock of ReNative "DNA" philosophy.

When you create new project `rnv new` there is only one single file generated `renative.json`.

Just like the DNA it contains core information about your project, structure, templates, platforms etc.

Once you trigger your first `rnv ...` command this file is used to generate everything on demand

Just the few things you can configure and override with `renative.*.json` files:

- Project templates
- Platforms
- Build schemes
- Plugins
- Deployments
- Overrides

and more

## Config Locations


`[PROJECT_PATH]`

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

`[WORKSPACE_PATH]`

    .
    └── [PROJECT_NAME]
        ├── appConfigs
        │   └── [APP_ID]
        │       ├── renative.json
        │       └── renative.private.json
        ├── renative.json
        └── renative.private.json



## Config Merges

ReNative always merges all relevant renative configs into one single build config.


Following is the order of merges of various renative configs (if present) producing final `platformAssets/renative.json` config file.

⬇️
`[RNV_PATH]/projectTemplates/renative.templates.json`</br>
⬇️
`[RNV_PATH]/pluginTemplates/renative.plugins.json`</br>
⬇️
`[WORKSPACE_PATH]/renative.json`</br>
⬇️
`[WORKSPACE_PATH]/renative.private.json`</br>
⬇️
`[WORKSPACE_PATH]/renative.local.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/renative.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/renative.private.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/renative.local.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/renative.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/renative.private.json`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/renative.local.json`</br>
⬇️
`[PROJECT_PATH]/renative.json`</br>
⬇️
`[PROJECT_PATH]/renative.private.json`</br>
⬇️
`[PROJECT_PATH]/renative.local.json`</br>
⬇️
`[PROJECT_PATH]/appConfigs/[APP_ID]/renative.json`</br>
⬇️
`[PROJECT_PATH]/appConfigs/[APP_ID]/renative.private.json`</br>
⬇️
`[PROJECT_PATH]/appConfigs/[APP_ID]/renative.local.json`</br>




## Dynamic Injectors

You can inject varietry of different dynamic props via `renative.*.json` configs

```
{{INJECTOR}}
```


### configProps

Any property in `renative.*.json` can be injected into build file.

```json
{
  "common": {
     "id": "com.example.app"
  }
}
```

Inject example of `myInject.txt`:

```
Inject app ID here: {{{{configProps.id}}}}
```

### runtimeProps

runtimeProps are special properties generated during each rnv run.

Example:

```json
{
  "common": {
     "timestamp": "{{runtimeProps.timestamp}}"
  }
}
```

Currently supported runtime properties:

- scheme
- appConfing
- engine
- localhost
- timestamp
- appDir
- appId
- isWrapper
- missingEnginePlugins
- targetUDID
- target
- shouldOpenBrowser
- port


### props

you can abstract complex `renative.*.json` plugin configuration via props inject mechanism

Example plugin definition:

```json
"react-native-fbsdk": {
    "props": {
        "APP_ID": "",
        "APP_NAME": ""
    },
    "ios": {
        "podName": "react-native-fbsdk",
        "appDelegateImports": [
            "FBSDKCoreKit"
        ],
        "appDelegateMethods": {
            "application": {
                "didFinishLaunchingWithOptions": [
                    "ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)"
                ],
                "open": [
                    "ApplicationDelegate.shared.application(app, open: url, options: options)"
                ]
            }
        },
        "plist": {
            "FacebookAppID": "{{props.APP_ID}}",
            "FacebookDisplayName": "{{props.APP_NAME}}",
            "CFBundleURLTypes": [
                {
                    "CFBundleTypeRole": "Editor",
                    "CFBundleURLSchemes": [
                        "fb{{props.APP_ID}}"
                    ]
                }
            ],
            "LSApplicationQueriesSchemes": [
                "fbapi",
                "fb-messenger-share-api",
                "fbauth2",
                "fbshareextension"
            ]
        }
    }
}
```

Example usage:

Instead of overriding complex plugin definition you can simply override props

```json
{
   "plugins": {
     "react-native-fbsdk": {
         "props": {
             "APP_ID": "xxxxxxxxx",
             "APP_NAME": "xxxxxxxxxxxx"
         }
      }
   }
}
```


### resolvePackage

resolvePackage allows you to dynamically resolve package location within `renative.*.json`` file


```
{
  "common": {
     "reactLocation": "{{resolvePackage('react')}}"
  }
}
```


## Config Values Overrides

There are 3 levels of override entry objects for your props to fine-tune your app config:

1. `.common` //Applies for all platforms + all schemes
2. `.platforms.YOUR_PLATFORM` //Applies specific platforms + all schemes
3. `.platforms.YOUR_PLATFORM.buildSchemes.YOUR_SCHEME` //Applies for specific platform + specific scheme

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

-   `Strings` => Replaced
-   `Numbers` => Replaced
-   `Arrays` => Replaced
-   `Objects` => Merged by top level (not deep merge)

Example:
https://github.com/pavjacko/renative/blob/develop/packages/renative-template-hello-world/appConfigs/helloworld/renative.json#L4

Will be overridden by:
https://github.com/pavjacko/renative/blob/develop/packages/renative-template-hello-world/appConfigs/helloworld/renative.json#L59

Output config will be decorated with few extra props to help with debugging:

```
{
  "_timestamp": "",
  "_mergeSources": []
}
```

## Build Flavours

You can configure different app ID, Title etc. with buildScheme field in you appConfig file.

Example:

```json
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

## Runtime Props

When you define object with key `runtime`, its properties will be merged into final `./platformAssets/renative.runtime.json` file

you can import above file into your code and get different values depending on your build
