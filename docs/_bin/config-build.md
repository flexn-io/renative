---
id: config-build
title: Build Config
sidebar_label: Build Config
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview


Build config is special type because it is generated every `rnv` job and is unique for each platform and appConfig.

It is the result of all `renative.*.json` merges per each job

Every `rnv` job will generate unique build file in `./platformAssets/` folder.

Naming convention of such file is `[APP_ID]_[PLATFORM].json`

ie command `rnv run -p android -c helloworld` will genreate build file at:

`./platformBuilds/helloworld_android.json`
