---
id: config-overview
title: Config Overview
sidebar_label: Overview
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview

Renative configs are one of the most powerful feature of ReNative platform.

Their format is `renative.*.json`

They form the bedrock of ReNative "DNA" philosophy.

When you create new project `rnv new` there is only one single file generated `renative.json`.

Just like the DNA it contains core information about your project, structure, templates, platforms etc.

Once you trigger your first `rnv ...` command this file is used to generate everything on demand

Just the few things you can configure and override with `renative.*.json` files:

- Project templates
- Platforms
- Build schemes
- Plugins
- Deployments
- Overrides

and more

## Combine Multiple Configs

ReNative always merges all relevant renative configs into one single build config.

The merge order is:


```
const mergeFiles = [
    c.files.rnv.projectTemplates.config,
    { plugins: extraPlugins },
    ...pluginTemplates,
    c.files.rnv.engines.config,
    c.files.workspace.config,
    c.files.workspace.configPrivate,
    c.files.workspace.configLocal,
    c.files.workspace.project.config,
    c.files.workspace.project.configPrivate,
    c.files.workspace.project.configLocal,
    c.files.workspace.appConfig.configBase,
    c.files.workspace.appConfig.config,
    c.files.workspace.appConfig.configPrivate,
    c.files.workspace.appConfig.configLocal,
    c.files.project.config,
    c.files.project.configPrivate,
    c.files.project.configLocal,
    c.files.appConfig.configBase,
    c.files.appConfig.config,
    c.files.appConfig.configPrivate,
    c.files.appConfig.configLocal
];
```
