<p align="center">
  <img width="800" height="100" src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rn_exp.png?raw=true" />
<p>
  <h1 align="center">react-native-vanilla</h1>
<table>
  <tr>
    <th>iOS</th><th>Android</th><th>tvOS</th><th>Android TV</th>
  </tr>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_ios.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tvos.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_android-tv.gif?raw=true" />
    </th>
  </tr>
  <tr>
    <th colspan=2>Web</th><th>Tizen</th><th>LG webOS</th>
  </tr>
  <tr>
    <th colspan=2>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_tizen1.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_webos.gif?raw=true" />
    </th>
  </tr>
</table>

[![npm version](https://img.shields.io/npm/v/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![npm downloads](https://img.shields.io/npm/dm/react-native-vanilla.svg?style=flat-square)](https://www.npmjs.com/package/react-native-vanilla)
[![License MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pavjacko/react-native-vanilla/pulls)

> Most fundamental multi-platform project template based on [react native](https://facebook.github.io/react-native/). Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web`, `Tizen` and `LG webOS` platforms

* Ideal starting point for advanced multi-platform projects.
* Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
* Includes bleeding edge dependencies configured to work with each other

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features:](#features)
    - [Development platform](#development-platform)
    - [Requirements](#requirements)
    - [Stack / Libraries](#stack--libraries)
- [Get Started](#get-started)
    - [1. Prerequisite](#1-prerequisite)
    - [2. Installation](#2-installation)
- [iOS](#ios)
    - [Requirements](#requirements-1)
    - [Project Configuration](#project-configuration)
    - [Run](#run)
- [Android](#android)
    - [Requirements](#requirements-2)
    - [Project Configuration](#project-configuration-1)
    - [Run](#run-1)
- [tvOS](#tvos)
    - [Requirements](#requirements-3)
    - [Project Configuration](#project-configuration-2)
    - [Run](#run-2)
- [Android TV](#android-tv)
    - [Requirements](#requirements-4)
    - [Project Configuration](#project-configuration-3)
    - [Run](#run-3)
- [Web](#web)
    - [Requirements](#requirements-5)
    - [Project Configuration](#project-configuration-4)
    - [Run](#run-4)
- [Tizen](#tizen)
    - [Requirements](#requirements-6)
    - [Project Configuration](#project-configuration-5)
    - [Run](#run-5)
- [LG webOS](#lg-webos)
    - [Requirements](#requirements-7)
    - [Project Configuration](#project-configuration-6)
    - [Run](#run-6)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---
## Features:

#### Development platform

| OS        | Support |
| ------------- |:-------------:|
| Mac      | `YES`  |
| Windows      | `untested`  |
| Linux      | `untested`  |

#### Requirements
- [Node](https://nodejs.org) `8.x` or newer
- [NPM](https://npmjs.com/) `6.2.0` or newer
- [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development

#### Stack / Libraries
- [React](https://facebook.github.io/react/) `16.4.1` react library
- [React Native](https://facebook.github.io/react-native/) `0.56.0` for building native apps using react
- [Babel](http://babeljs.io/) `7.x.x` for ES6+ support

---
## Get Started

#### 1. Prerequisite

The recommended way to run specific version of Node and NPM is to use NVM:

```
nvm install node 10.8.0
nvm alias default node
```

Recommended Node configuration:
* Node v10.8.0
* npm v6.2.0


#### 2. Installation

On the command prompt run the following commands

```sh
$ git clone git@github.com:pavjacko/react-native-vanilla.git

$ cd react-native-vanilla

$ npm run setup
```

---
## iOS

- Latest swift based Xcode project
- Cocoapods Workspace ready
- Swift 4.1 Support

#### Requirements
- [CocoaPods](https://cocoapods.org) `1.5.3` or newer
- [Xcode](https://developer.apple.com/xcode/) for iOS development
- [CocoaPods](https://cocoapods.org/) `1.4.0` for iOS libraries

#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Swift      | `4.1`  |
| Deployment Target      | `11.4`  |

#### Run

```
npm start
npm run ios
```

---
## Android

- Latest Android project
- Kotlin Support
- Support for Gradle 4.9
- Support for Android JSC (improved support for JavascriptCore like ES6 syntax)

#### Requirements
- [Android Studio](https://developer.android.com/studio/index.html) for Android development
- [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development

#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Gradle      | `4.9-RC1`  |
| Android Gradle | `3.3.0-ALPHA3`  |
| Kotlin | `1.2.50`  |
| Target SDK      | `27`  |
| JSC      | `org.webkit:android-jsc:r216113`  |

#### Run
NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run android
```

---
## tvOS

- Latest swift based Xcode project
- Cocoapods Workspace ready
- Swift 4.1 Support

#### Requirements
- [CocoaPods](https://cocoapods.org) `1.5.3` or newer
- [Xcode](https://developer.apple.com/xcode/) for iOS development
- [CocoaPods](https://cocoapods.org/) `1.4.0` for iOS libraries

#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Swift      | `4.1`  |
| Deployment Target      | `11.4`  |

#### Run

```
npm start
npm run tvos
```

---
## Android TV

- Latest Android project
- Kotlin Support
- Support for Gradle 4.9
- Support for Android JSC (improved support for JavascriptCore like ES6 syntax)

#### Requirements
- [Android Studio](https://developer.android.com/studio/index.html) for Android development
- [Android SDK](https://developer.android.com/sdk/) `23.0.1` or newer for Android development


#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Gradle      | `4.9-RC1`  |
| Android Gradle | `3.3.0-ALPHA3`  |
| Kotlin | `1.2.50`  |
| Target SDK      | `27`  |
| JSC      | `org.webkit:android-jsc:r216113`  |

#### Run
NOTE: make sure you have 1 android device connected or 1 emulator running

```
npm start
npm run androidtv
```

---
## Web

- Supports Chrome, Safari, Firefox, IE10+

#### Requirements
- no extra requirements required

#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Webpack      | `3.11.0`  |
| react-native-web      | `0.8.9`  |
| Babel Core     | `7.0.0-beta.47`  |

#### Run

```
npm run web
```
open browser URL: http://localhost:8080

---
## Tizen

- Latest Tizen project
- Support for Tizen 4.0

#### Requirements
- [Tizen Studio](https://developer.tizen.org/development/tizen-studio/) 2.4
- [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `4.0`


#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| Tizen Studio     | `2.5`  |
| Tizen SDK | `4.0`  |
| react-native-web      | `0.8.9`  |
| Babel Core     | `7.0.0-beta.47`  |

#### Run

```
npm run tizen:build
```

* Open project in Tizen Studio <PROJECT_ROOT>/tizen
* Run app

---
## LG webOS

- Latest LG webOS Project

#### Requirements
- [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0


#### Project Configuration

| Feature        | Version |
| ------------- |:-------------:|
| ares-webos-sdk | `1.7.x`  |
| react-native-web      | `0.8.9`  |
| Babel Core     | `7.0.0-beta.47`  |

#### Run

* launch webOS emulator

```
npm run webos:build
npm run webos:install
```

## Contributors


| [<img src="https://avatars.githubusercontent.com/u/4638697?v=4" width="100px;"/><br /><sub><b>Pavel Jacko</b></sub>](https://github.com/pavjacko)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=pavjacko "Contributions") | [<img src="https://avatars.githubusercontent.com/u/1237997?v=4" width="100px;"/><br /><sub><b>Daniel Marino Ruiz</b></sub>](https://github.com/CHaNGeTe)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=CHaNGeTe "Contributions") | [<img src="https://avatars.githubusercontent.com/u/5989212?v=4" width="100px;"/><br /><sub><b>Sander Looijenga</b></sub>](https://github.com/sanderlooijenga)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=sanderlooijenga "Contributions") | [<img src="https://avatars1.githubusercontent.com/u/6653451?v=4" width="100px;"/><br /><sub><b>David Rielo</b></sub>](https://github.com/davidrielo)<br />[📖](https://github.com/pavjacko/react-native-vanilla/commits?author=davidrielo "Contributions") |
| :---: | :---: | :---: | :---: |

## LICENSE

MIT
