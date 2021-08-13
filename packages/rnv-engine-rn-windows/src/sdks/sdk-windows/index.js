import path from 'path';
import fs from 'fs';
import { Common, Logger, EngineManager, Resolver, Exec } from 'rnv';
// import cli from '@react-native-windows/cli';
// import runWindowsCMD from '@react-native-windows/cli/lib-commonjs/runWindows/runWindows';
// import msBuildTools from '@react-native-windows/cli/lib-commonjs/runWindows/utils/msbuildtools';
// import info from '@react-native-windows/cli/lib-commonjs/runWindows/utils/info';

import { copyProjectTemplateAndReplace } from './copyTemplate';

// TODO Is there a way to convert these requires into proper imports
// eslint-disable-next-line global-require
const cli = require('@react-native-windows/cli');
// eslint-disable-next-line global-require
const runWindows = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/runWindows'
).runWindowsCommand.func;
const msBuildTools = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/utils/msbuildtools'
).default;
const { commandWithProgress, newSpinner } = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/utils/commandWithProgress'
);

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
    info: false,
    // Number - Enable direct debugging on specified port
    directDebugging: undefined,
    // Sending telemetry that allows analysis of usage and failures of the react-native-windows CLI to Microsoft
    telemetry: true,
    // Bundler port to run on
    devPort: undefined,
    // Additional options/args passed to react native's cli's metro server start function
    additionalMetroOptions: {},
    // UWP App can be packaged into .appx or .msix
    packageExtension: 'appx'
};

// TODO Document/comment each of the functions
export const ruWindowsProject = async (c, injectedOptions = {}) => {
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
    const directDebugging = getConfigProp(c, c.platform, 'directDebugging', defaultOptions.directDebugging);
    const telemetry = getConfigProp(c, c.platform, 'telemetry', defaultOptions.telemetry);
    const devPort = getConfigProp(c, c.platform, 'devPort', c.runtime.port);
    const additionalMetroOptions = getConfigProp(c, c.platform, 'additionalMetroOptions', defaultOptions.additionalMetroOptions);
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
        },
        ...injectedOptions
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

function clearWindowsTemporaryFiles(c) {
    logTask('clearWindowsTemporaryFiles');
    const logging = getConfigProp(c, c.platform, 'logging', defaultOptions.logging);
    const opts = {
        cwd: c.paths.project.dir,
        detached: false,
        stdio: logging ? 'inherit' : 'ignore'
    };

    // TODO This should be part of rnv clean and rnv run -r and not part of the SDK
    // This should resolve as it used internally by react-native-windows
    // eslint-disable-next-line global-require
    const child_process_1 = require('child_process');
    child_process_1.spawn('cmd.exe', ['/C', 'del /q/f/s %TEMP%\\*'], opts);

    // NuGet cache
    child_process_1.spawn('cmd.exe', ['/C', 'dotnet nuget locals all --clear'], opts);

    // Yarn/NPM cache
    child_process_1.spawn('cmd.exe', ['/C', 'npm cache clean --force & yarn cache clean --all'], opts);
}

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
        `${getAppFolder(c, c.platform)}\\${c.runtime.appId}\\Bundle`,
        '--entry-file',
        `${c.buildConfig.platforms[c.platform].entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c, c.platform)}\\${c.runtime.appId}\\Bundle\\index.windows.bundle`
    ];

    if (c.program.info) {
        args.push('--verbose');
    }

    if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
        // Directory might not exist yet (created during builds proccess)
        const dir = path.join(getAppFolder(c, c.platform), 'Release', c.runtime.appId, 'sourcemaps', 'react');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        args.push('--sourcemap-output');
        args.push(`${dir}\\index.windows.bundle.map`);
    }

    return executeAsync(c, `node ${doResolve(
        'react-native'
    )}/local-cli/cli.js ${args.join(' ')} --config=metro.config.js`, { env: { ...generateEnvVars(c) } });
};

const setSingleBuildProcessForWindows = (c) => {
    logTask('setSingleBuildProcessForWindows');

    return executeAsync(c, 'set MSBUILDDISABLENODEREUSE=1');
};

const packageWindowsApp = async (c) => {
    try {
        const arch = getConfigProp(c, c.platform, 'arch', defaultOptions.arch);
        const logging = getConfigProp(c, c.platform, 'logging', defaultOptions.logging);
        const packageExtension = getConfigProp(c, c.platform, 'packageExtension', defaultOptions.packageExtension);
        const appFolder = getAppFolder(c);
        // Find available SDKs, which have MakeAppx tool
        const sdks = msBuildTools.getAllAvailableUAPVersions();
        const packageTaskDescription = 'Packaging UWP Application';
        // TODO Implement sign with a certiface valid for stores (not self signed)
        const signTaskDescription = 'Signing your UWP application with self generated certificate';

        // Create a package for the app
        // TODO Ideally this would be done with ReNative's executeAsync, but it throws path not found error
        await commandWithProgress(newSpinner(packageTaskDescription), packageTaskDescription,
            `C:\\Program Files (x86)\\Windows Kits\\10\\bin\\${sdks[0]}\\${arch}\\makeappx.exe`,
            ['pack', '/o', '/d', `${appFolder}/Release/${c.runtime.appId}`, '/p', `platformBuilds/${c.runtime.appId}_windows/${c.runtime.appId}.${packageExtension}`], logging);
        // Sign the package with self signed certificate
        // TODO Signing algorithm and password need to be dynamic
        await commandWithProgress(newSpinner(signTaskDescription), signTaskDescription,
            `C:\\Program Files (x86)\\Windows Kits\\10\\bin\\${sdks[0]}\\${arch}\\SignTool.exe`,
            ['sign', '/v', '/fd', 'sha256', '/a', '/f', `${appFolder}/${c.runtime.appId}/${c.runtime.appId}_TemporaryKey.pfx`, '/p', 'password', `${appFolder}/${c.runtime.appId}.${packageExtension}`], logging);
    } catch (e) {
        console.error('App packaging failed with error: ', e);
    }
};

export { copyWindowsTemplateProject as configureWindowsProject,
    packageBundleForWindows,
    clearWindowsTemporaryFiles,
    packageWindowsApp };
