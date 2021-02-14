---
id: kaios
title: KaiOS Platform
sidebar_label: KaiOS
---

<table>
  <tr>
  <td>
    <img src="https://img.shields.io/badge/Mac-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Windows-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/Linux-yes-brightgreen.svg" />
    <img src="https://img.shields.io/badge/HostMode-yes-brightgreen.svg" />
  </td>
  </tr>
</table>

<img src="https://renative.org/img/rnv_kaios.gif" height="250"/>

## File Extension Support

<!--EXTENSION_SUPPORT_START-->

Extenstions are defined via engines. Engines with kaios support: 

<!--EXTENSION_SUPPORT_END-->

## Requirements

-   [KaiOSrt](https://developer.kaiostech.com/simulator) for emulator

After installation you can launch it via Applications:

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/kaios1.png" />
    </th>
  </tr>
</table>

## Run

Run on Simulator

```
rnv run -p kaios
```

Run on Device

```
rnv run -p kaios -d
```

Run in Browser

```
rnv run -p kaios --hosted
```

## App Config

[see: Web based config](api-config.md#web-props)
