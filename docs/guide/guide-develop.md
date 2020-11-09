---
id: guide-develop
title: Develop ReNative
sidebar_label: Develop ReNative
---

<img src="https://renative.org/img/ic_construction.png" width=50 height=50 />

## Developing ReNative Locally

If you need full control over whole ReNative build you can clone and develop it locally

```
1) clone git@github.com:pavjacko/renative.git
2) cd renative
3) yarn bootstrap
4) yarn watch
```

At this point your global `$ rnv` command is linked directly into project above.

It's also best way to contribute back to RNV! :)

```
rnv template apply
=> pick renative-template-hello-world
```

#### Windows development

Requirements: Python 2.7, Visual Studio installed or install `windows-build-tools`(https://www.npmjs.com/package/windows-build-tools). **Please make sure you follow the package's instructions, especially running it in PowerShell as Administrator**

## Deployments

### Feature

Features (from `feat/xxx` branches):

npm tag `feat`

```
npm run deploy:feat
```

### Alpha

Alpha Releases (from `develop` branches):

tag format: `0.31.0-alpha.1`

npm tag `alpha`

```
npm run deploy:alpha
```

### Production

Production (from `release/xx` branches):

tag format: `0.31.0`

npm tag: `latest`

```
npm run deploy:prod
```

## Documentation

[Documentation for CLI](api-cli-engine-core.md)

[Documentation for RNV](api-rnv.md)

[Documentation for Config](api-config.md)

[Documentation for Runtime](api-renative.md)
