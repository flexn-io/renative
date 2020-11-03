---
id: guide-config_folders
title: Config Folders
sidebar_label: Config Folders
---

<img src="https://renative.org/img/ic_appconfigs.png" width=50 height=50 />

Legend:

-   `[PLATFORM]` - specific platform key like `ios`, `android`, `web`, etc..
-   `[APP_ID]` - name of your folder in `./appConfigs` which contains specific `renative.json` file
-   `[PROJECT_NAME]` - `name` field in the root `package.json` file of your project
-   `[PLUGIN_ID]` - `key` of the plugin defined in one of the `renative.json` files
-   `[WORKSPACE_PATH]` - `path` to your workspace (`~/.rnv` by default) where local and sensitive information is stored.

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

## Structure

applies for both public and private `./..` and `~./rnv/[PROJECT_NAME]/..`

    .
    └── appConfigs
        ├── base
        │   ├── fonts
        │   ├── plugins
        │   └── builds
        └── [APP_ID]          # Extend / Override appConfigs/base
            ├── assets
            │   └── [PLATFORM]
            ├── fonts
            ├── builds
            └── plugins
                └── [PLUGIN_KEY]
                    ├── fonts
                    └── builds

## Merges

Following is the order of merges of various folders (if present) contributing to final `platformBuilds/*/**`.

⬇️
`[RNV_ROOT]/platformTemplates/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/base/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/base/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./platformBuilds`

Following is the order of merges of various folders (if present) contributing to final `platformAssets/*/**`.

⬇️
`./appConfigs/base/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./appConfigs/base/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./platformAssets`

## Special Folders

-   `platformBuilds` - all builds and projects are dynamically generated
-   `platformAssets` - all shared assets are dynamically copied here
-   `appConfigs` - all configuration files overrides flavours are placed here
-   `projectConfig` - DEPRECATED (use appConfigs/base)
-   `buildHooks` - allows you to extend RNV build functionality
-   `src` - source code of the project
-   `builds` - contents of this folder will be injected into `./platformBuilds/[APP_ID]_[PLATFORM]` destination
-   `plugins` - allows you to extend / override project files based on activated plugin
-   `fonts` - special folder used for dynamic fonts injections
-   `assets` - contents of this folder will be injected into `./platformAssets` destination

## File Overrides / Injectors

Every time you run RNV command, ReNative checks following "special" folders and copies contents of those into designated target folders

-   `*/plugins/[PLUGIN_ID]`
-   `*/plugins/[PLUGIN_ID]/overrides` -> special override allows you to override files in plugin itself! (located `./node_modules`)
-   `*/builds/[PLATFORM]`
-   `*/fonts`
-   `*/assets/runtime`
-   `*/assets/[PLATFORM]`

You can utilise above folders in following places:

-   `./appConfigs/base`
-   `./appConfigs/[APP_ID]`
-   `[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]`
-   `[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base`

## Platform Builds Overrides

Project Scoped Build Override

`./appConfigs/base/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Project Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

App Config Scoped Build Override

`./appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

App Config Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + Project Scoped Build Override

`./appConfigs/base/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + Project Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + App Config Scoped Build Override

`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + App Config Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

### Platform Assets Overrides

Project Scoped Assets Override

`./appConfigs/base/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Project Scoped Assets Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

App Config Scoped Build Override

`./appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

App Config Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + Project Scoped Build Override

`./appConfigs/base/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + Project Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/base/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + App Config Scoped Build Override

`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + App Config Scoped Build Override (Private Content)

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

### Build Flavour Injectors

Sometimes you need to add buildFlavour specific file into project before build. ie Firebase, Crashlytics configs and so on

you can achieve by creating folder with postfix `<PLATFORM>@<BUILD_SCHEME_NAME>`

    .
    ├── appConfigs
        └── helloworld
            ├── assets
            ├── plugins
            │   └── some-plugin
            │       └── builds
            │            ├── android@release
            │            │   └── fileToBeInjectedInReleaseMode.txt
            │            └── android@debug
            │                └── fileToBeInjectedInDebugMode.txt
            └── builds
                ├── android@release
                │   └── fileToBeInjectedInReleaseMode.txt
                └── android@debug
                    └── fileToBeInjectedInDebugMode.txt

### Flavoured Builds

Combination of features above allows you to configure and build large number of flavoured builds with almost no extra configuration

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/rnv_arch3.png" />
    </th>
  </tr>
</table>

## Files / Assets

Override Rules:

-   https://github.com/pavjacko/renative/tree/develop#platform-builds-overrides
-   https://github.com/pavjacko/renative/tree/develop#platform-assets-overrides

#### ✅ What to add to `./appConfigs/*/**`

-   icon assets
-   splash screens
-   runtime configs

#### ❌ What NOT to add to `./appConfigs/*/**`

-   passwords
-   production keys
-   keystores, p12
-   googleservice-info.json
-   fabric keys
-   any other sensitive data

those should be added to private project mirror:

`[WORKSPACE_PATH]/[PROJECT_NAME]/appConfigs/*/**`
