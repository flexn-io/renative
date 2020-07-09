---
id: changelog
title: Changelog
sidebar_label: Changelog
---


## v0.31.0-alpha.2 (2020-7-7)

### Fixed

- add core placeholder, electron next
- update package placeholders
- placeholders for decoupled packages
- electron fix
- fix next runner cleaner logs
- refactor, cleanup
- deprecate -p web-next, -e next
- engines refactor
- migrate engine specific runners
- transformations configs
- feat: convert tvos template to use lauchscreen storyboard
- xcodebuild args
- Merge branch 'develop' into feat/launch-screen
- fix: quote escapes for --xcodebuildArchiveArgs "...." ios   option
- auto update live changelog every release
- fix: don't override already generated version changelogs
- update docs
- fix: add correct dev server url to web based logs

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.1 (2020-6-30)

### Fixed

- add launch images and configs
- feat: add ios launchscreen
- fix: correct base folder for private configs + legacy support warning

### Added Features

- none

### Breaking Changes

iOS Template has been updated to follow new requirements for storyboard based launch screen. More info:  https://developer.apple.com/news/?id=01132020b

new launch images should be placed to your assets configs typically:


```
.
└── [appConfigs/<appConfig>/assets/ios/Assets.xcassets/launch-image.imageset]
    ├── launch-image.png
    ├── launch-image@2x.png
    └── launch-image@3x.png

```

Recommended size is 1000x1000, 2000x2000 and 3000x3000 to cover all iOS screen densities

![ios launch image guide](/img/launch-image-guide.png)

## v0.30.3 (2020-6-26)

### Fixed

- hotfix: correct tizen extensions. thx @TheDuc
- 0.30.2
- Merge pull request #529 from pavjacko/fix/#528-sdk-filed-merges
- ci chores
- ci chores
- ci chores
- ci chores
- ci chores
- revert typo
- ci chores
- fix: improved handling of autofixes
- fix: prevent crash if provisioning folder does not exist
- fix: regenerate buildConfig after sdk update fix: change default tvos config from manual to auto signing

### Added Features

- none

### Breaking Changes

- none


## v0.30.2-alpha.2 (2020-6-24)

### Fixed

- further SDK merge fixes
- fix: #524 add default workspace to merge flow

### Added Features

- none

### Breaking Changes

- none


## v0.30.2-alpha.1 (2020-6-24)

### Fixed

- update loggigng
- fix: correct sdk field merges

### Added Features

- none

### Breaking Changes

- none


## v0.30.2 (2020-6-25)

### Fixed

- Merge pull request #529 from pavjacko/fix/#528-sdk-filed-merges
- revert typo
- fix: improved handling of autofixes
- fix: prevent crash if provisioning folder does not exist
- fix: regenerate buildConfig after sdk update fix: change default tvos config from manual to auto signing

### Added Features

- none

### Breaking Changes

- none

## v0.30.1 (2020-6-24)

### Fixed

- update rnv plugins
- fix: handle pugin add error in wrapper project
- Merge pull request #526 from pavjacko/feature/react-native-localize-plugin-update
- move podspec to correct override folder
- upgraded version + tvos support
- husky lint, update docs
- 0.30.0
- 0.30 docs
- added integrations docs
- update logging
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- fix android WIN config path inject
- config docs
- config docs

### Added Features

- feat: better logging + suggestions for crypto issues
- feat: confirm folder replace during rnv new

### Breaking Changes

- none

NOTE: Following plugins have been updated to newer versions:

- `react-native-webview`
- `react-native-prompt-android`
- `react-native-root-toast`
- `react-native-animatable`

## v0.30.0 (2020-6-23)

### Fixed

- 0.30 docs
- added integrations docs
- update logging
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- fix android WIN config path inject
- config docs
- config docs

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.25 (2020-6-20)

### Fixed

- doc updates

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.24 (2020-6-19)

### Fixed

- fix sdk discovery for rnv build tasks
- remove unnecessary plugins from templates (moved to core engine definitions)
- engine plugin overrides , improved summary logging
- ci chores 32

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.23 (2020-6-19)

### Fixed

- ci chores
- update extension support
- cleanup logging

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.22 (2020-6-18)

### Fixed

- add only missing plugins
- ci chores 31
- engine base compatibility
- Merge branch 'develop' into feat/e2e-ci
- fix #522
- jsx, tsx compiler support
- E2E web automation with cypress
- e2e android
- rn engines abstraction layer
- disable favicon asset time stamping
- fix export for ios
- add engine configs
- Merge branch 'develop' into feat/e2e-ci
- ci chores 22
- dynamic  injectors via json functions
- downgrade detox workaround for https://github.com/wix/detox/issues/152
- init detox

### Added Features

- none

