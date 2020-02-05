import path from 'path';
import fs from 'fs';
import { isObject, isArray, isBool, isString } from '../../systemTools/objectUtils';
import {
    getAppFolder,
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getConfigProp,
    getBuildFilePath,
    getFlavouredProp
} from '../../common';
import {
    logTask,
    logError,
    logWarning
} from '../../systemTools/logger';
import { parsePlugins } from '../../pluginTools';
import { getAppFolderName } from './index';
import { readObjectSync, mergeObjects } from '../../systemTools/fileutils';


export const parseExportOptionsPlist = (c, platform) => new Promise((resolve) => {
// EXPORT OPTIONS
    const tId = getConfigProp(c, platform, 'teamID');
    const appFolder = getAppFolder(c, platform);
    const exportOptions = getConfigProp(c, platform, 'exportOptions') || {};
    const id = getConfigProp(c, platform, 'id');

    c.pluginConfigiOS.exportOptions = objToPlist(exportOptions);

    if (exportOptions.provisioningProfiles) {
        const expProvProfile = exportOptions.provisioningProfiles[id];
        if (!expProvProfile) {
            logError(`Your exportOptions.provisionProfiles object in ${c.paths.appConfig.config} does not include id ${id}!`);
        }
    }

    const bPath = getBuildFilePath(c, platform, 'exportOptions.plist');
    writeCleanFile(bPath, path.join(appFolder, 'exportOptions.plist'), [
        { pattern: '{{TEAM_ID}}', override: tId },
        { pattern: '{{PLUGIN_EXPORT_OPTIONS}}', override: c.pluginConfigiOS.exportOptions },
    ]);
    resolve();
});

export const parseEntitlementsPlist = (c, platform) => new Promise((resolve, reject) => {
    logTask(`parseEntitlementsPlistSync:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const entitlementsPath = path.join(appFolder, `${appFolderName}/${appFolderName}.entitlements`);
    // PLUGIN ENTITLEMENTS
    let pluginsEntitlementsObj = getConfigProp(c, platform, 'entitlements');
    if (!pluginsEntitlementsObj) {
        pluginsEntitlementsObj = readObjectSync(path.join(c.paths.rnv.dir, 'src/platformTools/apple/supportFiles/entitlements.json'));
    }

    saveObjToPlistSync(c, entitlementsPath, pluginsEntitlementsObj);
    resolve();
});

export const parseInfoPlist = (c, platform) => new Promise((resolve, reject) => {
    logTask(`parseInfoPlist:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const plat = c.buildConfig.platforms[platform];
    const { orientationSupport, urlScheme } = plat;
    const plistPath = path.join(appFolder, `${appFolderName}/Info.plist`);

    // PLIST
    let plistObj = readObjectSync(path.join(c.paths.rnv.dir, `src/platformTools/apple/supportFiles/info.plist.${platform}.json`));
    plistObj.CFBundleDisplayName = getAppTitle(c, platform);
    plistObj.CFBundleShortVersionString = getAppVersion(c, platform);
    plistObj.CFBundleVersion = getAppVersionCode(c, platform);
    // FONTS
    if (c.pluginConfigiOS.embeddedFonts.length) {
        plistObj.UIAppFonts = c.pluginConfigiOS.embeddedFonts;
    }
    // PERMISSIONS
    const pluginPermissions = '';
    const includedPermissions = getConfigProp(c, platform, 'includedPermissions') || getConfigProp(c, platform, 'permissions');
    if (includedPermissions && c.buildConfig.permissions) {
        const plat = c.buildConfig.permissions[platform] ? platform : 'ios';
        const pc = c.buildConfig.permissions[plat];
        if (includedPermissions.length && includedPermissions[0] === '*') {
            for (const v in pc) {
                const key = pc[v].key || v;
                plistObj[key] = pc[v].desc;
            }
        } else {
            includedPermissions.forEach((v) => {
                if (pc[v]) {
                    const key = pc[v].key || v;
                    plistObj[key] = pc[v].desc;
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
    // URL_SCHEMES (LEGACY)
    if (urlScheme) {
        logWarning('urlScheme is DEPRECATED. use "plist:{ CFBundleURLTypes: []}" object instead');
        plistObj.CFBundleURLTypes.push({
            CFBundleTypeRole: 'Editor',
            CFBundleURLName: urlScheme,
            CFBundleURLSchemes: [urlScheme]
        });
    }

    // PLIST
    const plist = getConfigProp(c, platform, 'plist');
    if (plist) {
        plistObj = mergeObjects(c, plistObj, plist, true, true);
    }

    // PLUGINS
    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const plist = getFlavouredProp(c, pluginPlat, 'plist');
        if (plist) {
            plistObj = mergeObjects(c, plistObj, plist, true, false);
        }
    });
    saveObjToPlistSync(c, plistPath, plistObj);
    resolve();
});

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

const saveObjToPlistSync = (c, filePath, obj) => {
    // fs.writeFileSync(filePath, objToPlist(sanitizeDynamicProps(obj, c.buildConfig?._refs)));
    fs.writeFileSync(filePath, objToPlist(obj));
};


export {
    objToPlist,
    saveObjToPlistSync
};
