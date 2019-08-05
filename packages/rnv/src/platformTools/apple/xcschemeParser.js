import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getAppVersion,
    getAppTitle,
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getAppId,
    copyBuildsFolder,
    getConfigProp,
    getIP,
    getQuestion,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder
} from '../../common';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';
import { getAppFolderName } from '../apple';

export const parseXcscheme = (c, platform) => new Promise((resolve, reject) => {
    logTask(`parseXcscheme:${platform}`);
    // XCSCHEME
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    const poisxSpawn = runScheme === 'Release' && !allowProvisioningUpdates && provisioningStyle === 'Manual';
    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);

    const debuggerId = poisxSpawn ? '' : 'Xcode.DebuggerFoundation.Debugger.LLDB';
    const launcherId = poisxSpawn ? 'Xcode.IDEFoundation.Launcher.PosixSpawn' : 'Xcode.DebuggerFoundation.Launcher.LLDB';
    const schemePath = `${appFolderName}.xcodeproj/xcshareddata/xcschemes/${appFolderName}.xcscheme`;
    writeCleanFile(path.join(appTemplateFolder, schemePath), path.join(appFolder, schemePath), [
        { pattern: '{{PLUGIN_DEBUGGER_ID}}', override: debuggerId },
        { pattern: '{{PLUGIN_LAUNCHER_ID}}', override: launcherId },
    ]);
    resolve();
});
