---
id: api-rnv-config
title: rnv Config Object Reference
sidebar_label: rnv Config
---

List of available config props injected into [Build Hooks](guide-build-hooks.md) via method parameter

```
// buildHooks/src/index.js
const hooks = {
    hello: async c => {
        // c Object contains all the info about the current rnv session
    }
```

## root

```
{
  program: {},
  process: {},
  command: {},
  subCommand: {},
  paths: {},
  files: {}
}

```

## c.paths

```
{
  rnv: {
      dir: '',
      platformTemplates: {
          dir: ''
      },
      pluginTemplates: {
          dir: '',
          config: ''
      },
      package: '',
      plugins: {
          dir: ''
      }
      projectTemplate: {
          dir: ''
      }
  },
  project: {
      projectConfig: {
          dir: '',
          buildsDir: '',
          fontsDir: '',
          pluginsDir: ''
      },
      builds: {
          dir: '',
          config: ''
      },
      assets: {
          dir: '',
          config: ''
      },
      platformTemplates: {
          dir: ''
      }
  },
  appConfig: {
      dir: '',
      config: ''
  },
  private: {
      project: {
          projectConfig: {},
          builds: {},
          assets: {},
          platformTemplates: {}
      },
      appConfig: {
          dir: '',
          config: ''
      }
  }
}
```

## c.files

```
{
  rnv: {},
  project: {
      projectConfig: {},
      builds: {},
      assets: {},
      platformTemplates: {}
  },
  appConfig: {},
  private: {
      project: {
          projectConfig: {},
          builds: {},
          assets: {},
          platformTemplates: {}
      },
      appConfig: {}
  }
}
```
