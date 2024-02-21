import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import {
    execCLI,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    RnvContext,
    getPlatformProjectDir,
    getConfigProp,
    chalk,
    logTask,
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
} from '@rnv/core';
import semver from 'semver';
import { CLI_TIZEN } from './constants';

import {
    runTizenSimOrDevice,
    createDevelopTizenCertificate,
    DEFAULT_CERTIFICATE_NAME,
    addDevelopTizenCertificate,
} from './deviceManager';
import { checkPortInUse, waitForHost, getAppVersion, confirmActiveBundler, addSystemInjects } from '@rnv/sdk-utils';

const DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION = `${DEFAULT_CERTIFICATE_NAME}.p12`;

export const checkTizenStudioCert = async (c: RnvContext): Promise<boolean> => {
    try {
        await execCLI(c, CLI_TIZEN, `security-profiles list -n ${DEFAULTS.certificateProfile}`);
        return true;
    } catch (e) {
        return false;
    }
};

export const configureTizenGlobal = (c: RnvContext) =>
    new Promise<void>((resolve, reject) => {
        logTask('configureTizenGlobal');
        // Check Tizen Cert
        // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
        const tizenAuthorCert = path.join(c.paths.workspace.dir, DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION);

        if (fsExistsSync(tizenAuthorCert)) {
            checkTizenStudioCert(c)
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

const _runTizenSimOrDevice = async (c: RnvContext) => {
    try {
        await runTizenSimOrDevice(c, buildCoreWebpackProject);
    } catch (e) {
        // TODO: Capture different errors and react accordingly
        return Promise.reject(e);
    }
    return true;
};

export const runTizen = async (c: RnvContext, target?: string) => {
    logTask('runTizen', `target:${target}`);
    const { platform } = c;
    const { hosted } = c.program;

    if (!platform) return;

    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler(c);
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
    }

    logTask('runTizen', `target:${target} hosted:${!!isHosted}`);
    if (isHosted) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildCoreWebpackProject(c);
        await _runTizenSimOrDevice(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(platform)} devServer at port ${chalk().white(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForHost(c, '')
                .then(() => _runTizenSimOrDevice(c))
                .catch(logError);
            await runWebpackServer(c, isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);

            if (resetCompleted) {
                waitForHost(c, '')
                    .then(() => _runTizenSimOrDevice(c))
                    .catch(logError);
                await runWebpackServer(c, isWeinreEnabled);
            } else {
                await _runTizenSimOrDevice(c);
            }
        }
    }
};

export const buildTizenProject = async (c: RnvContext) => {
    logTask('buildTizenProject');

    const { platform } = c;

    if (!platform) return;

    const certProfile = getConfigProp(c, c.platform, 'certificateProfile') || DEFAULTS.certificateProfile;
    const tDir = getPlatformProjectDir(c)!;

    await buildCoreWebpackProject(c);
    if (!c.program.hosted) {
        const tOut = path.join(tDir, 'output');
        const tIntermediate = path.join(tDir, 'intermediate');
        const tBuild = path.join(tDir, 'build');

        const requiredFiles = ['.project', '.tproject', 'config.xml', 'icon.png'];

        requiredFiles.map((requiredFile) => {
            const requiredFilePath = path.join(tDir, requiredFile);
            copyFileSync(requiredFilePath, path.join(tBuild, requiredFile));
        });

        await execCLI(c, CLI_TIZEN, `build-web -- ${tBuild} -out ${tIntermediate}`);
        await execCLI(c, CLI_TIZEN, `package -- ${tIntermediate} -s ${certProfile} -t wgt -o ${tOut}`);

        logSuccess(`Your WGT package is located in ${chalk().cyan(tOut)} .`);
    }

    return true;
};

let _isGlobalConfigured = false;

export const configureTizenProject = async (c: RnvContext) => {
    logTask('configureTizenProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    if (!isPlatformActive(c, platform)) {
        return;
    }

    if (!_isGlobalConfigured && !c.program.hosted) {
        _isGlobalConfigured = true;
        await configureTizenGlobal(c);
    }

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject();
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = (c: RnvContext) =>
    new Promise<void>((resolve) => {
        logTask('_configureProject');
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

        const file = path.join(getPlatformProjectDir(c)!, configFile);
        writeCleanFile(file, file, injects, undefined, c);

        resolve();
    });
