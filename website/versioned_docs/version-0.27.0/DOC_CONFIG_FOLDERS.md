---
id: version-0.27.0-config_folders
title: Config Folders
sidebar_label: Config Folders
original_id: config_folders
---


<img src="https://renative.org/img/ic_appconfigs.png" width=50 height=50 />


## Structure

applies for both public and private `./..` and `~./rnv/[PROJECT_NAME]/..`


    .
    ├── projectConfig               
    │   ├── fonts                   
    │   ├── plugins                 
    │   └── builds                  
    └── appConfigs
        └── [APP_ID]
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
`./projectConfig/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./projectConfig/builds/_shared/*/**` => `./platformBuilds/_shared/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/projectConfig/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./projectConfig/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/projectConfig/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
⬇️
`./platformBuilds`


Following is the order of merges of various folders (if present) contributing to final `platformAssets/*/**`.

⬇️
`./projectConfig/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/projectConfig/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./projectConfig/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/projectConfig/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`</br>
⬇️
`./platformAssets`


## Special Folders

- `platformBuilds` - TODO
- `platformAssets` - TODO
- `appConfigs` - TODO
- `projectConfig` - TODO
- `buildHooks` - TODO
- `src` - TODO
- `builds` - TODO
- `plugins` - TODO
- `fonts` - TODO
- `assets` - TODO

## File Overrides / Injectors

Every time you run RNV command, ReNative checks following "special" folders and copies contents of those into designated target folders

- `*/plugins/[PLUGIN_ID]`
- `*/plugins/[PLUGIN_ID]/overrides` -> special override allows you to override files in plugin itslef! (located `./node_modules`)
- `*/builds/[PLATFORM]`
- `*/fonts`
- `*/assets/runtime`
- `*/assets/[PLATFORM]`

You can utilise above folders in following places:

- `./appConfigs/[APP_ID]`
- `./projectConfig`
- `~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]`
- `~/.rnv/[PROJECT-NAME]/projectConfig`

Legend:

- `[PLATFORM]` - specific platform key like `ios`, `andoid`, `web`, etc..
- `[APP_ID]` - name of your folder in `./appConfigs` which contains specific `renative.json` file
- `[PROJECT-NAME]` - `name` field in the root `package.json` file of your project
- `[PLUGIN_ID]` - `key` of the plugin definced in `./projectConfig/plugins.json`
- `~/.rnv` - name of default workspace folder where local and sensitive information is stored. NOTE: this folder path can be customized via ` { "workspace": "MY_WORKSPACE_NAME" }` in `renative.json` of each project

Your workspaces can be found in `~./renative.workspaces.json`

##### Platform Builds Overrides

Project Scoped Build Override

`./projectConfig/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Project Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/projectConfig/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

App Config Scoped Build Override

`./appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

App Config Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + Project Scoped Build Override

`./projectConfig/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + Project Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/projectConfig/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + App Config Scoped Build Override

`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

Plugin + App Config Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`

## Platform Assets Overrides

Project Scoped Assets Override

`./projectConfig/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Project Scoped Assets Override (Private Content)

`~/.rnv/[PROJECT-NAME]/projectConfig/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

App Config Scoped Build Override

`./appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

App Config Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + Project Scoped Build Override

`./projectConfig/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + Project Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/projectConfig/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + App Config Scoped Build Override

`./appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`

Plugin + App Config Scoped Build Override (Private Content)

`~/.rnv/[PROJECT-NAME]/appConfigs/[APP_ID]/plugins/[PLUGIN_ID]/assets/runtime/*/**` => `./platformAssets/runtime/*/*`


## Build Flavour Injectors

Sometimes you need to add buildFlavour specific file into project before build. ie Firebase, Crashlytics configs and so on

you can achieve by creating folder with postfix `<PLATFORM>@<BUILD_SCHEME_NAME>`

    .
    ├── appConfigs
        └── helloWorld
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



## Flavoured Builds

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

- https://github.com/pavjacko/renative/tree/develop#platform-builds-overrides
- https://github.com/pavjacko/renative/tree/develop#platform-assets-overrides


#### ✅ What to add to `./appConfigs/*/**`

- icon assets
- splash screens
- runtime configs

#### ❌ What NOT to add to `./appConfigs/*/**`

- passwords
- production keys
- keystores, p12
- googleservice-info.json
- fabric keys
- any other sensitive data

those should be added to private project mirror:

`~/.rnv/[PROJECT-NAME]/appConfigs/*/**`
