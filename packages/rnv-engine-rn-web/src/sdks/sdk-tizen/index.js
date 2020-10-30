import path from 'path';
import semver from 'semver';
import { Exec, SDKWebpack, FileUtils, Common, Logger, Constants, TargetManager, PlatformManager, ProjectManager } from 'rnv';

const { execCLI } = Exec;
const {
    CLI_TIZEN,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    RNV_PROJECT_DIR_NAME,
    RNV_SERVER_DIR_NAME
} = Constants;
const {
    getPlatformProjectDir,
    getTemplateProjectDir,
    getAppVersion,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects
} = Common;
const {
    chalk,
    logTask,
    logDebug,
    logError,
    logSuccess,
    logWarning,
    logInfo
} = Logger;
const { isPlatformActive } = PlatformManager;
const { writeCleanFile, fsExistsSync } = FileUtils;
const { buildWeb, runWebpackServer, configureCoreWebProject, waitForWebpack } = SDKWebpack;
const { copyAssetsFolder, copyBuildsFolder, DEFAULT_CERTIFICATE_NAME } = ProjectManager;

const { runTizenSimOrDevice, createDevelopTizenCertificate } = TargetManager.Tizen;

const DEFAULT_SECURITY_PROFILE_NAME = 'RNVanillaCert';
const DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION = `${DEFAULT_CERTIFICATE_NAME}.p12`;

export const configureTizenGlobal = c => new Promise((resolve, reject) => {
    logTask('configureTizenGlobal');
    // Check Tizen Cert
    // if (isPlatformActive(c, TIZEN) || isPlatformActive(c, TIZEN_WATCH)) {
    const tizenAuthorCert = path.join(c.paths.workspace.dir, DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION);
    if (fsExistsSync(tizenAuthorCert)) {
        logDebug(`${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file exists!`);
        resolve();
    } else {
        logWarning(
            `${DEFAULT_CERTIFICATE_NAME_WITH_EXTENSION} file missing! Creating one for you...`
        );
        createDevelopTizenCertificate(c)
            .then(() => resolve())
            .catch(e => reject(e));
    }
    // }
});

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
        await buildWeb(c);
        await runTizenSimOrDevice(c);
    } else {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

        if (!isPortActive) {
            logInfo(
                `Your ${chalk().white(
                    platform
                )} devServer at port ${chalk().white(
                    c.runtime.port
                )} is not running. Starting it up for you...`
            );
            waitForWebpack(c)
                .then(() => runTizenSimOrDevice(c))
                .catch(logError);
            await runWebpackServer(c, isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);

            if (resetCompleted) {
                waitForWebpack(c)
                    .then(() => runTizenSimOrDevice(c))
                    .catch(logError);
                await runWebpackServer(c, isWeinreEnabled);
            } else {
                await runTizenSimOrDevice(c);
            }
        }
    }
};

export const buildTizenProject = async (c) => {
    logTask('buildTizenProject');

    const { platform } = c;

    const platformConfig = c.buildConfig.platforms[platform];
    const tDir = getPlatformProjectDir(c);

    await buildWeb(c);
    if (!c.program.hosted) {
        const tOut = path.join(tDir, 'output');
        const tBuild = path.join(tDir, 'build');
        const certProfile = platformConfig.certificateProfile ?? DEFAULT_SECURITY_PROFILE_NAME;

        await execCLI(c, CLI_TIZEN, `build-web -- ${tDir} -out ${tBuild}`);
        await execCLI(
            c,
            CLI_TIZEN,
            `package -- ${tBuild} -s ${certProfile} -t wgt -o ${tOut}`
        );

        logSuccess(
            `Your WGT package is located in ${chalk().cyan(tOut)} .`
        );
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

    if (!_isGlobalConfigured) {
        _isGlobalConfigured = true;
        await configureTizenGlobal(c);
    }

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c, bundleAssets ? RNV_PROJECT_DIR_NAME : RNV_SERVER_DIR_NAME);
    await configureProject(c);
    return copyBuildsFolder(c, platform);
};

export const configureProject = c => new Promise((resolve) => {
    logTask('configureProject');
    const { platform } = c;

    const configFile = 'config.xml';
    const p = c.buildConfig.platforms[platform];

    const injects = [
        { pattern: '{{PACKAGE}}', override: p.package },
        { pattern: '{{ID}}', override: p.id },
        { pattern: '{{APP_NAME}}', override: p.appName },
        { pattern: '{{APP_VERSION}}', override: semver.coerce(getAppVersion(c, platform)) }
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(getTemplateProjectDir(c), configFile),
        path.join(getPlatformProjectDir(c), configFile),
        injects, null, c
    );

    resolve();
});
