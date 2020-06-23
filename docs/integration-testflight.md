---
id: integration_testflight
title: TestFlight
sidebar_label: TestFlight
---

<img src="https://renative.org/img/ic_integrations.png" width=50 height=50 />

## Overview

Coming soon


## Fallback via Build Hooks

You can still use automated deploy via build hooks

create file `./buildHooks/src/iosDeployTestFlight.js`

```js
import { Exec, Common } from 'rnv';

const iosDeploy = async c => {
    let fastlaneArguments = [];
    const basePath = Common.getAppFolder(c, c.platform);
    const path = `${basePath}/release/RNVApp.ipa`;
    const teamID = Common.getConfigProp(c, c.platform, 'teamIdentifier');
    const appleId = Common.getConfigProp(c, c.platform, 'appleId');
    const appId = Common.getConfigProp(c, c.platform, 'id');

    fastlaneArguments = [
        'run',
        'upload_to_testflight',
        `app_identifier:${appId}`,
        `app_platform:ios`,
        `team_id:${teamID}`,
        `ipa:${path}`,
        `apple_id:${appleId}`,
        'skip_waiting_for_build_processing:true',
    ];

    if (process.env.APPLE_DEVELOPER_USERNAME) {
        fastlaneArguments.push(`username:${process.env.APPLE_DEVELOPER_USERNAME}`);
    }

    try {
        await Exec.executeAsync(c, `fastlane ${fastlaneArguments.join(' ')}`, {
            env: process.env,
            shell: true,
            stdio: 'inherit',
            silent: true,
        });
    } catch (e) {
        console.log(`Fastlane ${c.platform} upload to AppStore failed with error ${e}`);
    }
};

export default iosDeploy;
```

update file `./buildHooks/src/index.js`

```js
import iosDeployTestFlight from './iosDeployTestFlight';

const hooks = {
    iosDeployTestFlight
}

const pipes = {
    'deploy:after': [
        iosDeployTestFlight
    ],
};

export { pipes, hooks };
```

run deploy command:


`rnv deploy -p ios -s appstore`
