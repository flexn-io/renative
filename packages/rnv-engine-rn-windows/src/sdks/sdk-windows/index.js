

import { Common, Logger, Exec, EngineManager, Resolver } from 'rnv';
import { copyProjectTemplateAndReplace } from './copyTemplate';

// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const cli = require('@react-native-windows/cli');
// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const runWindows = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/runWindows'
).runWindowsCommand.func;

const { logTask, logWarning } = Logger;
const { getAppFolder, getConfigProp } = Common;
const { executeAsync } = Exec;
const { generateEnvVars } = EngineManager;
const { doResolve } = Resolver;

const defaultOptions = {
    language: 'cpp',
    experimentalNuGetDependency: false,
    useWinUI3: false,
    nuGetTestVersion: null,
    reactNativeEngine: 'chakra',
    nuGetTestFeed: null,
    overwrite: false
};

// TODO Document/comment each of the functions
export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');

    const language = getConfigProp(c, c.platform, 'language', defaultOptions.language);

    const env = getConfigProp(c, c.platform, 'environment');

    // TODO Default options, need to configure this via renative.json
    const options = {
        release: false,
        root: c.paths.project.dir,
        arch: 'x86',
        singleproc: undefined,
        emulator: undefined,
        device: undefined,
        target: undefined,
        remoteDebugging: undefined,
        logging: true,
        packager: true,
        bundle: undefined,
        launch: true,
        autolink: false,
        build: true,
        deploy: true,
        sln: undefined,
        proj: c.paths.project.dir,
        appPath: getAppFolder(c),
        msbuildprops: undefined,
        buildLogDirectory: undefined,
        info: undefined,
        directDebugging: undefined,
        telemetry: false,
        devPort: c.runtime.port,
        additionalMetroOptions: {
            env: {
                NODE_ENV: env || 'development',
                ...generateEnvVars(c)
            }
        }
    };
    const args = [];

    if (!options.additionalMetroOptions.env.RNV_APP_BUILD_DIR) {
        logWarning('Enviroment variables not injected properly! Running metro will return an error!');
    }

    const projectConfig = {
        windows: {
            sourceDir: getAppFolder(c, true),
            solutionFile: `${c.runtime.appId}.sln`,
            project: {
                projectName: c.runtime.appId,
                projectFile: `${c.runtime.appId}\\${c.runtime.appId}.vcxproj`,
                projectLang: language,
                // TODO Validate if this is ok
                projectGuid: c.runtime.appId
            },
            folder: c.paths.project.dir

        },
    };
    const config = {
        root: c.paths.project.dir,
        commands: cli.commands,
        platforms: {
            windows: {
                linkConfig: () => null,
                projectConfig: () => cli.projectConfig(c.paths.project.dir, {
                    project: projectConfig,
                }),
                dependencyConfig: cli.dependencyConfig,
                npmPackageName: 'react-native-windows',
            },
        },
        project: projectConfig
    };

    await runWindows(args, config, options);
    return true;
};

const copyWindowsTemplateProject = async (c) => {
    await copyProjectTemplateAndReplace(c, defaultOptions);
    return true;
};

export const packageBundleForVStudio = (c, isDev = false) => {
    logTask('packageBundleForVStudio');
    // const { maxErrorLength } = c.program;
    const args = [
        'bundle',
        '--platform',
        'windows',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.runtime.appId}_${c.platform}`
        // ,
        // '--entry-file',
        // `${c.buildConfig.platforms[c.platform].entryFile}.js`,
        // '--bundle-output',
        // `${getAppFolder(c, c.platform)}/main.jsbundle`
    ];

    if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
        args.push('--sourcemap-output');
        args.push(`${getAppFolder(c, c.platform)}/main.jsbundle.map`);
    }

    if (c.program.info) {
        args.push('--verbose');
    }

    return executeAsync(c, `node ${doResolve(
        'react-native'
    )}/local-cli/cli.js ${args.join(' ')} --config=metro.config.js`, { env: { ...generateEnvVars(c) } });
};

export { copyWindowsTemplateProject as configureWindowsProject };
