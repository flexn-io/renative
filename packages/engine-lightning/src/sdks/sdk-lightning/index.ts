import path from 'path';
import {
    isPlatformActive,
    chalk,
    logTask,
    logSuccess,
    executeAsync,
    execCLI,
    RnvContext,
    getConfigProp,
    getPlatformProjectDir,
    copyAssetsFolder,
    copyBuildsFolder,
    writeCleanFile,
    DEFAULTS,
    OverridesOptions,
    CoreEnvVars,
    getAppFolder,
    logDefault,
    fsExistsSync,
    copyFolderContentsRecursiveSync,
} from '@rnv/core';
import semver from 'semver';

import { runTizenSimOrDevice, CLI_TIZEN } from '@rnv/sdk-tizen';
import { CLI_WEBOS_ARES_PACKAGE, runWebosSimOrDevice } from '@rnv/sdk-webos';
import { getAppVersion, getAppTitle, getAppId, getAppDescription, addSystemInjects } from '@rnv/sdk-utils';
import { EnvVars } from './env';

export const runLightningProject = async (c: RnvContext) => {
    logDefault('runLightningProject');
    const { platform } = c;
    const { hosted } = c.program;
    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        await executeAsync(c, 'lng dev', {
            stdio: 'inherit',
            silent: false,
            env: {
                ...CoreEnvVars.BASE(),
                ...CoreEnvVars.RNV_EXTENSIONS(),
                ...EnvVars.LNG_AUTO_UPDATE(),
                ...EnvVars.LNG_BUILD_FOLDER(),
                ...EnvVars.LNG_ENTRY_FILE(),
                ...EnvVars.LNG_SERVE_PORT(),
                ...EnvVars.LNG_STATIC_FOLDER(),
            },
        });
    } else {
        await buildLightningProject(c);
        if (platform === 'tizen') {
            await runTizenSimOrDevice(c);
        } else {
            await runWebosSimOrDevice(c);
        }
    }

    return true;
};

export const buildLightningProject = async (c: RnvContext) => {
    logDefault('buildLightningProject');

    const { platform } = c;
    if (!platform) return;

    const certProfile = getConfigProp(c, c.platform, 'certificateProfile') || DEFAULTS.certificateProfile;

    const target = getConfigProp(c, platform, 'target', 'es6');
    const tBuild = EnvVars.LNG_DIST_FOLDER().LNG_DIST_FOLDER;

    const tOut = path.join(tBuild || '', 'output');

    await executeAsync(c, `lng dist --${target}`, {
        stdio: 'inherit',
        silent: false,
        env: {
            ...CoreEnvVars.BASE(),
            ...CoreEnvVars.RNV_EXTENSIONS(),
            ...EnvVars.LNG_AUTO_UPDATE(),
            ...EnvVars.LNG_DIST_FOLDER(),
            ...EnvVars.LNG_ENTRY_FILE(),
            ...EnvVars.LNG_STATIC_FOLDER(),
        },
    });

    if (platform === 'tizen') {
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
    c.runtime.platformBuildsProjectPath = `${getAppFolder(c)}`;
    if (!isPlatformActive(c, platform)) {
        return;
    }
    await copyAssetsFolder(c, platform);
    await _configureProject(c);
    console.log('configureLightningProject', JSON.stringify(c.paths, null, 2));
    _copyAssets(c);
    return copyBuildsFolder(c, platform);
};

const _copyAssets = (c: RnvContext) => {
    logTask('copyLightningAssets');
    const staticFolder = path.join(getAppFolder(c, true), 'static');

    // copy fonts
    const fontsSrcs = c.paths.appConfig.fontsDirs;
    const fontsDest = path.join(staticFolder, 'fonts');
    fontsSrcs.forEach((fontSrc) => {
        if (fsExistsSync(fontSrc)) {
            copyFolderContentsRecursiveSync(fontSrc, fontsDest);
        }
    });
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logDefault('_configureProject');

        const { platform } = c;
        if (!platform) {
            resolve();
            return;
        }

        const pkg = getConfigProp(c, c.platform, 'package') || '';
        const id = getConfigProp(c, c.platform, 'id') || '';
        const appName = getConfigProp(c, c.platform, 'appName') || '';

        const injects: OverridesOptions =
            platform === 'tizen'
                ? [
                      { pattern: '{{PACKAGE}}', override: pkg },
                      { pattern: '{{ID}}', override: id },
                      { pattern: '{{APP_NAME}}', override: appName },
                      {
                          pattern: '{{APP_VERSION}}',
                          override: semver.coerce(getAppVersion(c, platform))?.format(),
                      },
                  ]
                : [
                      { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform)?.toLowerCase() },
                      { pattern: '{{APP_TITLE}}', override: getAppTitle(c, platform) },
                      { pattern: '{{APP_VERSION}}', override: semver.coerce(getAppVersion(c, platform))?.format() },
                      { pattern: '{{APP_DESCRIPTION}}', override: getAppDescription(c, platform) },
                      { pattern: '{{APP_BG_COLOR}}', override: getConfigProp(c, platform, 'backgroundColor', '#fff') },
                      { pattern: '{{APP_ICON_COLOR}}', override: getConfigProp(c, platform, 'iconColor', '#000') },
                      { pattern: '{{APP_VENDOR}}', override: getConfigProp(c, platform, 'author') || DEFAULTS.author },
                  ];

        addSystemInjects(c, injects);

        const configFile = platform === 'tizen' ? 'config.xml' : 'appinfo.json';
        const file = path.join(getPlatformProjectDir(c)!, configFile);
        writeCleanFile(file, file, injects, undefined, c);

        resolve();
    });
