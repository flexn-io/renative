# API Reference for RNV Config (c)

List of available config props injected into hooks methods:

## `c` Object

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

## `c.paths` Object

```
{
  rnv: {
      dir: '',
      nodeModulesDir: '',
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

## `c.files` Object

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
