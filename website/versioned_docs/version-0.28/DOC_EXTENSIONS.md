---
id: version-0.28-file_extensions
title: File Extensions
sidebar_label: File Extensions
original_id: file_extensions
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


| Extension | Priority  |
| --------- | :-------: |
| `.mobile.js`          | 1 |
| `.android.js`       | 2 |
| `.native.js`         | 3 |
| `.js`             | 4 |


Example of `tizen` platform file extensions:


| Extension | Priority  |
| --------- | :-------: |
| `.tv.js`          | 1 |
| `.smarttv.js`     | 2 |
| `.tizen.js`       | 3 |
| `.web.js`         | 4 |
| `.js`             | 5 |


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
