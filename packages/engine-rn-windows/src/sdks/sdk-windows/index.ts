import fs, { copyFileSync } from 'fs';
import glob from 'glob';
import path from 'path';
import {
    CoreEnvVars,
    Env,
    RnvContext,
    doResolve,
    executeAsync,
    getAppFolder,
    getConfigProp,
    logDebug,
    logError,
    logTask,
    logWarning,
} from '@rnv/core';
// import cli from '@react-native-windows/cli';
// import runWindowsCMD from '@react-native-windows/cli/lib-commonjs/runWindows/runWindows';
// import msBuildTools from '@react-native-windows/cli/lib-commonjs/runWindows/utils/msbuildtools';
// import info from '@react-native-windows/cli/lib-commonjs/runWindows/utils/info';
import { copyProjectTemplateAndReplace } from './copyTemplate';

// TODO Is there a way to convert these requires into proper imports
// eslint-disable-next-line global-require
const cli = require('@react-native-windows/cli');
// eslint-disable-next-line global-require
const runWindows = require('@react-native-windows/cli/lib-commonjs/runWindows/runWindows').runWindowsCommand.func;
// const msBuildTools = require(
//     '@react-native-windows/cli/lib-commonjs/runWindows/utils/msbuildtools'
// ).default;
const {
    runPowerShellScriptFunction,
    // commandWithProgress,
    // newSpinner,
} = require('@react-native-windows/cli/lib-commonjs/runWindows/utils/commandWithProgress');

const env: Env = process?.env;

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
    logging: false,
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
    // Where the build is placed (default is full path to platformBuilds/projectName_windows)
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
    packageExtension: 'appx',
};

type ConfigKey = any;

const getOptions = (c: RnvContext, injectedOptions: InjectOptions = {}) => {
    const language = getConfigProp<ConfigKey>(c, c.platform, 'language', defaultOptions.language);
    const release = getConfigProp<ConfigKey>(c, c.platform, 'release', defaultOptions.release);
    const root = getConfigProp<ConfigKey>(c, c.platform, 'root', c.paths.project.dir);
    const arch = getConfigProp<ConfigKey>(c, c.platform, 'arch', defaultOptions.arch);
    const singleproc = getConfigProp<ConfigKey>(c, c.platform, 'singleproc', defaultOptions.singleproc);
    const emulator = getConfigProp<ConfigKey>(c, c.platform, 'emulator', defaultOptions.emulator);
    const device = getConfigProp<ConfigKey>(c, c.platform, 'device', defaultOptions.device);
    const target = getConfigProp<ConfigKey>(c, c.platform, 'target', defaultOptions.target);
    const overwrite = getConfigProp<ConfigKey>(c, c.platform, 'overwrite', defaultOptions.overwrite);
    const remoteDebugging = getConfigProp<ConfigKey>(c, c.platform, 'remoteDebugging', defaultOptions.remoteDebugging);
    const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
    const packager = getConfigProp<ConfigKey>(c, c.platform, 'packager', defaultOptions.packager);
    const bundle = getConfigProp<ConfigKey>(c, c.platform, 'bundle', defaultOptions.bundle);
    const launch = getConfigProp<ConfigKey>(c, c.platform, 'launch', defaultOptions.launch);
    const autolink = getConfigProp<ConfigKey>(c, c.platform, 'autolink', defaultOptions.autolink);
    const build = getConfigProp<ConfigKey>(c, c.platform, 'build', defaultOptions.build);
    const deploy = getConfigProp<ConfigKey>(c, c.platform, 'deploy', defaultOptions.deploy);
    const sln = getConfigProp<ConfigKey>(c, c.platform, 'sln', defaultOptions.sln);
    const proj = getConfigProp<ConfigKey>(c, c.platform, 'proj', c.paths.project.dir);
    const appPath = getConfigProp<ConfigKey>(c, c.platform, 'appPath', getAppFolder(c));
    const msbuildprops = getConfigProp<ConfigKey>(c, c.platform, 'msbuildprops', defaultOptions.msbuildprops);
    const buildLogDirectory = getConfigProp<ConfigKey>(
        c,
        c.platform,
        'buildLogDirectory',
        path.join(getAppFolder(c), 'BuildLogs')
    );
    const info = getConfigProp<ConfigKey>(c, c.platform, 'info', defaultOptions.info);
    const directDebugging = getConfigProp<ConfigKey>(c, c.platform, 'directDebugging', defaultOptions.directDebugging);
    const telemetry = getConfigProp<ConfigKey>(c, c.platform, 'telemetry', defaultOptions.telemetry);
    const devPort = getConfigProp<ConfigKey>(c, c.platform, 'devPort', c.runtime.port);
    const env = getConfigProp<ConfigKey>(c, c.platform, 'environment');
    // Aditional ReNative property configurations
    const bundleAssets = getConfigProp<ConfigKey>(c, c.platform, 'bundleAssets') === true;
    const bundleIsDev = getConfigProp<ConfigKey>(c, c.platform, 'bundleIsDev') === true;
    const additionalMetroOptions = getConfigProp<ConfigKey>(
        c,
        c.platform,
        'additionalMetroOptions',
        defaultOptions.additionalMetroOptions
    );

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
        language,
        overwrite,
        bundleAssets,
        bundleIsDev,
        // Additional values passed to react native cli start function call
        additionalMetroOptions: {
            ...additionalMetroOptions,
            // ENV variables must not be removed as metro will fail without them
            env: {
                NODE_ENV: env || 'development',
                ...CoreEnvVars.BASE(),
                ...CoreEnvVars.RNV_EXTENSIONS(),
            },
        },
        ...injectedOptions,
    };

    return options;
};

