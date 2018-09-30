<p align='center'>
  <h1 align='center'>React Native Vanilla</h1>
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
    <th><a href="#android">Android</a></th><th><a href="#web">Web</a></th><th><a href="#tizen">Tizen</a></th><th><a href="#lg-webos">LG webOS</a></th><th><a href="#"></a></th>
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
        ...
    </th>
  </tr>
</table>

<br />

[![npm version](https://img.shields.io/npm/v/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![npm downloads](https://img.shields.io/npm/dm/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![License MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pavjacko/react-native-vanilla/pulls)

> Most fundamental multi-platform project template based on [react native](https://facebook.github.io/react-native/). Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web`, `Tizen`, `LG webOS`, `macOS/OSX` and `Windows` platforms

-   Ideal starting point for advanced multi-platform projects.
-   Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
-   Includes bleeding edge dependencies configured to work with each other

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

-   [Get Started](#get-started)
    -   [1. Prerequisite](#1-prerequisite)
    -   [2. Installation](#2-installation)
-   [Architecture](#architecture)
-   [iOS](#ios)
    -   [Requirements](#requirements)
    -   [Project Configuration](#project-configuration)
    -   [Run](#run)
-   [Android](#android)
    -   [Requirements](#requirements-1)
    -   [Project Configuration](#project-configuration-1)
    -   [Run](#run-1)
-   [tvOS](#tvos)
    -   [Requirements](#requirements-2)
    -   [Project Configuration](#project-configuration-2)
    -   [Run](#run-2)
-   [Android TV](#android-tv)
    -   [Requirements](#requirements-3)
    -   [Project Configuration](#project-configuration-3)
    -   [Run](#run-3)
-   [Web](#web)
    -   [Requirements](#requirements-4)
    -   [Project Configuration](#project-configuration-4)
    -   [Run](#run-4)
-   [Tizen](#tizen)
    -   [Requirements](#requirements-5)
    -   [Project Configuration](#project-configuration-5)
    -   [Run](#run-5)
-   [LG webOS](#lg-webos)
    -   [Requirements](#requirements-6)
    -   [Project Configuration](#project-configuration-6)
    -   [Run](#run-6)
-   [macOS](#macos)
    -   [Requirements](#requirements-7)
    -   [Project Configuration](#project-configuration-7)
    -   [Run](#run-7)
-   [Windows](#windows)
    -   [Requirements](#requirements-8)
    -   [Project Configuration](#project-configuration-8)
    -   [Run](#run-8)
    -   [Distribute](#distribute)
-   [Contributors](#contributors)
-   [Discussions](#discussions)
-   [Community](#community)
-   [LICENSE](#license)

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

-   [Node](https://nodejs.org) `8.x` or newer
-   [NPM](https://npmjs.com/) `6.2.0` or newer
-   [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development

#### Stack / Libraries

-   [React](https://facebook.github.io/react/) `16.5.1` react library
-   [React Native](https://facebook.github.io/react-native/) `0.57.1` for building native apps using react
-   [Babel](http://babeljs.io/) `7.x.x` for ES6+ support

---

## Get Started

#### 1. Prerequisites

The recommended way to run specific version of Node and NPM is to use NVM:

```
nvm install node 8.11.4
nvm alias default node 8.11.4
```

Tested / Recommended Node configurations:

| Node Version | NPM Version |
| ------------ | :---------: |
| `8.11.4`     |   `5.6.0`   |

#### 2. Installation

On the command prompt run the following commands

```sh
$ git clone git@github.com:pavjacko/react-native-vanilla.git

$ cd react-native-vanilla

$ npm run setup
```

---

## Architecture

Folder Structure

    .
    ├── assets                   # Cross platfrom assets
    ├── docs                     # Documentation files
    ├── platforms                # Platform specific projects / code
    │   ├── android              # Android platform project
    │   ├── androidtv            # Android TV convigured platform project
    │   ├── ios                  # iOS Xcode platform project
    │   ├── macos                # macOS Electron platform project
    │   ├── tizen                # Tizen platform project
    │   ├── tvos                 # tvOS Xcode platform project
    │   ├── web                  # Webpack based project
    │   ├── webos                # Web OS platform project
    ├── src                      # Source files
    ├── tests                    # Automated tests
    ├── utils                    # Tools and utilities
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
| Gradle         |            `4.9-RC1`             |
| Android Gradle |          `3.3.0-ALPHA3`          |
| Kotlin         |             `1.2.50`             |
| Target SDK     |               `27`               |
| JSC            | `org.webkit:android-jsc:r224109` |

#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run android
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
| Gradle         |            `4.9-RC1`             |
| Android Gradle |          `3.3.0-ALPHA3`          |
| Kotlin         |             `1.2.50`             |
| Target SDK     |               `27`               |
| JSC            | `org.webkit:android-jsc:r224109` |

#### Run

NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run androidtv
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

---

<img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen

-   Latest Tizen project
-   Support for Tizen 4.0

#### Requirements

-   [Tizen Studio](https://developer.tizen.org/development/tizen-studio/) 2.4
-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `4.0`

#### Project Configuration

| Feature          |     Version     |
| ---------------- | :-------------: |
| Tizen Studio     |      `2.5`      |
| Tizen SDK        |      `4.0`      |
| react-native-web |     `0.9.1`     |
| Babel Core       |     `7.1.2`     |

#### Run

```
npm run tizen:build
```

-   Open project in Tizen Studio <PROJECT_ROOT>/tizen
-   Run app

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen1.png?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen2.png?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen3.png?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen4.png?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/tizen5.png?raw=true" />
    </th>
  </tr>
</table>

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

#### Run

-   launch webOS emulator

```
npm run webos:build
npm run webos:install
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

## Contributors

| [<img src="https://avatars.githubusercontent.com/u/4638697?v=4" width="100px;"/><br /><sub><b>Pavel Jacko</b></sub>](https://github.com/pavjacko)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=pavjacko "Contributions") | [<img src="https://avatars.githubusercontent.com/u/1237997?v=4" width="100px;"/><br /><sub><b>Daniel Marino Ruiz</b></sub>](https://github.com/CHaNGeTe)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=CHaNGeTe "Contributions") | [<img src="https://avatars.githubusercontent.com/u/5989212?v=4" width="100px;"/><br /><sub><b>Sander Looijenga</b></sub>](https://github.com/sanderlooijenga)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=sanderlooijenga "Contributions") | [<img src="https://avatars1.githubusercontent.com/u/6653451?v=4" width="100px;"/><br /><sub><b>David Rielo</b></sub>](https://github.com/davidrielo)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=davidrielo "Contributions") |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


---

## Discussions

> coming soon

---

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
