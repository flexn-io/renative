import path from 'path';
import semver from 'semver';
import { Exec, WebpackUtils, FileUtils, Common, Logger, Constants, PlatformManager, ProjectManager, SDKManager } from 'rnv';

const { writeCleanFile } = FileUtils;
const { execCLI } = Exec;
const {
    getPlatformProjectDir,
    getTemplateProjectDir,
    getPlatformBuildDir,
    getAppVersion,
    getAppTitle,
    getAppId,
    getAppDescription,
    getConfigProp,
    checkPortInUse,
    confirmActiveBundler,
    addSystemInjects
} = Common;
const { buildCoreWebpackProject, runWebpackServer, configureCoreWebProject, waitForWebpack } = WebpackUtils;

const { isPlatformActive } = PlatformManager;
const {
    chalk,
    logTask,
    logInfo,
    logSuccess,
    logError
} = Logger;
const {
    copyBuildsFolder,
    copyAssetsFolder
} = ProjectManager;
const {
    CLI_WEBOS_ARES_PACKAGE,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    RNV_PROJECT_DIR_NAME,
    RNV_SERVER_DIR_NAME
} = Constants;
const { runWebosSimOrDevice } = SDKManager.Webos;


export const runWebOS = async (c) => {
    const { hosted } = c.program;
    const { target } = c.runtime;
    const { platform } = c;


    const isHosted = hosted && !getConfigProp(c, platform, 'bundleAssets');

    if (isHosted) {
        const isPortActive = await checkPortInUse(c, platform, c.runtime.port);
        if (isPortActive) {
            const resetCompleted = await confirmActiveBundler(c);
            c.runtime.skipActiveServerCheck = !resetCompleted;
        }
    }

    logTask('runWebOS', `target:${target} hosted:${!!isHosted}`);
    if (isHosted) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        await buildCoreWebpackProject(c);
        await runWebosSimOrDevice(c);
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
                .then(() => runWebosSimOrDevice(c))
                .catch(logError);
            await runWebpackServer(c, isWeinreEnabled);
        } else {
            const resetCompleted = await confirmActiveBundler(c);
            if (resetCompleted) {
                waitForWebpack(c)
                    .then(() => runWebosSimOrDevice(c))
                    .catch(logError);
                await runWebpackServer(c, isWeinreEnabled);
            } else {
                await runWebosSimOrDevice(c);
            }
        }
    }
};

export const buildWebOSProject = async (c) => {
    logTask('buildWebOSProject');

    await buildCoreWebpackProject(c);

    if (!c.program.hosted) {
        const tDir = getPlatformProjectDir(c);
        const tOut = path.join(getPlatformBuildDir(c), 'output');
        await execCLI(c, CLI_WEBOS_ARES_PACKAGE, `-o ${tOut} ${tDir} -n`);

        logSuccess(
            `Your IPK package is located in ${chalk().cyan(tOut)} .`
        );
    }
};

export const configureWebOSProject = async (c) => {
    logTask('configureWebOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c);

    if (!isPlatformActive(c, platform)) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c, bundleAssets ? RNV_PROJECT_DIR_NAME : RNV_SERVER_DIR_NAME);
    await _configureProject(c);
    return copyBuildsFolder(c, platform);
};

const _configureProject = async (c) => {
    logTask('_configureProject');
    const { platform } = c;

    const configFile = 'appinfo.json';

    const injects = [
        {
            pattern: '{{APPLICATION_ID}}',
            override: getAppId(c, platform).toLowerCase()
        },
        {
            pattern: '{{APP_TITLE}}',
            override: getAppTitle(c, platform)
        },
        {
            pattern: '{{APP_VERSION}}',
            override: semver.coerce(getAppVersion(c, platform))
        },
        {
            pattern: '{{APP_DESCRIPTION}}',
            override: getAppDescription(c, platform)
        },
        {
            pattern: '{{APP_BG_COLOR}}',
            override: getConfigProp(c, platform, 'bgColor', '#fff')
        },
        {
            pattern: '{{APP_ICON_COLOR}}',
            override: getConfigProp(c, platform, 'iconColor', '#000')
        },
        {
            pattern: '{{APP_VENDOR}}',
            override: getConfigProp(c, platform, 'vendor', 'Pavel Jacko')
        }
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(getTemplateProjectDir(c), configFile),
        path.join(getPlatformProjectDir(c), configFile),
        injects, null, c
    );

    return true;
};
