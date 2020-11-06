---
id: architecture
title: Architecture
sidebar_label: Architecture
---

<img src="https://renative.org/img/ic_arch.png" width=50 height=50 />

## Build Process

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/rnv_arch1.png" />
    </th>
  </tr>
</table>

Folder Structure (Generated Project)

    .
    ├── appConfigs                  # Application flavour configuration files/assets
    │   ├── base                    # Shared project configuration files/assets
    │   │   ├── fonts               # Folder for all custom fonts
    │   │   └── builds              # Fonts configuration
    │   └── helloworld              # Example application flavour
    │       ├── assets              # Platform assets injected to `./platformAssets`
    │       ├── builds              # Platform files injected to `./platformBuilds`
    │       └── renative.json       # Application flavour config
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    ├── src                         # Source files
    └── renative.json           # React Native Plugins configuration

## Override Mechanism

ReNative support flexible override mechanism which allows you customise your project to great degree

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/rnv_arch2.png" />
    </th>
  </tr>
</table>
