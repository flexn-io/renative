# Documentation for tvOS Platform


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_tvos.png?raw=true" width=90 height=50 />

## tvOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-n/a-lightgrey.svg)
![](https://img.shields.io/badge/Linux-n/a-lightgrey.svg)
![](https://img.shields.io/badge/HostMode-n/a-lightgrey.svg)

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_tvos.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest swift based Xcode project
-   Cocoapods Workspace ready
-   Swift 4.1 Support

#### Requirements

-   [CocoaPods](https://cocoapods.org) `1.5.3` or newer
-   [Xcode](https://developer.apple.com/xcode/) for iOS development

#### Project Configuration

| Feature           | Version |
| ----------------- | :-----: |
| Swift             |  `4.1`  |
| Deployment Target | `11.4`  |

#### Run

```
rnv start
rnv run -p tvos
```

#### Advanced

Clean and Re-build platform project

```
rnv run -p tvos -r
```

Launch with specific tvOS simulator

```
rnv run -p tvos -t "Apple TV 4K"
```

#### App Config

<a href="#apple-based-config">see: Apple based config</a>
