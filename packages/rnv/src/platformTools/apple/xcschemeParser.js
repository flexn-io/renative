import path from 'path';
import {
    getAppFolder,
    writeCleanFile,
    getAppTemplateFolder,
    getConfigProp,
} from '../../common';
import {
    logTask
} from '../../systemTools/logger';
import { getAppFolderName } from './index';

export const parseXcscheme = async (c, platform) => {
    logTask(`parseXcscheme:${platform}`);
    // XCSCHEME
    const allowProvisioningUpdates = getConfigProp(c, platform, 'allowProvisioningUpdates', true);
    const provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    const runScheme = getConfigProp(c, platform, 'runScheme');
    // const poisxSpawn = runScheme === 'Release' && !allowProvisioningUpdates && provisioningStyle === 'Manual';
    // Since RN 61+ this must be set to true otherwise debug apps install but not launch
    const poisxSpawn = true;
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
};
