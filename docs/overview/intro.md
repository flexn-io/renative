---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## Intro



Scale from simple command to enterprise ecosystem


## Core & CLI

Core RNV system is base dependency of engines, extensions, tasks
It also includes

## Plugins

Allows you to extend app functionality with numerous available plugins.

## AppConfigs

Allows you to setup multiple application targets under one project

Every app configuration flavour contains its own `renative.*.json` file used to extend overall config with configurations specific to app flavour


Configurations typically stored in your project `appConfigs/[APP_ID]/renative.json` :

- App id, Title, Description etc
- Active / inactive plugins
- Plugin overrides per app
- Build schemes
- Runtime injections

## Configuration

Extremely versatile config system

allows you to configure most of your project by simple `renative.json` file changes.



## Engines

Engines allow you to build your project for specific platform with variety of different technology stacks


They provide project structure and fundamental rendering / transpilation functionality.

Default engine for ReNative is `react-native`

[Full Documentation](engine-rn.md)


## Integrations

Allow you to extend features of rnv via external integration plugins

## Platforms

RNV allows you to target over 15 different platforms.


## Tasks

RNV is essentially and task runner. most of the execution is completed by tasks.

## App Code

Application code is the actual code of your app. it usually sits in src.

## Templates

Templates are used as initial bootstrap structure you can use instead of creating your project source, configs and assets from scratch.

Templates are offered during creation of new project ( `rnv new` )

More Info (Templates)

## File Extensions

You can create highly sophisticated reusable multiplatofrm architecture by utilising powerful file extension system

## Runtime

ReNative provides runtime SDK library to support multi-platform development
