---
id: version-0.28-develop
title: Develop ReNative
sidebar_label: Develop ReNative
original_id: develop
---

<img src="https://renative.org/img/ic_construction.png" width=50 height=50 />

## Developing ReNative Locally

If you need full control over whole ReNative build you can clone and develop it locally

```
1) clone git@github.com:pavjacko/renative.git
2) cd renative
3) npm i
4) npm run watch
5) npm run link
```

At this point your global `$ rnv` command is linked directly into project above.

It's also best way to contribute back to RNV! :)


```
rnv template apply
=> pick renative-template-hello-world
```

#### Windows development
Requirements: Python 2.7, Visual Studio installed or install `windows-build-tools`(https://www.npmjs.com/package/windows-build-tools). **Please make sure you follow the package's instructions, especially running it in PowerShell as Administrator** 

## RNV C Object

[Documentation for RNV Runtime Config](docs/DOC_RNV_CONFIG.md)
