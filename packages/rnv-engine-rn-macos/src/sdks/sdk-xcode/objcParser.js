// TODO: add more customization like custom imports, methods e.t.c. (like engine-rn swiftParser)
import path from 'path';
import { FileUtils, Logger, Common } from 'rnv';

const {
    getEntryFile,
    getAppTemplateFolder,
    getGetJsBundleFile,
    addSystemInjects
} = Common;
const { logTask } = Logger;
const { writeCleanFile } = FileUtils;

export const parseAppDelegate = (
    c,
    platform,
    appFolder,
    appFolderName,
    isBundled = false,
    ip = 'localhost',
) => new Promise((resolve) => {
    const newPort = c.runtime?.port;
    logTask('parseAppDelegateSync', `ip:${ip} port:${newPort}`);
    const appDelegate = 'AppDelegate.m';

    const entryFile = getEntryFile(c, platform);

    const forceBundle = getGetJsBundleFile(c, platform);

    let bundle;
    if (forceBundle) {
        bundle = forceBundle;
    } else if (isBundled) {
        bundle = `[[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"${
            entryFile
        }",  fallbackResource:nil]`;
    } else {
        bundle = `[NSURL URLWithString:@"http://${ip}:${newPort}/${entryFile}.bundle?platform=macos"]`;
    }

    const injects = [
        { pattern: '{{BUNDLE}}', override: bundle },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        path.join(
            getAppTemplateFolder(c, platform),
            appFolderName,
            appDelegate
        ),
        path.join(appFolder, appFolderName, appDelegate),
        injects, null, c
    );
    resolve();
});