type InjectOptions = {
    release?: boolean;
    launch?: boolean;
    deploy?: boolean;
    logging?: boolean;
};

// TODO Document/comment each of the functions
export const ruWindowsProject = async (c: RnvContext, injectedOptions?: InjectOptions) => {
    logTask('runWindowsProject');

    const options = getOptions(c, injectedOptions);
    const args: string[] = [];

    if (!options.additionalMetroOptions.env.RNV_APP_BUILD_DIR) {
        logWarning('Enviroment variables not injected properly! Running metro will return an error!');
    }

    const cnfg = {
        sourceDir: getAppFolder(c, true),
        solutionFile: `${c.runtime.appId}.sln`,
        project: {
            projectName: c.runtime.appId,
            projectFile: `${c.runtime.appId}\\${c.runtime.appId}.vcxproj`,
            projectLang: options.language,
            // TODO Validate if this is ok
            projectGuid: c.runtime.appId,
        },
        folder: c.paths.project.dir,
    };

    const projectConfig = {
        windows: cnfg,
    };

    const config = {
        root: c.paths.project.dir,
        commands: cli.commands,
        platforms: {
            windows: {
                linkConfig: () => null,
                projectConfig: () =>
                    cli.projectConfig(c.paths.project.dir, {
                        project: projectConfig,
                    }),
                dependencyConfig: cli.dependencyConfig,
                npmPackageName: 'react-native-windows',
            },
        },
        project: projectConfig,
    };

    // This needs to be set before the first run to make sure there is just
    // one build process running and the run command does not hang if you use
    // it with -r flag
    await setSingleBuildProcessForWindows(c);

    // For release bundle needs to be created
    if (options.bundleAssets || options.release) {
        logDebug('Assets will be bundled');
        await packageBundleForWindows(c, options.bundleIsDev);
    }

    await runWindows(args, config, options);

    return true;
};

const copyWindowsTemplateProject = async (c: RnvContext, injectedOptions = {}) => {
    const options = getOptions(c, injectedOptions);

    const opts = {
        ...options,
        ...injectedOptions,
    };

    await copyProjectTemplateAndReplace(c, opts);

    if (!fs.existsSync(opts.buildLogDirectory)) {
        fs.mkdirSync(opts.buildLogDirectory, { recursive: true });
    }
    return true;
};

function clearWindowsTemporaryFiles(c: RnvContext) {
    logTask('clearWindowsTemporaryFiles');
    const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
    const opts = {
        cwd: c.paths.project.dir,
        detached: false,
        stdio: logging ? 'inherit' : 'ignore',
    };

    // TODO This should be part of rnv clean and rnv run -r and not part of the SDK
    // This should resolve as it used internally by react-native-windows
    // eslint-disable-next-line global-require
    const child_process_1 = require('child_process');

    // NuGet cache
    child_process_1.spawn('cmd.exe', ['/C', 'dotnet nuget locals all --clear'], opts);

    // NPM cache
    delete process.env.NPM_CONFIG_CACHE;
    delete process.env.NPM_CONFIG_PREFIX;

    // TODO Arbitrary 3s delay before continuing to make sure all files were removed is not ideal
    // But without it bundler executes at the same time deletion occurs and therefore bundler
    // fails to initiate
    return new Promise((resolve) => setTimeout(() => resolve(true), 4000));
}

