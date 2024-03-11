import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    execCLI,
    RnvContext,
    getPlatformProjectDir,
    getConfigProp,
    chalk,
    logDefault,
    logDebug,
    logError,
    logSuccess,
    logWarning,
    logInfo,
    isPlatformActive,
    writeCleanFile,
    fsExistsSync,
    copyAssetsFolder,
    copyBuildsFolder,
    OverridesOptions,
    DEFAULTS,
    copyFileSync,
    getContext,
} from '@rnv/core';
import semver from 'semver';
import { CLI_TIZEN } from './constants';

import {
    runTizenSimOrDevice,
    createDevelopTizenCertificate,
    DEFAULT_CERTIFICATE_NAME,
    addDevelopTizenCertificate,
} from './deviceManager';
import {
    checkPortInUse,
    waitForHost,
    getAppVersion,
    confirmActiveBundler,
    addSystemInjects,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
} from '@rnv/sdk-utils';

const DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION = `${DEFAULT_CERTIFICATE_NAME}.p12`;

export const checkTizenStudioCert = async (): Promise<boolean> => {
    try {
        await execCLI(CLI_TIZEN, `security-profiles list -n ${DEFAULTS.certificateProfile}`);
        return true;
    } catch (e) {
        return false;
    }
};

export const configureTizenGlobal = (c: RnvContext) =>
    new Promise<void>((resolve, reject) => {
        logDefault('configureTizenGlobal');
        // Check Tizen Cert
        // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
        const tizenAuthorCert = path.join(c.paths.workspace.dir, DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION);

        if (fsExistsSync(tizenAuthorCert)) {
            checkTizenStudioCert()
                .then((certificateExists) => {
                    if (certificateExists) {
                        logDebug(`${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file exists in Tizen Studio!`);
                        resolve();
                    } else {
                        logWarning(
                            `${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file missing in Tizen Studio! Adding an existing...`
                        );
                        const certDirPath = c.paths.workspace.dir;
                        const certFilename = DEFAULT_CERTIFICATE_NAME;
                        const certPassword = '1234';

                        addDevelopTizenCertificate(c, {
                            profileName: DEFAULTS.certificateProfile,
                            certPath: path.join(certDirPath, `${certFilename}.p12`),
                            certPassword,
                        })
                            .then(() => resolve())
                            .catch((e) => {
                                reject(e);
                            });
                    }
                })
                .catch((e) => reject(e));
        } else {
            logWarning(`${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file missing! Creating one for you...`);
            createDevelopTizenCertificate(c)
                .then(() => resolve())
                .catch((e) => {
                    reject(e);
                });
        }
        // }
    });

const _copyRequiredFiles = () => {
    const tDir = getPlatformProjectDir()!;
    const tBuild = path.join(tDir, 'build');

    const requiredFiles = ['.project', '.tproject', 'config.xml', 'icon.png'];

    requiredFiles.map((requiredFile) => {
        const requiredFilePath = path.join(tDir, requiredFile);
        copyFileSync(requiredFilePath, path.join(tBuild, requiredFile));
    });
};

export const runTizen = async (c: RnvContext, target?: string) => {
    logDefault('runTizen', `target:${target}`);
    const { platform } = c;
    const { hosted } = c.program;

    if (!platform) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    const isHosted = hosted && !bundleAssets;

    if (isHosted) {
        const isPortActive = await checkPortInUse(c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler(c);
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
        logDefault('runTizen', `target:${target} hosted:${!!isHosted}`);
        return;
    }

    if (bundleAssets) {
        await buildCoreWebpackProject();
        _copyRequiredFiles();
        await runTizenSimOrDevice();
    } else {
        const isPortActive = await checkPortInUse(c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().bold(platform)} devServer at port ${chalk().bold(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForHost(c, '')
                .then(() => runTizenSimOrDevice())
                .catch(logError);
            await runWebpackServer(isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);

            if (resetCompleted) {
                waitForHost(c, '')
                    .then(() => runTizenSimOrDevice())
                    .catch(logError);
                await runWebpackServer(isWeinreEnabled);
            } else {
                await runTizenSimOrDevice();
            }
        }
    }
};

export const buildTizenProject = async () => {
    const c = getContext();
    logDefault('buildTizenProject');

    const { platform } = c;

    if (!platform) return;

    const certProfile = getConfigProp(c, c.platform, 'certificateProfile') || DEFAULTS.certificateProfile;
    const tDir = getPlatformProjectDir()!;

    await buildCoreWebpackProject();

    if (!c.program.hosted) {
        _copyRequiredFiles();
        const tOut = path.join(tDir, 'output');
        const tIntermediate = path.join(tDir, 'intermediate');
        const tBuild = path.join(tDir, 'build');

        await execCLI(CLI_TIZEN, `build-web -- ${tBuild} -out ${tIntermediate}`);
        await execCLI(CLI_TIZEN, `package -- ${tIntermediate} -s ${certProfile} -t wgt -o ${tOut}`);

        logSuccess(`Your WGT package is located in ${chalk().cyan(tOut)} .`);
    }

    return true;
};

let _isGlobalConfigured = false;

export const configureTizenProject = async () => {
    const c = getContext();
    logDefault('configureTizenProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir()}`;

    if (!isPlatformActive(platform)) {
        return;
    }

    if (!_isGlobalConfigured && !c.program.hosted) {
        _isGlobalConfigured = true;
        await configureTizenGlobal(c);
    }

    await copyAssetsFolder(platform);
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(platform);
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logDefault('_configureProject');
        const { platform } = c;

        if (!platform) return;

        const configFile = 'config.xml';
        // const p = c.buildConfig.platforms?.[platform];

        const pkg = getConfigProp(c, c.platform, 'package') || '';
        const id = getConfigProp(c, c.platform, 'id') || '';
        const appName = getConfigProp(c, c.platform, 'appName') || '';

        const injects: OverridesOptions = [
            { pattern: '{{PACKAGE}}', override: pkg },
            { pattern: '{{ID}}', override: id },
            { pattern: '{{APP_NAME}}', override: appName },
            { pattern: '{{APP_VERSION}}', override: semver.valid(semver.coerce(getAppVersion(c, platform))) || '' },
        ];

        addSystemInjects(c, injects);

        const file = path.join(getPlatformProjectDir()!, configFile);
        writeCleanFile(file, file, injects, undefined, c);

        resolve();
    });
