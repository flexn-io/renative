# react-native-vanilla
Most fundamental multi-platform project template based on react native. Includes latest `iOS`, `tvOS`, `Android`, `Android TV`, `Web` and `Tizen` platforms

* Ideal starting point for advanced multi-platform projects.
* Uses latest vanilla native project templates including Xcode with Swift and Android with Kotlin support
* Includes bleeding edge dependencies configured to work with each other

<p align="center">
  <img width="100" height="100" src="https://github.com/pavjacko/react-native-vanilla/blob/feature/tizen/docs/rn.png" />
<p>
<table>
  <tr>
    <th>iOS</th><th>Android</th><th>tvOS</th><th>Android TV</th><th>Web</th><th>Tizen</th>
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
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/master/docs/rnv_web.gif?raw=true" />
    </th><th>
    <img src="https://github.com/pavjacko/react-native-vanilla/blob/feature/tizen/docs/rnv_tizen1.gif" />
    </th>
  </tr>
</table>

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

#### Get Started

##### 1. Prerequisite

The recommended way to run specific version of Node and NPM is to use NVM:

```
nvm install node 10.8.0
nvm alias default node
```

Recommended Node configuration:
* Node v10.8.0
* npm v6.2.0


##### 2. Installation

On the command prompt run the following commands

```sh
$ git clone git@github.com:pavjacko/react-native-vanilla.git

$ cd react-native-vanilla

$ npm run setup
```


# iOS
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

# Android
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

# tvOS
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

# Android TV
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

# Web
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

# Tizen
- Latest Tizen project
- Support for Tizen 4.0

#### Requirements
- [Tizen Studio](https://developer.tizen.org/development/tizen-studio/)
- [Tizen SDK](https://developer.android.com/sdk/) `4.0`


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
