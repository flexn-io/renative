---
id: config-workspaces
title: Workspace Configs
sidebar_label: Workspace Configs
---

<img src="https://renative.org/img/ic_configuration.png" width=50 height=50 />

## Overview


`renative.workspaces.json` is special type because it serves and 1st entry to your ReNative config ecosystem.


Typical workspace config will look like this:

```
{
    "workspaces": {
        "rnv": {
            "path": "~/.rnv"
        },
        "SOME_ANOTHER_WORKSPACE_ID": {
            "path": "<WORKSPACE_PATH>"
        }
    }
}
```

You can then switch to custom workspace per each project `./renative.json`

```
{
  "workspaceID": "SOME_ANOTHER_WORKSPACE_ID"
}
```
