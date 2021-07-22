"use strict";
/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWindowsCommand = exports.getAnonymizedProjectName = void 0;
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const telemetry_1 = require("@react-native-windows/telemetry");
const build = require("./utils/build");
const chalk = require("chalk");
const deploy = require("./utils/deploy");
const commandWithProgress_1 = require("./utils/commandWithProgress");
const info = require("./utils/info");
const msbuildtools_1 = require("./utils/msbuildtools");
const runWindowsOptions_1 = require("./runWindowsOptions");
const autolink_1 = require("./utils/autolink");
const os_1 = require("os");
function setExitProcessWithError(loggingWasEnabled) {
    if (!loggingWasEnabled) {
        console.log(`Re-run the command with ${chalk.bold('--logging')} for more information`);
        if (telemetry_1.Telemetry.client) {
            console.log(`Your session id was ${telemetry_1.Telemetry.client.commonProperties.sessionId}`);
        }
    }
    process.exitCode = 1;
}
function getPkgVersion(pkgName) {
    try {
        const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
            paths: [process.cwd(), __dirname],
        });
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
        if (pkgJson.name === pkgName && pkgJson.version !== undefined) {
            return pkgJson.version;
        }
    }
    catch (_a) { }
    commandWithProgress_1.newWarn(`Could not determine ${pkgName} version`);
    return '';
}
let runWindowsPhase = 'None';
/**
 * Performs build deploy and launch of RNW apps.
 * @param args Unprocessed args passed from react-native CLI.
 * @param config Config passed from react-native CLI.
 * @param options Options passed from react-native CLI.
 */
