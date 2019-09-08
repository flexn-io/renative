import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import child_process from 'child_process';
import {
    logTask,
    logError,
    logWarning,
    logSuccess,
    getAppFolder,
    isPlatformActive,
    getConfigProp,
    logDebug,
    getAppId
} from '../../common';
import { executeAsync } from '../../systemTools/exec';
import { IOS, TVOS } from '../../constants';
import { setAppConfig } from '../../configTools/configParser';

export const updateProfile = (c, appConfigId) => new Promise((resolve, reject) => {
    logTask(`updateProfile:${appConfigId}`, chalk.grey);

    // TODO: run trough all schemes
    // const schemes = c.buildConfig.platforms?.[c.platform]?.buildSchemes
    // const currScheme = c.program.scheme
    // for(k in schemes) {
    //   c.program.scheme = k
    // }

    if (appConfigId) setAppConfig(c, appConfigId);

    if (c.platform !== IOS && c.platform !== TVOS) {
        reject(`updateProfile:platform ${c.platform} not supported`);
        return;
    }
    const { platform } = c;

    const { appId } = c.runtime;
    const { scheme } = c.program;
    const id = getAppId(c, platform);
    const teamID = getConfigProp(c, platform, 'teamID');
    const pMethod = getConfigProp(c, platform, 'exportOptions')?.method;
    const runScheme = getConfigProp(c, platform, 'runScheme');
    let provisioning;
    if (pMethod === 'ad-hoc') provisioning = 'adhoc';
    if (pMethod === 'development' || runScheme === 'Debug') provisioning = 'development';

    let args = [
        'sigh',
        '--app_identifier',
        id,
        '--team_id',
        teamID,
        '--output_path',
        `${c.paths.workspace.dir}/${c.files.project.package.name}/appConfigs/${appId}/certs`,
        '--force'
    ];
    if (process.env.APPLE_DEVELOPER_USERNAME) {
        args = args.concat([
            '--username',
            process.env.APPLE_DEVELOPER_USERNAME
        ]);
    }
    if (provisioning) {
        args.push(`--${provisioning}`);
    }

    executeAsync(c, `fastlane ${args.join(' ')}`)
        .then(() => {
            logSuccess(`Succesfully updated provisioning profile for ${appId}:${scheme}:${id}`);

            resolve();
        })
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});
