---
id: guide-config
title: Config Files
sidebar_label: Config Files
---


<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

Legend:

- `[PLATFORM]` - specific platform key like `ios`, `android`, `web`, etc..
- `[APP_ID]` - name of your folder in `./appConfigs` which contains specific `renative.json` file
- `[PROJECT_NAME]` - `name` field in the root `package.json` file of your project
- `[PLUGIN_ID]` - `key` of the plugin defined in one of the `renative.json` files
- `[WORKSPACE_PATH]` - `path` to your global workspace (`~/.rnv` by default) where local and sensitive information is stored.
- `[PROJECT_PATH]` - `path` to working copy of your project.

NOTE: `[WORKSPACE_PATH]` folder path can be customised in `~/.rnv/renative.workspaces.json`  
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

## JSON Configurations

App configs are ReNative compliant app configuration folders which follow prescribed structure

Applies for:

- `renative.json` - standard config (committed to git)
- `renative.private.json` - config containing sensitive values (ignored from git)
- `renative.local.json` - config containing local values (ignored from git)
- `[APP_ID]_[PLATFORM].json` - final merged config located in `./platformBuilds/[APP_ID]_[PLATFORM].json` (ignored from git)
- `renative.runtime.json` - final merged config available to app runtime located in `./platformBuilds/renative.runtime.json` (ignored from git)
- `renative.template.json` - config for renative template projects used to generate new projects (committed to git)
- `renative.plugin.json` - config for renative plugin projects (committed to git)

## Structure

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

## Merges

Following is the order of merges of various renative configs (if present) producing final `platformAssets/renative.json` config file.

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




- `./platformBuilds/renative.build.json`

- `./platformAssets/renative.runtime.json` - (subset of renative config available at runtime and packaged with final app)

[Full API Reference]('api-config.md')


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
