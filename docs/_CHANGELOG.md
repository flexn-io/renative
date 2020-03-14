# Changelog

## [v0.28.0]

- Migration to React Native 0.61.2
- Support for Hermes Engine
- AndroidX Support

- Migrated 30+ plugins

- RN Camera
- Local Storage
- NetInfo
-

## [v0.26.0]

- new config system

BREAKING CHANGES:



## [v0.25.0 ]

TODO


## [v0.21.7]

-   Give options of available platforms

```bash
rnv run -p ?
rnv run
```

## Bug Fixes

-   fix infinite `_listAndroidTargets`



## [v0.21.6]


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
