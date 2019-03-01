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
- [Quick Start](#quick-start)
- [Advanced Configuration](#advanced-configuration)
    - [Global Configurations](#global-configurations)
    - [App Configurations](#app-configurations)
    - [Clean Project](#clean-project)
- [Architecture](#architecture)
- [iOS](#ios)
    - [Supported OS](#supported-os)
    - [Requirements](#requirements)
    - [Project Configuration](#project-configuration)
    - [Run](#run)
    - [Advanced](#advanced)
- [Android](#android)
    - [Supported OS](#supported-os-1)
    - [Requirements](#requirements-1)
    - [Project Configuration](#project-configuration-1)
    - [Emulators](#emulators)
    - [Run](#run-1)
    - [Advanced](#advanced-1)
- [tvOS](#tvos)
    - [Supported OS](#supported-os-2)
    - [Requirements](#requirements-2)
    - [Project Configuration](#project-configuration-2)
    - [Run](#run-2)
    - [Advanced](#advanced-2)
- [Android TV](#android-tv)
    - [Supported OS](#supported-os-3)
    - [Requirements](#requirements-3)
    - [Project Configuration](#project-configuration-3)
    - [Run](#run-3)
    - [Advanced](#advanced-3)
- [Web](#web)
    - [Supported OS](#supported-os-4)
    - [Requirements](#requirements-4)
    - [Project Configuration](#project-configuration-4)
    - [Run](#run-4)
    - [Advanced](#advanced-4)
- [Tizen TV](#tizen-tv)
    - [Supported OS](#supported-os-5)
    - [Requirements](#requirements-5)
    - [Project Configuration](#project-configuration-5)
    - [Emulator](#emulator)
    - [Run](#run-5)
    - [Advanced](#advanced-5)
- [LG webOS](#lg-webos)
    - [Supported OS](#supported-os-6)
    - [Requirements](#requirements-6)
    - [Project Configuration](#project-configuration-6)
    - [Emulator](#emulator-1)
    - [Run](#run-6)
    - [Advanced](#advanced-6)
- [macOS](#macos)
    - [Supported OS](#supported-os-7)
    - [Requirements](#requirements-7)
    - [Project Configuration](#project-configuration-7)
    - [Run](#run-7)
  - [Advanced](#advanced-7)
- [Windows](#windows)
    - [Supported OS](#supported-os-8)
    - [Requirements](#requirements-8)
    - [Project Configuration](#project-configuration-8)
    - [Run](#run-8)
  - [Advanced](#advanced-8)
- [Android Wear](#android-wear)
    - [Supported OS](#supported-os-9)
    - [Requirements](#requirements-9)
    - [Project Configuration](#project-configuration-9)
    - [Run](#run-9)
    - [Advanced](#advanced-9)
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

## Supported Modes:

<table>
  <tr>
    <th><a href="#">Clone</a></th><th><a href="#">Global CLI</a></th><th><a href="#">NPM Dependency</a></th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/mode_git_grey.png?raw=true" />
    <br/>
      git clone react-native-vanilla.git
      </td><td>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/mode_cli_grey.png?raw=true" />
    <br/>
      npm install react-native-vanilla -g
    </td><td>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/mode_npm_grey.png?raw=true" />
    <br/>
    npm install react-native-vanilla
    </td>
  </tr>
  <tr>
  <th>
  </th>
    <th>
      COMIN SOON
    </th><th>
    COMIN SOON
    </th>
  </tr>
</table>


## Features:

#### Development platform

| OS      |  Support   |
| ------- | :--------: |
| Mac     |   `YES`    |
| Windows |   `untested` PRs Welcome!    |
| Linux   | `untested` PRs Welcome! |

#### Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development

#### Stack / Libraries

-   [React](https://facebook.github.io/react/) `16.8.3` react library
-   [React Native](https://facebook.github.io/react-native/) `0.58.5` for building native apps using react
-   [Babel](http://babeljs.io/) `7.x.x` for ES6+ support

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_rocket.png?raw=true" width=50 height=50 />

## Get Started

#### 1. Prerequisites

**RVM**

```bash
$ brew install gnupg
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
$ \curl -sSL https://get.rvm.io | bash
$ source ~/.rvm/scripts/rvm
```

or update rvm to latest

```bash
$ rvm get stable
```

**NVM**

```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bashrc
```

If you already have nvm, update to latest:

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

**NodeJS**

The recommended way to run specific version of Node and NPM is to use NVM:

```bash
$ nvm install node 10.13.0
$ nvm alias default node 10.13.0
```

Tested / Recommended Node configurations:

| Node Version | NPM Version |
| ------------ | :---------: |
| `10.13.0`     |   `6.4.1`   |

**NPX**

```bash
$ npm install -g npx
```

**CocoaPods**

```bash
$ sudo gem install cocoapods
```

**Xcode (if you want to develop for iOS/tvOS)**

-   [Download Xcode from here](https://developer.apple.com/xcode/)


**Android Studio (if you want to develop for Android)**

-   [Download Android Studio from here](https://developer.android.com/studio)

after installation complete your Android SDK should be located here:

```
/Users/<USER>/Library/Android/sdk
```

**Tizen SDK (if you want to develop for Tizen)**

-   [Download Tizen Studio from here](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk)

after installation complete your Tizen SDK should be located here:

```
/Users/<USER>/tizen-studio/
```

**WebOS SDK (if you want to develop for WebOS)**

-   [Download WebOS SDK from here](http://webostv.developer.lge.com/sdk/installation/)

after installation complete your WebOS SDK should be located here:

```
/Users/<USER>/Library/webOS_TV_SDK/
```

## Quick Start

```bash
$ git clone git@github.com:pavjacko/react-native-vanilla.git

$ cd react-native-vanilla

$ npm i

```

At this point you need to keep bundler running. Ideally create 3 separate terminal tabs/windows. use one to keep bundler running and other one for build commands

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/terminal.png?raw=true" />
    </th>
  </tr>
</table>

TAB 1:

Start the bundler

```bash
$ npm start
```

TAB 2:

Run your first `ios` app

```bash
$ npm run ios
```

TAB 3:

Run your first `web` app

```bash
$ npm run web
```

open: http://0.0.0.0:8080/


🚀 Congratulations! You're now multi-platform developer! 🚀


## Advanced Configuration

#### Global Configurations

`npm install` will create config folder at this location: `~./rnv/config.json`

Open the file and edit SDK paths of platforms you plan to use:

```json
{
  "sdks": {
    "ANDROID_SDK": "/Users/<USER>/Library/Android/sdk",
    "ANDROID_NDK": "/Users/<USER>/Library/Android/sdk/ndk-bundle",
    "IOS_SDK": "No need. Just install Xcode",
    "TIZEN_SDK": "/Users/<USER>/tizen-studio",
    "WEBOS_SDK": "/Users/<USER>/Library/webOS_TV_SDK"
  }
}
```

#### App Configurations

Re-Generate platform projects (for helloWorld app config platforms):

```bash
npx rnv platform configure -c helloWorld
```

Configure your multi-platfrom app based on `./appConfigs/helloWorld` configuration:

```bash
npx rnv app configure -c helloWorld -u
```

#### Clean Project

Sometimes you might want to clean your project and start fresh. It's simple!:

```bash
npm run clean && npm i
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

Folder Structure

    .
    ├── appConfigs                  # Applications configuration files/assets
    │   └── helloWorld              # Example application
    │       ├── assets              # Cross platform assets
    │       └── config.json         # Application config
    ├── docs                        # Documentation files
    ├── entry                       # Entry point index files
    ├── packages                    # Local dependencies
    │   └── rnv                     # React Native Vanilla Build System `CLI`
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
npm start
npm run ios
```

#### Advanced

```
npx rnv run -help
npx rnv run -p ios -t "iPhone 6 Plus"
npx rnv run -p ios -t "iPhone 6 Plus" --info
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
npm start
npm run android
```

#### Advanced

Launch specific emulator:
```
npx rnv target launch -p android -t Nexus_5X_API_26
```

Run via RNV CLI

```
npx rnv run -p android
npx rnv run -p android --info
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
npm start
npm run tvos
```

#### Advanced

```
npx rnv run -help
npx rnv run -p tvos -t "Apple TV 4K"
npx rnv run -p tvos -t "Apple TV 4K" --info
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
npm start
npm run androidtv
```

#### Advanced

Launch specific emulator:
```
npx rnv target launch -p androidtv -t Android_TV_720p_API_22
```

Run via RNV CLI

```
npx rnv run -p androidtv
npx rnv run -p androidtv --info
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
npm run web
```

open browser URL: http://0.0.0.0:8080/

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

```
npx rnv target list
```

<table>
  <tr>
    <th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen4.png?raw=true" />
    </th>
  </tr>
</table>


```
npx rnv target launch -p tizen -t T-samsung-5.0-x86
```

#### Run

```
npm run tizen
```

#### Advanced

or specific simulator:

```
npx rnv run -p tizen -t T-samsung-5.0-x86
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
npx rnv target launch -p webos -t emulator
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
npm run webos
```

#### Advanced


Run via RNV CLI

```
npx rnv run -p webos -t emulator
npx rnv run -p webos -t emulator --info
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
npm run macos
```

### Advanced

Run via RNV CLI

```
npx rnv run -p macos
npx rnv run -p macos --info
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
npm run windows
```

### Advanced

Run via RNV CLI

```
npx rnv run -p windows
npx rnv run -p windows --info
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
npm run androidwear
```

#### Advanced

Launch specific emulator:
```
npx rnv target launch -p androidwear -t Android_Wear_Round_API_28
```

Run via RNV CLI

```
npx rnv run -p androidwear
npx rnv run -p androidwear --info
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
npx rnv setup

npx rnv platform configure -c helloWorld

npx rnv app configure -c helloWorld

npx rnv app configure -c helloWorld -u

npx rnv run -p ios -t "iPhone 6"
npx rnv run -p tvos
npx rnv run -p tizen
npx rnv run -p web
npx rnv run -p tizen -t T-samsung-5.0-x86
npx rnv run -p webos -t emulator
npx rnv run -p android
npx rnv run -p androidtv
npx rnv run -p androidwear
npx rnv run -p macos
npx rnv run -p windows

npx rnv target launch -p android -t Nexus_5X_API_26
npx rnv target launch -p androidtv -t Android_TV_720p_API_22
npx rnv target launch -p androidwear -t Android_Wear_Round_API_28
npx rnv target launch -p tizen -t T-samsung-5.0-x86
npx rnv target launch -p webos -t emulator


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
