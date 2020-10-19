---
id: version-0.31-changelog
title: Changelog
sidebar_label: Changelog
original_id: changelog
---


## v0.31.2 (2020-10-19)

### Fixed

- [fix] support tsx, ts extrensions transipler in web platforms
- [fix] macos template
- [docs] autogenerate rnv runtime config via schema
- [docs] update
- [feat] add configurable debugging options via command line
- Merge pull request #598 from EyMaddis/feature/chii-and-weinre
- Merge branch 'feat/json-schema' into release/0.31
- [docs] updates docs and schema
- [docs] update schema and docs
- [docs] autogenerate config schema docs
- update schema config
- [feat] add config schema coverage
- [feat] renative json schema validator
- Merge pull request #595 from EyMaddis/feature/appshell-metatags
- [fix] lint issues
- Merge pull request #594 from EyMaddis/tizen-fixes
- enable chii for electron
- Merge pull request #597 from EyMaddis/fix/baseUrl-for-css
- [feat] offer bundler reset if existing session active
- [fix] make ios error logs more readable and useful
- support baseUrl for css and other assets
- support chii in addition to weinre
- allow users to controll appShell html headers
- allow tizen apps with space in the name

### Added Features

- none

### Breaking Changes

- none


## v0.31.1 (2020-10-15)

### Fixed

- [fix] ensure clean parent dir of node_modules when rnv new
- [fix] support woff fonts
- 0.31.0
- [docs] generate 0.31 documentation
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] clean templateConfig after bootstrap
- Merge pull request #588 from EyMaddis/patch-1
- Fix customization documentation for 0.31
- 0.31.0-RC.10
- [fix] jetify only under android, add loadsh.set
- 0.31.0-RC.9
- [fix] babel-loader for packages/app
- [feat] support for custom template injections, recommended versions
- [ci] lerna chores
- [ci] lerna chores
- [ci] travis+lerna chores
- [chore] clean logs
- [fix] reuse project babel config for build hooks
- [feat] preload template info during rnv new
- [feat] check if trying to create new project in existing one
- [fix] run jetify only if truly required, clean warning logs
- [chores] improve logging
- [feat] save custom templates to workspace template list
- [fix] ensure bootstrapped template triggers correct engine reset
- [fix] correct template file generator order
- [feat] add support for templateConfig.includedPaths
- 0.31.0-RC.8
- [fix] provide wps alternative locations
- [fix] ensure plugin fix after node_modules updates
- [fix] exclude semver checks for template bootstraps
- [fix] ensure proper reset of appConfig if deleted
- 0.31.0-RC.7
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.34 (2020-10-3)

### Fixed

- dependency upgrades
- Merge branch 'feat/push-notifications' into develop
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- update electron deps
- Merge pull request #574 from pavjacko/dependabot/npm_and_yarn/packages/rnv/node-fetch-2.6.1
- Merge pull request #582 from pavjacko/feat/detox-update
- Merge pull request #575 from pavjacko/feat/gradle-version-up
- latest version
- Merge branch 'develop' into feat/detox-update
- [fix] next dev / next start support via bundleAssets config prop
- [fix] Xcode12 react core podfile fixes
- Bump node-fetch from 2.6.0 to 2.6.1 in /packages/rnv
- unify gradle version across all android based platforms
- Merge branch 'feat/tasks' into feat/push-notifications
- firebase version up, added messaging
- update detox plugin version

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.33 (2020-10-1)

### Fixed

- [feat] dependency resolution of nested pluginTemplates
- [feat] custom templates
- [fix] skip buildHooks pipes for global commands
- [fix] improve dependency resolutions of complex plugins
- [fix]  premature dependenaculation
- [fix] react-native focus fix
- [fix] rnv clean, skip depUpdates
- 0.31.0-alpha.32

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.32 (2020-9-29)

### Fixed

- [feat] rnv project upgrade
- [feat] sync up engines during rnv upgrade
- [fix] rnv kill oustide of rnv project
- [docs] update release notes with migration guide
- 0.31.0-alpha.31

### Added Features

- `rnv project upgrade` allows upgrade/downgrade of renative project to specific rnv dependencies

### Breaking Changes

- none

## v0.31.0-alpha.31 (2020-9-23)

### Fixed

- [feat] withRNV metro decorator
- Merge branch 'feat/engines-pt2' into develop
- [fix] rnv start -r
- [fix]: navigation fixes
- 0.31.0-alpha.30

### Added Features

