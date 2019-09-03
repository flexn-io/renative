---
id: version-0.26.0-cli
title: ReNative CLI
sidebar_label: CLI
original_id: cli
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

`$ rnv start -p <PLATFOM>` - start server / bundler for specific platform. (no `-p` defaults to metro bundler)

##### rnv run

`$ rnv run -p <PLATFOM>` - runs app specific platform

##### rnv package

`$ rnv package -p <PLATFOM>` - package JS for specific platform

##### rnv build

`$ rnv build -p <PLATFOM>` - build / compile app for specific platform

##### rnv export

`$ rnv export -p <PLATFOM>` - export / archive app for specific platform

##### rnv deploy

`$ rnv deploy -p <PLATFOM>` - deploy app for specific platform

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

your projects will be build using `./platformTemplates/[PLATFOM]/*` from this point

If you want to revert back to using ReNative templates simply run

`$ rnv platform connect` - gives options which platforms to connect

your projects will be build using `./node_modules/rnv/platformTemplates/[PLATFOM]/*` from this point

##### rnv plugin

Plugin Management

`$ rnv plugin list` - list all available / installed plugins

`$ rnv plugin add` - list all available plugins to be installed

##### rnv target

Emulator / Simulator / Device Management

`$ rnv target launch -p <PLATFORM>` - Start target (i.e. simulator/ emulator)

##### rnv tools

`$ rnv tools fixPackage` - fix + cleanup+ format your `package.json`

### Options

You can combine most of the above commands with following extra arguments you can combine together

##### -r , --reset

ReNative Allows you to perform reset commands if you facing unforeseen problems or migrating ReNative versions

`$ rnv start -r` - Reset Metro Bundler cache

`$ rnv run -p <PLATFORM> -r` - Reset specific platform of platformBuild project (fully recreate project based on provided template)

`$ rnv configure -r` - Reset all platforms of platformBuild project (fully recreate projects based on provided template)

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

ususall ReNative runs in cascading dependency mode. that means that if for example your run `deploy` command, rnv runs all necessary commands (`configure`, `package`, `build`, `export`) before running `deploy` command itself

sometimes you just want to run last command. `--only` esures only top level command is executed

`$ rnv deploy -p <PLATFORM> -s <BUILD_SCHEME>` - run all dependant commands + deploy

`$ rnv deploy -p <PLATFORM> -s <BUILD_SCHEME> --only` - run deploy only
