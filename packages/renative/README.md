<p align='center'>
    <br />
    <br />
  <p align='center'><img width="300" height="321" src="https://github.com/pavjacko/renative/blob/master/docs/logo-512.png?raw=true" /></p>
  <br />
  <br />
  <p align='center'>build universal cross-platform apps with <a href="https://facebook.github.io/react-native/">react native</a></p>
  <p align='center'>
  <img src="https://img.shields.io/badge/Platforms_Supported-15-blue.svg" />
  <img src="https://img.shields.io/badge/React_Native-0.59.5-blue.svg" />
  <img src="https://img.shields.io/badge/React-16.8.6-blue.svg" />
  <img src="https://img.shields.io/badge/Plugins-45-red.svg" />
  </p>
</p>

   <br />
    <br />
      <br />
       <br />

<p align='center'>
    <a href="https://github.com/pavjacko/renative"><img src="https://img.shields.io/github/stars/pavjacko/renative.svg?style=social" /></a>
    <a href="https://github.com/pavjacko/renative"><img src="https://img.shields.io/github/forks/pavjacko/renative.svg?style=social" />
    <a href="https://spectrum.chat/renative"><img src="https://withspectrum.github.io/badge/badge.svg" /></a>
        </a>
    <a href="https://twitter.com/renative"><img src="https://img.shields.io/twitter/follow/renative.svg?style=social" /></a>
</p>

---

<!--
Quickstart
Platforms
Plugins
Templates
Configuration
Integrations
Build Hooks
CLI
Runtime
Contributing
-->

<p align="center">
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#platforms"><b>Platforms</b></a> &bull;
  <a href="#templates--starters"><b>Templates</b></a> &bull;
  <a href="#plugins"><b>Plugins</b></a> &bull;
  <a href="#integrations">Integrations</a> &bull;
  <a href="#configurations"><b>Configurations</b></a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#project-config">Project Config</a> &bull;
  <a href="#app-configs">App Configs</a> &bull;
  <a href="#build-hooks">Build Hooks</a> &bull;
  <a href="#cli"><b>CLI</b></a> &bull;
  <a href="#renative-cli">ReNative CLI</a> &bull;
  <a href="#developing-renative-locally">Developing ReNative Locally</a> &bull;
  <a href="#runtime"><b>Runtime</b></a> &bull;
  <a href="#contributing"><b>Contributing</b></a> &bull;
  <a href="#discussions">Discussions</a> &bull;
  <a href="#contributors">Contributors</a> &bull;
  <a href="#backers">Backers</a> &bull;
  <a href="#sponsors">Sponsors</a> &bull;
  <a href="#community">Community</a> &bull;
  <a href="#stats">Stats</a> &bull;
  <a href="#license">License</a>
</p>

<p align='center'>
    <a href="https://github.com/pavjacko"><img src="https://img.shields.io/github/followers/pavjacko.svg?label=Follow%20me%20on%20Github&style=social" /></a>
    <a href="https://twitter.com/pavjacko"><img src="https://img.shields.io/twitter/follow/pavjacko.svg?label=Follow%20me%20on%20Twitter&style=social" /></a>
</p>

<br />

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_ios.png?raw=true" width=20 height=20 />
      </br>
      <a href="#ios">iOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tvos.png?raw=true" width=36 height=20 />
      </br>
      <a href="#tvos">tvOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_androidtv.png?raw=true" width=20 height=20 />
      </br>
      <a href="#android-tv">Android TV</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_macos.png?raw=true" width=20 height=20 />
      </br>
      <a href="#macos">macOS</a>
    </th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_ios.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_android-tv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_macos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_android.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android">Android</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_web.png?raw=true" width=80 height=20 />
    </br>
    <a href="#web">Web</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-tv">Tizen TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_webos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#lg-webos">LG webOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_android.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tizen.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_webos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_firefoxos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxos">FirefoxOS</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_windows.png?raw=true" width=20 height=20 />
    </br>
    <a href="#windows">Windows</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_firefoxtv.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxtv">Firefox TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_kaios.png?raw=true" width=55 height=20 />
    </br>
    <a href="#kaios">KaiOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_firefoxos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_windows.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_firefoxtv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_kaios.gif?raw=true" />
    </th>
  </tr>

  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-mobile">Tizen Mobile</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizenwatch.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-watch">Tizen Watch</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/ic_androidwear.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android-wear">Android Wear</a>
    </th><th>
    ...
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/rnv_tizenmobile.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tizenwatch.gif?raw=true" width="136" height="184" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_androidwear.gif?raw=true" width="150" height="150" />
    </th><th>
    ...
    </th>
  </tr>
</table>

<br />

