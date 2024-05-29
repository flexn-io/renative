import path from 'path';
import { getConfigProp, chalk, logDefault, logWarning, logSuccess, executeAsync, getContext } from '@rnv/core';
import { getAppId } from '@rnv/sdk-utils';

export const registerDevice = async () => {
    const c = getContext();
    logDefault(`registerDevice:${c.platform}`);

    const teamID = getConfigProp('teamID');
    const udid = c.runtime.targetUDID;
    const deviceName = c.runtime.target;

    const args = ['run', 'register_device', `team_id:"${teamID}"`, `udid:"${udid}"`, `name:"${deviceName}"`];

    try {
        await executeAsync(`fastlane ${args.join(' ')}`, {
            shell: true,
            stdio: 'inherit',
            silent: true,
        });
        logSuccess(`successfully registered device ${deviceName}:${udid}:${teamID}`);
        return true;
    } catch (e) {
        logWarning(e);
        return true;
    }
};

export const updateProfile = async (): Promise<boolean> => {
    logDefault(`updateProfile`, chalk().grey);
    const c = getContext();

    // TODO: run trough all schemes
    // const schemes = c.buildConfig.platforms?.[c.platform]?.buildSchemes
    // const currScheme = c.program.opts().scheme
    // for(k in schemes) {
    //   c.program.opts().scheme = k
    // }

    // if (appConfigId) await setAppConfig(c, appConfigId);

    if (c.platform !== 'ios') {
        return Promise.reject(`updateProfile:platform ${c.platform} not supported`);
    }
    const { scheme } = c.program.opts();

    const { platform } = c;

    const { appId } = c.runtime;

    const id = getAppId();
    const teamID = getConfigProp('teamID');
    const pMethod = getConfigProp('exportOptions')?.method;
    const runScheme = getConfigProp('runScheme');
    let provisioning;
    if (pMethod === 'ad-hoc') provisioning = 'adhoc';
    if (pMethod === 'development' || runScheme === 'Debug') {
        provisioning = 'development';
    }

    const certsPath = path.join(c.paths.workspace.appConfig.dir, 'certs');

    let args = [
        'sigh',
        '--app_identifier',
        id,
        '--team_id',
        teamID,
        '--output_path',
        certsPath,
        '--force',
        '--platform',
        platform,
    ];
    if (process.env.APPLE_DEVELOPER_USERNAME) {
        args = args.concat(['--username', process.env.APPLE_DEVELOPER_USERNAME]);
    }
    if (provisioning) {
        args.push(`--${provisioning}`);
    }

    try {
        await executeAsync(`fastlane ${args.join(' ')}`, {
            shell: true,
            stdio: 'inherit',
            silent: true,
        });
        logSuccess(`successfully updated provisioning profile for ${appId}:${scheme}:${id}`);
        return true;
    } catch (e) {
        logWarning(e);
        return true;
    }
};