### Breaking Changes

- none

## v0.29.1-alpha.21 (2020-6-17)

### Fixed

- skip time-stamping ico files fix getConfigProp log
- Merge pull request #520 from robertivanco/feat/tizen/add-security-profile
- security(platform-tizen): mask password when creating certificate or security profile
- feat(platform-tizen): add custom security profile

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.20 (2020-6-11)

### Fixed

- Merge pull request #517 from pavjacko/feat/default-prompt-choice-export
- adds default value for export web prompt
- add lodash.get dependency

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.19 (2020-6-9)

### Fixed

- add extensions helper constant
- Merge pull request #515 from pavjacko/feat/cast-update
- update g cast
- Merge branch 'develop' into feat/cast-update
- add support for typescript  and SSR extensions
- Merge pull request #512 from pavjacko/feat/asset-timestamps
- Sdk update

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.18 (2020-6-2)

### Fixed

- fix binary files injections
- abstract fs API

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.16 (2020-6-2)

### Fixed

- dynamic props injectors

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.15 (2020-5-31)

### Fixed

- disable metro operations for custom engines
- enable build tizen and webos in --hosted mode
- run node_modules doResolve against resolve itstelf to avoid non react apps issues
- brainfart
- default to npm if package.lock present

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.14 (2020-5-31)

### Fixed

- fix renative versioning bug

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.13 (2020-5-30)

### Fixed

- bump up iOS targets
- log cleanup
- migrate writeCleanFile
- runtime file injections
- asset timestamp
- fix version updater. thx @hosek

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.12 (2020-5-24)

### Fixed

- Merge pull request #509 from pavjacko/fix/windows-chores
- stalebot you fascist dictator I'm giving you a doze of valium
- fix doResolve gradle edge cases

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.11 (2020-5-23)

### Fixed

- tizen device detection
- _withPathFix
- resolve fix for win
- better handling of unlink for win
- Merge branch 'fix/windows-chores' of github.com:pavjacko/renative into fix/windows-chores
- fixed next with windows
- windows issue with link command
- Merge branch 'develop' into fix/windows-chores
- Merge branch 'fix/windows-chores' of github.com:pavjacko/renative into fix/windows-chores
- Merge pull request #508 from TheDuc/patch-1
- Merge branch 'fix/windows-chores' into patch-1
- replace backslashes

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.10 (2020-5-22)

### Fixed

- Merge pull request #505 from pavjacko/fix/remove-node-expat-dep
- investigating failing test on GH CI
- fix broken symLinks
- remove xml2json refs

### Added Features

- none

### Breaking Changes

- none


## v0.29.1-alpha.9 (2020-5-20)

### Fixed

- fix web dependencies
- Merge branch 'develop' into fix/remove-node-expat-dep
- Merge pull request #502 from pavjacko/feat/docker_next_export_deploy
- log output improvements
- now next export to docker works without run first, added extra docker message
- Merge branch 'develop' into feat/docker_next_export_deploy
- Merge branch 'develop' into fix/remove-node-expat-dep
- replace heavy xml2json with light  xml2js
- Merge pull request #503 from TheDuc/TheDuc-patch-3
- fixed syntax
- replace APP_VERSION in tizen template
- add APP_VERSION to tizen template
- release @rnv/deploy-docker@0.2.1
- next can now be exported or deployed to docker

### Added Features

- none

### Breaking Changes

if you using next engine (`-e next`) in your app make sure you add

```json
{
   "plugins": {
       "next": "source:rnv"
   }
}
```

to your `./renative.json`

## v0.29.1-alpha.8 (2020-5-18)

### Fixed

- fixes: https://github.com/pavjacko/renative/issues/444
- fixes: https://github.com/pavjacko/renative/issues/445

### Added Features

- none

### Breaking Changes

- none

## v0.29.1-alpha.7 (2020-5-18)

### Fixed

- changelog generator
- fix next overrides
- fix missing watchman error
- fix doc links
- fix missing appConfig
- fix links

### Added Features

- none

### Breaking Changes

- none


## v0.29.0 (2020-5-18)

### Fixed

- tbc

### Added Features

- none

### Breaking Changes

- none

## v0.28.0 (2019-11-5)

### Fixed

-   Migration to React Native 0.61.2
-   Support for Hermes Engine
-   AndroidX Support

-   Migrated 30+ plugins

-   RN Camera
-   Local Storage
-   NetInfo


### Added Features

- none

### Breaking Changes

- none

## v0.27.0 (2019-09-17)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.26.0 (2019-09-1)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.25.0 (2019-08-14)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.23.0 (2019-06-19)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.22.0 (2019-06-1)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.21.6 (2019-5-23)


### Fixes

