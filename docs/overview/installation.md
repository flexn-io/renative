---
id: installation
title: Installation
sidebar_label: Installation
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

Run your first `ios` app

```bash
$ rnv run -p ios
```

Run your first `android` app

```bash
$ rnv run -p android
```

Run your first `web` app

```bash
$ rnv run -p web
```

... and so on

All app code is located in `./src` directory

## NPX

⚠️

It is recommended that after initial project setup you start using `npx rnv ...` prefix instead of `rnv ...`

This ensures that every project uses correct version of `rnv` to avoid potential compatibility issues

make sure you have npx installed globally via `npm install npx -g`