const packageBundleForWindows = (c: RnvContext, isDev = false) => {
    logTask('packageBundleForWindows');
    // const { maxErrorLength } = c.program;
    const entryFile = getConfigProp(c, c.platform, 'entryFile');

    if (!c.runtime.appId) return;

    const args = [
        'bundle',
        '--platform',
        'windows',
        '--dev',
        isDev,
        '--assets-dest',
        `${getAppFolder(c).replace(/\//g, '\\')}\\${c.runtime.appId}\\Bundle`,
        '--entry-file',
        `${entryFile}.js`,
        '--bundle-output',
        `${getAppFolder(c).replace(/\//g, '\\')}\\${c.runtime.appId}\\Bundle\\index.windows.bundle`,
    ];

    if (c.program.info) {
        args.push('--verbose');
    }

    if (getConfigProp<ConfigKey>(c, c.platform, 'enableSourceMaps', false)) {
        // Directory might not exist yet (created during builds proccess)
        const dir = path.join(getAppFolder(c), 'Release', c.runtime.appId, 'sourcemaps', 'react');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        args.push('--sourcemap-output');
        args.push(`${dir}\\index.windows.bundle.map`);
    }

    return executeAsync(
        c,
        `node ${doResolve('react-native', true, { forceForwardPaths: false })}\\local-cli\\cli.js ${args.join(
            ' '
        )} --config=metro.config.js`,
        { env: { ...CoreEnvVars.BASE(), ...CoreEnvVars.RNV_EXTENSIONS() } }
    );
};

const setSingleBuildProcessForWindows = (c: RnvContext) => {
    logTask('setSingleBuildProcessForWindows');
    // eslint-disable-next-line eqeqeq
    if (env.MSBUILDDISABLENODEREUSE != 1) {
        const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
        const opts = {
            cwd: c.paths.project.dir,
            detached: false,
            stdio: logging ? 'inherit' : 'ignore',
        };

        // TODO This should be part of rnv clean and rnv run -r and not part of the SDK
        // This should resolve as it used internally by react-native-windows
        // eslint-disable-next-line global-require
        const child_process_1 = require('child_process');
        child_process_1.spawn('cmd.exe', ['/C', 'set MSBUILDDISABLENODEREUSE=1'], opts);
    }
};

// Copied from @react-native-windows/cli/overrides/lib-commonjs/runWindows/utils/deploy.js
const pushd = (pathArg: string) => {
    const cwd = process.cwd();
    process.chdir(pathArg);
    return () => process.chdir(cwd);
};

// Copied from @react-native-windows/cli/overrides/lib-commonjs/runWindows/utils/deploy.js
const getWindowsStoreAppUtils = (c: RnvContext) => {
    const appFolder = getAppFolder(c);
    const RNWinPath = path.join(
        path.dirname(
            require.resolve('@react-native-windows/cli/package.json', {
                paths: [c.paths.project.dir],
            })
        )
    );
    logWarning(`RN Win Path: ${RNWinPath}`);
    const popd = pushd(appFolder);
    const windowsStoreAppUtilsPath = path.join(RNWinPath, 'powershell', 'WindowsStoreAppUtils.ps1');
    // This should resolve as it used internally by react-native-windows
    // eslint-disable-next-line global-require
    const child_process_1 = require('child_process');
    child_process_1.execSync(`powershell -NoProfile Unblock-File "${windowsStoreAppUtilsPath}"`);
    popd();
    return windowsStoreAppUtilsPath;
};

function getAppPackage(c: RnvContext, injectedOptions?: InjectOptions) {
    const options = getOptions(c, injectedOptions);
    const appFolder = getAppFolder(c);

    let appPackage;
    const rootGlob = `${appFolder.replace(/\\/g, '/')}/{*/AppPackages,AppPackages/*}`;
    const newGlob = `${rootGlob}/*_${options.arch === 'x86' ? '{Win32,x86}' : options.arch}_Test`;
    const result = glob.sync(newGlob);
    if (result.length > 1 && c.runtime.appId) {
        const newFilteredGlobs = result.filter((x) => x.includes(c.runtime.appId || ''));
        if (newFilteredGlobs.length >= 1) {
            logWarning(`More than one app package found: ${result}`);
        }
        appPackage = newFilteredGlobs[0];
    } else if (result.length === 1) {
        appPackage = result[0];
    }
    if (!appPackage) {
        throw new Error(`Unable to find app package using search path: "${appPackage}"`);
    }
    return appPackage;
}