[![build](https://travis-ci.org/pavjacko/renative.svg?branch=master)](https://travis-ci.org/pavjacko/renative)
[![npm version](https://img.shields.io/npm/v/renative.svg?style=flat-square)](https://www.npmjs.com/package/renative)
[![npm downloads](https://img.shields.io/npm/dm/renative.svg?style=flat-square)](https://www.npmjs.com/package/renative)
[![All Contributors](https://img.shields.io/github/contributors/pavjacko/renative.svg)](#contributors)
[![License MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pavjacko/renative/pulls)
![hits](https://hits.dwyl.com/pavjacko/renative.svg)

<!-- [![OpenCollective](https://opencollective.com/renative/backers/badge.svg)](#backers) -->
<!-- [![OpenCollective](https://opencollective.com/renative/sponsors/badge.svg)](#sponsors) -->
<!-- [![StackOverflow](http://img.shields.io/badge/stackoverflow-renative-blue.svg)]( http://stackoverflow.com/questions/tagged/renative) -->

> The universal development SDK to build multi-platform projects with [react native](https://facebook.github.io/react-native/). Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web`, `Tizen TV`, `Tizen Watch`, `LG webOS`, `macOS/OSX`, `Windows`, `KaiOS`, `Firefox OS` and `Firefox TV` platforms

-   Ideal starting point for advanced multi-platform projects.
-   Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
-   Includes bleeding edge dependencies configured to work with each other

---

<!-- - [ReNative CLI](#rnv-cli)
- [Developing ReNative Locally](#developing-rnv-locally)
- [Discussions](#discussions)
- [Contributors](#contributors)
- [Backers](#backers)
- [Sponsors](#sponsors)
- [Community](#community)
- [Stats](#stats)
- [LICENSE](#license) -->

<!-- <p align="center">
  <a href="#ios">iOS</a> &bull;
  <a href="/selectorAndroid/">Android</a> &bull;
  <a href="/selectorWeb/">tvOS</a> &bull;
  <a href="/clientiOS/">Android TV</a> &bull;
</p> -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!--
- [🚀 Quick Start](#-quick-start)
- [Features](#-features)
- [Advanced Configuration](#-advanced-configuration)
- [Architecture](#architecture)
- [iOS](#ios)
- [Android](#android)
- [tvOS](#tvos)
- [Android TV](#android-tv)
- [Web](#web)
- [Tizen TV](#tizen-tv)
- [Tizen Watch](#tizen-watch)
- [LG webOS](#lg-webos)
- [macOS](#macos)
- [Windows](#windows)
- [Android Wear](#android-wear)
- [KaiOS](#kaios)
- [ReNative CLI](#rnv-cli)
- [Developing ReNative Locally](#developing-rnv-locally)
- [Discussions](#discussions)
- [Contributors](#contributors)
- [Backers](#backers)
- [Sponsors](#sponsors)
- [Community](#community)
- [Stats](#stats)
- [LICENSE](#license) -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🚀 Quick Start

##### 1) Install ReNative CLI (rnv)

```bash
$ npm install rnv -g
```

##### 2) Create new app:

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/cli_app_create1.gif?raw=true" />
    </th>
  </tr>
</table>

```bash
$ rnv new
```

Follow steps in the terminal

##### 3) Create 3 separate terminal tabs/windows. use one to keep bundler running and other one for build commands

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/terminal.png?raw=true" />
    </th>
  </tr>
</table>

**TAB 1:**

Start the bundler

```bash
$ rnv start
```

**TAB 2:**

Run your first `ios` app

```bash
$ rnv run -p ios
```

**TAB 3:**

Run your first `web` app

```bash
$ rnv run -p web
```

open: http://0.0.0.0:8080/

🎉 `Congratulations! You're now multi-platform developer!` 🎉

All app code is located in `./src` directory

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_features.png?raw=true" width=50 height=50 />

## Features

Build app blazingly fast with built-in features:

* Standard react-native community plugins
* React-Navigation Support
* Embedded 0 configuration custom font support
* SVG Icon Support
* Hot-reload development / debugging
* Deployment Ready project
* Generated projects can be opened and profiled in standard IDEs like Xcode, Android Studio, Tizen IDE etc  

#### Development platforms

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-POC-orange.svg)
![](https://img.shields.io/badge/Ubuntu-untested-lightgrey.svg)

#### Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [Android Studio](https://developer.android.com/studio) (if you want to develop for Android)
-   [Xcode](https://developer.apple.com/xcode/) (if you want to develop for iOS/tvOS)
-   [Tizen Studio](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) (if you want to develop for Tizen)
-   [WebOS SDK](http://webostv.developer.lge.com/sdk/installation/) (if you want to develop for WebOS)
-   [KaiOS SDK](https://developer.kaiostech.com) (if you want to develop for KaiOS)


---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_configuration.png?raw=true" width=50 height=50 />

## Templates / Starters

#### Built-in

Hello World:

https://www.npmjs.com/package/renative-template-hello-world

Blank:

https://www.npmjs.com/package/renative-template-blank

#### Community

Chat App:

https://www.npmjs.com/package/@reactseals/renative-template-chat


---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_plugins.png?raw=true" width=50 height=50 />

## Plugins

ReNative Supports standard community driven react-native plugins you can use to enhance the functionality of your apps:

Get list of all available community plugins. (NOTE you can always add new one manually into `projectConfig/plugins.json`)

`rnv plugin list`

you should get colorised overview similar to this:

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/cli_plugins.png?raw=true" />
    </th>
  </tr>
</table>

add new plugin to your project:

`rnv plugin add`

and follow the command prompt steps

Update your current plugins with latest ones from ReNative

`rnv plugin update`

and follow the command prompt steps

#### Custom Plugin Support

You can configure multiple React Native plugins without need to update project blueprints.
default location of plugin configs is `./projectConfig/plugins.json`

Example:

```json
{
    "plugins": {
      "renative": "source:rnv",
      "react": "source:rnv",
      "react-art": "source:rnv",
      "react-dom": "source:rnv",
      "react-native": "source:rnv",
      "react-native-web": "source:rnv",
      "react-native-web-image-loader": "source:rnv",
      "react-native-gesture-handler": "source:rnv",
      "react-navigation": "source:rnv",
      "react-navigation-tabs": "source:rnv",
      "react-native-reanimated": "source:rnv",
      "react-native-vector-icons": "source:rnv"
    }
}
```

You can also customise default plugin configuration:

```json
{
    "plugins": {
        "react-native-gesture-handler": {
            "version": "0.1.0",
            "ios": {
                "podName": "RNGestureHandler",
                "path": "node_modules/react-native-gesture-handler"
            },
            "android": {
                "package": "com.swmansion.gesturehandler.react.RNGestureHandlerPackage",
                "path": "node_modules/react-native-gesture-handler/android"
            }
        }
    }
}
```

Plugin Spec:

```json
{
  "pugin-name": {
      "version": "",
      "enabled": true,
      "ios": {},
      "android": {},
      "webpack": {
          "modulePaths": [],
          "moduleAliases": []
      }
  }
}
```


# Configurations

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_configuration.png?raw=true" width=50 height=50 />

## Project Config

`./projectConfig` folder is used to configure your project properties which can be used in appConfigs / buildFlavours


    .
    ├── projectConfig               # Project configuration files/assets
        ├── fonts                   # Folder for all custom fonts
        ├── fonts.json              # Fonts configuration
        ├── permissions.json        # Permissions configuration
        └── plugins.json            # React Native Plugins configuration


---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_appconfigs.png?raw=true" width=50 height=50 />

## App Configs

`./appConfigs` offers powerful configuration system which allows you to configure various flavours in your projects.

`./appConfigs/APP_ID/config.json` spec:

```json
{
  "id": "APP_ID",
  "common": {
    "title": "",
    "description": "",
    "author": {
      "name": ""
    },
    "includedPlugins": ["*"],
    "includedFonts": ["*"]
  },
  "platforms": {

  }
}
```


Re-Generate platform projects (for helloWorld app config platforms):

```bash
rnv platform configure -c helloWorld
```

Configure your multi-platform app based on `./appConfigs/helloWorld` configuration:

```bash
rnv app configure -c helloWorld -u
```

#### Android based config

Applies for `android`, `androidtv`, `androidwear`

For appConfigs:

```json
{
  "entryFile": "",
  "getJsBundleFile": "",
  "universalApk": true,
  "multipleAPKs": false,
  "minSdkVersion": 21,
  "backgroundColor": "",
  "id": "",
  "signingConfig": "",
  "bundleAssets": false,
  "permissions": [],
  "bundleAssets": true,
  "bundleIsDev": true,
  "buildSchemes": {}
}
```

For plugins:

```json
{
    "package": "",
    "path": "",
    "AndroidManifest": {},
    "BuildGradle": {},
    "AppBuildGradle": {}
}
```

#### Apple based config

Applies for `ios`, `tvos`

For appConfigs:

```json
{
  "entryFile": "",
  "backgroundColor": "",
  "id": "",
  "bundleAssets": false,
  "permissions": [],
  "bundleAssets": true,
  "bundleIsDev": true,
  "teamID": "",
  "scheme": "",
  "permissions": ["*"],
  "orientationSupport": {
    "phone": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ],
    "tab": [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
      "UIInterfaceOrientationLandscapeLeft",
      "UIInterfaceOrientationLandscapeRight"
    ]
  },
  "provisioningStyle": "",
  "systemCapabilities": {},
  "entitlements": {},
  "buildSchemes": {}
}
```

For plugins:

```json
{
    "podName": "",
    "path": "",
    "appDelegateApplicationMethods": {
      "didFinishLaunchingWithOptions": [],
      "open": [],
      "supportedInterfaceOrientationsFor": [],
      "didReceiveRemoteNotification": [],
      "didFailToRegisterForRemoteNotificationsWithError": [],
      "didReceive": [],
      "didRegister": [],
      "didRegisterForRemoteNotificationsWithDeviceToken": [],
    }
}
```

#### Web based config

Applies for `web`

```json
{
  "id": "",
  "entryFile": "",
  "title": "",
  "webpackConfig": {
    "devServerHost": "",
    "customScripts": []
  },
  "buildSchemes": {}
}
```

#### Global Configurations

`rnv` will create config folder at this location: `~/.rnv/config.json`

Open the file and edit SDK paths of platforms you plan to use:

```json
{
    "sdks": {
        "ANDROID_SDK": "/Users/<USER>/Library/Android/sdk",
        "ANDROID_NDK": "/Users/<USER>/Library/Android/sdk/ndk-bundle",
        "IOS_SDK": "No need. Just install Xcode",
        "TIZEN_SDK": "/Users/<USER>/tizen-studio",
        "WEBOS_SDK": "/Users/<USER>/Library/webOS_TV_SDK",
        "KAIOS_SDK": "/Applications/Kaiosrt.app"
    }
}
```

You can also edit your preferred emulator targets (allows you to run `rnv target launch -p <PLATFORM>` without `-p <TARGET>`)

```json
{
    "defaultTargets": {
        "android": "Nexus_5X_API_26",
        "androidtv": "Android_TV_720p_API_22",
        "androidwear": "Android_Wear_Round_API_28",
        "ios": "iPhone 6",
        "tvos": "Apple TV 4K",
        "tizen": "T-samsung-5.0-x86",
        "tizenwatch": "W-5.0-circle-x86",
        "webos": "emulator"
    }
}
```



#### App Signing

For Android release signing, ReNative creates `~/GLOBAL_RNV/PROJECT_NAME/APP_CONFIG_ID/config.private.json` file
with path to your release keystore file and its credentials.

```
{
  "android": {
    "storeFile": "./release.keystore",
    "storePassword": "************",
    "keyAlias": "************",
    "keyPassword": "************"
  }
}
```

Then you can run the release app by:

```bash
rnv app configure -p android
rnv run -p android -s release
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

`rnv run -p ios -s debug` (`-s debug` is DEFAULT option so you don't have to add it every time)

and

`rnv run -p ios -s release`

#### Build Flavour Injectors

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


#### Custom appConfig Location per Project

For decoupled project you might need to point to custom appConfig location per project. because that location might be different for each developer you can create `rnv-config.local.json` in your project root (git ignored by default) which points to your local appConfig folder.

Contents of the file should follow this format:

```json
{
    "appConfigsPath": "/Users/<USER>/my-local-app-config-folder"
}
```

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/ic_hooks.png?raw=true" width=50 height=50 />

## Build Hooks

Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you.

create file: `./buildHooks/src/index.js` with this script (NOTE: every top-level method must return Promise):

```js
import chalk from 'chalk';

const hooks = {
    hello: c =>
        new Promise((resolve, reject) => {
            console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
            resolve();
        }),
};

const pipes = {};

export { pipes, hooks };
```

then simply run:

```
rnv hooks run -x hello
```

ReNative will transpile and execute it in real time!

`index.js` is required entry point but you can create more complex scripts with multiple files/imports.

every top-level method gets invoked with ReNative `config` object containing all necessary build information

#### Using RNV in Build Hooks

You can utilize RNV CLI functionality inside of build hooks by simply importing rnv packages:

```js
import {
    Constants, Runner, App, Platform, Target, Common, Exec,
    PlatformTools, Doctor, PluginTools, SetupTools, FileUtils
} from 'rnv'
```

#### Build Pipes

Sometimes you want to execute specific hook automatically before/after certain ReNative build phase.

To get list of available hook pipes run:

`rnv hooks pipes`

You can connect your hook method to one of predefined pipes in your `./buildHooks/src/index.js`:

```js
const pipes = {
    'app:configure:before': hooks.hello,
};
```

Example code above will execute `hooks.hello()` before every time you run `rnv app configure` commands

#### Run Multiple Pipes on One Hook

```js
const pipes = {
    'app:configure:before': [hooks.hello, hooks.someOtherHook],
};
```

List of available pipe hooks:

```
'run:before', 'run:after',
'log:before', 'log:after',
'start:before', 'start:after',
'package:before', 'package:after',
'package:before', 'package:after',
'build:before', 'build:after',
'deploy:before', 'deploy:after',
'app:configure:before', 'app:configure:after',
'platform:configure:before', 'platform:configure:after'
```

List of available config props injected into hooks methods:

```js
//ROOT
c.program;
c.process;
c.command;
c.subCommand;
c.appId;
c.platform;
//FILES
c.files.projectConfig;
c.files.rnvPackage;
//PATHS
c.paths.rnvRootFolder;
c.paths.rnvHomeFolder;
c.paths.rnvPlatformTemplatesFolder;
c.paths.rnvPluginTemplatesFolder;
c.paths.rnvPluginTemplatesConfigPath;
c.paths.rnvPackagePath;
c.paths.rnvPluginsFolder;
c.paths.projectRootFolder;
c.paths.buildHooksFolder;
c.paths.buildHooksDistFolder;
c.paths.buildHooksIndexPath;
c.paths.buildHooksDistIndexPath;
c.paths.projectSourceFolder;
c.paths.projectNpmLinkPolyfillPath;
c.paths.homeFolder;
c.paths.globalConfigFolder;
c.paths.globalConfigPath;
c.paths.projectConfigPath;
c.paths.projectConfigLocalPath;
c.paths.projectPackagePath;
c.paths.rnCliConfigPath;
c.paths.babelConfigPath;
c.paths.projectConfigFolder;
c.paths.projectPluginsFolder;
c.paths.globalConfigFolder;
c.paths.globalConfigPath;
c.paths.appConfigsFolder;
c.paths.entryFolder;
c.paths.platformTemplatesFolders;
c.paths.platformAssetsFolder;
c.paths.platformBuildsFolder;
c.paths.projectPluginsFolder;
c.paths.rnvNodeModulesFolder;
c.paths.projectNodeModulesFolder;
c.paths.runtimeConfigPath;
c.paths.projectConfigFolder;
c.paths.pluginConfigPath;
c.paths.permissionsConfigPath;
c.paths.fontsConfigFolder;
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_runtime.png?raw=true" width=50 height=50 />

## Runtime

ReNative provides runtime SDK library to support multiplatform development

```js
import { Api } from 'renative'
```


---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_arch.png?raw=true" width=50 height=50 />

## Architecture

Build Process

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_arch1.png?raw=true" />
    </th>
  </tr>
</table>

Folder Structure (Generated Project)

    .
    ├── appConfigs                  # Application flavour configuration files/assets
    │   └── helloWorld              # Example application flavour
    │       ├── assets              # Platform assets injected to `./platformAssets`
    │       ├── builds              # Platform files injected to `./platformBuilds`
    │       └── config.json         # Application flavour config
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    ├── projectConfig               # Project configuration files/assets
    │   ├── fonts                   # Folder for all custom fonts
    │   ├── fonts.json              # Fonts configuration
    │   ├── permissions.json        # Permissions configuration
    │   └── plugins.json            # React Native Plugins configuration
    └── src                         # Source files


#### Override Mechanism

ReNative support flexible override mechanism which allows you customise your project to great degree

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_arch2.png?raw=true" />
    </th>
  </tr>
</table>

`./appConfigs/APP_ID/config.json` RULES:

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

`Strings` => Replaced
`Numbers` => Replaced
`Arrays` => Replaced
`Objects` => Merged by top level (not deep merge)

Example:
https://github.com/pavjacko/renative/blob/master/packages/renative-template-hello-world/appConfigs/helloWorld/config.json#L4

Will be overridden by:
https://github.com/pavjacko/renative/blob/master/packages/renative-template-hello-world/appConfigs/helloWorld/config.json#L59

This allows you to configure and build large number of flavoured builds with almost no extra configuration

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_arch3.png?raw=true" />
    </th>
  </tr>
</table>


# Platforms

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_ios.png?raw=true" width=50 height=50 />

## iOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Ubuntu-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_ios.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

#### Requirements

-   [CocoaPods](https://cocoapods.org) `1.5.3` or newer
-   [Xcode](https://developer.apple.com/xcode/) for iOS development

#### Project Configuration

| Feature           | Version |
| ----------------- | :-----: |
| Swift             |  `4.1`  |
| Deployment Target | `11.4`  |

#### Run on Simulator

```
rnv start
rnv run -p ios
```

#### Run on Device

IMPORTANT: before you run ReNative app on the actual iOS device you MUST:

1. Have ios device connected on the same network as your dev machine
2. Have ios developer account properly configured with ability to generate provisioning profiles dynamically (Dynamic Signing)
3. Have correct TeamID assigned `..platforms.ios.teamID` in your `./appConfigs/<YOUR_APP_CONFIG>/config.json`

You can configure each `buldScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/config.json`

```
rnv start
rnv run -p ios -d
```

#### Deploy on Device

This will run production version on your device (not connected to metro bundler)
Same prerequisite as above applies here

```
rnv start
rnv run -p ios -s release -d
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p ios -r
```

Launch app with specific iOS simulator

```
rnv run -p ios -t "iPhone 6 Plus"
```

Launch app with specific iOS simulator (let ReNative to give you the list of available options):

```
rnv run -p ios -t ?
```

Launch specific emulator :

```
rnv target launch -p ios -t "iPhone 8"
```

Launch specific emulator (let ReNative to give you the list of available options):

```
rnv target launch -p ios -t ?
```

Get list of all available devices

```
rnv target list -p ios
```

Get device/simulator logs

```
rnv log -p ios
```

Get device/simulator logs with filter

```
rnv log -p ios -f com.myapp
```

#### App Config

<a href="#apple-based-config">see: Apple based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_android.png?raw=true" width=50 height=50 />

## Android

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_android.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        | Version  |
| -------------- | :------: |
| Gradle         | `4.10.1` |
| Android Gradle | `3.3.1`  |
| Kotlin         | `1.3.20` |
| Target SDK     |   `27`   |

#### Emulators

You can create variety of emulators via Android Studio IDE

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/android1.png?raw=true" />
    </th>
  </tr>
</table>

#### Run on Simulator

NOTE: make sure you have 1 android device connected or 1 emulator running

```
rnv start
rnv run -p android
```

#### Run on Device

```
rnv start
rnv run -p android -d
```

#### Deploy on Device

This will run production version on your device (not connected to metro bundler)
You can configure each `buldScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/config.json`

```
rnv start
rnv run -p android -s release -d
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p android -r
```

Launch specific android emulator:

```
rnv target launch -p android -t Nexus_5X_API_26
```

Launch app with specific iOS simulator (let ReNative to give you the list of available options):

```
rnv run -p android -t ?
```

Launch specific emulator :

```
rnv target launch -p android -t Nexus_5X_API_26
```

Launch specific emulator (let ReNative to give you the list of available options):

```
rnv target launch -p android -t ?
```

Get list of all available devices

```
rnv target list -p android
```

Get device/simulator logs

```
rnv log -p android
```

Get device/simulator logs with filter

```
rnv log -p android -f com.myapp
```

#### App Config

<a href="#android-based-config">see: Android based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Ubuntu-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tvos.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

#### Requirements

-   [CocoaPods](https://cocoapods.org) `1.5.3` or newer
-   [Xcode](https://developer.apple.com/xcode/) for iOS development

#### Project Configuration

| Feature           | Version |
| ----------------- | :-----: |
| Swift             |  `4.1`  |
| Deployment Target | `11.4`  |

#### Run

```
rnv start
rnv run -p tvos
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tvos -r
```

Launch with specific tvOS simulator

```
rnv run -p tvos -t "Apple TV 4K"
```

#### App Config

<a href="#apple-based-config">see: Apple based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_androidtv.png?raw=true" width=50 height=50 />

## Android TV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_android-tv.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        | Version  |
| -------------- | :------: |
| Gradle         | `4.10.1` |
| Android Gradle | `3.3.1`  |
| Kotlin         | `1.3.20` |
| Target SDK     |   `27`   |

#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
rnv start
rnv run -p androidtv
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p androidtv -r
```

Launch specific emulator:

```
rnv target launch -p androidtv -t Android_TV_720p_API_22
```

#### App Config

<a href="#android-based-config">see: Android based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_web.png?raw=true" width=200 height=50 />

## Web

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_web.gif?raw=true" />
    </th>
  </tr>
</table>

-   Supports Chrome, Safari, Firefox, IE10+

#### Requirements

-   no extra requirements required

#### Project Configuration

| Feature          | Version  |
| ---------------- | :------: |
| Webpack          | `3.11.0` |
| react-native-web | `0.9.1`  |
| Babel Core       | `7.1.2`  |

#### Run

```
rnv run -p web
```

RNV will run local server and attempt to open browser URL: http://0.0.0.0:8080/

If you only want to run server:

```
rnv start -p web
```

#### Build

```
rnv build -p web
```

your deployable web app folder will be located in `./platformBuilds/<APP_ID>_web/public`

#### Advanced

Clean and Re-build platform project

```
rnv run -p web -r
```

Run with verbose logging:

```
rnv run -p web --info
```

Run app on custom port `9999`:

```
rnv run -p web --port 9999
```

#### App Config

<a href="##web-based-config">see: Web based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tizen.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Tizen project
-   Support for Tizen 5.0, 4.0, 3.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`
-   Make sure your CPU supports virtualization. Otherwise Tizen emulator might not start.
-   If you are deploying to a TV, follow this guide to set your TV in developer mode [Link](https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device)

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/tizen4.png?raw=true" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizen -t T-samsung-5.0-x86
```

#### Run

```
rnv run -p tizen
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tizen -r
```

Launch with specific Tizen simulator:

```
rnv run -p tizen -t T-samsung-5.0-x86
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizenwatch.png?raw=true" width=50 height=50 />

## Tizen Watch

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=200 src="https://github.com/pavjacko/renative/blob/master/docs/rnv_tizenwatch.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Tizen project
-   Support for Tizen 5.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/tizenwatch1.png?raw=true" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenwatch -t W-5.0-circle-x86
```

#### Run

```
rnv run -p tizenwatch
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tizenwatch -r
```

Launch with specific Tizen Watch simulator:

```
rnv run -p tizenwatch -t W-5.0-circle-x86
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=600 src="https://github.com/pavjacko/renative/blob/master/docs/rnv_webos.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest LG webOS Project

#### Requirements

-   [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

-   launch webOS emulator via CLI

```bash
rnv target launch -p webos -t emulator
```

-   launch webOS emulator Manually

usually located in something like:

```
<USER_PATH>/Library/webOS_TV_SDK/Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app
```

#### Run

```
rnv run -p webos
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen Mobile

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/rnv_tizenmobile.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Tizen project
-   Support for Tizen 5.0, 4.0, 3.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`
-   Make sure your CPU supports virtualization. Otherwise Tizen emulator might not start.
-   If you are deploying to a TV, follow this guide to set your TV in developer mode [Link](https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device)

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/tizen_mobile1.png?raw=true" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenmobile -t M-5.0-x86
```

#### Run

```
rnv run -p tizenmobile
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tizenmobile -r
```

Launch with specific Tizen simulator:

```
rnv run -p tizenmobile -t M-5.0-x86
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_macos.png?raw=true" width=50 height=50 />

## macOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Ubuntu-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_macos.gif?raw=true" />
    </th>
  </tr>
</table>

-   support for OSX/macOS
-   Based on Electron

#### Requirements

-   n/a

#### Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.9`  |
| electron-builder | `20.28.2` |

#### Run

```
rnv run -p macos
```

#### Deploy on Electron Simulator

This will run production version on your simulator (not connected to devserver)
You can configure each `buldScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/config.json`

```
rnv run -p macos -s release
```

#### Export

```
rnv export -p macos -s release
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_windows.png?raw=true" width=50 height=50 />

## Windows

![](https://img.shields.io/badge/Mac-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_windows.gif?raw=true" />
    </th>
  </tr>
</table>

-   support for Windows 10+
-   Based on Electron

#### Requirements

-   Windows dev environment

#### Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.1`  |
| electron-builder | `20.28.2` |

#### Run

```
rnv run -p windows
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_androidwear.png?raw=true" width=50 height=50 />

## Android Wear

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_androidwear.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        | Version  |
| -------------- | :------: |
| Gradle         | `4.10.1` |
| Android Gradle | `3.3.1`  |
| Kotlin         | `1.3.20` |
| Target SDK     |   `27`   |

#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p androidwear
```

NOTE: There is a bug in RN. for now you must NOT have running bundler (`rnv start`) in order for wear sim to work

#### Advanced

Clean and Re-build platform project

```
rnv run -p androidwear -r
```

Launch specific emulator:

```
rnv target launch -p androidwear -t Android_Wear_Round_API_28
```

#### App Config

<a href="#android-based-config">see: Android based config</a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_kaios.png?raw=true" width=140 height=50 />

## KaiOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_kaios.gif?raw=true" />
    </th>
  </tr>
</table>

#### Requirements

-   [KaiOSrt](https://developer.kaiostech.com/simulator) for emulator

After installation you can launch it via Applications:

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/kaios1.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p kaios
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_firefoxos.png?raw=true" width=50 height=50 />

## FirefoxOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_firefoxos.gif?raw=true" />
    </th>
  </tr>
</table>

#### Requirements

-   [FirefoxDeveloperEdition](https://www.mozilla.org/en-US/firefox/developer/) for IDE + Emulator

After installation you can launch it via Applications:

`Tools -> Web Developer -> WebIDE`

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/firefoxos.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p firefoxos
```

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_firefoxtv.png?raw=true" width=50 height=50 />

## FirefoxTV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Ubuntu-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/master/docs/rnv_firefoxtv.gif?raw=true" />
    </th>
  </tr>
</table>

#### Requirements

-   [FirefoxDeveloperEdition](https://www.mozilla.org/en-US/firefox/developer/) for IDE + Emulator

After installation you can launch it via Applications:

`Tools -> Web Developer -> WebIDE`

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/firefoxos.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p firefoxtv
```

# CLI

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_cli.png?raw=true" width=50 height=50 />

## ReNative CLI

Deployed to https://www.npmjs.com/package/rnv

Commands:

```
rnv                                 //Print help
rnv --version                       //Print ReNative Version
rnv run -p <PLATFORM>               //Run app on simulator/device/browser
rnv target launch -p <PLATFORM>     //Start target (i.e. simulator/ emulator)
rnv app configure                   //Configure app based on selected appConfig (copy runtime, initialise, copy assets, versions)
rnv new                             //Create new app
rnv platform eject                  //Eject platformTemplates into project
rnv platform connect                //Use ReNative predefined templates
```

#### Get Status

Get basic info about your current project

```bash
rnv status
```

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/info.png?raw=true" />
    </th>
  </tr>
</table>

#### Clean Project

This will delete all `node-modules` and `package-lock.json` files. you will be asked to confirm this action

```bash
rnv clean
```

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/master/docs/clean.png?raw=true" />
    </th>
  </tr>
</table>

#### Reset options

ReNative Allows you to perform reset commands if you facing unforeseen problems or migrating ReNative versions

Reset Metro Bundler cache

```bash
rnv start -r
```

Reset specific platform of platformBuild project (fully recreate project based on provided template)

```bash
rnv run -p <PLATFORM> -r
rnv app configure -p <PLATFORM> -r
```

Reset all platforms of platformBuild project (fully recreate projects based on provided template)

```bash
rnv app configure -r
```

#### Monochrome logs

If you prefer having your logs clean (without color decorations). you can use `--mono` flag for any`rnv` command.
This is particularly useful for CI where logs are usually stripped from colors by CI logger and producing visual artefacts

Examples:

```bash
rnv status --mono
rnv start --mono
...
```

#### Ejecting Platforms

By default, ReNative controls platformTemplates for you. Advantage is that you don't need to maintain them and will get all the updates automatically.
If however you need to customise them you can eject them directly into your project.

```bash
rnv platform eject
```

your projects will be build using `./platformTemplates` from this point

If you want to revert back to using ReNative templates simply run

```bash
rnv platform connect
```

your projects will be build using `./node_modules/renative/rnv-cli/platformTemplates` from this point



---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_construction.png?raw=true" width=50 height=50 />

## Developing ReNative Locally

If you need full control over whole ReNative build you can clone and develop it locally

```
1) clone git@github.com:pavjacko/renative.git
2) cd renative
3) npm i
4) npm run watch
5) npm run link
```


At this point your global `$ rnv` command is linked directly into project above.

It's also best way to contribute back to RNV! :)


```
rnv template apply
=> pick renative-template-hello-world
```

# Contributing

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_chat.png?raw=true" width=50 height=50 />

## Discussions

https://spectrum.chat/renative

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_contributor.png?raw=true" width=50 height=50 />

## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).

<a href="graphs/contributors"><img src="https://opencollective.com/renative/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/renative#backer)]

<a href="https://opencollective.com/renative#backers" target="_blank"><img src="https://opencollective.com/renative/backers.svg?width=890"></a>

## Sponsors

<a href="https://www.24i.com"><img src="https://github.com/pavjacko/renative/blob/master/docs/sponsors/24i.jpg?raw=true" width=200 height=85 /></a>

---

<img src="https://github.com/pavjacko/renative/blob/master/docs/ic_community.png?raw=true" width=50 height=50 />

## Community

Special thanks to open-source initiatives this project utilises, notably:

-   https://www.npmjs.com/package/react-native
-   https://www.npmjs.com/package/react-native-web
-   https://www.npmjs.com/package/webpack
-   https://www.npmjs.com/package/babel-cli
-   https://www.npmjs.com/package/electron

---

## Stats

[![NPM](https://nodei.co/npm/renative.png)](https://nodei.co/npm/renative/) [![Join the chat at https://gitter.im/pavjacko/renative](https://badges.gitter.im/pavjacko/renative.svg)](https://gitter.im/pavjacko/renative?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## LICENSE

[MIT](LICENSE)
