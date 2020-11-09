---
id: config-runtime
title: Runtime Config
sidebar_label: Runtime Config
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview


`renative.runtime.json` is special type because it is generated every `rnv` job.

Its location is always in `./platformAssets/renative.runtime.json` because it's meant to be accessed by source code.

## Injecting Runtime Value

You can decorate your `renative.*.json` with runtime value ie:

```json
{
   "runtime": {
      "foo": "bar"
   }
}
```


ie command `rnv run -p android -c helloworld` will genreate build file at:

`./platformAssets/renative.runtime.json`


with followng value:

```json
{
   "foo": "bar"
}
```
