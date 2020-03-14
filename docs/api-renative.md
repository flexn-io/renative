---
id: api-renative
title: renative
sidebar_label: renative
---

## getScaledValue

Help to render UI with unified relative scaled factor

type: `function`

```
import { getScaledValue } from 'renative'

StyleSheet.create({
    view: {
      width: getScaledValue(50),
      height: getScaledValue(50)
    }
})
```

## useOpenURL

Cross-platform hook to open external URLs

type: `function`

```
import { useOpenURL } from 'renative'

const openURL = useOpenURL();
openURL('https://renative.org')
```

## useNavigate

Cross-platform hook to navigate to specific section of app

type: `function`

```
import { useNavigate } from 'renative'

const navigate = useNavigate();
navigate(route, opts, params)
```

## usePop

Cross-platform hook to navigate back to previous screen

type: `function`

```
import { usePop } from 'renative'

const pop = usePop();
pop()
```

## useOpenDrawer

Cross-platform hook to open drawer

type: `function`

```
import { useOpenDrawer } from 'renative'

const openDrawer = useOpenDrawer();
openDrawer(drawerName)
```

## platform

Returns string representing current platform

type: `string`

```
import { platform } from 'renative'
```

## factor

Returns string representing current form factor

type: `string`

```
import { factor } from 'renative'
```

## engine

Returns string representing current core engine

type: `string`

```
import { engine } from 'renative'
```

## isPlatform...

Built-time platform checks for renative target platform

returns true if running under specific platform via `rnv ... -p <PLATFORM>`

### isPlatformAndroid

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformAndroidtv

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformAndroidwear

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformIos

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformTvos

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformWeb

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformWebos

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformTizen

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformTizenwatch

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformTizenmobile

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformMacos

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformWindows

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformFirefoxos

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformFirefoxtv

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

### isPlatformKaios

type: `bool`

```
import { isPlatformAndroid } from 'renative'
```

## isEngine...

Built-time platform checks for renative core engine

### isEngineNative

type: `bool`

```
import { isEngineNative } from 'renative'
```

### isEngineWeb

type: `bool`

```
import { isEngineWeb } from 'renative'
```


## isFactor...

Built-time platform checks for renative form factor per each specific platform

returns true if running under specific form factor via `rnv ... -p <PLATFORM>` and matches one of the form factors ie for android:
[Android Extenstion Support](platform-android.md#file-extension-support)


### isFactorBrowser

type: `bool`

```
import { isFactorBrowser } from 'renative'
```

### isFactorDesktop

type: `bool`

```
import { isFactorDesktop } from 'renative'
```

### isFactorMobile

type: `bool`

```
import { isFactorMobile } from 'renative'
```

### isFactorTv

type: `bool`

```
import { isFactorTv } from 'renative'
```

### isFactorWatch

type: `bool`

```
import { isFactorWatch } from 'renative'
```
