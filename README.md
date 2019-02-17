<p align='center'>
  <h1 align='center'>🚀 React Native Vanilla</h1>
  <p align='center'><img width="700" height="100" src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rn_exp.png?raw=true" /></p>
  <p align='center'>build universal cross-platform apps with <a href="https://facebook.github.io/react-native/">react native</a></p>
</p>

   <br />
    <br />
      <br />
<table>
  <tr>
    <th><a href="#ios">iOS</a></th><th><a href="#tvos">tvOS</a></th><th><a href="#android-tv">Android TV</a></th><th><a href="#macos">macOS</a></th><th><a href="#windows">Windows</a></th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_ios.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android-tv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_macos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_windows.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th><a href="#android">Android</a></th><th><a href="#web">Web</a></th><th><a href="#tizen-tv">Tizen TV</a></th><th><a href="#lg-webos">LG webOS</a></th><th><a href="#android-wear">Android Wear</a></th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tizen.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_webos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_androidwear.gif?raw=true" width="100" height="100" />
    </th>
  </tr>
</table>

<br />

[![npm version](https://img.shields.io/npm/v/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![npm downloads](https://img.shields.io/npm/dm/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![License MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pavjacko/react-native-vanilla/pulls)

> The most fundamental multi-platform project template based on [react native](https://facebook.github.io/react-native/). Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web`, `Tizen`, `LG webOS`, `macOS/OSX` and `Windows` platforms

-   Ideal starting point for advanced multi-platform projects.
-   Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
-   Includes bleeding edge dependencies configured to work with each other

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Get Started](#get-started)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Installation](#2-installation)
- [Architecture](#architecture)
- [iOS](#ios)
    - [Requirements](#requirements)
    - [Project Configuration](#project-configuration)
    - [Run](#run)
    - [Advanced](#advanced)
- [Android](#android)
    - [Requirements](#requirements-1)
    - [Project Configuration](#project-configuration-1)
    - [First time installation](#first-time-installation)
    - [Run](#run-1)
    - [Advanced](#advanced-1)
- [tvOS](#tvos)
    - [Requirements](#requirements-2)
    - [Project Configuration](#project-configuration-2)
    - [Run](#run-2)
    - [Advanced](#advanced-2)
- [Android TV](#android-tv)
    - [Requirements](#requirements-3)
    - [Project Configuration](#project-configuration-3)
    - [First time installation](#first-time-installation-1)
    - [Run](#run-3)
    - [Advanced](#advanced-3)
- [Web](#web)
    - [Requirements](#requirements-4)
    - [Project Configuration](#project-configuration-4)
    - [Run](#run-4)
    - [Advanced](#advanced-4)
- [Tizen TV](#tizen-tv)
    - [Requirements](#requirements-5)
    - [Project Configuration](#project-configuration-5)
    - [Emulator](#emulator)
    - [Run](#run-5)
- [LG webOS](#lg-webos)
    - [Requirements](#requirements-6)
    - [Project Configuration](#project-configuration-6)
    - [Emulator](#emulator-1)
    - [Run](#run-6)
- [macOS](#macos)
    - [Requirements](#requirements-7)
    - [Project Configuration](#project-configuration-7)
    - [Run](#run-7)
- [Windows](#windows)
    - [Requirements](#requirements-8)
    - [Project Configuration](#project-configuration-8)
    - [Run](#run-8)
    - [Distribute](#distribute)
- [Android Wear](#android-wear)
    - [Requirements](#requirements-9)
    - [Project Configuration](#project-configuration-9)
    - [First time installation](#first-time-installation-2)
    - [Run](#run-9)
- [RNV CLI](#rnv-cli)
- [Contributors](#contributors)
- [Discussions](#discussions)
- [Community](#community)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Features:

#### Development platform

| OS      |  Support   |
| ------- | :--------: |
| Mac     |   `YES`    |
| Windows |   `YES`    |
| Linux   | `untested` |

#### Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development

#### Stack / Libraries

-   [React](https://facebook.github.io/react/) `16.7.0-alpha.2` react library
-   [React Native](https://facebook.github.io/react-native/) `0.57.7` for building native apps using react
-   [Babel](http://babeljs.io/) `7.x.x` for ES6+ support

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_rocket.png?raw=true" width=50 height=50 />

## Get Started

#### 1. Prerequisites

The recommended way to run specific version of Node and NPM is to use NVM:

```
nvm install node 10.13.0
nvm alias default node 10.13.0
```

Tested / Recommended Node configurations:

| Node Version | NPM Version |
| ------------ | :---------: |
| `10.13.0`     |   `6.4.1`   |

#### 2. Installation

On the command prompt run the following commands

```sh
$ git clone git@github.com:pavjacko/react-native-vanilla.git

$ cd react-native-vanilla

$ npm run setup
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_arch.png?raw=true" width=50 height=50 />

## Architecture

Folder Structure

    .
    ├── appConfigs                  # Applications configuration files/assets
    │   └── helloWorld              # Example application
    │       ├── assets              # Cross platform assets
    │       └── config.json         # Application config
    ├── docs                        # Documentation files
    ├── packages                    # Local dependencies
    │   └── rvn                     # React Native Vanilla Build System `CLI`
    │       └── platformTemplates   # Platform specific Project Templates
    │           ├── android         # `Android` platform project
    │           ├── androidtv       # `Android TV` configured platform project
    │           ├── androidwear     # `Android Wear` configured platform project
    │           ├── ios             # `iOS` Xcode platform project
    │           ├── macos           # `macOS` Electron platform project
    │           ├── tizen           # `Tizen` platform project
    │           ├── tvos            # `tvOS` Xcode platform project
    │           ├── web             # `Web` platform project
    │           ├── webos           # `WebOS` platform project
    │           └── windows         # `Windows` desktop platform project
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    ├── src                         # Source files
    ├── tests                       # Automated tests
    ├── LICENSE
    └── README.md

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_ios.png?raw=true" width=50 height=50 />

## iOS

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
npm start
npm run ios
```

#### Advanced

```
npx rnv run -help
npx rnv run -p ios -s "iPhone 6 Plus"
npx rnv run -p ios -s "iPhone 6 Plus" --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_android.png?raw=true" width=50 height=50 />

## Android

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9
-   Support for Android JSC (improved support for JavascriptCore like ES6 syntax)

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        |             Version              |
| -------------- | :------------------------------: |
| Gradle         |            `4.10.1`              |
| Android Gradle |          `3.3.1`                 |
| Kotlin         |             `1.3.20`             |
| Target SDK     |               `27`               |
| JSC            | `org.webkit:android-jsc:r224109` |

#### First time installation

create file named `local.properties` in `<PROJECT_ROOT>/platforms/android`

with paths to your Android SDK. Usually:

```
ndk.dir=/Users/<USER>/Library/Android/sdk/ndk-bundle
sdk.dir=/Users/<USER>/Library/Android/sdk
```

#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run android
```

#### Advanced

```
npx rnv run -help
npx rnv run -p android -s "Nexus 9"
npx rnv run -p android -s "Nexus 9" --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

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
npm start
npm run tvos
```

#### Advanced

```
npx rnv run -help
npx rnv run -p tvos -s "Apple TV 4K"
npx rnv run -p tvos -s "Apple TV 4K" --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_androidtv.png?raw=true" width=50 height=50 />

## Android TV

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9
-   Support for Android JSC (improved support for JavascriptCore like ES6 syntax)

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        |             Version              |
| -------------- | :------------------------------: |
| Gradle         |            `4.10.1`              |
| Android Gradle |          `3.3.1`                 |
| Kotlin         |             `1.3.20`             |
| Target SDK     |               `27`               |
| JSC            | `org.webkit:android-jsc:r224109` |

#### First time installation

create file named `local.properties` in `<PROJECT_ROOT>/platforms/androidtv`

with paths to your Android SDK. Usually:

```
ndk.dir=/Users/<USER>/Library/Android/sdk/ndk-bundle
sdk.dir=/Users/<USER>/Library/Android/sdk
```

#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run androidtv
```

#### Advanced

```
npx rnv run -help
npx rnv run -p androidtv -s "Android TV 4K"
npx rnv run -p androidtb -s "Android TV 4K" --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_web.png?raw=true" width=200 height=50 />

## Web

-   Supports Chrome, Safari, Firefox, IE10+

#### Requirements

-   no extra requirements required

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| Webpack          |    `3.11.0`     |
| react-native-web |     `0.9.1`     |
| Babel Core       | `7.1.2` |

#### Run

```
npm run web
```

open browser URL: http://localhost:8080

#### Advanced

```
npx rnv run -help
npx rnv run -p web
npx rnv run -p web --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

-   Latest Tizen project
-   Support for Tizen 4.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `4.0`

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| Tizen Studio     |      `2.5`      |
| Tizen SDK        |      `4.0`      |
| react-native-web |     `0.9.1`     |
| Babel Core       |     `7.1.2`     |

Make sure you have tizen-cli configured in your env variables:

```
export PATH="<USER_PATH>/tizen-studio/tools/ide/bin:$PATH"
export PATH="<USER_PATH>/tizen-studio/tools/emulator/bin:$PATH"
```

#### Emulator

Make sure you have at least 1 TV VM setup

```
emulator-manager
```

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen4.png?raw=true" />
    </th>
  </tr>
</table>


```
em-cli list-vm

em-cli launch --name T-samsung-4.0-x86
```

#### Run

```
npm run tizen
```

or specific simulator:
```
npm run tizen T-samsung-4.0-x86
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

-   Latest LG webOS Project

#### Requirements

-   [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| cli-webos   |     `0.0.2`     |
| react-native-web |     `0.9.1`     |
| Babel Core       | `7.1.2` |

Make sure you have ares-cli configured in your env variables:

```
export PATH="<USER_PATH>/Library/webOS_TV_SDK/CLI/bin:$PATH"
```

Test above path by running
```
ares -V
```

#### Emulator

-   launch webOS emulator
usually located in something like:
```
<USER_PATH>/Library/webOS_TV_SDK/Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app
```

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/webos1.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

```
npm run webos
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_macos.png?raw=true" width=50 height=50 />

## macOS

-   support for OSX/macOS
-   Based on Electron

#### Requirements

-   n/a

#### Project Configuration

| Feature          |  Version  |
| ---------------- | :-------: |
| electron         |  `2.0.0`  |
| react-native-web |  `0.9.1`  |
| electron-builder | `20.28.2` |

#### Run

```
npm run macos
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_windows.png?raw=true" width=50 height=50 />

## Windows

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
npm run windows
```

#### Distribute

```
npm run windows:dist
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_androidwear.png?raw=true" width=50 height=50 />

## Android Wear

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9
-   Support for Android JSC (improved support for JavascriptCore like ES6 syntax)

#### Requirements

-   [Android Studio](https://developer.android.com/studio/index.html) for Android development
-   [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        |             Version              |
| -------------- | :------------------------------: |
| Gradle         |            `4.10.1`              |
| Android Gradle |          `3.3.1`                 |
| Kotlin         |             `1.3.20`             |
| Target SDK     |               `27`               |
| JSC            | `org.webkit:android-jsc:r224109` |

#### First time installation

create file named `local.properties` in `<PROJECT_ROOT>/platforms/androidwear`

with paths to your Android SDK. Usually:

```
ndk.dir=/Users/<USER>/Library/Android/sdk/ndk-bundle
sdk.dir=/Users/<USER>/Library/Android/sdk
```

#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
npm run androidwear
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_cli.png?raw=true" width=50 height=50 />

## RNV CLI

Commands:

```
//common.js
rnv --help              //Print help
rnv --version           //Print RNV Version

//runner.js
rnv run                 //Run app on simulator/device/browser
rnv package             //Package JS bundles
rnv build               //Build standalone package/app
rnv deploy              //Deploy app
rnv update              //Force Update Dependencies
rnv test                //Run Tests
rnv doc                 //Generate documentation

//target.js
rnv target create       //Create new target (i.e. simulator/ emulator)
rnv target remove       //Remove target (i.e. simulator/ emulator)
rnv target start        //Start target (i.e. simulator/ emulator)
rnv target quit         //Terminate target (i.e. simulator/ emulator)
rnv target list         //List of available targets (i.e. simulator/ emulator)

//app.js
rnv app configure       //Configure app based on selected appConfig (copy runtime, initialise, copy assets, versions)
rnv app switch          //Switch app to new appConfig (only copy runtime)
rnv app create          //Create new appConfig
rnv app remove          //Remove selected appConfig
rnv app list            //List available appConfigs
rnv app info            //Get info about current app configuration

//platform.js
rnv platform createAll  //Recreate all platformBuilds projects for selected appConfig
rnv platform updateAll  //Update all platformBuilds projects for selected appConfig
rnv platform list       //List available platform templates
rnv platform add        //Add new platform to current appConfig
rnv platform remove     //Remove selected platform from current appConfig

//plugin.js
rnv plugin:add          //Add new plugin to current appConfig
rnv plugin:remove       //Remove existing plugin from current appConfig
rnv plugin:list         //List all installed plugins for current appConfig

```

Examples:

```
rnv target create --name "XXXXX"
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_contributor.png?raw=true" width=50 height=50 />

## Contributors

| [<img src="https://avatars.githubusercontent.com/u/4638697?v=4" width="100px;"/><br /><sub><b>Pavel Jacko</b></sub>](https://github.com/pavjacko)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=pavjacko "Contributions") | [<img src="https://avatars.githubusercontent.com/u/1237997?v=4" width="100px;"/><br /><sub><b>Daniel Marino Ruiz</b></sub>](https://github.com/CHaNGeTe)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=CHaNGeTe "Contributions") | [<img src="https://avatars.githubusercontent.com/u/5989212?v=4" width="100px;"/><br /><sub><b>Sander Looijenga</b></sub>](https://github.com/sanderlooijenga)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=sanderlooijenga "Contributions") | [<img src="https://avatars1.githubusercontent.com/u/6653451?v=4" width="100px;"/><br /><sub><b>David Rielo</b></sub>](https://github.com/davidrielo)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=davidrielo "Contributions") |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_chat.png?raw=true" width=50 height=50 />

## Discussions

https://spectrum.chat/reactnativevanilla

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/feat/rnv/docs/ic_community.png?raw=true" width=50 height=50 />

## Community

Special thanks to open-source initiatives this project utilises, notably:

-   https://www.npmjs.com/package/react-native
-   https://www.npmjs.com/package/react-native-web
-   https://www.npmjs.com/package/webpack
-   https://www.npmjs.com/package/babel-cli
-   https://www.npmjs.com/package/electron

---

## LICENSE

[MIT](LICENSE)