const signWindowsApp = async (c: RnvContext, script: string, windowsStoreAppUtils: string) => {
    try {
        const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
        // TODO Installs the app instead of just saving a certificate
        await runPowerShellScriptFunction(
            'Saving certificate in the local certificate store',
            windowsStoreAppUtils,
            `Install-App "${script}" -Force`,
            logging
        );
    } catch (err) {
        logError(err);
    }
};

const installWindowsApp = async (c: RnvContext, script: string, windowsStoreAppUtils: string) => {
    const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
    await runPowerShellScriptFunction(
        'Removing old version of the app',
        windowsStoreAppUtils,
        `Uninstall-App ${c.runtime.appId}`,
        logging
    );
    await runPowerShellScriptFunction(
        'Installing new version of the app',
        windowsStoreAppUtils,
        `Install-App "${script}" -Force`,
        logging
    );
};

const packageWindowsApp = async (c: RnvContext, injectedOptions?: InjectOptions) => {
    if (!c.runtime.appId) return;
    try {
        const appFolder = getAppFolder(c);
        const windowsStoreAppUtils = getWindowsStoreAppUtils(c);
        const appPackage = getAppPackage(c, injectedOptions);

        // TODO For the most part package generated by runWindows with release option set to true is enough
        // but you might want to package and sign the app manually with a different certificate
        // const arch = getConfigProp<ConfigKey>(c, c.platform, 'arch', defaultOptions.arch);
        // const logging = getConfigProp<ConfigKey>(c, c.platform, 'logging', defaultOptions.logging);
        // const packageExtension = getConfigProp<ConfigKey>(c, c.platform, 'packageExtension', defaultOptions.packageExtension);
        // // const packageExtension = getConfigProp<ConfigKey>(c, c.platform, 'packageExtension', defaultOptions.packageExtension);
        // // Find available SDKs, which have MakeAppx tool
        // const sdks = msBuildTools.getAllAvailableUAPVersions();
        // const packageTaskDescription = 'Packaging UWP Application';
        // const signTaskDescription = 'Signing your UWP application with self generated certificate';

        // // Create a package for the app
        // await commandWithProgress(newSpinner(packageTaskDescription), packageTaskDescription,
        //     `C:\\Program Files (x86)\\Windows Kits\\10\\bin\\${sdks[0]}\\${arch}\\makeappx.exe`,
        //     ['pack', '/o', '/d', `${appFolder}/Release/${c.runtime.appId}`, '/p', `platformBuilds/${c.runtime.appId}_windows/${c.runtime.appId}.${packageExtension}`], logging);
        // // Sign the package with self signed certificate
        // await commandWithProgress(newSpinner(signTaskDescription), signTaskDescription,
        //     `C:\\Program Files (x86)\\Windows Kits\\10\\bin\\${sdks[0]}\\${arch}\\SignTool.exe`,
        //     ['sign', '/v', '/fd', 'sha256', '/a', '/f', `${appFolder}/${c.runtime.appId}/${c.runtime.appId}_TemporaryKey.pfx`, '/p', 'password', `${appFolder}/${c.runtime.appId}.${packageExtension}`], logging);
        const RNWinPowershellPath = path.join(
            path.dirname(
                require.resolve('@react-native-windows/cli/package.json', {
                    paths: [c.paths.project.dir],
                })
            ),
            'powershell'
        );

        // TODO Sign-AppDevPackage cannot be executed
        copyFileSync(
            path.join(RNWinPowershellPath, 'Sign-AppDevPackage.ps1'),
            path.join(appFolder, 'AppPackages', c.runtime.appId, `${c.runtime.appId}_1.0.0.0_Win32_Test`)
        );
        const script = glob.sync(path.join(c.paths.project.dir, appPackage, 'Add-AppDevPackage.ps1'))[0];
        // await signWindowsApp(c, script, windowsStoreAppUtils);
        await installWindowsApp(c, script, windowsStoreAppUtils);
    } catch (e) {
        logError(`App packaging failed with error: ${e}`);
    }
};

export {
    copyWindowsTemplateProject as configureWindowsProject,
    packageBundleForWindows,
    clearWindowsTemporaryFiles,
    packageWindowsApp,
    installWindowsApp,
    signWindowsApp,
};
