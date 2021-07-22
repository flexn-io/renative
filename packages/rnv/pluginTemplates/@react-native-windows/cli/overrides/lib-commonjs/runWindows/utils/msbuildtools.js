"use strict";
/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const chalk = require("chalk");
const os = require("os");
const shell = require("shelljs");
const version_1 = require("./version");
const checkRequirements = require("./checkRequirements");
const commandWithProgress_1 = require("./commandWithProgress");
const child_process_1 = require("child_process");
const vsInstalls_1 = require("./vsInstalls");
class MSBuildTools {
    /**
     * @param version is something like 16.0 for 2019
     * @param installationPath  Path to installation root
     * @param installationVersion is the full version e.g. 16.3.29411.108
     */
    constructor(version, installationPath, installationVersion) {
        this.version = version;
        this.installationPath = installationPath;
        this.installationVersion = installationVersion;
    }
    /**
     * @returns directory where x86 msbuild can be found
     */
    msbuildPath() {
        return path.join(this.installationPath, 'MSBuild/Current/Bin');
    }
    cleanProject(slnFile) {
        const cmd = `"${path.join(this.msbuildPath(), 'msbuild.exe')}" "${slnFile}" /t:Clean`;
        const results = child_process
            .execSync(cmd)
            .toString()
            .split(os_1.EOL);
        results.forEach(result => console.log(chalk.white(result)));
    }
    async buildProject(slnFile, buildType, buildArch, msBuildProps, verbose, target, buildLogDirectory, singleproc, additionalMetroOptions) {
        commandWithProgress_1.newSuccess(`Found Solution: ${slnFile}`);
        commandWithProgress_1.newInfo(`Build configuration: ${buildType}`);
        commandWithProgress_1.newInfo(`Build platform: ${buildArch}`);
        const verbosityOption = verbose ? 'normal' : 'minimal';
        const logPrefix = path.join(buildLogDirectory || os.tmpdir(), `msbuild_${process.pid}_${target}`);
        const errorLog = logPrefix + '.err';
        const warnLog = logPrefix + '.wrn';
        const localBinLog = target === 'build' ? '' : ':deploy.binlog';
        const binlog = buildLogDirectory ? `:${logPrefix}.binlog` : localBinLog;
        const args = [
            `/clp:NoSummary;NoItemAndPropertyList;Verbosity=${verbosityOption}`,
            '/nologo',
            `/p:Configuration=${buildType}`,
            `/p:Platform=${buildArch}`,
            '/p:AppxBundle=Never',
            `/bl${binlog}`,
            `/flp1:errorsonly;logfile=${errorLog}`,
            `/flp2:warningsonly;logfile=${warnLog}`,
        ];
        // Building projects in parallel increases compiler memory usage and
        // doesn't lead to dramatic performance gains (See #4739). Only enable
        // parallel builds on machines with >16GB of memory to avoid OOM errors
        const highMemory = os_1.totalmem() > 16 * 1024 * 1024 * 1024;
        const enableParallelBuilds = singleproc === false || highMemory;
        if (enableParallelBuilds) {
            args.push('/maxCpuCount');
        }
        if (target === 'build') {
            args.push('/restore', '/p:RestorePackagesConfig=true');
        }
        else {
            args.push(`/t:Deploy`);
        }
        Object.keys(msBuildProps).forEach(key => {
            args.push(`/p:${key}=${msBuildProps[key]}`);
        });
        try {
            checkRequirements.isWinSdkPresent('10.0');
        }
        catch (e) {
            commandWithProgress_1.newError(e.message);
            throw e;
        }
        if (verbose) {
            console.log(`Running MSBuild with args ${args.join(' ')}`);
        }
        const progressName = target === 'deploy' ? 'Deploying Solution' : 'Building Solution';
        const spinner = commandWithProgress_1.newSpinner(progressName);
        try {
            await commandWithProgress_1.commandWithProgress(spinner, progressName, path.join(this.msbuildPath(), 'msbuild.exe'), [slnFile].concat(args), verbose, additionalMetroOptions);
        }
        catch (e) {
            let error = e;
            if (!e) {
                const firstMessage = (await fs.promises.readFile(errorLog))
                    .toString()
                    .split(os_1.EOL)[0];
                error = new Error(firstMessage);
                error.logfile = errorLog;
            }
            throw error;
        }
        // If we have no errors, delete the error log when we're done
        if ((await fs.promises.stat(errorLog)).size === 0) {
            await fs.promises.unlink(errorLog);
        }
    }
    static findAvailableVersion(buildArch, verbose, prerelease) {
        // https://aka.ms/vs/workloads
        const requires = [
            'Microsoft.Component.MSBuild',
            getVCToolsByArch(buildArch),
        ];
        const minVersion = process.env.VisualStudioVersion || '16.7';
        const vsInstallation = vsInstalls_1.findLatestVsInstall({
            requires,
            minVersion,
            verbose,
            prerelease,
        });
        if (!vsInstallation) {
            if (process.env.VisualStudioVersion != null) {
                throw new Error(`MSBuild tools not found for version ${process.env.VisualStudioVersion} (from environment). Make sure all required components have been installed`);
            }
            else {
                throw new Error(`Could not find MSBuild with VCTools for Visual Studio ${minVersion} or later. Make sure all required components have been installed`);
            }
        }
        const toolsPath = path.join(vsInstallation.installationPath, 'MSBuild/Current/Bin');
        if (fs.existsSync(toolsPath)) {
            commandWithProgress_1.newSuccess(`Found compatible MSBuild at ${toolsPath} (${vsInstallation.installationVersion})`);
            return new MSBuildTools(minVersion, vsInstallation.installationPath, vsInstallation.installationVersion);
        }
        else {
            throw new Error(`MSBuild path '${toolsPath} does not exist'`);
        }
    }
    static getAllAvailableUAPVersions() {
        const results = [];
        const programFilesFolder = process.env['ProgramFiles(x86)'] || process.env.ProgramFiles;
        // No Program Files folder found, so we won't be able to find UAP SDK
        if (!programFilesFolder) {
            return results;
        }
        let uapFolderPath = path.join(programFilesFolder, 'Windows Kits', '10', 'Platforms', 'UAP');
        if (!shell.test('-e', uapFolderPath)) {
            // Check other installation folder from reg
            const sdkFolder = getSDK10InstallationFolder();
            if (sdkFolder) {
                uapFolderPath = path.join(sdkFolder, 'Platforms', 'UAP');
            }
        }
        // No UAP SDK exists on this machine
        if (!shell.test('-e', uapFolderPath)) {
            return results;
        }
        shell
            .ls(uapFolderPath)
            .filter(uapDir => shell.test('-d', path.join(uapFolderPath, uapDir)))
            .map(version_1.default.tryParse)
            .forEach(version => version && results.push(version));
        return results;
    }
}
exports.default = MSBuildTools;
function getVCToolsByArch(buildArch) {
    switch (buildArch) {
        case 'x86':
        case 'x64':
            return 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64';
        case 'ARM':
            return 'Microsoft.VisualStudio.Component.VC.Tools.ARM';
        case 'ARM64':
            return 'Microsoft.VisualStudio.Component.VC.Tools.ARM64';
    }
}
function getSDK10InstallationFolder() {
    const folder = '';
    const execString = 'reg query "HKLM\\SOFTWARE\\Microsoft\\Microsoft SDKs\\Windows\\v10.0" /s /v InstallationFolder /reg:32';
    let output;
    try {
        output = child_process_1.execSync(execString).toString();
    }
    catch (e) {
        return folder;
    }
    const re = /\\Microsoft SDKs\\Windows\\v10.0\s*InstallationFolder\s+REG_SZ\s+(.*)/gim;
    const match = re.exec(output);
    if (match) {
        return match[1];
    }
    return folder;
}
//# sourceMappingURL=msbuildtools.js.map