- fix readme	bf2b9fd3	Pavel Jacko <beherithrone@gmail.com>	23 May 2019 at 07:41
- webpack updates, docs	93d7b7b5	Pavel Jacko <beherithrone@gmail.com>	23 May 2019 at 07:39
- Merge branch 'master' of github.com:pavjacko/renative	ad6a8ae0	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 19:25
- webpack	a56ff08d	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 19:25
- Merge pull request #59 from mihaiblaga89/eslint_plugin_add	5f46b68c	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 19:14
- 0.21.6-alpha.1	1f832112	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 16:56
- opt platforms	43f42a60	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 16:37
- added eslint-plugin-detox	b11a510e	Mihai Blaga <mihaiblaga89@gmail.com>	22 May 2019 at 15:43
- linter updates	9ec5af1a	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 15:11
- Merge branch 'master' of github.com:pavjacko/renative	a176b84b	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 12:39
- Merge pull request #58 from mihaiblaga89/format_everything_ftw	89519fbb	Pavel Jacko <beherithrone@gmail.com>	22 May 2019 at 12:37
- missed a file	3a8b390d	Mihai Blaga <legolas8911@gmail.com>	21 May 2019 at 23:35
- added husky and ran prettier on every .js	93b11655	Mihai Blaga <legolas8911@gmail.com>	21 May 2019 at 23:27
- Merge pull request #1 from pavjacko/master	19db3fda	Mihai Blaga <legolas8911@gmail.com>	21 May 2019 at 23:25
- Merge pull request #57 from mihaiblaga89/pods_error_handling	28840463	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 16:21
- added function to check if Cocoapods is installed before invoking it	59463502	Mihai Blaga <mihaiblaga89@gmail.com>	21 May 2019 at 14:10
- Merge pull request #56 from hosek/androidTV-theme	95b271b8	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 13:20
- AndroidTV style updated to AppCompat Added support for Android phones display notches	e1c0545c	Roman Hosek <>	21 May 2019 at 12:47
- Merge branch 'master' of github.com:pavjacko/renative	9871189e	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 10:27
- Merge pull request #52 from hosek/master	3090c7eb	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 10:23
- Merge pull request #50 from CHaNGeTe/fix/gradlew-windows	f15ce642	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 10:22
- Merge pull request #51 from CHaNGeTe/fix/native-orientation-locker	15bfb18c	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 10:22
- support for cocoapods commit	a8bab1fe	Pavel Jacko <beherithrone@gmail.com>	21 May 2019 at 10:22
- add packages install	30921c39	Roman Hosek <>	10 May 2019 at 14:08
- create ANdroid emulator on demand	48da08cd	Roman Hosek <>	9 May 2019 at 16:24


### Optional Platforms Support

```bash
rnv app create
```

### support for plugin cocoapods github commit

```json
"ios-photo-editor": {
      "no-npm": true,
      "ios": { "podName": "iOSPhotoEditor", "git": "https://github.com/prscX/photo-editor", "commit": "fa8894c992dedb431d696eb43ac4cc4ba847b4b8" }
    },
```

### Inject activity method via plugin configuration

```json
"android": {
  "package": "org.wonday.orientation.OrientationPackage",
  "activityImports": [
    "android.content.res.Configuration"
  ],
  "activityMethods": [
    "override fun onConfigurationChanged(newConfig:Configuration) {",
    "  super.onConfigurationChanged(newConfig)",
    "  val intent = Intent(\"onConfigurationChanged\")",
    "  intent.putExtra(\"newConfig\", newConfig)",
    "  this.sendBroadcast(intent)",
    "}"
  ]
},
```

### Create Android Emulator on Demand

```bash
rnv run -p android
```

### Bug Fixes

-   Android TV theme error
-   Added eslint detox
-   improved webpack config

## v0.21.0 (2019-05-4)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.20.0 (2019-05-1)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.19.0 (2019-04-28)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.18.0 (2019-04-14)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.17.1 (2019-04-4)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.16.1 (2019-04-2)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.13.0 (2019-03-16)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.12.0 (2019-03-12)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.11.0 (2019-03-05)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.10.0 (2019-03-03)

### Fixed

- none


### Added Features

- none

### Breaking Changes

- none

## v0.30.0-rc1 (2020-6-21)

### Fixed

- update docs
- Merge branch 'fix/506' into develop
- fix #506 touchable opacity
- Merge pull request #525 from pavjacko/feat/e2e-ci
- fix removeDirSync
- lint orgy completed
- lint orgy
- add release notes & upgrade guides to the website
- doc updates

### Added Features

- none

### Breaking Changes

- none


## v0.30.0-rc2 (2020-6-21)

### Fixed

- fix engine plugin injection, fix tv navigation

### Added Features

- none

### Breaking Changes

- none

