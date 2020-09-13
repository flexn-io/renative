---
id: api-cli-engine-core
title: Engine Core CLI Reference
sidebar_label: Engine Core
---



---

## crypto decrypt

> Decrypt encrypted project files into local ~/<wokspace>/<project>/..

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv crypto decrypt
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## crypto encrypt

> Encrypts secure files from ~/<wokspace>/<project>/.. to project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv crypto encrypt
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## crypto installCerts

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv crypto installCerts
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## crypto updateProfile

> Update provisioning profile

Supported Platforms:

`ios`, `tvos`

Example:

```bash
rnv crypto updateProfile
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## crypto updateProfiles

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv crypto updateProfiles
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## crypto installProfiles

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv crypto installProfiles
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## target list

> List all available devices / emulators for specific platform

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv target list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## target launch

> Launch specific emulator

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv target launch
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## platform eject

> Copy all platform files directly to project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv platform eject
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## platform connect

> Connect platform template back to rnv

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv platform connect
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## platform list

> List all available platforms

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv platform list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## platform configure

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv platform configure
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## platform setup

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv platform setup
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## template add

> Install additional template to the project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv template add
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## template apply

> Reset project to specific template

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv template apply
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## template list

> Show list of available templates

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv template list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## plugin add

> Add selected plugin to the project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv plugin add
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## plugin list

> Show list of all available plugins

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv plugin list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## plugin update

> Update specific plugin to latest supported version (rnv)

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv plugin update
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## workspace list

> Show list of all available workspaces

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv workspace list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## workspace add

> Add new workspace

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv workspace add
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## workspace connect

> Connect project with selected workspace

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv workspace connect
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## workspace update

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv workspace update
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## hooks list

> Get list of all available hooks

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv hooks list
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## hooks run

> Run specific build hook

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv hooks run
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## hooks pipes

> Get the list of all available pipes

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv hooks pipes
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## clean

> Automatically removes all node_modules and lock in your project and its dependencies

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv clean
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## fastlane

> Run fstalane commands directly

Supported Platforms:

`ios`, `tvos`, `android`, `androidtv`, `androidwear`

Example:

```bash
rnv fastlane
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## publish

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv publish
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## pkg

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv pkg
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## status

> Show current info about the project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv status
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## config

> Edit or display RNV configs

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv config
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## help

> Display generic help

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv help
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## new

> Create new ReNative project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv new
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## install

> Install package node_modules via yarn or npm

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv install
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## project configure

> Configure current project

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv project configure
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## app configure

> Configure project with specific appConfig

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv app configure
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## workspace configure

> 

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv workspace configure
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## log

> Attach logger to device or emulator and print out logs

Supported Platforms:

`ios`, `tvos`, `android`, `androidtv`, `androidwear`

Example:

```bash
rnv log
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)



---

## configureSoft

> Configure system and project wothout recreating files (used for --only)

Supported Platforms:

`ios`, `android`, `androidtv`, `androidwear`, `web`, `tizen`, `tizenmobile`, `tvos`, `webos`, `macos`, `windows`, `tizenwatch`, `kaios`, `firefoxos`, `firefoxtv`, `chromecast`

Example:

```bash
rnv configureSoft
```

Options:

`--ci` - Don't ask for confirmations

`-c`, `--appConfigID` - Switch to different appConfig beforehand

`-p`, `--platform` - Specify platform

`-s`, `--scheme` - Specify build scheme

`-r`, `--reset` - Clean project beforehand

`-t`, `--target` - Specify target simulator / device

`-d`, `--device` - Run on device

`-i`, `--info` - Show full stack trace

`-o`, `--only` - Execute only run task

`--analyzer` - Show app size analysis report

`--hosted` - Run platform as hosted web app in browser

`--mono` - Monochromatic output to terminal (no colors)

test