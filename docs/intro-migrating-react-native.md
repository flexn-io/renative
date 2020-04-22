---
id: intro-migrating_react_native
title: Migrating react-native project to ReNative
sidebar_label: Migrating react-native
---

<img src="https://facebook.github.io/react-native/img/header_logo.svg" width=50 height=50 />

## Overview

ReNative supports react-native projects pretty much out of the box in terms of your application code

Due to variety of possibilities / complexity fo react-native projects (ie plugins, custom build scripts and so on) there might be some extra work required to reconnect existing plugins

## Migration Guide

1. Install rnv
2. Create new project `rnv new` (pick renative-template-hello-world)
3. follow rest of the steps
4. After first `rnv run ...` check out the codebase and pay attention to:

-   `./index.ios.js` file
-   `./index.android.js` file
-   `src/` folder

replace `src/` folder content with source content of your app (JS files)

make sure that your main app.js is initialized in both

-   `./index.ios.js` file
-   `./index.android.js` file

that's it really.

if you also installed some react native plugins in your project make sure to move them to

`./renative.json` config file under `plugins` object. renative uses standard react native plugins so plugin names will stay same!

if you have any issues you can always raise a question or a bug in https://github.com/pavjacko/renative/issues
