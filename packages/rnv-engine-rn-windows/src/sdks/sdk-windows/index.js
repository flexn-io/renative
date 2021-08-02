

import { Common, Logger, EngineManager, Resolver, Exec } from 'rnv';
import { copyProjectTemplateAndReplace } from './copyTemplate';

// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const cli = require('@react-native-windows/cli');
// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const runWindows = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/runWindows'
).runWindowsCommand.func;

const { logTask, logWarning, logDebug } = Logger;
const { getAppFolder, getConfigProp } = Common;
const { generateEnvVars } = EngineManager;
const { doResolve } = Resolver;
const { executeAsync } = Exec;

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
    // TODO By default this leaves open MSBuild proccesses in the background
    // which will hang the run if it is run with -r flag
    // -----------------------------------------------------------------------
    // Opt out of multi-proc builds
    singleproc: true,
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
    bundle: false,
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
    telemetry: true,
    // Bundler port to run on
    devPort: undefined,
    // Additional options/args passed to react native's cli's metro server start function
    additionalMetroOptions: {}
};

// TODO Document/comment each of the functions
export const ruWindowsProject = async (c, injectedOptions = {}) => {
    logTask('runWindowsProject');

    const opts = {
        ...defaultOptions,
        ...injectedOptions
    };

    const language = getConfigProp(c, c.platform, 'language', opts.language);
    const release = getConfigProp(c, c.platform, 'release', opts.release);
    const root = getConfigProp(c, c.platform, 'root', c.paths.project.dir);
    const arch = getConfigProp(c, c.platform, 'arch', opts.arch);
    const singleproc = getConfigProp(c, c.platform, 'singleproc', opts.singleproc);
    const emulator = getConfigProp(c, c.platform, 'emulator', opts.emulator);
    const device = getConfigProp(c, c.platform, 'device', opts.device);
    const target = getConfigProp(c, c.platform, 'target', opts.target);
    const remoteDebugging = getConfigProp(c, c.platform, 'remoteDebugging', opts.remoteDebugging);
    const logging = getConfigProp(c, c.platform, 'logging', opts.logging);
    const packager = getConfigProp(c, c.platform, 'packager', opts.packager);
    const bundle = getConfigProp(c, c.platform, 'bundle', opts.bundle);
    const launch = getConfigProp(c, c.platform, 'launch', opts.launch);
    const autolink = getConfigProp(c, c.platform, 'autolink', opts.autolink);
    const build = getConfigProp(c, c.platform, 'build', opts.build);
    const deploy = getConfigProp(c, c.platform, 'deploy', opts.deploy);
    const sln = getConfigProp(c, c.platform, 'sln', opts.sln);
    const proj = getConfigProp(c, c.platform, 'proj', c.paths.project.dir);
    const appPath = getConfigProp(c, c.platform, 'appPath', getAppFolder(c));
    const msbuildprops = getConfigProp(c, c.platform, 'msbuildprops', opts.msbuildprops);
    const buildLogDirectory = getConfigProp(c, c.platform, 'buildLogDirectory', opts.buildLogDirectory);
    const info = getConfigProp(c, c.platform, 'info', opts.info);
    const directDebugging = getConfigProp(c, c.platform, 'directDebugging', opts.directDebugging);
    const telemetry = getConfigProp(c, c.platform, 'telemetry', opts.telemetry);
    const devPort = getConfigProp(c, c.platform, 'devPort', c.runtime.port);
    const additionalMetroOptions = getConfigProp(c, c.platform, 'additionalMetroOptions', opts.additionalMetroOptions);
    const env = getConfigProp(c, c.platform, 'environment');
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets') === true;
    const bundleIsDev = getConfigProp(c, c.platform, 'bundleIsDev') === true;

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

    // This needs to be set before the first run to make sure there is just
    // one build process running and the run command does not hang if you use
    // it with -r flag
    await setSingleBuildProcessForWindows(c);

    // For release bundle needs to be created
    if (bundleAssets || release) {
        logDebug('Assets will be bundled');
        await packageBundleForWindows(
            c,
            bundleIsDev
        );
    }

    await runWindows(args, config, options);

    // This needs to run after the build because otherwise such folder will not exist
    if (getConfigProp(c, c.platform, 'enableSourceMaps', true)) {
        args.push('--sourcemap-output');
        args.push(`${getAppFolder(c, c.platform)}\\Release\\${c.runtime.appId}\\sourcemaps\\react\\index.windows.bundle.map`);
    }

    return true;
};

const copyWindowsTemplateProject = async (c, injectedOptions = {}) => {
    const opts = {
        ...defaultOptions,
        ...injectedOptions
    };

    await copyProjectTemplateAndReplace(c, opts);
    return true;
};

const packageBundleForWindows = (c, isDev = false) => {
    logTask('packageBundleForWindows');
    // const { maxErrorLength } = c.program;
    const args = [
        'bundle',
        '--platform',
        'windows',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.runtime.appId}_${c.platform}`,
        '--entry-file',
        `${c.buildConfig.platforms[c.platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, c.platform)}\\${c.runtime.appId}\\Bundle\\index.windows.bundle`,
        `--assets-dest ${getAppFolder(c, c.platform)}\\${c.runtime.appId}\\Bundle`
    ];

    if (c.program.info) {
        args.push('--verbose');
    }

    return executeAsync(c, `node ${doResolve(
        'react-native'
    )}/local-cli/cli.js ${args.join(' ')} --config=metro.config.js`, { env: { ...generateEnvVars(c) } });
};

const setSingleBuildProcessForWindows = (c) => {
    logTask('setSingleBuildProcessForWindows');

    return executeAsync(c, 'set MSBUILDDISABLENODEREUSE=1');
};

export { copyWindowsTemplateProject as configureWindowsProject, packageBundleForWindows };