async function runWindows(args, config, options) {
    var _a, _b, _c, _d;
    if (!options.telemetry) {
        if (options.logging) {
            console.log('Disabling telemetry');
        }
        telemetry_1.Telemetry.disable();
    }
    else {
        telemetry_1.Telemetry.setup();
    }
    // https://github.com/yarnpkg/yarn/issues/8334 - Yarn on Windows breaks apps that read from the environment variables
    // Yarn will run node via CreateProcess and pass npm_config_* variables in lowercase without unifying their value
    // with their possibly existing uppercase counterparts. This breaks programs that read from the environment block
    // and write to a case-insensitive dictionary since they expect to encounter each variable only once.
    // The values of the lowercase variables are the one npm actually wants to use, plus they are seeded from the
    // uppercase variable values one if there are no overrides.
    delete process.env.NPM_CONFIG_CACHE;
    delete process.env.NPM_CONFIG_PREFIX;
    if (options.info) {
        try {
            const output = await info.getEnvironmentInfo();
            console.log(output.trimEnd());
            console.log('  Installed UWP SDKs:');
            const sdks = msbuildtools_1.default.getAllAvailableUAPVersions();
            sdks.forEach(version => console.log('    ' + version));
            return;
        }
        catch (e) {
            (_a = telemetry_1.Telemetry.client) === null || _a === void 0 ? void 0 : _a.trackException({ exception: e });
            commandWithProgress_1.newError('Unable to print environment info.\n' + e.toString());
            return setExitProcessWithError(options.logging);
        }
    }
    let runWindowsError;
    try {
        await runWindowsInternal(args, config, options);
    }
    catch (e) {
        (_b = telemetry_1.Telemetry.client) === null || _b === void 0 ? void 0 : _b.trackException({ exception: e });
        runWindowsError = e;
        return setExitProcessWithError(options.logging);
    }
    finally {
        (_c = telemetry_1.Telemetry.client) === null || _c === void 0 ? void 0 : _c.trackEvent({
            name: 'run-windows',
            properties: {
                release: options.release,
                arch: options.arch,
                singleproc: options.singleproc,
                emulator: options.emulator,
                device: options.device,
                target: options.target,
                remoteDebugging: options.remoteDebugging,
                logging: options.logging,
                packager: options.packager,
                bundle: options.bundle,
                launch: options.launch,
                autolink: options.autolink,
                build: options.bundle,
                deploy: options.deploy,
                sln: options.sln !== undefined,
                proj: options.proj !== undefined,
                msBuildProps: options.msbuildprops !== undefined
                    ? options.msbuildprops.split(',').length
                    : 0,
                info: options.info,
                directDebugging: options.directDebugging,
                'react-native-windows': getPkgVersion('react-native-windows'),
                'react-native': getPkgVersion('react-native'),
                'cli-version': getPkgVersion('@react-native-windows/cli'),
                msftInternal: telemetry_1.isMSFTInternal(),
                durationInSecs: process.uptime(),
                success: runWindowsError === undefined,
                phase: runWindowsPhase,
                totalMem: os_1.totalmem(),
                diskFree: telemetry_1.getDiskFreeSpace(__dirname),
                cpus: os_1.cpus().length,
                project: await getAnonymizedProjectName(config.root),
            },
        });
        (_d = telemetry_1.Telemetry.client) === null || _d === void 0 ? void 0 : _d.flush();
    }
}
async function getAnonymizedProjectName(projectRoot) {
    const projectJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(projectJsonPath)) {
        return null;
    }
    const projectJson = JSON.parse((await fs.promises.readFile(projectJsonPath)).toString());
    const projectName = projectJson.name;
    if (typeof projectName !== 'string') {
        return null;
    }
    // Ensure the project name cannot be reverse engineered to avoid leaking PII
    return crypto
        .createHash('sha256')
        .update(projectName)
        .digest('hex')
        .toString();
}
exports.getAnonymizedProjectName = getAnonymizedProjectName;
async function runWindowsInternal(args, config, options) {
    const verbose = options.logging;
    if (verbose) {
        commandWithProgress_1.newInfo('Verbose: ON');
    }
    let slnFile;
    try {
        // Get the solution file
        slnFile = build.getAppSolutionFile(options, config);
    }
    catch (e) {
        commandWithProgress_1.newError(`Couldn't get app solution information. ${e.message}`);
        throw e;
    }
    try {
        if (options.autolink) {
            const autolinkArgs = [];
            const autolinkConfig = config;
            const autoLinkOptions = {
                logging: options.logging,
                proj: options.proj,
                sln: options.sln,
            };
            runWindowsPhase = 'AutoLink';
            await autolink_1.autoLinkCommand.func(autolinkArgs, autolinkConfig, autoLinkOptions);
        }
        else {
            commandWithProgress_1.newInfo('Autolink step is skipped');
        }
    }
    catch (e) {
        commandWithProgress_1.newError(`Autolinking failed. ${e.message}`);
        throw e;
    }
    let buildTools;
    runWindowsPhase = 'FindBuildTools';
    try {
        buildTools = msbuildtools_1.default.findAvailableVersion(options.arch, verbose);
    }
    catch (error) {
        commandWithProgress_1.newWarn('No public VS release found');
        // Try prerelease
        try {
            commandWithProgress_1.newInfo('Trying pre-release VS');
            buildTools = msbuildtools_1.default.findAvailableVersion(options.arch, verbose, true);
        }
        catch (e) {
            commandWithProgress_1.newError(e.message);
            throw error;
        }
    }
    if (options.build) {
        runWindowsPhase = 'FindSolution';
        if (!slnFile) {
            commandWithProgress_1.newError('Visual Studio Solution file not found. Maybe run "npx react-native-windows-init" first?');
            throw new Error('Cannot find solution file');
        }
        // Get build/deploy options
        const buildType = deploy.getBuildConfiguration(options);
        const msBuildProps = build.parseMsBuildProps(options);
        // Disable the autolink check since we just ran it
        msBuildProps.RunAutolinkCheck = 'false';
        try {
            runWindowsPhase = 'FindSolution';
            await build.buildSolution(buildTools, slnFile, buildType, options.arch, msBuildProps, verbose, 'build', options.buildLogDirectory, options.singleproc, options.additionalMetroOptions);
        }
        catch (e) {
            commandWithProgress_1.newError(`Build failed with message ${e.message}. Check your build configuration.`);
            if (e.logfile) {
                console.log('See', chalk.bold(e.logfile));
            }
            throw e;
        }
    }
    else {
        commandWithProgress_1.newInfo('Build step is skipped');
    }
    // await deploy.startServerInNewWindow(options, verbose);
    if (options.deploy) {
        runWindowsPhase = 'FindSolution';
        if (!slnFile) {
            commandWithProgress_1.newError('Visual Studio Solution file not found. Maybe run "npx react-native-windows-init" first?');
            throw new Error('Cannot find solution file');
        }
        try {
            runWindowsPhase = 'Deploy';
            if (options.device || options.emulator || options.target) {
                await deploy.deployToDevice(options, verbose);
            }
            else {
                await deploy.deployToDesktop(options, verbose, config, buildTools);
            }
        }
        catch (e) {
            commandWithProgress_1.newError(`Failed to deploy${e ? `: ${e.message}` : ''}`);
            throw e;
        }
    }
    else {
        commandWithProgress_1.newInfo('Deploy step is skipped');
    }
}
/*
// Example of running the Windows Command
runWindows({
  root: 'C:\\github\\hack\\myapp',
  debug: true,
  arch: 'x86',
  nugetPath: 'C:\\github\\react\\react-native-windows\\local-cli\\runWindows\\.nuget\\nuget.exe'
});
*/
/**
 * Starts the app on a connected Windows emulator or mobile device.
 */
exports.runWindowsCommand = {
    name: 'run-windows',
    description: 'builds your app and starts it on a connected Windows desktop, emulator or device',
    func: runWindows,
    options: runWindowsOptions_1.runWindowsOptions,
};
//# sourceMappingURL=runWindows.js.map