- withRNV abstracts most of the complexity of configuring aliases and module paths. it uses renative.*.json plugins to do so behind the scenes


### Breaking Changes


NextJS config should migrate to use withRNV from `@rnv/engine-rn-next`:

`next.config.js`


```
const { withRNV } = require('@rnv/engine-rn-next');
const path = require('path');

const config = {

};

module.exports = withRNV(config);
```


Metro config should migrate to use withRNV from `@rnv/engine-rn`:

`metro.config.js`

```
const path = require('path');
const { withRNV } = require('@rnv/engine-rn');

const config = {

};

module.exports = withRNV(config);
```

## v0.31.0-alpha.30 (2020-9-21)

### Fixed

- [fix] dowgrading RNW to 0.12.3 due to nav refresh flicker in 0.13.12

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.29 (2020-9-21)

### Fixed

- publish preps
- [feat] @rnv/engine-rn
- [feat] @rnv/engine-rn-electron
- [feat] @rnv/engine-rn-web
- refactor packages engine structure
- [feat] decoupled next engine

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.28 (2020-9-20)

### Fixed

- migrate build path definitions to engines

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.27 (2020-9-20)

### Fixed

- Merge pull request #577 from pavjacko/feat/next-upgrades
- test updates
- [chores] optimise travis build order
- [feat] git commit&tag hooks
- [fix] next server extensions
- Merge branch 'feat/next-upgrades' of github.com:pavjacko/renative into feat/next-upgrades
- [feat] dynamic engine extensions
- test coverage
- update helloworld template
- [feat] next upgrades
- screw the BFF... I'll make you my bitch anyway
- [feat] improved override.json support
- damn you nextjs if I can't make you my bitch I'll make you my BFF

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.26 (2020-9-17)

### Fixed

- [fix] rnv crypto standalone task
- [fix] focus issues on tizen and webos
- update firefox, chromecast sdks
- uts
- fix eject list
- electron icns auto generator
- interactive CLI help
- webpack-sdk update to new paths
- fix hosted option
- [feat] refactor engine templates
- kill task, webos fixes
- [chores] clean up config, npx resolve checks
- optional crypto

### Added Features

- none

### Breaking Changes

- appConfigs/\*\*/builds/_shared is DEPRECATED. use appConfigs/\*\*/builds/<PLATFORM> instead

## v0.31.0-alpha.25 (2020-9-15)

### Fixed

- dynamic CLI options generator
- [fix] Android Manifest overrides #570
- param config injections
- [docs] autogenerate task cli API

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.24 (2020-9-13)

### Fixed

- handle unknown subtasks
- Merge pull request #552 from pavjacko/feat/tasks
- global task --only / -o support
- [fix] capture missing appConfigs folders
- 0.31.0-feat-tasks.4
- [fix] merge files from workspace
- [fix] rnv deploy --only
- 0.31.0-feat-tasks.3
- [fix] avoid platform clean, pod update if not required
- 0.31.0-feat-tasks.2
- [feat] support merge folders of extend + base appConfigs globally
- 0.31.0-feat-tasks.1.md
- added feat to version counter in changelog buildhook
- added scripts to publish with feat tag
- fix case sensitivity issues in appConfig folders

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.23 (2020-7-31)

### Fixed

- ensure executeAsync returns value
- support for custom script executions in tasks.rnv.install
- fix support for global tasks

### Added Features

- none

### Breaking Changes

- `.next.js` extension is DEPRECATED. use `.web.js` and `.server.web.js` in combination with engine `engine-rn-next` instead
REASON: next.js was temporary `web-next` platform extension. this has been replaced with `engine-rn-next` which supports standard `-p web`

- `rnv configure` now requires platform `-p` specified. if you don't, rnv will ask you to pick one. if you use `--ci` option command will fail.
REASON: `rnv configure` used to run configure command on all supported platforms of the project at once but that is hardly ever needed as all platform commands chain back to configure anyway. this created unnecessary log builds
NOTE: `rnv configure` is not necessary if you plan to run `rnv run / build / export / package` afterwards as these commands will run configure task as dependency anyway

## v0.31.0-alpha.22 (2020-7-30)

### Fixed

- rn engine platform support task fixes, fix rnv log
- update legacy docs. fixes #554

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.21 (2020-7-29)

### Fixed

- fix macos fonts, layout, helloworld improvements
- decouple analytics from loggers, fileutils DI, clean import/no-cycle
- build scheme management improvements / fixes

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.20 (2020-7-28)

### Fixed

- check against unsupported platforms
- support for multiple next versions
- add exec cmd message for interactive commands

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.19 (2020-7-28)

