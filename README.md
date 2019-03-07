<p align='center'>
  <h1 align='center'>🚀 React Native Vanilla</h1>
  <p align='center'><img width="700" height="100" src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rn_logo_exp.png?raw=true" /></p>
  <p align='center'>build universal cross-platform apps with <a href="https://facebook.github.io/react-native/">react native</a></p>
</p>

   <br />
    <br />
      <br />
<table>
  <tr>
    <th><a href="#ios">iOS</a></th><th><a href="#tvos">tvOS</a></th><th><a href="#android-tv">Android TV</a></th><th><a href="#macos">macOS</a></th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_ios1.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android-tv.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_macos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th><a href="#android">Android</a></th><th><a href="#web">Web</a></th><th><a href="#tizen-tv">Tizen TV</a></th><th><a href="#lg-webos">LG webOS</a></th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android1.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tizen.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_webos.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th><a href="#tizen-watch">Tizen Watch</a></th><th><a href="#windows">Windows</a></th><th><a href="#android-wear">Android Wear</a></th><th><a href="#kaios">KaiOS</a></th>
  </tr>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tizenwatch.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_windows.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_androidwear.gif?raw=true" width="150" height="150" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_kaios.gif?raw=true" />
    </th>
  </tr>
</table>

<br />

[![npm version](https://img.shields.io/npm/v/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![npm downloads](https://img.shields.io/npm/dm/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![License MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pavjacko/react-native-vanilla/pulls)

> The most fundamental multi-platform project template based on [react native](https://facebook.github.io/react-native/). Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web`, `Tizen TV`, `Tizen Watch`, `LG webOS`, `macOS/OSX`, `Windows` and `KaiOS` platforms

-   Ideal starting point for advanced multi-platform projects.
-   Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
-   Includes bleeding edge dependencies configured to work with each other

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


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
- [RNV CLI](#rnv-cli)
- [Discussions](#discussions)
- [Contributors](#contributors)
- [Backers](#backers)
- [Sponsors](#sponsors)
- [Community](#community)
- [Stats](#stats)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## 🚀 Quick Start

##### 1) Install RNV

```bash
$ npm install react-native-vanilla@latest -g
```

##### 2) Create new app:

```bash
$ rnv app create
```

Follow steps in the terminal

##### 3) Create 3 separate terminal tabs/windows. use one to keep bundler running and other one for build commands

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/terminal.png?raw=true" />
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


---

## 🚀🚀 Features:

#### Development platform

| OS      |  Support   |
| ------- | :--------: |
| Mac     |   `YES`    |
| Windows |   `untested` PRs Welcome!    |
| Linux   | `untested` PRs Welcome! |

#### Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [RVM](https://rvm.io/) `1.29.7` or newer
-   [NPX](https://npmjs.com/) `10.2.0` or newer
-   [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development

#### Stack / Libraries

-   [React](https://facebook.github.io/react/) `16.8.3` react library
-   [React Native](https://facebook.github.io/react-native/) `0.58.5` for building native apps using react
-   [Babel](http://babeljs.io/) `7.x.x` for ES6+ support


#### Prerequisites

**NodeJS**

[Download NodeJS from here](https://nodejs.org/en/download/)

| Node Version | NPM Version |
| ------------ | :---------: |
| `10.13.0`     |   `6.4.1`   |


**Xcode (if you want to develop for iOS/tvOS)**

-   [Download Xcode from here](https://developer.apple.com/xcode/)

**CocoaPods (if you want to develop for iOS/tvOS)**

-   [Download Cocoapods from here](https://cocoapods.org/)

**Android Studio (if you want to develop for Android)**

-   [Download Android Studio from here](https://developer.android.com/studio)


**Tizen SDK (if you want to develop for Tizen)**

-   [Download Tizen Studio from here](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk)


**WebOS SDK (if you want to develop for WebOS)**

-   [Download WebOS SDK from here](http://webostv.developer.lge.com/sdk/installation/)


---


## 🚀🚀🚀 Advanced Configuration

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

#### App Configurations

Re-Generate platform projects (for helloWorld app config platforms):

```bash
rnv platform configure -c helloWorld
```

Configure your multi-platfrom app based on `./appConfigs/helloWorld` configuration:

```bash
rnv app configure -c helloWorld -u
```


---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_arch.png?raw=true" width=50 height=50 />

## Architecture

Build Process

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv1.png?raw=true" />
    </th>
  </tr>
</table>

Folder Structure (Generated Project)

    .
    ├── appConfigs                  # Applications configuration files/assets
    │   └── helloWorld              # Example application
    │       ├── assets              # Cross platform assets
    │       └── config.json         # Application config
    ├── entry                       # Entry point index files
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    └── src                         # Source files

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_ios.png?raw=true" width=50 height=50 />

## iOS

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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
rnv run -p ios
```

#### Advanced

Launch with specific iOS simulator

```
rnv run -p ios -t "iPhone 6 Plus"
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_android.png?raw=true" width=50 height=50 />

## Android

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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


#### Emulators

You can create variety of emulators via Android Studio IDE

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/android1.png?raw=true" />
    </th>
  </tr>
</table>


#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
rnv start
rnv run -p android
```

#### Advanced

Launch specific emulator:
```
rnv target launch -p android -t Nexus_5X_API_26
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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

Launch with specific tvOS simulator

```
rnv run -p tvos -t "Apple TV 4K"
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_androidtv.png?raw=true" width=50 height=50 />

## Android TV

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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


#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
rnv start
rnv run -p androidtv
```

#### Advanced

Launch specific emulator:
```
rnv target launch -p androidtv -t Android_TV_720p_API_22
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_web.png?raw=true" width=200 height=50 />

## Web

-   Supports Chrome, Safari, Firefox, IE10+

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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
rnv run -p web
```

open browser URL: http://0.0.0.0:8080/

#### Advanced

```
rnv run -p web --info
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

-   Latest Tizen project
-   Support for Tizen 5.0

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| Tizen Studio     |      `2.5`      |
| Tizen SDK        |      `5.0`      |
| react-native-web |     `0.9.9`     |
| Babel Core       |     `7.1.2`     |


#### Emulator

Make sure you have at least 1 TV VM setup


<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen4.png?raw=true" />
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

Launch with specific Tizen simulator:

```
rnv run -p tizen -t T-samsung-5.0-x86
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tizenwatch.png?raw=true" width=50 height=50 />

## Tizen Watch

-   Latest Tizen project
-   Support for Tizen 5.0

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| Tizen Studio     |      `2.5`      |
| Tizen SDK        |      `5.0`      |
| react-native-web |     `0.9.9`     |
| Babel Core       |     `7.1.2`     |


#### Emulator

Make sure you have at least 1 TV VM setup


<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizenwatch1.png?raw=true" />
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

Launch with specific Tizen Watch simulator:

```
rnv run -p tizenwatch -t W-5.0-circle-x86
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

-   Latest LG webOS Project

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

#### Requirements

-   [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| react-native-web |     `0.9.9`     |
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

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/webos1.png?raw=true" />
    </th>
  </tr>
</table>

#### Run

```
rnv run -p webos
```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_macos.png?raw=true" width=50 height=50 />

## macOS

-   support for OSX/macOS
-   Based on Electron

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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


---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_windows.png?raw=true" width=50 height=50 />

## Windows

-   support for Windows 10+
-   Based on Electron

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_androidwear.png?raw=true" width=50 height=50 />

## Android Wear

-   Latest Android project
-   Kotlin Support
-   Support for Gradle 4.9

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

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



#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p androidwear
```

#### Advanced

Launch specific emulator:

```
rnv target launch -p androidwear -t Android_Wear_Round_API_28
```



---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_kaios.png?raw=true" width=140 height=50 />

## KaiOS

-   

#### Supported OS

| Mac      |  Windows   |  Linux        |
| :--------: | :--------: | :--------: |
|   `YES`    |   `NO`    | `NO` |

#### Requirements

-   [KaiOSrt](https://developer.kaiostech.com/simulator) for emulator

After installation you can launch it via Applications:

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/kaios1.png?raw=true" />
    </th>
  </tr>
</table>


#### Project Configuration

| Feature        |             Version              |
| -------------- | :------------------------------: |
|          |                     |




#### Run

NOTE: make sure you have 1 android wear device connected or 1 wear emulator running

```
rnv run -p kaios
```



---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_cli.png?raw=true" width=50 height=50 />

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
rnv platform create  //Recreate all platformBuilds projects for selected appConfig
rnv platform update  //Update all platformBuilds projects for selected appConfig
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
rnv setup

rnv platform configure -c helloWorld

rnv app configure -c helloWorld

rnv app configure -c helloWorld -u

rnv run -p ios -t "iPhone 6"
rnv run -p tvos
rnv run -p tizen
rnv run -p web
rnv run -p tizen -t T-samsung-5.0-x86
rnv run -p webos -t emulator
rnv run -p android
rnv run -p androidtv
rnv run -p androidwear
rnv run -p macos
rnv run -p windows

rnv target launch -p android -t Nexus_5X_API_26
rnv target launch -p androidtv -t Android_TV_720p_API_22
rnv target launch -p androidwear -t Android_Wear_Round_API_28
rnv target launch -p tizen -t T-samsung-5.0-x86
rnv target launch -p webos -t emulator


```

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_chat.png?raw=true" width=50 height=50 />

## Discussions

https://spectrum.chat/reactnativevanilla

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_contributor.png?raw=true" width=50 height=50 />

## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).

<a href="graphs/contributors"><img src="https://opencollective.com/react-native-vanilla/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/react-native-vanilla#backer)]

<a href="https://opencollective.com/react-native-vanilla#backers" target="_blank"><img src="https://opencollective.com/react-native-vanilla/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/react-native-vanilla#sponsor)]

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_community.png?raw=true" width=50 height=50 />

## Community

Special thanks to open-source initiatives this project utilises, notably:

-   https://www.npmjs.com/package/react-native
-   https://www.npmjs.com/package/react-native-web
-   https://www.npmjs.com/package/webpack
-   https://www.npmjs.com/package/babel-cli
-   https://www.npmjs.com/package/electron

---

## Stats

[![NPM](https://nodei.co/npm/react-native-vanilla.png)](https://nodei.co/npm/react-native-vanilla/)

## LICENSE

[MIT](LICENSE)
