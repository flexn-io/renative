/* eslint-disable import/no-cycle */
import path from 'path';
import {
    getAppFolder,
    getAppTemplateFolder,
    addSystemInjects
} from '../core/common';
import { logTask } from '../core/systemManager/logger';
import { getAppFolderName } from './index';
import { writeCleanFile } from '../core/systemManager/fileutils';

export const parseXcscheme = async (c, platform) => {
    logTask('parseXcscheme');
    // XCSCHEME
    // const allowProvisioningUpdates = getConfigProp(
    //     c,
    //     platform,
    //     'allowProvisioningUpdates',
    //     true
    // );
    // const provisioningStyle = getConfigProp(
    //     c,
    //     platform,
    //     'provisioningStyle',
    //     'Automatic'
    // );
    // const poisxSpawn = runScheme === 'Release' && !allowProvisioningUpdates && provisioningStyle === 'Manual';
    // Since RN 61+ this must be set to true otherwise debug apps install but not launch
    const poisxSpawn = true;
    const appFolder = getAppFolder(c);
    const appFolderName = getAppFolderName(c, platform);
    const appTemplateFolder = getAppTemplateFolder(c, platform);

    const debuggerId = poisxSpawn
        ? ''
        : 'Xcode.DebuggerFoundation.Debugger.LLDB';
    const launcherId = poisxSpawn
        ? 'Xcode.IDEFoundation.Launcher.PosixSpawn'
        : 'Xcode.DebuggerFoundation.Launcher.LLDB';
    const schemePath = `${appFolderName}.xcodeproj/xcshareddata/xcschemes/${appFolderName}.xcscheme`;

    const injects = [
        { pattern: '{{PLUGIN_DEBUGGER_ID}}', override: debuggerId },
        { pattern: '{{PLUGIN_LAUNCHER_ID}}', override: launcherId }
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(appTemplateFolder, schemePath),
        path.join(appFolder, schemePath),
        injects, null, c
    );
};
