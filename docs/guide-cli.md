---
id: guide-cli
title: ReNative CLI
sidebar_label: ReNative CLI
---

<img src="https://renative.org/img/ic_cli.png" width=50 height=50 />

## ReNative CLI

Deployed to https://www.npmjs.com/package/rnv

### Commands

##### rnv

`$ rnv` - Print help

`$ rnv --version` - Print ReNative Version

##### rnv new

`$ rnv new` - creates new ReNative project

##### rnv start

`$ rnv start -p <PLATFORM>` - start server / bundler for specific platform. (no `-p` defaults to metro bundler)

##### rnv run

`$ rnv run -p <PLATFORM>` - runs app specific platform

##### rnv package

`$ rnv package -p <PLATFORM>` - package JS for specific platform

##### rnv build

`$ rnv build -p <PLATFORM>` - build / compile app for specific platform

##### rnv export

`$ rnv export -p <PLATFORM>` - export / archive app for specific platform

##### rnv deploy

`$ rnv deploy -p <PLATFORM>` - deploy app for specific platform

##### rnv status

`$ rnv status` - prints out info about your project

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/info.png" />
    </th>
  </tr>
</table>

##### rnv clean

`$ rnv clean` - will delete all `node-modules` and `package-lock.json` files. you will be asked to confirm this action

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/clean.png" />
    </th>
  </tr>
</table>

##### rnv platform

Manipulates platforms

By default, ReNative controls platformTemplates for you. Advantage is that you don't need to maintain them and will get all the updates automatically.
If however you need to customise them you can eject them directly into your project.

`$ rnv platform eject` - gives options which platforms to eject

your projects will be build using `./platformTemplates/[PLATFORM]/*` from this point

If you want to revert back to using ReNative templates simply run

`$ rnv platform connect` - gives options which platforms to connect

your projects will be build using `./node_modules/rnv/platformTemplates/[PLATFORM]/*` from this point

##### rnv plugin

Plugin Management

`$ rnv plugin list` - list all available / installed plugins

`$ rnv plugin add` - list all available plugins to be installed

##### rnv target

Emulator / Simulator / Device Management

`$ rnv target launch -p <PLATFORM>` - Start target (i.e. simulator/ emulator)

##### rnv tools

`$ rnv tools fixPackage` - fix + cleanup+ format your `package.json`

##### rnv fastlane

`$ rnv fastlane <commands>` - Run fastlane directly from rnv. Supports all fastlane commands. It installs fastlane automatically if it's not installed.

##### rnv config

`$ rnv config list` - will print out the current configurations, both global and per project

`$ rnv config <key>` - will print out the current values for that key, both global and per project

`$ rnv config <key> <value>` - will update the value for that key, project wise if `-G` or `--global` is not specified.

_Project values take precedence over the global ones, basically you can have for example `analytics` disabled globally and enabled on one project_

###### Current supported configs

| Key       | Possible Values  | Default Value | Description                                                                                                                     |
| --------- | ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| analytics | `true` / `false` | `true`        | Enabled by default, both globally and per project. Allows us to track RNV errors and metrics with Sentry in order to improve it |

##### rnv publish

`$ rnv publish [patch|minor|major]` - Will help you bump the version, create a commit and a tag and push them. It uses [release-it](https://github.com/release-it/release-it) under the hood so you can configure it and pass whatever arguments that are supported by `release-it`. You can also run `rnv publish` without any arguments to enter interactive mode.

### Options

You can combine most of the above commands with following extra arguments you can combine together

##### -r , --reset

ReNative Allows you to perform reset commands if you facing unforeseen problems or migrating ReNative versions

`$ rnv start -r` - Reset Metro Bundler cache

`$ rnv run -p <PLATFORM> -r` - Reset specific platform of platformBuild project (fully recreate project based on provided template)

`$ rnv configure -r` - Reset all platforms of platformBuild project (fully recreate projects based on provided template)

##### -R , --resetHard

Does everything what `-r` + reset platformAssets

##### --mono

If you prefer having your logs clean (without color decorations). you can use `--mono` flag for any`$ rnv` command.
This is particularly useful for CI where logs are usually stripped from colors by CI logger and producing visual artefacts

Examples:

`$ rnv status --mono`
`$ rnv start --mono`

##### -c , -appConfigID

Allows you to immediately switch to specific app config

`$ rnv run -p <PLATFORM> -c <APP_ID>` - configure APP_ID and run PLATFORM

`$ rnv build -p <PLATFORM> -c <APP_ID>` - configure APP_ID and build PLATFORM

##### -d , --device

`$ rnv run -p <PLATFORM> -d` - Install/Run on connected device instead of simulator

##### -s , --scheme

You can pass down specific build scheme configured in `./appConfigs/APP_ID/renative.json`

`$ rnv run -p <PLATFORM>` - runs app with default scheme (`-s debug`)

`$ rnv run -p <PLATFORM> -s myScheme` - runs app with `myScheme` build scheme

##### -i , --info

Log verbose output

`$ rnv run -p <PLATFORM> -i`

##### -t , --target

Allows you to specify known target name/id so CLI won't ask you to pick one

`$ rnv run -p <PLATFORM> -t <TARGET_NAME>`

##### --host

Allows you to run some platforms directly in browser

`$ rnv run -p <PLATFORM> --host`

##### --only

usually ReNative runs in cascading dependency mode. that means that if for example your run `deploy` command, rnv runs all necessary commands (`configure`, `package`, `build`, `export`) before running `deploy` command itself

sometimes you just want to run last command. `--only` ensures only top level command is executed

`$ rnv deploy -p <PLATFORM> -s <BUILD_SCHEME>` - run all dependant commands + deploy

`$ rnv deploy -p <PLATFORM> -s <BUILD_SCHEME> --only` - run deploy only

##### -g, --global

Used for `rnv config` to modify the config value globally, not just in the current project
