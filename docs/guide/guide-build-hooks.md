---
id: guide-build_hooks
title: Build Hooks
sidebar_label: Build Hooks
---

<img src="https://renative.org/img/ic_hooks.png" width=50 height=50 />

## Build Hooks

Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you.

create file: `./buildHooks/src/index.js` with this script (NOTE: every top-level method must return Promise):

```js
import chalk from 'chalk';

const hooks = {
    hello: c =>
        new Promise((resolve, reject) => {
            console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
            resolve();
        })
};

const pipes = {};

export { pipes, hooks };
```

then simply run:

```
rnv hooks run -x hello
```

ReNative will transpile and execute it in real time!

`index.js` is required entry point but you can create more complex scripts with multiple files/imports.

every top-level method gets invoked with ReNative `config` object containing all necessary build information

## Using RNV in Build Hooks

You can utilize RNV CLI functionality inside of build hooks by simply importing rnv packages:

```js
import {
    Constants,
    Common,
    Exec,
    PlatformManager,
    Doctor,
    PluginManager,
    SetupManager,
    FileUtils
} from 'rnv';
```

## Build Pipes

Sometimes you want to execute specific hook automatically before/after certain ReNative build phase.

To get list of available hook pipes run:

`$ rnv hooks pipes`

You can connect your hook method to one of predefined pipes in your `./buildHooks/src/index.js`:

```js
const pipes = {
    'configure:before': hooks.hello
};
```

Example code above will execute `hooks.hello()` before every time you run `$ rnv configure` commands

## Run Multiple Pipes on One Hook

```js
const pipes = {
    'configure:before': [hooks.hello, hooks.someOtherHook]
};
```

List of available pipe hooks:

```
'run:before', 'run:after',
'log:before', 'log:after',
'start:before', 'start:after',
'package:before', 'package:after',
'package:before', 'package:after',
'build:before', 'build:after',
'export:before', 'export:after',
'deploy:before', 'deploy:after',
'configure:before', 'configure:after',
'platform:configure:before', 'platform:configure:after'
```
