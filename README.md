<p align='center'>
    <br />
    <br />
  <p align='center'><img width="300" height="321" src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/logo-512.png?raw=true" /></p>
  <br />
  <br />
  <p align='center'>build universal cross-platform apps with <a href="https://facebook.github.io/react-native/">react native</a></p>
  <p align='center'>
  <img src="https://img.shields.io/badge/Platforms_Supported-15-blue.svg" />
  <img src="https://img.shields.io/badge/React_Native-0.59.5-blue.svg" />
  <img src="https://img.shields.io/badge/React-16.8.6-blue.svg" />
  <img src="https://img.shields.io/badge/Plugins-78-red.svg" />
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
  <a href="#common-issues"><b>Common Issues</b></a> &bull;
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
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_ios.png?raw=true" width=20 height=20 />
      </br>
      <a href="#ios">iOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tvos.png?raw=true" width=36 height=20 />
      </br>
      <a href="#tvos">tvOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_androidtv.png?raw=true" width=20 height=20 />
      </br>
      <a href="#android-tv">Android TV</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_macos.png?raw=true" width=20 height=20 />
      </br>
      <a href="#macos">macOS</a>
    </th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_ios.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_android-tv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_macos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_android.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android">Android</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_web.png?raw=true" width=80 height=20 />
    </br>
    <a href="#web">Web</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-tv">Tizen TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_webos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#lg-webos">LG webOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_android.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizen.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_webos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_firefoxos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxos">FirefoxOS</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_windows.png?raw=true" width=20 height=20 />
    </br>
    <a href="#windows">Windows</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_firefoxtv.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxtv">Firefox TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_kaios.png?raw=true" width=55 height=20 />
    </br>
    <a href="#kaios">KaiOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_firefoxos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_windows.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_firefoxtv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_kaios.gif?raw=true" />
    </th>
  </tr>

  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-mobile">Tizen Mobile</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizenwatch.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-watch">Tizen Watch</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_androidwear.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android-wear">Android Wear</a>
    </th><th>
    ...
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizenmobile.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizenwatch.gif?raw=true" width="136" height="184" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_androidwear.gif?raw=true" width="150" height="150" />
    </th><th>
    ...
    </th>
  </tr>
</table>

<br />

