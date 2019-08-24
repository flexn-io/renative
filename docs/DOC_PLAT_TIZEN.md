# Documentation for Tizen TV Platform


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tizen.png?raw=true" width=50 height=50 />

## Tizen TV

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tizen.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest Tizen project
-   Support for Tizen 5.0, 4.0, 3.0

#### Requirements

-   [Tizen SDK](https://developer.tizen.org/ko/development/tizen-studio/configurable-sdk) `5.0`
-   Make sure your CPU supports virtualization. Otherwise Tizen emulator might not start.
-   If you are deploying to a TV, follow this guide to set your TV in developer mode [Link](https://developer.samsung.com/tv/develop/getting-started/using-sdk/tv-device)

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
    <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/tizen4.png?raw=true" />
    </th>
  </tr>
</table>

```
rnv target launch -p tizen -t T-samsung-5.0-x86
```

#### Run

```
rnv run -p tizen
```

Run on Device

```
rnv run -p tizen -d
```

Run in Browser

```
rnv run -p tizen --hosted
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tizen -r
```

Launch with specific Tizen simulator:

```
rnv run -p tizen -t T-samsung-5.0-x86
```
