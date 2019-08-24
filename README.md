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
  <!-- <a href="#platforms">Platforms</a> &bull; -->
  <a href="#templates--starters">Templates</a> &bull;
  <a href="#plugins">Plugins</a> &bull;
  <a href="#integrations">Integrations</a> &bull;
  <a href="#json-configurations">JSON Configurations</a> &bull;
  <a href="#folder-configurations">Folder Configurations</a> &bull;
  <a href="#build-hooks">Build Hooks</a> &bull;
  <a href="#cli">CLI</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#developing-renative">Developing ReNative</a> &bull;
  <a href="#common-issues">Common Issues</a> &bull;
  <a href="#runtime">Runtime</a> &bull;
  <!-- <a href="#contributing">Contributing</a> &bull; -->
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


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_quickstart.png?raw=true" width=50 height=50 />

## Quick Start


```bash
$ npm install rnv -g

$ rnv new
```

[Get Started (with more in-depth info)](docs/DOC_GET_STARTED.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_features.png?raw=true" width=50 height=50 />

## Features

- Learn
- Write
- Build
- Integrate
- Debug
- Test
- Deploy


[Explore ReNative Features](docs/DOC_FEATURES.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_templates.png?raw=true" width=50 height=50 />

## Templates / Starters

Too lazy to build your idea from scratch? use one of the predefined & community templates to get you started in no time.

[Documentation for ReNative Templates and Starters](docs/DOC_TEMPLATES.md)


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_plugins.png?raw=true" width=50 height=50 />

## Plugins

ReNative supports standard community driven react-native plugins you can use to enhance the functionality of your apps:

[Documentation for ReNative Plugins](docs/DOC_PLUGINS.md)

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_integrations.png?raw=true" width=50 height=50 />

## Integrations

ReNative supports integration for various services and deployment infrastructures for your apps

[Documentation for ReNative Integrations](docs/DOC_INTEGRATIONS.md)


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

## Developing ReNative

If you need full control over whole ReNative build you can clone and develop it locally

[Documentation for Developing ReNative](docs/DOC_DEVELOP.md)

## Common Issues

---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_issues.png?raw=true" width=50 height=50 />

If you face unexpected issues always good to check if there is a quick solution for it

[List of common problems and how to solve them](docs/DOC_COMMON_ISSUES.md)

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
