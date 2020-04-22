---
id: guide-file_extensions
title: File Extensions
sidebar_label: File Extensions
---

<img src="https://renative.org/img/ic_file_extensions.png" width=50 height=50 />

## Overview

ReNative supports powerful file extension mechanism to enable developers to tailor the code and UX towards the needs of specific UI requirements

## File Extension Map

<img src="https://renative.org/img/file_extensions.png" />

## How it works

Based on the map above, each platform `-p [PLATFORM]` triggers compile process and always picks first available extension going from top to bottom.

Each rnv supported platform creates unique path of priority extension allowing you to differentiate it based on various factors

Example of `android` platform file extensions:

| Extension           | Type          | Priority |
| ------------------- | ------------- | :------: |
| `android.mobile.js` | `form factor` |    1     |
| `mobile.js`         | `form factor` |    2     |
| `android.js`        | `platform`    |    3     |
| `mobile.native.js`  | `fallback`    |    4     |
| `native.js`         | `fallback`    |    5     |
| `js`                | `fallback`    |    6     |
| `tsx`               | `fallback`    |    7     |
| `ts`                | `fallback`    |    8     |

Example of `tizen` platform file extensions:

| Extension     | Type          | Priority |
| ------------- | ------------- | :------: |
| `tizen.tv.js` | `form factor` |    1     |
| `web.tv.js`   | `form factor` |    2     |
| `tv.js`       | `form factor` |    3     |
| `tizen.js`    | `platform`    |    4     |
| `tv.web.js`   | `fallback`    |    5     |
| `web.js`      | `fallback`    |    6     |
| `js`          | `fallback`    |    7     |
| `tsx`         | `fallback`    |    8     |
| `ts`          | `fallback`    |    9     |

## Form Factors

Building multi-platform UI sometimes needs "shared" UI to avoid code duplication. ie `mobile` for all mobile experience and `tv` for "leanback" or "big screen" experience

Form factor extension allow you to write only one file compiled for multiple platforms

Image creating Page which should have unique UI on multiple form factors

```
MyPageComponent/
  index.js
```

In above example your code becomes convoluted and has to include variety of `if` `switch` statements to manage differences.

Instead you can write your component like this:

```
MyPageComponent/
  index.desktop.js
  index.mobile.js
  index.tv.js
  index.watch.js
```

Ensuring unique UX experience across different mediums.

Afterwards you can simply use it as standard single component

```
import MyComponent from './MyComponent'

...

<MyComponent />
...
```

Main advantage of this approach is that code is packaged/compiled per platform thus removing unused platform code from final `bundle.js`
