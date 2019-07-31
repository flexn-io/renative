import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { isObject, isArray, isBool, isString } from '../../systemTools/objectUtils';
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
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects } from '../../systemTools/fileutils';


export const parseExportOptionsPlistSync = (c, platform) => {
// EXPORT OPTIONS
    const tId = getConfigProp(c, platform, 'teamID');
    const appFolder = getAppFolder(c, platform);
    const exportOptions = {
        method: 'app-store',
        teamID: tId
    };

    c.pluginConfigiOS.exportOptions = objToPlist(exportOptions);
    const bPath = getBuildFilePath(c, platform, 'exportOptions.plist');
    writeCleanFile(bPath, path.join(appFolder, 'exportOptions.plist'), [
        { pattern: '{{TEAM_ID}}', override: tId },
        { pattern: '{{PLUGIN_EXPORT_OPTIONS}}', override: c.pluginConfigiOS.exportOptions },
    ]);
};

export const parseEntitlementsPlistSync = (c, platform) => {
    logTask(`parseEntitlementsPlistSync:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const entitlementsPath = path.join(appFolder, `${appFolderName}/${appFolderName}.entitlements`);
    // PLUGIN ENTITLEMENTS
    let pluginsEntitlementsObj = getConfigProp(c, platform, 'entitlements');
    if (!pluginsEntitlementsObj) {
        pluginsEntitlementsObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/entitlements.json'));
    }

    saveObjToPlistSync(entitlementsPath, pluginsEntitlementsObj);
};

export const parseInfoPlistSync = (c, platform) => {
    logTask(`parseInfoPlistSync:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const { permissions, orientationSupport, urlScheme, plistExtra } = c.files.appConfigFile.platforms[platform];
    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    // PLIST
    let plistObj = readObjectSync(path.join(c.paths.rnvRootFolder, 'src/platformTools/apple/supportFiles/info.plist.json'));
    plistObj.CFBundleDisplayName = getAppTitle(c, platform);
    plistObj.CFBundleShortVersionString = getAppVersion(c, platform);
    // FONTS
    if (c.pluginConfigiOS.embeddedFonts.length) {
        plistObj.UIAppFonts = c.pluginConfigiOS.embeddedFonts;
    }
    // PERMISSIONS
    const pluginPermissions = '';
    if (permissions) {
        if (permissions.length && permissions[0] === '*') {
            if (c.files.permissionsConfig) {
                const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'ios';
                const pc = c.files.permissionsConfig.permissions[plat];
                for (const v in pc) {
                    plistObj[pc[v].key] = pc[v].desc;
                }
            }
        } else {
            permissions.forEach((v) => {
                if (c.files.permissionsConfig) {
                    const plat = c.files.permissionsConfig.permissions[platform] ? platform : 'ios';
                    const pc = c.files.permissionsConfig.permissions[plat];
                    if (pc[v]) {
                        plistObj[pc[v].key] = pc[v].desc;
                    }
                }
            });
        }
    }
    // ORIENATATIONS
    if (orientationSupport) {
        if (orientationSupport.phone) {
            plistObj.UISupportedInterfaceOrientations = orientationSupport.phone;
        } else {
            plistObj.UISupportedInterfaceOrientations = ['UIInterfaceOrientationPortrait'];
        }
        if (orientationSupport.tab) {
            plistObj['UISupportedInterfaceOrientations~ipad'] = orientationSupport.tab;
        } else {
            plistObj['UISupportedInterfaceOrientations~ipad'] = ['UIInterfaceOrientationPortrait'];
        }
    }
    // URL_SCHEMES
    if (urlScheme) {
        plistObj.CFBundleURLTypes.push({
            CFBundleTypeRole: 'Editor',
            CFBundleURLName: urlScheme,
            CFBundleURLSchemes: [urlScheme]
        });
    }
    // PLIST EXTRAS
    if (plistExtra) {
        plistObj = mergeObjects(c, plistObj, plistExtra);
    }
    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        if (pluginPlat.plist) {
            plistObj = mergeObjects(c, plistObj, pluginPlat.plist);
        }
    });
    saveObjToPlistSync(plistPath, plistObj);
};

const PLIST_START = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">\n`;

const PLIST_END = '</plist>\n';

const objToPlist = (obj) => {
    let output = PLIST_START;
    output += _parseObject(obj, 0);
    output += PLIST_END;
    return output;
};

const _parseObject = (obj, level) => {
    let output = '';
    let space = '';
    for (let i = 0; i < level; i++) {
        space += '  ';
    }
    if (isArray(obj)) {
        output += `${space}<array>\n`;
        obj.forEach((v) => {
            output += _parseObject(v, level + 1);
        });
        output += `${space}</array>\n`;
    } else if (isBool(obj)) {
        output += `${space}<${obj} />\n`;
    } else if (isObject(obj)) {
        output += `${space}<dict>\n`;
        for (const key in obj) {
            output += `  ${space}<key>${key}</key>\n`;
            output += _parseObject(obj[key], level + 1);
        }
        output += `${space}</dict>\n`;
    } else if (isString(obj)) {
        output += `${space}<string>${obj}</string>\n`;
    }

    return output;
};

const saveObjToPlistSync = (filePath, obj) => {
    fs.writeFileSync(filePath, objToPlist(obj));
};


export {
    objToPlist,
    saveObjToPlistSync
};
