# Changelog

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
- ci chores 30
- ci chores 29
- jsx, tsx compiler support
- ci chores 28
- ci chores 27
- ci chores 26
- ci chores 25
- ci chores 24
- ci chores 23
- E2E web automation with cypress
- e2e android
- rn engines abstraction layer
- disable favicon asset time stamping
- fix export for ios
- add engine configs
- Merge branch 'develop' into feat/e2e-ci
- ci chores 22
- dynamic  injectors via json functions
- ci chores 21
- ci chores 20
- ci chores 19
- ci chores 18
- ci chores 17
- ci chores 16
- ci chores 15
- ci chores 14
- ci chores 13
- ci chores 12
- ci chores 11
- ci chores 10
- ci chores 9
- ci chores 8
- ci chores 7
- ci chores 6
- ci chores 5
- ci chores 4
- ci chores 3
- ci chores 2
- ci chore 1
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
