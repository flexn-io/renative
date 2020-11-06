---
id: aws
title: AWS
sidebar_label: AWS
---

<img src="https://renative.org/img/ic_integrations.png" width=50 height=50 />

## Overview

ReNative has the ability to deploy your website made with `rnv` to AWS.

The files are uploaded to AWS from `platformBuilds/xxxxx_web/public` folder.


## Commands

`rnv deploy -p web -t aws`


## Fallback via Build Hooks

You can still use automated deploy via build hooks

create file `./buildHooks/src/webDeployAWS.js`

```js
import { Exec, Common } from 'rnv';

const webDeploy = async (c) => {
    const { platform, program, process } = c;
    const bucketName = Common.getConfigProp(c, platform, 's3bucket');
    const region = Common.getConfigProp(c, platform, 's3region', 'eu-west-1');
    const version = Common.getConfigProp(c, c.platform, 'version', c.files.project.package.version);
    const { scheme } = program;
    const folderName = `${c.runtime.appId}-${scheme}-v${version}`;
    const binaryPath = path.join(Common.getAppFolder(c, c.platform), 'public');

    const asyncParams = {
        env: process.env,
        shell: true,
        stdio: 'inherit',
        silent: true,
    };

    const params = `aws s3 cp ${binaryPath} s3://${bucketName}/${folderName} --recursive --acl public-read --region ${region}`;

    const s3 = c.files.workspace.project.configPrivate.aws[bucketName];

    if (s3) {
        process.env.AWS_ACCESS_KEY_ID = s3.aws_access_key_id;
        process.env.AWS_SECRET_ACCESS_KEY = s3.aws_secret_access_key;
    } else {
        console.error(
            `You don't have credentials located in ${c.paths.workspace.configPrivate} for bucket ${bucketName}`
        );
        return;
    }

    await Exec.executeAsync(c, params, asyncParams);
};

export default webDeploy;
```

update file `./buildHooks/src/index.js`

```js
import webDeployAWS from './webDeployAWS';

const hooks = {
    webDeployAWS
}

const pipes = {
    'deploy:after': [
        webDeployAWS
    ],
};

export { pipes, hooks };
```

Configure your `./appConfigs/[APP_ID]/renative.json`:

```
{
  "platforms": {
      "web": {
          "buildSchemes": {
                "release": {
                    "environment": "production",
                    "s3region": "eu-central-1",
                    "s3bucket": "name-of-the-s3-bucket"
              }
          }
      }
  }
}
```

run deploy command:


`rnv deploy -p web -s release`
