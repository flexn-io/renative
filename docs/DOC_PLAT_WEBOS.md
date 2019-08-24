# Documentation for LG WebOS Platform


---

<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_webos.png?raw=true" width=50 height=50 />

## LG webOS

![](https://img.shields.io/badge/Mac-yes-brightgreen.svg)
![](https://img.shields.io/badge/Windows-yes-brightgreen.svg)
![](https://img.shields.io/badge/Linux-yes-brightgreen.svg)
![](https://img.shields.io/badge/HostMode-yes-brightgreen.svg)

<table>
  <tr>
    <th>
      <img width=600 src="https://github.com/pavjacko/renative/blob/develop/docs/images/rnv_webos.gif?raw=true" />
    </th>
  </tr>
</table>

-   Latest LG webOS Project

#### Requirements

-   [LG Emulator](http://webostv.developer.lge.com/sdk/tools/emulator/introduction-emulator/) v3.0.0

#### Project Configuration

| Feature          | Version |
| ---------------- | :-----: |
| react-native-web | `0.9.9` |
| Babel Core       | `7.1.2` |

#### Emulator

-   launch webOS emulator via CLI

```bash
rnv target launch -p webos -t emulator
```

-   launch webOS emulator Manually

usually located in something like:

```
<USER_PATH>/Library/webOS_TV_SDK/Emulator/v4.0.0/LG_webOS_TV_Emulator_RCU.app
```

#### Run

Run on Simulator

```
rnv run -p webos
```

Run on Device

```
rnv run -p webos -d
```

Run in Browser

```
rnv run -p webos --hosted
```
