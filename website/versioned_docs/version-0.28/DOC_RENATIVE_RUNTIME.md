---
id: version-0.28-runtime
title: ReNative Runtime
sidebar_label: Runtime
original_id: runtime
---


<img src="https://renative.org/img/ic_runtime.png" width=50 height=50 />

## Runtime

ReNative provides runtime SDK library to support multi-platform development

```js
import { Api } from 'renative'
```

## Api

### formFactor

```js
import { Api } from 'renative'

Api.formFactor === 'mobile'
```

possible values: `mobile`, `tv`, `watch`, `desktop`, `browser`

returns string value of highest priority form factor

### platform

```js
import {
    Api,     
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV
  } from 'renative'

Api.platform === ANDROID_TV
```

returns string value of current platform

## Platforms

Retruns true if specific platform matches

### isAndroid

```js
import { isAndroid } from 'renative'

isAndroid()
```

### isAndroidtv

```js
import { isAndroidtv } from 'renative'

isAndroidtv()
```

### isAndroidwear

```js
import { isAndroidwear } from 'renative'

isAndroidwear()
```

### isIos

```js
import { isIos } from 'renative'

isIos()
```

### isTvos

```js
import { isTvos } from 'renative'

isTvos()
```

### isWeb

```js
import { isWeb } from 'renative'

isWeb()
```

### isWebos

```js
import { isWebos } from 'renative'

isWebos()
```

### isTizen

```js
import { isTizen } from 'renative'

isTizen()
```

### isTizenwatch

```js
import { isTizenwatch } from 'renative'

isTizenwatch()
```

### isTizenphone

```js
import { isTizenphone } from 'renative'

isTizenphone()
```

### isMacos

```js
import { isMacos } from 'renative'

isMacos()
```

### isWindows

```js
import { isWindows } from 'renative'

isWindows()
```

### isFirefoxos

```js
import { isFirefoxos } from 'renative'

isFirefoxos()
```

### isFirefoxtv

```js
import { isFirefoxtv } from 'renative'

isFirefoxtv()
```

### isKaios

```js
import { isKaios } from 'renative'

isKaios()
```



## Form Factors

Returns true if specific form factor matches

### isBrowser

```js
import { isBrowser } from 'renative'

isBrowser()
```

returns `true` for platforms: `web`

### isDesktop

```js
import { isDesktop } from 'renative'

isDesktop()
```

returns `true` for platforms: `macos`, `windows`

### isMobile

```js
import { isMobile } from 'renative'

isMobile()
```

returns `true` for platforms: `ios`, `android`, `tizenmobile`, `firefoxos`, `kaios`

### isTv

```js
import { isTv } from 'renative'

isTv()
```

returns `true` for platforms: `androidtv`, `tvos`, `tizen`, `webos`, `firefoxtv`

### isWatch

```js
import { isWatch } from 'renative'

isWatch()
```

returns `true` for platforms: `androidwear`, `tizenwatch`
