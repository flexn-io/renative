---
id: guide-analytics
title: Analytics
sidebar_label: Analytics
---

<img src="https://renative.org/img/ic_analytics.png" width=50 height=50 />

## Overview

To improve stability of the platform and help us fine-tune the most used features, ReNative collects anonymous crash logs via https://sentry.io/

If you do not wish to send any anonymous logs you can disable it globally or per project.

Easiest way to do so is by using `rnv config` command.

## Disable analytics globally

`rnv config analytics false -G`

## Disable analytics per project

`rnv config analytics false`

## Disable analytics globally manually

You can also do it manually by editing your config files

add following property to `~/.rnv/renative.json` file:

```json
{
    "enableAnalytics": false
}
```

## Disable analytics per project manually

add following property to `PATH_TO_YOUR_PROJECT/renative.json` file:

```json
{
    "enableAnalytics": false
}
```
