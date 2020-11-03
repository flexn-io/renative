---
id: guide-overview
title: Overview
sidebar_label: Overview
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />


Extremely versatile config system allows you to configure most of your project and environment by simple `renative.json` file changes.





## Project Configuration


Your main `renative.json` sits at the root of your project.

It is used to define all the major configurations for your particular project shared across all app configurations

Configurations typically stored in your project `renative.json` :

- Platform definitions
- Plugin definitions
- Engine configurations
- Defaults
- Permissions
- Crypto configuration
- workspaceID


## App Configuration

Every app configuration flavour contains its own `renative.*.json` file used to extend overall config with configurations specific to app flavour


Configurations typically stored in your project `appConfigs/[APP_ID]/renative.json` :

- App id, Title, Description etc
- Active / inactive plugins
- Plugin overrides per app
- Build schemes
- Runtime injections


## Global Configuration

Global `renative.*.json` are located in your workspace folder and workspace project folders.

default workspace location is `~/.rnv` but that can be configured

Because they are global, they will get merged into every build config regardless of the project. However as they get merged as one of the first files they can be easily overridden.


Configurations typically stored in your project `~/./rnv/renative.json` :

- SDK locations
- default targets


## Workspace Configuration

`renative.workspaces.json` is special type because it serves and 1st entry to your ReNative config ecosystem.


Typical workspace config will look like this:

```
{
    "workspaces": {
        "rnv": {
            "path": "~/.rnv"
        },
        "SOME_ANOTHER_WORKSPACE_ID": {
            "path": "<WORKSPACE_PATH>"
        }
    }
}
```

You can then switch to custom workspace per each project `./renative.json`

```
{
  "workspaceID": "SOME_ANOTHER_WORKSPACE_ID"
}
```



## Template Configuration

`renative.template.json` is special type because it serves as a template file during creation of new project.



## Build Configuration

Build config is special type because it is generated every `rnv` job and is unique for each platform and appConfig.

It is the result of all `renative.*.json` merges per each job

Every `rnv` job will generate unique build file in `./platformAssets/` folder.

Naming convention of such file is `[APP_ID]_[PLATFORM].json`

ie command `rnv run -p android -c helloworld` will genreate build file at:

`./platformBuilds/helloworld_android.json`

## Local Configuration


`renative.local.json` is special type because it's never included in git repository.

this allows you to create specific override related to your own local environment without compromising the integrity of your project


## Private Configuration

`renative.private.json` is special type because it is meant to store sensitive information.

It's never included in git repository directly.

It typically resides in your workspace directory and gets encrypted by `rnv crypto` as a means of secure sharing between developers


this allows you to inject sensitive information (deployment keys, keystores, certificates passwords etc) into your project without compromising its security


## Runtime Configuration

`renative.runtime.json` is special type because it is generated every `rnv` job.

Its location is always in `./platformAssets/renative.runtime.json` because it's meant to be accessed by source code.

### Injecting Runtime Value

You can decorate your `renative.*.json` with runtime value ie:

```json
{
   "runtime": {
      "foo": "bar"
   }
}
```


ie command `rnv run -p android -c helloworld` will generate build file at:

`./platformAssets/renative.runtime.json`


with followng value:

```json
{
   "foo": "bar"
}
```













---



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
