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
      pluginTemplates: {},
      platformTemplates: {}
  },
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
