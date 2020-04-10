---
id: guide-runtime
title: ReNative Runtime
sidebar_label: Runtime
---

<img src="https://renative.org/img/ic_runtime.png" width=50 height=50 />

## Runtime

ReNative provides runtime SDK library to support multi-platform development

```js
import {
    Button,
    Icon,
    isPlatformTizen,
    isFactorTv,
    engine,
    platform
} from 'renative';

<Button
    style={themeStyles.button}
    textStyle={themeStyles.buttonText}
    title="Try Me!"
    className="focusable"
    onPress={() => {
        setBgColor(bgColor === '#666666' ? Theme.color1 : '#666666');
    }}
    onEnterPress={() => {
        setBgColor(bgColor === '#666666' ? Theme.color1 : '#666666');
    }}
    onBecameFocused={handleFocus}
    onArrowPress={handleUp}
/>;
```

[Full API Reference](api-renative.md)
