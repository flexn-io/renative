---
id: version-0.28-analytics
title: Analytics
sidebar_label: Analytics
original_id: analytics
---

<img src="https://renative.org/img/ic_analytics.png" width=50 height=50 />

## Overview

To improve stability of the platform and help us fine-tune the most used features, ReNative collects anonymous crash logs via https://sentry.io/


If you do not wish to send any anonymous logs you can disable it globally or per project


## Disable analytics globally

add following property to `~/.rnv/renative.json` file:

```json
{
  "enableAnalytics": false
}
```

## Disable analytics per project

add following property to `PATH_TO_YOUR_PROJECT/renative.json` file:

```json
{
  "enableAnalytics": false
}
```
