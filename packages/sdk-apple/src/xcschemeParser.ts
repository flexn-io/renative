import path from 'path';
import { getAppFolder, getConfigProp, logDefault, writeCleanFile, getContext } from '@rnv/core';
import { getAppFolderName } from './common';
import { addSystemInjects, getAppTemplateFolder } from '@rnv/sdk-utils';

// const xml2js = require('xml2js');
// const parser = new xml2js.Parser();

export const parseXcscheme = async () => {
    logDefault('parseXcscheme');
    const c = getContext();
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
    const appFolder = getAppFolder();
    const appFolderName = getAppFolderName();
    const appTemplateFolder = getAppTemplateFolder();

    const debuggerId = poisxSpawn ? '' : 'Xcode.DebuggerFoundation.Debugger.LLDB';
    const launcherId = poisxSpawn
        ? 'Xcode.IDEFoundation.Launcher.PosixSpawn'
        : 'Xcode.DebuggerFoundation.Launcher.LLDB';
    const schemePath = `${appFolderName}.xcodeproj/xcshareddata/xcschemes/${appFolderName}.xcscheme`;

    let _commandLineArguments = '';
    const commandLineArguments = getConfigProp('commandLineArguments');
    if (commandLineArguments?.length) {
        commandLineArguments.forEach((arg) => {
            _commandLineArguments += `
        <CommandLineArgument
           argument = "${arg}"
           isEnabled = "YES">
        </CommandLineArgument>
`;
        });
    }

    const injects = [
        { pattern: '{{PLUGIN_DEBUGGER_ID}}', override: debuggerId },
        { pattern: '{{PLUGIN_LAUNCHER_ID}}', override: launcherId },
        { pattern: '{{INJECT_COMMAND_LINE_ARGUMENTS}}', override: _commandLineArguments },
    ];

    addSystemInjects(injects);

    writeCleanFile(path.join(appTemplateFolder!, schemePath), path.join(appFolder, schemePath), injects, undefined, c);

    // const parseObj = await parser.parseStringPromise(path.join(appFolder, schemePath));
};
