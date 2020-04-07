---
id: guide-workspaces
title: Workspaces
sidebar_label: Workspaces
---

<img src="https://renative.org/img/ic_workspace.png" width=50 height=50 />

## Overview

Workspaces manage global scopes for ReNative projects.
It allows to add private scoped templates and plugins to `rnv` commands
This is useful for organisation split. ie:

Workspace `myOrganisation`

`~/.myOrganisation`

Workspace `myOtherOrganisation`

`~/.myOtherOrganisation`

run `rnv run workspaces list` to check your workspace list.

## Custom Workspaces

NOTE: `[WORKSPACE_PATH]` folder path can be customised in `~/.rnv/renative.workspaces.json`

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
