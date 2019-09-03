---
id: tizenwatch
title: Tizen Watch Platform
sidebar_label: Tizen Watch
---

<img src="https://renative.org/img/ic_tizenwatch.png" width=50 height=50 />

## Tizen Watch

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=200 src="https://renative.org/img/rnv_tizenwatch.gif" />
    </th>
  </tr>
</table>

-   Latest Tizen project
-   Support for Tizen 5.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| Tizen Studio     |  `2.5`  |
| Tizen SDK        |  `5.0`  |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

Make sure you have at least 1 TV VM setup

<table>
  <tr>
    <th>
    <img src="https://renative.org/img/tizenwatch1.png" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizenwatch -t W-5.0-circle-x86
```

#### Run

```
rnv run -p tizenwatch
```

Run on Device

```
rnv run -p tizenwatch -d
```

Run in Browser

```
rnv run -p tizenwatch --hosted
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tizenwatch -r
```

Launch with specific Tizen Watch simulator:

```
rnv run -p tizenwatch -t W-5.0-circle-x86
```
