---
id: version-0.27.0-installation
title: Installation
sidebar_label: Installation
original_id: installation
---


<img src="https://renative.org/img/ic_quickstart.png" width=50 height=50 />

## Requirements

-   [Node](https://nodejs.org) `10.13.0` or newer
-   [NPM](https://npmjs.com/) `6.4.1` or newer
-   [Android Studio](https://developer.android.com/studio) (if you want to develop for Android)
-   [Xcode](https://developer.apple.com/xcode/) (if you want to develop for iOS/tvOS)
-   [Tizen Studio](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) (if you want to develop for Tizen)
-   [WebOS SDK](http://webostv.developer.lge.com/sdk/installation/) (if you want to develop for WebOS)
-   [KaiOS SDK](https://developer.kaiostech.com) (if you want to develop for KaiOS)



## Install ReNative CLI (rnv)

```bash
$ npm install rnv -g
```

## Create new app

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/cli_app_create1.gif" />
    </th>
  </tr>
</table>

```bash
$ rnv new
```

Follow steps in the terminal

## Run first app

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/terminal.png" />
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
