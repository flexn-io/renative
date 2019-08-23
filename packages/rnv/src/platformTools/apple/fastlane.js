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
    logDebug
} from '../../common';
import { executeAsync } from '../../systemTools/exec';
import { IOS, TVOS } from '../../constants';

export const updateProfile = c => new Promise((resolve, reject) => {
    logTask('updateProfile', chalk.grey);

    if (c.platform !== IOS && c.platform !== TVOS) {
        reject(`updateProfile:platform ${c.platform} not supported`);
        return;
    }
    const { platform } = c;

    const { appId } = c.runtime;
    const { scheme, maxErrorLength } = c.program;
    const id = getConfigProp(c, platform, 'id');
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
        `${c.paths.private.dir}/${c.files.project.package.name}/appConfigs/${appId}/certs`,
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

    executeAsync(`fastlane ${args.join(' ')}`, { maxErrorLength })
        .then(() => {
            logSuccess(`Succesfully updated provisioning profile for ${appId}:${scheme}:${id}`);

            resolve();
        })
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});
