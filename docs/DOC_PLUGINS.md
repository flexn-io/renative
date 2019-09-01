---
id: plugins
title: Plugins
sidebar_label: Plugins
---


<img src="https://github.com/pavjacko/renative/blob/develop/docs/images/ic_plugins.png?raw=true" width=50 height=50 />

## Plugins

ReNative Supports standard community driven react-native plugins you can use to enhance the functionality of your apps:

Get list of all available community plugins. (NOTE you can always add new one manually into `projectConfig/plugins.json`)

`$ rnv plugin list`

you should get colorised overview similar to this:

<table>
  <tr>
    <th>
      <img src="https://github.com/pavjacko/renative/blob/develop/docs/images/cli_plugins.png?raw=true" />
    </th>
  </tr>
</table>

add new plugin to your project:

`$ rnv plugin add`

and follow the command prompt steps

Update your current plugins with latest ones from ReNative

`$ rnv plugin update`

and follow the command prompt steps

#### Custom Plugin Support

You can configure multiple React Native plugins without need to update project blueprints.
default location of plugin configs is `./projectConfig/plugins.json`

Example:

```json
{
    "plugins": {
      "renative": "source:rnv",
      "react": "source:rnv",
      "react-art": "source:rnv",
      "react-dom": "source:rnv",
      "react-native": "source:rnv",
      "react-native-web": "source:rnv",
      "react-native-web-image-loader": "source:rnv",
      "react-native-gesture-handler": "source:rnv",
      "react-navigation": "source:rnv",
      "react-navigation-tabs": "source:rnv",
      "react-native-reanimated": "source:rnv",
      "react-native-vector-icons": "source:rnv"
    }
}
```

You can also customise default plugin configuration:

```json
{
    "plugins": {
        "react-native-gesture-handler": {
            "version": "0.1.0",
            "ios": {
                "podName": "RNGestureHandler",
                "path": "node_modules/react-native-gesture-handler"
            },
            "android": {
                "package": "com.swmansion.gesturehandler.react.RNGestureHandlerPackage",
                "path": "node_modules/react-native-gesture-handler/android"
            }
        }
    }
}
```

Plugin Spec:

```json
{
  "plugin-name": {
      "version": "",
      "enabled": true,
      "ios": {},
      "android": {},
      "webpack": {
          "modulePaths": [],
          "moduleAliases": []
      }
  }
}
```
