import {
    RnvContext,
    TIZEN,
    addSystemInjects,
    chalk,
    copyAssetsFolder,
    copyBuildsFolder,
    execCLI,
    executeAsync,
    fsExistsSync,
    generateEnvVars,
    getAppDescription,
    getAppId,
    getAppTitle,
    getAppVersion,
    getConfigProp,
    getPlatformBuildDir,
    getPlatformProjectDir,
    isPlatformActive,
    logSuccess,
    logTask,
    writeCleanFile,
} from '@rnv/core';
import path from 'path';
import semver from 'semver';

import { CLI_TIZEN, DEFAULT_SECURITY_PROFILE_NAME, runTizenSimOrDevice } from '@rnv/sdk-tizen';
import { CLI_WEBOS_ARES_PACKAGE, runWebosSimOrDevice } from '@rnv/sdk-webos';
import { VITE_CONFIG_NAME } from '../../constants';

export const runLightningProject = async (c: RnvContext) => {
    logTask('runLightningProject');
    const entryFile = getConfigProp(c, c.platform, 'entryFile');
    const { platform } = c;
    const { hosted } = c.program;
    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        await executeAsync(c, 'vite --open --host', {
            stdio: 'inherit',
            silent: false,
            env: {
                LNG_BUILD_FOLDER: getPlatformBuildDir(c, true),
                LNG_ENTRY_FILE: entryFile,
                LNG_SERVE_PORT: c.runtime.currentPlatform?.defaultPort,
                ...generateEnvVars(c),
            },
        });
    } else {
        await buildLightningProject(c);
        if (platform === TIZEN) {
            await runTizenSimOrDevice(c);
        } else {
            await runWebosSimOrDevice(c);
        }
    }

    return true;
};

export const buildLightningProject = async (c: RnvContext) => {
    logTask('buildLightningProject');

    const { platform } = c;
    const platformConfig = c.buildConfig.platforms?.[platform];

    const entryFile = getConfigProp(c, c.platform, 'entryFile');
    const tBuild = getPlatformProjectDir(c);

    const tOut = path.join(tBuild || '', 'output');
    const certProfile = platformConfig?.certificateProfile ?? DEFAULT_SECURITY_PROFILE_NAME;

    await executeAsync(c, `vite build --sourcemap=true`, {
        stdio: 'inherit',
        silent: false,
        env: {
            LNG_DIST_FOLDER: getPlatformBuildDir(c, true),
            LNG_ENTRY_FILE: entryFile,
            ...generateEnvVars(c),
        },
    });

    if (platform === TIZEN) {
        await execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`);

        logSuccess(`Your WGT package is located in ${chalk().cyan(tOut)} .`);
    } else {
        await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tBuild} -n`);

        logSuccess(`Your IPK package is located in ${chalk().cyan(tOut)} .`);
    }

    return true;
};

export const configureLightningProject = async (c: RnvContext) => {
    logTask('configureLightningProject');
    const { platform } = c;
    const { platformTemplatesDirs, dir } = c.paths.project;
    const supportFilesDir = path.join(platformTemplatesDirs[c.platform], '../../supportFiles');

    const configFile = path.join(dir, VITE_CONFIG_NAME);
    c.runtime.platformBuildsProjectPath = `${getPlatformBuildDir(c)}`;
    if (!isPlatformActive(c, platform)) {
        return;
    }
    await copyAssetsFolder(c, platform);
    if (!fsExistsSync(configFile)) {
        writeCleanFile(path.join(supportFilesDir, VITE_CONFIG_NAME), configFile, undefined, undefined, c);
    }
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logTask('_configureProject');
        const { platform } = c;
        const p = c.buildConfig.platforms?.[platform];

        const injects =
            platform === TIZEN
                ? [
                      { pattern: '{{PACKAGE}}', override: p?.package },
                      { pattern: '{{ID}}', override: p?.id },
                      { pattern: '{{APP_NAME}}', override: p?.appName },
                      { pattern: '{{APP_VERSION}}', override: semver.coerce(getAppVersion(c, platform)) },
                  ]
                : [
                      { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform).toLowerCase() },
                      { pattern: '{{APP_TITLE}}', override: getAppTitle(c, platform) },
                      { pattern: '{{APP_VERSION}}', override: semver.coerce(getAppVersion(c, platform)) },
                      { pattern: '{{APP_DESCRIPTION}}', override: getAppDescription(c, platform) },
                      { pattern: '{{APP_BG_COLOR}}', override: getConfigProp(c, platform, 'bgColor', '#fff') },
                      { pattern: '{{APP_ICON_COLOR}}', override: getConfigProp(c, platform, 'iconColor', '#000') },
                      { pattern: '{{APP_VENDOR}}', override: getConfigProp(c, platform, 'vendor', 'Pavel Jacko') },
                  ];

        addSystemInjects(c, injects);

        const configFile = platform === TIZEN ? 'config.xml' : 'appinfo.json';
        const file = path.join(getPlatformProjectDir(c)!, configFile);
        writeCleanFile(file, file, injects, undefined, c);

        resolve();
    });
