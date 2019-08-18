# API Reference for Files & Folders


App configs are ReNative compliant app configuration folders which follow prescribed structure

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
`./projectConfig/builds/[PLATFORM]/*/**` => `./platformBuilds/[APP_ID]_[PLATFORM]/*/*`</br>
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
`./platformBuilds` & `./platformAssets`

## Special Folders

- `builds` - TODO
- `plugins` - TODO
- `fonts` - TODO
- `assets` - TODO

#### File Overrides / Injectors

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
- `[APP_ID]` - name of your folder in `./appConfigs` which contains specific `config.json` file
- `[PROJECT-NAME]` - `name` field in the root `package.json` file of your project
- `[PLUGIN_ID]` - `key` of the plugin definced in `./projectConfig/plugins.json`
- `~/.rnv` - name of default global folder where local and sensitive information is stored. NOTE: this folder path can be customized via ` { "globalConfigFolder": "~/.myCustomGlobalFolder" }` in `rn-config.json` of each project

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

##### Platform Assets Overrides

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


#### Flavoured Builds

Combination of 2 features above allows you to configure and build large number of flavoured builds with almost no extra configuration

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_arch3.png?raw=true" />
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
