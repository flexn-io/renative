<p align='center'>
    <br />
    <br />
  <p align='center'><img width="300" height="321" src="https://github.com/pavjacko/renative/blob/develop/docs/images/logo-512.png?raw=true" /></p>
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
  <!-- <a href="#platforms"><b>Platforms</b></a> &bull; -->
  <a href="#templates--starters"><b>Templates</b></a> &bull;
  <a href="#plugins"><b>Plugins</b></a> &bull;
  <a href="#integrations">Integrations</a> &bull;
  <a href="#json-configurations">JSON Configurations</a> &bull;
  <a href="#folder-configurations">Folder Configurations</a> &bull;
  <a href="#build-hooks">Build Hooks</a> &bull;
  <a href="#cli"><b>CLI</b></a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#developing-renative-locally">Developing ReNative Locally</a> &bull;
  <a href="#common-issues"><b>Common Issues</b></a> &bull;
  <a href="#runtime"><b>Runtime</b></a> &bull;
  <!-- <a href="#contributing"><b>Contributing</b></a> &bull; -->
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
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_ios.png?raw=true" width=20 height=20 />
      </br>
      <a href="#ios">iOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tvos.png?raw=true" width=36 height=20 />
      </br>
      <a href="#tvos">tvOS</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidtv.png?raw=true" width=20 height=20 />
      </br>
      <a href="#android-tv">Android TV</a>
    </th><th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_macos.png?raw=true" width=20 height=20 />
      </br>
      <a href="#macos">macOS</a>
    </th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_ios.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_android-tv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_macos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_android.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android">Android</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_web.png?raw=true" width=80 height=20 />
    </br>
    <a href="#web">Web</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-tv">Tizen TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_webos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#lg-webos">LG webOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_android.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tizen.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_webos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxos.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxos">FirefoxOS</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_windows.png?raw=true" width=20 height=20 />
    </br>
    <a href="#windows">Windows</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxtv.png?raw=true" width=20 height=20 />
    </br>
    <a href="#firefoxtv">Firefox TV</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_kaios.png?raw=true" width=55 height=20 />
    </br>
    <a href="#kaios">KaiOS</a>
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_firefoxos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_windows.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_firefoxtv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_kaios.gif?raw=true" />
    </th>
  </tr>

  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-mobile">Tizen Mobile</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizenwatch.png?raw=true" width=20 height=20 />
    </br>
    <a href="#tizen-watch">Tizen Watch</a>
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidwear.png?raw=true" width=20 height=20 />
    </br>
    <a href="#android-wear">Android Wear</a>
    </th><th>
    ...
    </th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tizenmobile.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tizenwatch.gif?raw=true" width="136" height="184" />
    </th><th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_androidwear.gif?raw=true" width="150" height="150" />
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


## 🚀 Quick Start

##### 1) Install ReNative CLI (rnv)

```bash
$ npm install rnv -g
```

##### 2) Create new app:

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/cli_app_create1.gif?raw=true" />
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
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/terminal.png?raw=true" />
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

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_features.png?raw=true" width=50 height=50 />

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
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/os_osx.png?raw=true" width="100" height="100" />
    </th>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/os_win.png?raw=true" width="100" height="100" />
    </th>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/os_linux.jpeg?raw=true" width="100" height="100" />
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

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_templates.png?raw=true" width=50 height=50 />

## Templates / Starters

Too lazy to build your idea from scratch? use one of the predefined & community templates to get you started in no time.

