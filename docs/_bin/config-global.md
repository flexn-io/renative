---
id: config-global
title: Global Configs
sidebar_label: Global Configs
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview


Global `renative.*.json` are located in your workspace folder and workspace project folders.

default workspace location is `~/.rnv` but that can be configured

Because they are global, they will get merged into every build config regardless of the project. However as they get merged as one of the first files they can be easily overridden.


Configurations typically stored in your project `~/./rnv/renative.json` :

- SDK locations
- default targets
