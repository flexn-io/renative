import { buildCoreWebpackProject, configureCoreWebProject, runWebpackServer } from '@rnv/sdk-webpack';
import path from 'path';
import { Common, Constants, Exec, FileUtils, Logger, PlatformManager, ProjectManager, SDKManager } from 'rnv';
import semver from 'semver';

const { execCLI } = Exec;
const { CLI_TIZEN, REMOTE_DEBUGGER_ENABLED_PLATFORMS } = Constants;
const {
    getPlatformProjectDir,
    // getTemplateProjectDir,
    getAppVersion,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects,
    waitForHost,
} = Common;
const { chalk, logTask, logDebug, logError, logSuccess, logWarning, logInfo } = Logger;
const { isPlatformActive } = PlatformManager;
const { writeCleanFile, fsExistsSync } = FileUtils;

const { copyAssetsFolder, copyBuildsFolder } = ProjectManager;

const { runTizenSimOrDevice, createDevelopTizenCertificate, DEFAULT_CERTIFICATE_NAME, DEFAULT_SECURITY_PROFILE_NAME } =
    SDKManager.Tizen;

const DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION = `${DEFAULT_CERTIFICATE_NAME}.p12`;

export const configureTizenGlobal = (c) =>
    new Promise((resolve, reject) => {
        logTask('configureTizenGlobal');
        // Check Tizen Cert
        // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
        const tizenAuthorCert = path.join(c.paths.workspace.dir, DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION);
        if (fsExistsSync(tizenAuthorCert)) {
            logDebug(`${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file exists!`);
            resolve();
        } else {
            logWarning(`${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file missing! Creating one for you...`);
            createDevelopTizenCertificate(c)
                .then(() => resolve())
                .catch((e) => reject(e));
        }
        // }
    });

const _runTizenSimOrDevice = async (c) => {
    try {
        await runTizenSimOrDevice(c, buildCoreWebpackProject);
    } catch (e) {
        // TODO: Capture different errors and react accordingly
        return Promise.reject(e);
    }
    return true;
};

export const runTizen = async (c, target) => {
    logTask('runTizen', `target:${target}`);
    const { platform } = c;
    const { hosted } = c.program;

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

export const buildTizenProject = async (c) => {
    logTask('buildTizenProject');

    const { platform } = c;

    const platformConfig = c.buildConfig.platforms[platform];
    const tDir = getPlatformProjectDir(c);

    await buildCoreWebpackProject(c);
    if (!c.program.hosted) {
        const tOut = path.join(tDir, 'output');
        const tBuild = path.join(tDir, 'build');
        const certProfile = platformConfig.certificateProfile ?? DEFAULT_SECURITY_PROFILE_NAME;

        await execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`);
        await execCLI(c, CLI_TIZEN, `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`);

        logSuccess(`Your WGT package is located in ${chalk().cyan(tOut)} .`);
    }

    return true;
};

let _isGlobalConfigured = false;

export const configureTizenProject = async (c) => {
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
    await configureCoreWebProject(c);
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = (c) =>
    new Promise((resolve) => {
        logTask('_configureProject');
        const { platform } = c;

        const configFile = 'config.xml';
        const p = c.buildConfig.platforms[platform];

        const injects = [
            { pattern: '{{PACKAGE}}', override: p.package },
            { pattern: '{{ID}}', override: p.id },
            { pattern: '{{APP_NAME}}', override: p.appName },
            { pattern: '{{APP_VERSION}}', override: semver.coerce(getAppVersion(c, platform)) },
        ];

        addSystemInjects(c, injects);

        const file = path.join(getPlatformProjectDir(c), configFile);
        writeCleanFile(file, file, injects, null, c);

        resolve();
    });