[Documentation for ReNative Templates and Starters](docs/DOC_TEMPLATES.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_plugins.png?raw=true" width=50 height=50 />

## Plugins

ReNative Supports standard community driven react-native plugins you can use to enhance the functionality of your apps:

[Documentation for ReNative Plugins](docs/DOC_PLUGINS.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_configuration.png?raw=true" width=50 height=50 />

## JSON Configurations

Tire of setting up and managing countless of various projects? you can go as simple as most basic json config file to get yourself up and running

[Documentation for ReNative JSON Config](docs/DOC_RENATIVE_CONFIG.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_appconfigs.png?raw=true" width=50 height=50 />

## Folder Configurations

ReNative offers flexible and scalable folder override & injection features to create numerous flavours, A/B features, dynamic plugin switches and more

[Documentation for ReNative Folder Configurations](docs/DOC_CONFIG_FOLDERS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_hooks.png?raw=true" width=50 height=50 />

## Build Hooks

Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you.

[Documentation for ReNative Build Hooks](docs/DOC_BUILD_HOOKS.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_runtime.png?raw=true" width=50 height=50 />

## Runtime

ReNative runtime is an NPM dependency used abstract away some of the complexities of building UI interfaces and features for large number of target platforms

[Documentation for ReNative Runtime](docs/DOC_RENATIVE_RUNTIME.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_cli.png?raw=true" width=50 height=50 />

## CLI

One CLI to do it all. `rnv` is your entry point and control centre to building multi-platfom apps with just a few commands to learn

[Documentation for RNV CLI](docs/DOC_RNV_CLI.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_arch.png?raw=true" width=50 height=50 />

## Architecture

More in-depth explanation how ReNative internals work

[Documentation for ReNative Architecture](docs/DOC_ARCHITECTURE.md)

<!--
# Platforms

<p>

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_android.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidtv.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_web.png?raw=true" width=200 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizenwatch.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_webos.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_macos.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_windows.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_ios.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidwear.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxos.png?raw=true" width=50 height=50 />
<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxtv.png?raw=true" width=50 height=50 />
</p>
 -->



---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_ios.png?raw=true" width=50 height=50 />

## iOS

`rnv run -p ios`

[Documentation for iOS Platform](docs/DOC_PLAT_IOS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_android.png?raw=true" width=50 height=50 />

## Android

`rnv run -p android`

[Documentation for Android Platform](docs/DOC_PLAT_ANDROID.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

`rnv run -p tvos`

[Documentation for tvOS Platform](docs/DOC_PLAT_TVOS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidtv.png?raw=true" width=50 height=50 />

## Android TV

`rnv run -p androidtv`

[Documentation for Android TV Platform](docs/DOC_PLAT_ANDROID_TV.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_web.png?raw=true" width=200 height=50 />

## Web

`rnv run -p web`

[Documentation for Web Platform](docs/DOC_PLAT_WEB.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

`rnv run -p tizen`

[Documentation for Tizen TV Platform](docs/DOC_PLAT_TIZEN.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizenwatch.png?raw=true" width=50 height=50 />

## Tizen Watch

`rnv run -p tizenwatch`

[Documentation for Tizen Watch Platform](docs/DOC_PLAT_TIZEN_WATCH.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

`rnv run -p webos`

[Documentation for LG WebOS Platform](docs/DOC_PLAT_WEBOS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen Mobile

`rnv run -p tizenmobile`

[Documentation for Tizen Mobile Platform](docs/DOC_PLAT_TIZEN_MOBILE.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_macos.png?raw=true" width=50 height=50 />

## macOS

`rnv run -p macos`

[Documentation for macOS Platform](docs/DOC_PLAT_MACOS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_windows.png?raw=true" width=50 height=50 />

## Windows

`rnv run -p windows`

[Documentation for Windows Platform](docs/DOC_PLAT_WINDOWS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_androidwear.png?raw=true" width=50 height=50 />

## Android Wear

`rnv run -p androidwear`

[Documentation for Android Wear Platform](docs/DOC_PLAT_ANDROID_WEAR.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_kaios.png?raw=true" width=140 height=50 />

## KaiOS

`rnv run -p kaios`

[Documentation for KaiOS Platform](docs/DOC_PLAT_KAIOS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxos.png?raw=true" width=50 height=50 />

## FirefoxOS

`rnv run -p firefoxos`

[Documentation for Firefox OS Platform](docs/DOC_PLAT_FIREFOX_OS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_firefoxtv.png?raw=true" width=50 height=50 />

## FirefoxTV

`rnv run -p firefoxtv`

[Documentation for Firefox TV Platform](docs/DOC_PLAT_FIREFOX_TV.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_construction.png?raw=true" width=50 height=50 />

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

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_issues.png?raw=true" width=50 height=50 />

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


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_chat.png?raw=true" width=50 height=50 />

## Discussions

https://spectrum.chat/renative

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_contributor.png?raw=true" width=50 height=50 />

## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).

<a href="graphs/contributors"><img src="https://opencollective.com/renative/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/renative#backer)]

<a href="https://opencollective.com/renative#backers" target="_blank"><img src="https://opencollective.com/renative/backers.svg?width=890"></a>

## Sponsors

<a href="https://www.24i.com"><img src="https://github.com/pavjacko/renative/blob/develop/docs/sponsors/24i.jpg?raw=true" width=200 height=85 /></a>

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_community.png?raw=true" width=50 height=50 />

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
