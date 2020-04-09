---
id: guide-common_issues
title: Common Issues
sidebar_label: Common Issues
---

<img src="https://renative.org/img/ic_issues.png" width=50 height=50 />

If you encounter unexpected error / issue it is always good to perform basic sanity steps:

#### rnv status

`rnv status`

this should print out basic `SUMMARY` box with info about your project, env, and RNV version. check if everything seem correct.

#### -r --reset

`rnv start -r` -> restart your server / bundler and reset all cache

`rnv run .... -r` -> recreate whole project before running app

#### -i --info

`rnv run .... -i` -> run ReNative with full verbose logs

#### rnv clean

If above does not help try to clean up your project

`rnv clean && npm i`

#### Raise Issue

If above does not help either you can raise new question/bug on repo https://github.com/pavjacko/renative/issues

Provide at least `SUMMARY` box from your console

#### Common Errors:

⚠️`linker command failed with exit code 1 (use -v to see invocation)`

Make sure your Xcode version is `10.2` or newer

⚠️`Description: Invalid runtime: com.apple.CoreSimulator.SimRuntime.iOS-.......`

try to run

```bash
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
```

and then

`rnv run ...`

⚠️`Could not create service of type ScriptPluginFactory using BuildScopeServices.createScriptPluginFactory()`

Try killing all `gradle` processes and running the build again, that should help

⚠️`> Execution of compression failed.`

https://github.com/pavjacko/renative/issues/183