### Fixed

- move legacy next to proper versioning folder
- Merge branch 'feat/update_next' into feat/tasks
- better next logs
- next improvements / fixes
- also added patch file
- next update
- Merge pull request #541 from pavjacko/feat/engines

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.18 (2020-7-28)

### Fixed

- feat: autocomplete
- ejected check fixes
- migrate workspace task
- 0.31.0-alpha.17
- platform support fixes
- fix support for custom appConfig folders
- fix chalk --mono, web next e2e
- support for custom build scheme descriptions in prompt
- bundler start log helpers for web
- clean logs

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.17 (2020-7-27)

### Fixed

- platform support fixes
- fix support for custom appConfig folders
- fix chalk --mono, web next e2e
- support for custom build scheme descriptions in prompt
- bundler start log helpers for web
- clean logs

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.16 (2020-7-26)

### Fixed

- support for --only , better android error logs
- enable executor override via -e <engine>
- migrate platform templates to engines
- 0.31.0-alpha.15
- android sdk bundleAssets fix, remove cycle references
- clean log
- clean getAppFolder API
- fix clean platformAssets when --resetHard (-R)

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.15 (2020-7-26)

### Fixed

- android sdk bundleAssets fix, remove cycle references
- clean log
- clean getAppFolder API
- fix clean platformAssets when --resetHard (-R)

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.14 (2020-7-26)

### Fixed

- fix plugin props
- integrate task.rnv.workspace.configure
- fix run task. loop task warning
- build file system prop injectors

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.13 (2020-7-25)

### Fixed

- dynamic android build file injectors

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.12 (2020-7-25)

### Fixed

- rename hack
- filterable logger -i "<value>,<value>.."
- auto generate platformBuilds, better logging
- migration fixes
- fix crypto, better logging
- task descriptors
- app config edge cases, task descriptions
- log fixes
- fix template selection
- refactor app config  logic
- fix missing appConfig crash
- fix cycled deps, platform support for tasks
- abstract engine injections
- decouple project configure task
- fix platform configure
- task options helper
- abstracted task execution
- update tasks info
- task runner abstraction
- update task executors
- fix android support files paths
- improved task handlers
- engine-core
- task export configs
- refactor task names
- filesystem abstraction
- decouple engine-rn-web tasks
- decouple engine-rn-next tasks
- decouple engine-rn-electron tasks
- decouple engine-rn tasks
- decouple rnv run tasks
- decouple project and support tasks
- decouple publish tasks
- decouple utility tasks
- decouple hook tasks
- decouple workspace tasks
- decouple plugin tasks
- decouple template tasks
- decouple platform tasks
- decouple crypto tasks
- refactor common dependencies
- engine-rn-next fixes + E2E
- migration fixes
- migration fixes
- big structure refactoring (preparation for decoupled packages)
- migrate engines
- electron engine task refactor
- engine-rn-web improvements
- ci build for AppleTV
- rnv build ios/tvos upgrades
- travis updates
- Merge branch 'feat/plugin-dep-resolvers' into feat/tasks
- rnv builder
- normalize platform tools APIs
- imporved debugger
- changelog
- refactor task engine

### Added Features

- none

### Breaking Changes

- none

## v0.31.0-alpha.11 (2020-7-16)

### Fixed

- Merge branch 'release/0.30' into feat/plugin-dep-resolvers
- fix: #548 initial focus on tizen
- fix: #550 splash screen  androidtv support
- 0.30.4
- fix crypto security import
- add rn-iap plugin

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.10 (2020-10-12)

### Fixed

- [fix] jetify only under android, add loadsh.set
- 0.31.0-RC.9
- [fix] babel-loader for packages/app
- [feat] support for custom template injections, recommended versions
- [ci] lerna chores
- [ci] lerna chores
- [ci] travis+lerna chores
- [chore] clean logs
- [fix] reuse project babel config for build hooks
- [feat] preload template info during rnv new
- [feat] check if trying to create new project in existing one
- [fix] run jetify only if truly required, clean warning logs
- [chores] improve logging
- [feat] save custom templates to workspace template list
- [fix] ensure bootstrapped template triggers correct engine reset
- [fix] correct template file generator order
- [feat] add support for templateConfig.includedPaths
- 0.31.0-RC.8
- [fix] provide wps alternative locations
- [fix] ensure plugin fix after node_modules updates
- [fix] exclude semver checks for template bootstraps
- [fix] ensure proper reset of appConfig if deleted
- 0.31.0-RC.7
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.10 (2020-7-12)

