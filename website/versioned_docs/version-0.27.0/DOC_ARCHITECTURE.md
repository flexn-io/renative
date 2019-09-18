---
id: version-0.27.0-architecture
title: Architecture
sidebar_label: Architecture
original_id: architecture
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
    │   └── helloWorld              # Example application flavour
    │       ├── assets              # Platform assets injected to `./platformAssets`
    │       ├── builds              # Platform files injected to `./platformBuilds`
    │       └── renative.json       # Application flavour config
    ├── platformAssets              # Generated cross-platform assets
    ├── platformBuilds              # Generated platform app projects
    ├── projectConfig               # Project configuration files/assets
    │   ├── fonts                   # Folder for all custom fonts
    │   └── builds                  # Fonts configuration
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
