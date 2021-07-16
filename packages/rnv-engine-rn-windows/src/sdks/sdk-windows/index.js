

import { Common, Logger, EngineManager } from 'rnv';
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
const { getAppFolder, getConfigProp, getAppTitle } = Common;
const { generateEnvVars } = EngineManager;

const defaultOptions = {
    language: 'cpp',
    experimentalNuGetDependency: false,
    useWinUI3: false,
    nuGetTestVersion: null,
    reactNativeEngine: 'chakra',
    nuGetTestFeed: null,
    overwrite: false,
    // Whether it's a release build
    release: false,
    // Where app entry .js file is
    root: undefined,
    // 'x86' | 'x64' | 'ARM' | 'ARM64'
    arch: 'x86',
    //  opt out of multi-proc builds
    singleproc: false,
    // Deploy to the emulator ??
    emulator: undefined,
    // Deploy to a device ??
    device: undefined,
    // Device GUID to deploy to
    target: undefined,
    // Boolean - Run using remote JS proxy
    remoteDebugging: undefined,
    // Enables logging of build steps
    logging: true,
    // Do not launch packager while building
    packager: true,
    // Enable Bundle configuration.
    bundle: undefined,
    // Launch the app after deployment
    launch: true,
    // Run autolinking
    autolink: false,
    // Build the solution
    build: true,
    // Deploy the app to an emulator
    deploy: true,
    // Solution file to build
    sln: undefined,
    // Where the proj directory is
    proj: undefined,
    // Where the build is placed
    appPath: undefined,
    // Comma separated props to pass to msbuild, eg: prop1=value1,prop2=value2
    msbuildprops: undefined,
    buildLogDirectory: undefined,
    info: undefined,
    // Number - Enable direct debugging on specified port
    directDebugging: undefined,
    // Sending telemetry that allows analysis of usage and failures of the react-native-windows CLI to Microsoft
    telemetry: false,
    // Bundler port to run on
    devPort: undefined,
    // Additional options/args passed to react native's cli's metro server start function
    additionalMetroOptions: {}
};

// TODO Document/comment each of the functions
export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');

    const language = getConfigProp(c, c.platform, 'language', defaultOptions.language);
    const release = getConfigProp(c, c.platform, 'release', defaultOptions.release);
    const root = getConfigProp(c, c.platform, 'root', c.paths.project.dir);
    const arch = getConfigProp(c, c.platform, 'arch', defaultOptions.arch);
    const singleproc = getConfigProp(c, c.platform, 'singleproc', defaultOptions.singleproc);
    const emulator = getConfigProp(c, c.platform, 'emulator', defaultOptions.emulator);
    const device = getConfigProp(c, c.platform, 'device', defaultOptions.device);
    const target = getConfigProp(c, c.platform, 'target', defaultOptions.target);
    const remoteDebugging = getConfigProp(c, c.platform, 'remoteDebugging', defaultOptions.remoteDebugging);
    const logging = getConfigProp(c, c.platform, 'logging', defaultOptions.logging);
    const packager = getConfigProp(c, c.platform, 'packager', defaultOptions.packager);
    const bundle = getConfigProp(c, c.platform, 'bundle', defaultOptions.bundle);
    const launch = getConfigProp(c, c.platform, 'launch', defaultOptions.launch);
    const autolink = getConfigProp(c, c.platform, 'autolink', defaultOptions.autolink);
    const build = getConfigProp(c, c.platform, 'build', defaultOptions.build);
    const deploy = getConfigProp(c, c.platform, 'deploy', defaultOptions.deploy);
    const sln = getConfigProp(c, c.platform, 'sln', defaultOptions.sln);
    const proj = getConfigProp(c, c.platform, 'proj', c.paths.project.dir);
    const appPath = getConfigProp(c, c.platform, 'appPath', getAppFolder(c));
    const msbuildprops = getConfigProp(c, c.platform, 'msbuildprops', defaultOptions.msbuildprops);
    const buildLogDirectory = getConfigProp(c, c.platform, 'buildLogDirectory', defaultOptions.buildLogDirectory);
    const info = getConfigProp(c, c.platform, 'info', defaultOptions.info);
    const directDebugging = getConfigProp(c, c.platform, 'directDebugging', c.runtime.port);
    const telemetry = getConfigProp(c, c.platform, 'telemetry', defaultOptions.telemetry);
    const devPort = getConfigProp(c, c.platform, 'devPort', c.runtime.port);
    const additionalMetroOptions = getConfigProp(c, c.platform, 'additionalMetroOptions', defaultOptions.additionalMetroOptions);

    const env = getConfigProp(c, c.platform, 'environment');

    // TODO Default options, need to configure this via renative.json
    const options = {
        release,
        root,
        arch,
        singleproc,
        emulator,
        device,
        target,
        remoteDebugging,
        logging,
        packager,
        bundle,
        launch,
        autolink,
        build,
        deploy,
        sln,
        proj,
        appPath,
        msbuildprops,
        buildLogDirectory,
        info,
        directDebugging,
        telemetry,
        devPort,
        // Additional values passed to react native cli start function call
        additionalMetroOptions: {
            ...additionalMetroOptions,
            // ENV variables must not be removed as metro will fail without them
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
                projectName: getAppTitle(c, c.platform),
                projectFile: `${c.runtime.appId}\\${c.runtime.appId}.vcxproj`,
                projectLang: language,
                // TODO Validate if this is ok
                projectGuid: getAppTitle(c, c.platform)
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

export { copyWindowsTemplateProject as configureWindowsProject };