### Fixed

- add support for "source:self"
- scoped plugin inheritance

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.9 (2020-10-11)

### Fixed

- [fix] babel-loader for packages/app
- [feat] support for custom template injections, recommended versions
- [ci] lerna chores
- [ci] lerna chores
- [ci] travis+lerna chores
- [chore] clean logs
- [fix] reuse project babel config for build hooks
- [feat] preload template info during rnv new
- [feat] check if trying to create new project in existing one
- [fix] run jetify only if truly required, clean warning logs
- [chores] improve logging
- [feat] save custom templates to workspace template list
- [fix] ensure bootstrapped template triggers correct engine reset
- [fix] correct template file generator order
- [feat] add support for templateConfig.includedPaths
- 0.31.0-RC.8
- [fix] provide wps alternative locations
- [fix] ensure plugin fix after node_modules updates
- [fix] exclude semver checks for template bootstraps
- [fix] ensure proper reset of appConfig if deleted
- 0.31.0-RC.7
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.9 (2020-7-12)

### Fixed

- update tasks, logs

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.8 (2020-10-9)

### Fixed

- [fix] provide wps alternative locations
- [fix] ensure plugin fix after node_modules updates
- [fix] exclude semver checks for template bootstraps
- [fix] ensure proper reset of appConfig if deleted
- 0.31.0-RC.7
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.8 (2020-7-11)

### Fixed

- chalk --mono support
- 0.31.0-alpha.7
- build hooks
- task dependencies
- fix configureWeb task
- fix webos emulator detection
- refactor engine runners
- fix   cleanPlatformIfRequired
- improved logs
- update task logs
- migrate packageParser, log updates, fix package override
- update logTasks

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.7 (2020-10-8)

### Fixed

- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.7 (2020-7-11)

### Fixed

- build hooks
- task dependencies
- fix configureWeb task
- fix webos emulator detection
- refactor engine runners
- fix   cleanPlatformIfRequired
- improved logs
- update task logs
- migrate packageParser, log updates, fix package override
- update logTasks

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.6 (2020-10-6)

### Fixed

- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.6 (2020-7-9)

### Fixed

- revert incorrect plugin config
- fix chalk

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.5 (2020-10-5)

### Fixed

- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.5 (2020-7-9)

### Fixed

- auto install node_modules after plugin updates

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.4 (2020-10-4)

### Fixed

- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.4 (2020-7-8)

### Fixed

- feat: add project links helper
- feat: add support for application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler
- rename npminstall
- npm dep invalidation fix

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.3 (2020-10-4)

### Fixed

- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-alpha.3 (2020-7-8)

### Fixed

- update engine runners
- scoped dependency resolutions plugin auto install cleaner error log
- feat: plugin dependency resolver
- docs update

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-RC.2 (2020-10-4)

### Fixed

- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


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

- `-p web-next`, `-e next` are no longer be available.

Use:

```json
{
    "platforms": {
        "web": {
            "engine": "engine-rn-next"
        }
    }
}
```

instead

## v0.31.0-RC.1 (2020-10-4)

### Fixed

- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

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

## v0.31.0 (2020-10-13)

### Fixed

