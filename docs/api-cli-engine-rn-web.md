---
id: api-cli-engine-rn-web
title: Engine RN Web CLI Reference
sidebar_label: Engine RN Web
---




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## run

> Run your app in browser

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv run
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform

`-t`, `--target` - select specific Target device/simulator

`-d`, `--device` - select connected Device

`--hosted` - Run in a hosted environment (skip budleAssets)

`-P`, `--port` - custom Port

`-D`, `--debug` - enable or disable remote debugger.

`--debugIp` - (optional) overwrite the ip to which the remote debugger will connect

`--skipTargetCheck` - Skip Android target check, just display the raw adb devices to choose from

`-H`, `--host` - custom Host ip




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## package

> Package source files into bundle

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv package
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## build

> Build project binary

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv build
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## configure

> Configure current project

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv configure
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## start

> Starts bundler / server

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv start
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## export

> Export the app into deployable binary

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv export
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## deploy

> Deploy the binary via selected deployment intgeration or buld hook

Supported Platforms:

`web`, `tizen`, `webos`, `tizenmobile`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv deploy
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)

`-r`, `--reset` - also perform Reset of platform

`-R`, `--resetHard` - also perform Reset of platform and all assets

`-e`, `--engine` - engine to be used (next)

`-c`, `--appConfigID` - select specific app Config id

`-s`, `--scheme` - select build Scheme

`-p`, `--platform` - select specific Platform




---

This command reference applies if your platform uses engine `engine-rn-web`.

More info at [Engine RN Web Guide](engine-rn-web.md)

---

## debug

> Debug your app on target device or emulator

Supported Platforms:

`web`, `tizen`

Example:

```bash
rnv debug
```

Options:

`-i`, `--info` - Show full debug Info

`--ci` - CI/CD flag so it wont ask questions

`--mono` - Monochrome console output without chalk

`--maxErrorLength` - Specify how many characters each error should display. Default 200

`-o`, `--only` - run Only top command (Skip dependencies)


test