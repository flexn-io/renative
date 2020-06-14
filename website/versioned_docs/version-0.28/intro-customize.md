---
id: version-0.28-intro-customize
title: Customize ReNative Project
sidebar_label: Customize ReNative
original_id: intro-customize
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview

ReNative allows you to customize, extend or override pretty much anything.

## Override file provided by ReNative

Let's imagine you want to override one of the files generated in `./platformBuilds/[APP_ID]_[PLATFORM]/[FILE_PATH]`

you can override any file via `./appConfigs/base/builds/[PLATFORM]/[FILE_PATH]`

## Example 1

Webpack config file of your web app:

`./platformBuilds/helloworld_web/webpack.config.js`

Will be overridden with:

`./appConfigs/base/builds/web/webpack.config.js`

## Example 2

Application delegate of your iOS app

`./platformBuilds/helloworld_ios/RNVApp/AppDelegate.swift`

Will be overridden with:

`./projectConfig/builds/ios/RNVApp/AppDelegate.swift`
