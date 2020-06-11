# Changelog

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