[![build](https://travis-ci.org/pavjacko/renative.svg?branch=develop)](https://travis-ci.org/pavjacko/renative)
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/cli_app_create1.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/terminal.png?raw=true" />
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

##### RNV + NPX

⚠️

It is recommended that after initial project setup you start using `npx rnv ...` prefix instead of `rnv ...`

This ensures that every project uses correct version of `rnv` to avoid potential compatibility issues

make sure you have npx installed globally via `npm install npx -g`

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_features.png?raw=true" width=50 height=50 />

## Features

Build app blazingly fast with built-in features:

* Standard react-native community plugins
* React-Navigation Support
* Embedded 0 configuration custom font support
* SVG Icon Support
* Hot-reload development / debugging
* Deployment Ready project
* Generated projects can be opened and profiled in standard IDEs like Xcode, Android Studio, Tizen IDE etc  

#### Supported OS

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/os_osx.png?raw=true" width="100" height="100" />
    </th>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/os_win.png?raw=true" width="100" height="100" />
    </th>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/os_linux.jpeg?raw=true" width="100" height="100" />
    </th>
  </tr>
  <tr>
    <th>
      <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    </th>
    <th>
      <img src="https://img.shields.io/badge/Windows-beta-orange.svg" />
    </th>
    <th>
      <img src="https://img.shields.io/badge/Linux-beta-orange.svg" />
    </th>
  </tr>
</table>


#### Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [Android Studio](https://developer.android.com/studio) (if you want to develop for Android)
-   [Xcode](https://developer.apple.com/xcode/) (if you want to develop for iOS/tvOS)
-   [Tizen Studio](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) (if you want to develop for Tizen)
-   [WebOS SDK](http://webostv.developer.lge.com/sdk/installation/) (if you want to develop for WebOS)
-   [KaiOS SDK](https://developer.kaiostech.com) (if you want to develop for KaiOS)


---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_configuration.png?raw=true" width=50 height=50 />

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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_plugins.png?raw=true" width=50 height=50 />

## Plugins

ReNative Supports standard community driven react-native plugins you can use to enhance the functionality of your apps:

Get list of all available community plugins. (NOTE you can always add new one manually into `projectConfig/plugins.json`)

`$ rnv plugin list`

you should get colorised overview similar to this:

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/cli_plugins.png?raw=true" />
    </th>
  </tr>
</table>

add new plugin to your project:

`$ rnv plugin add`

and follow the command prompt steps

Update your current plugins with latest ones from ReNative

`$ rnv plugin update`

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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_configuration.png?raw=true" width=50 height=50 />

## Project Config

`./projectConfig` folder is used to configure your project properties which can be used in appConfigs / buildFlavours


    .
    ├── projectConfig               # Project configuration files/assets
        ├── fonts                   # Folder for all custom fonts
        ├── fonts.json              # Fonts configuration
        ├── permissions.json        # Permissions configuration
        └── plugins.json            # React Native Plugins configuration


---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_appconfigs.png?raw=true" width=50 height=50 />

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
https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/DOC_RENATIVE_CONFIG.md


Re-Generate platform projects (for helloWorld app config platforms):

```bash
rnv platform configure -c helloWorld
```

Configure your multi-platform app based on `./appConfigs/helloWorld` configuration:

```bash
rnv configure -c helloWorld -u
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_hooks.png?raw=true" width=50 height=50 />

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

`$ rnv hooks pipes`

You can connect your hook method to one of predefined pipes in your `./buildHooks/src/index.js`:

```js
const pipes = {
    'configure:before': hooks.hello,
};
```

Example code above will execute `hooks.hello()` before every time you run `$ rnv configure` commands

#### Run Multiple Pipes on One Hook

```js
const pipes = {
    'configure:before': [hooks.hello, hooks.someOtherHook],
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
'configure:before', 'configure:after',
'platform:configure:before', 'platform:configure:after'
```



---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_runtime.png?raw=true" width=50 height=50 />

## Runtime


https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/DOC_RENATIVE_RUNTIME.md

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_arch.png?raw=true" width=50 height=50 />

## Architecture

Build Process

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_arch1.png?raw=true" />
    </th>
  </tr>
</table>

Folder Structure (Generated Project)

    .
    ├── appConfigs                  # Application flavour configuration files/assets
    │   └── helloWorld              # Example application flavour
    │       ├── assets              # Platform assets injected to `./platformAssets`
    │       ├── builds              # Platform files injected to `./platformBuilds`
    │       └── renative.json       # Application flavour config
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    ├── projectConfig               # Project configuration files/assets
    │   ├── fonts                   # Folder for all custom fonts
    │   └── builds                  # Fonts configuration
    ├── src                         # Source files
    └── renative.json           # React Native Plugins configuration


### Override Mechanism

ReNative support flexible override mechanism which allows you customise your project to great degree

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_arch2.png?raw=true" />
    </th>
  </tr>
</table>


# Platforms

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_ios.png?raw=true" width=50 height=50 />

## iOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Linux-n/a-lightgrey.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_ios.gif?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_android.png?raw=true" width=50 height=50 />

## Android

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_android.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development
-   Windows 10 Pro or a better variant if you want to start the emulator on a Windows machine. Windows Home or Educational do not support Hyper-V and that's required for starting the Android emulators

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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/android1.png?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Linux-n/a-lightgrey.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tvos.gif?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_androidtv.png?raw=true" width=50 height=50 />

## Android TV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_android-tv.gif?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_web.png?raw=true" width=200 height=50 />

## Web

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_web.gif?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizen.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/tizen4.png?raw=true" />
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

Run on Device

```
rnv run -p tizen -d
```

Run in Browser

```
rnv run -p tizen --hosted
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizenwatch.png?raw=true" width=50 height=50 />

## Tizen Watch

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=200 src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizenwatch.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/tizenwatch1.png?raw=true" />
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

Run on Device

```
rnv run -p tizenwatch -d
```

Run in Browser

```
rnv run -p tizenwatch --hosted
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=600 src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_webos.gif?raw=true" />
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

Run on Simulator

```
rnv run -p webos
```

Run on Device

```
rnv run -p webos -d
```

Run in Browser

```
rnv run -p webos --hosted
```

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen Mobile

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_tizenmobile.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/tizen_mobile1.png?raw=true" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenmobile -t M-5.0-x86
```

#### Run

Run on Simulator

```
rnv run -p tizenmobile
```

Run on Device

```
rnv run -p tizenmobile -d
```

Run in Browser

```
rnv run -p tizenmobile --hosted
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_macos.png?raw=true" width=50 height=50 />

## macOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Linux-n/a-lightgrey.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_macos.gif?raw=true" />
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

Run on Simulator

```
rnv run -p macos
```

Run in Browser

```
rnv run -p macos --hosted
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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_windows.png?raw=true" width=50 height=50 />

## Windows

![](https://img.shields.io/badge/Mac-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-n/a-lightgrey.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_windows.gif?raw=true" />
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

Run on Simulator

```
rnv run -p windows
```

Run in Browser

```
rnv run -p windows --hosted
```

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_androidwear.png?raw=true" width=50 height=50 />

## Android Wear

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_androidwear.gif?raw=true" />
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

NOTE: There is a bug in RN. for now you must NOT have running bundler (`$ rnv start`) in order for wear sim to work

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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_kaios.png?raw=true" width=140 height=50 />

## KaiOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_kaios.gif?raw=true" />
    </th>
  </tr>
</table>

#### Requirements

-   [KaiOSrt](https://developer.kaiostech.com/simulator) for emulator

After installation you can launch it via Applications:

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/kaios1.png?raw=true" />
    </th>
  </tr>
</table>

#### Run


Run on Simulator

```
rnv run -p kaios
```

Run on Device

```
rnv run -p kaios -d
```

Run in Browser

```
rnv run -p kaios --hosted
```

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_firefoxos.png?raw=true" width=50 height=50 />

## FirefoxOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_firefoxos.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/firefoxos.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

Run on Simulator

```
rnv run -p forefoxos
```

Run on Device

```
rnv run -p forefoxos -d
```

Run in Browser

```
rnv run -p forefoxos --hosted
```

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_firefoxtv.png?raw=true" width=50 height=50 />

## FirefoxTV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/rnv_firefoxtv.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/firefoxos.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

Run on Simulator

```
rnv run -p forefoxtv
```

Run on Device

```
rnv run -p forefoxtv -d
```

Run in Browser

```
rnv run -p forefoxtv --hosted
```

# CLI

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_cli.png?raw=true" width=50 height=50 />

TODO

### Ejecting Platforms

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

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_construction.png?raw=true" width=50 height=50 />

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

# Common Issues

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_issues.png?raw=true" width=50 height=50 />

If you encounter unexpected error / issue it is always good to perform basic sanity steps:

#### rnv status

`rnv status`

this should print out basic `SUMMARY` box with info about your project, env, and RNV version. check if everything seem correct.

#### -r --reset

`rnv start -r` -> restart your server / bundler and reset all cache

`rnv run .... -r` -> recreate whole project before running app

#### -i --info

`rnv run .... -i` -> run ReNative with full verbose logs

#### rnv clean

If above does not help try to clean up your project

`rnv clean && npm i`

#### Raise Issue

If above does not help either you can raise new question/bug on repo https://github.com/pavjacko/renative/issues

Provide at least `SUMMARY` box from your console


#### Common Errors:


⚠️`linker command failed with exit code 1 (use -v to see invocation)`

Make sure your Xcode version is `10.2` or newer


⚠️`Description: Invalid runtime: com.apple.CoreSimulator.SimRuntime.iOS-.......`

try to run

```bash
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
```
and then

`rnv run ...`

⚠️`Could not create service of type ScriptPluginFactory using BuildScopeServices.createScriptPluginFactory()`

Try killing all `gradle` processes and running the build again, that should help


⚠️`> Execution of compression failed.`

https://github.com/pavjacko/renative/issues/183



# Contributing

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_chat.png?raw=true" width=50 height=50 />

## Discussions

https://spectrum.chat/renative

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_contributor.png?raw=true" width=50 height=50 />

## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).

<a href="graphs/contributors"><img src="https://opencollective.com/renative/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/renative#backer)]

<a href="https://opencollective.com/renative#backers" target="_blank"><img src="https://opencollective.com/renative/backers.svg?width=890"></a>

## Sponsors

<a href="https://www.24i.com"><img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/sponsors/24i.jpg?raw=true" width=200 height=85 /></a>

---

<img src="https://github.com/pavjacko/renative/blob/feat/188-config-v2/docs/images/ic_community.png?raw=true" width=50 height=50 />

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
