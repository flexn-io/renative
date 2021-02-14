---
id: macos
title: macOS Platform
sidebar_label: macOS
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/Linux-n/a-lightgrey.svg" />
    <img src="https://img.shields.io/badge/HostMode-n/a-lightgrey.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_macos.gif" height="250"/>

## Overview

-   support for OSX/macOS
-   Based on Electron

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

Extenstions are defined via engines. Engines with macos support: 

<!--EXTENSION_SUPPORT_END-->

#### Requirements

-   n/a


#### Run

Run on Simulator

```
rnv run -p macos
```

Run in Browser

```
rnv run -p macos --hosted
```

#### Deploy on Electron Simulator

This will run production version on your simulator (not connected to devserver)
You can configure each `buildScheme` ie `-s release` in your config file `./appConfigs/<YOUR_APP_CONFIG>/renative.json`

```
rnv run -p macos -s release
```

#### Export

```
rnv export -p macos -s release
```

## App Config

[see: Web based config](api-config.md#web-props)