- [docs] generate 0.31 documentation
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] clean templateConfig after bootstrap
- Merge pull request #588 from EyMaddis/patch-1
- Fix customization documentation for 0.31
- 0.31.0-RC.10
- [fix] jetify only under android, add loadsh.set
- 0.31.0-RC.9
- [fix] babel-loader for packages/app
- [feat] support for custom template injections, recommended versions
- [ci] lerna chores
- [ci] lerna chores
- [ci] travis+lerna chores
- [chore] clean logs
- [fix] reuse project babel config for build hooks
- [feat] preload template info during rnv new
- [feat] check if trying to create new project in existing one
- [fix] run jetify only if truly required, clean warning logs
- [chores] improve logging
- [feat] save custom templates to workspace template list
- [fix] ensure bootstrapped template triggers correct engine reset
- [fix] correct template file generator order
- [feat] add support for templateConfig.includedPaths
- 0.31.0-RC.8
- [fix] provide wps alternative locations
- [fix] ensure plugin fix after node_modules updates
- [fix] exclude semver checks for template bootstraps
- [fix] ensure proper reset of appConfig if deleted
- 0.31.0-RC.7
- Merge branch 'release/0.31' of github.com:pavjacko/renative into release/0.31
- [fix] check if weinre exists for debug sessions
- [fix] tizen sdk paths alternative win
- 0.31.0-RC.6
- Merge pull request #584 from pavjacko/fix/version-codes
- [fix] custom version format leftover additions
- [fix] UT coverage, versionCodeFormat support
- [fix] add support for complex package versions in getAppVersionCode
- 0.31.0-RC.5
- [chore] dependency cleanup
- docs cleanup
- 0.31.0-RC.4
- refactor  cypress e2e
- [feat] offer server restart in port clashes
- template cleanup
- git rename hack
- [docs] fixes, updates
- [chore] update deploy scripts
- 0.31.0-RC.3
- [chore] update deploy scripts
- lerna chores 2
- lerna chores
- 0.31.0-RC.1
- 0.31.0-RC.1
- [docs] update upgrade & release notes
- [fix] remove   'transform-react-remove-prop-types' not to break some 3rd part libs (ie rn navigation)
- [fix] ios14 image render fix for react-native (https://github.com/facebook/react-native/issues/29279)
- [chore] migrate tasks to separate folder
- [fix] migrate platform eject / connect to engines
- Merge branch 'develop' of github.com:pavjacko/renative into develop
- 0.31.0-alpha.34
- [chore] add legacy ext support

### Added Features

- none

### Breaking Changes

- none


## v0.30.4 (2020-7-14)

### Fixed

- fix crypto security import
- 0.31.0-alpha.10
- add support for "source:self"
- scoped plugin inheritance
- 0.31.0-alpha.9
- update tasks, logs
- 0.31.0-alpha.8
- chalk --mono support
- 0.31.0-alpha.7
- build hooks
- task dependencies
- fix configureWeb task
- fix webos emulator detection
- refactor engine runners
- fix   cleanPlatformIfRequired
- improved logs
- update task logs
- migrate packageParser, log updates, fix package override
- update logTasks
- 0.31.0-alpha.6
- revert incorrect plugin config
- fix chalk
- 0.31.0-alpha.5
- auto install node_modules after plugin updates
- 0.31.0-alpha.4
- feat: add project links helper
- feat: add support for application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler
- rename npminstall
- npm dep invalidation fix
- 0.31.0-alpha.3
- update engine runners
- scoped dependency resolutions plugin auto install cleaner error log
- feat: plugin dependency resolver
- docs update
- 0.31.0-alpha.2
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
- 0.31.0-alpha.1
- add launch images and configs
- feat: add ios launchscreen
- fix: correct base folder for private configs + legacy support warning

### Added Features

- none

### Breaking Changes

- none


## v0.30.3 (2020-6-26)

### Fixed

- hotfix: correct tizen extensions. thx @TheDuc
- 0.30.2
- Merge pull request #529 from pavjacko/fix/#528-sdk-filed-merges
- revert typo
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

### Added Features

- none

### Breaking Changes

- none

## v0.29.1-alpha.23 (2020-6-19)

### Fixed

- update extension support
- cleanup logging

### Added Features

- none

### Breaking Changes

- none

## v0.29.1-alpha.22 (2020-6-18)

### Fixed

- add only missing plugins
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

## v0.31.0-feat-tasks.4 (2020-9-11)

### Fixed

- [fix] merge files from workspace
- [fix] rnv deploy --only
- 0.31.0-feat-tasks.3
- [fix] avoid platform clean, pod update if not required
- 0.31.0-feat-tasks.2
- [feat] support merge folders of extend + base appConfigs globally
- 0.31.0-feat-tasks.1.md
- added feat to version counter in changelog buildhook
- added scripts to publish with feat tag
- fix case sensitivity issues in appConfig folders

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-feat-tasks.3 (2020-9-10)

### Fixed

- [fix] avoid platform clean, pod update if not required
- 0.31.0-feat-tasks.2
- [feat] support merge folders of extend + base appConfigs globally
- 0.31.0-feat-tasks.1.md
- added feat to version counter in changelog buildhook
- added scripts to publish with feat tag
- fix case sensitivity issues in appConfig folders

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-feat-tasks.2 (2020-9-8)

### Fixed

- [feat] support merge folders of extend + base appConfigs globally
- 0.31.0-feat-tasks.1.md
- added feat to version counter in changelog buildhook
- added scripts to publish with feat tag
- fix case sensitivity issues in appConfig folders

### Added Features

- none

### Breaking Changes

- none


## v0.31.0-feat-tasks.1 (2020-8-26)

### Fixed

- added scripts to publish with feat tag
- fix case sensitivity issues in appConfig folders

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

