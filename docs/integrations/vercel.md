---
id: vercel
title: Vercel
sidebar_label: Vercel
---

<img src="https://renative.org/img/ic_integrations.png" width=50 height=50 />

## Overview

You can automatically deploy your web build to now.sh with `rnv`

You need to have now CLI installed and configured as per their documentation. (https://zeit.co/docs#installing-now-cli). Just follow the 'Installing Now CLI' section, no need to create a project.

Now you can run `rnv deploy -p web -t now`. You will be asked some questions if you don't already have a `now.json` file and it will be created for you.

### Deploying to production

With the default config only the first deploy will go to production, the rest will create a new URL(deployment). If you want for a specific scheme to deploy directly to production you can add `nowIsProduction: true` in your `buildScheme` in `appConfigs/<folder>/renative.json` like so:

```json
{
    ...
    "buildSchemes": {
        "release": {
            "nowIsProduction": true
        }
    }
    ...
}
```

Then use that scheme to deploy your app `rnv deploy -p web -t now -s release`
