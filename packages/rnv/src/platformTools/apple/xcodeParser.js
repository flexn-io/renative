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
    getConfigProp,
    getIP,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder,
} from '../../common';
import { copyBuildsFolder } from '../../projectTools/projectParser';
import { inquirerPrompt } from '../../systemTools/prompt';
import { IOS, TVOS } from '../../constants';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';
import { getAppFolderName } from './index';
import { parseProvisioningProfiles } from './provisionParser';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects, writeObjectSync } from '../../systemTools/fileutils';

const xcode = require('xcode');


export const parseXcodeProject = async (c, platform) => {
    // PROJECT
    c.runtime.xcodeProj = {};
    c.runtime.xcodeProj.provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    c.runtime.xcodeProj.deploymentTarget = getConfigProp(c, platform, 'deploymentTarget', '10.0');
    c.runtime.xcodeProj.provisionProfileSpecifier = getConfigProp(c, platform, 'provisionProfileSpecifier');
    c.runtime.xcodeProj.codeSignIdentity = getConfigProp(c, platform, 'codeSignIdentity');
    c.runtime.xcodeProj.systemCapabilities = getConfigProp(c, platform, 'systemCapabilities');
    c.runtime.xcodeProj.runScheme = getConfigProp(c, platform, 'runScheme');
    c.runtime.xcodeProj.teamID = getConfigProp(c, platform, 'teamID');
    c.runtime.xcodeProj.id = getConfigProp(c, platform, 'id');
    c.runtime.xcodeProj.appId = getAppId(c, platform);

    if (c.runtime.xcodeProj.provisioningStyle !== 'Automatic' && !c.runtime.xcodeProj.provisionProfileSpecifier) {
        const result = await parseProvisioningProfiles(c);

        let eligibleProfile;

        result.eligable.forEach((v) => {
            const bundleId = v.Entitlements['application-identifier'];

            if (bundleId === `${c.runtime.xcodeProj.teamID}.${c.runtime.xcodeProj.id}`) {
                eligibleProfile = v;
            }
        });

        if (eligibleProfile) {
            const { autoFix } = await inquirerPrompt({
                type: 'confirm',
                name: 'autoFix',
                message: `Found following eligible provisioning profile on your system: ${eligibleProfile.Entitlements['application-identifier']}. Do you want ReNative to fix your app confing?`,
                warningMessage: 'No provisionProfileSpecifier configured in appConfig despite setting provisioningStyle to manual'
            });
            if (autoFix) {
                c.runtime.xcodeProj.provisionProfileSpecifier = eligibleProfile.Name;
                c.files.appConfig.config.platforms[platform].buildSchemes[c.program.scheme].provisionProfileSpecifier = eligibleProfile.Name;
                writeObjectSync(c.paths.appConfig.config, c.files.appConfig.config);
            }
        } else {
            logWarning(`Your build config has provisioningStyle set to manual but no provisionProfileSpecifier configured in appConfig and no available provisioning profiles availiable for ${c.runtime.xcodeProj.id}`);
        }
    }

    await _parseXcodeProject(c, platform);
};

const _parseXcodeProject = (c, platform, config) => new Promise((resolve, reject) => {
    const appFolder = getAppFolder(c, platform);
    const appFolderName = getAppFolderName(c, platform);
    const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
    const xcodeProj = xcode.project(projectPath);
    xcodeProj.parse(() => {
        const {
            provisioningStyle, deploymentTarget,
            provisionProfileSpecifier, codeSignIdentity, systemCapabilities, runScheme, teamID, appId
        } = c.runtime.xcodeProj;

        if (c.runtime.xcodeProj.teamID) {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', teamID);
        } else {
            xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
        }

        xcodeProj.addTargetAttribute('ProvisioningStyle', provisioningStyle);
        xcodeProj.addBuildProperty('CODE_SIGN_STYLE', provisioningStyle);
        xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

        if (platform === IOS) {
            xcodeProj.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', deploymentTarget);
        } else if (platform === TVOS) {
            xcodeProj.updateBuildProperty('TVOS_DEPLOYMENT_TARGET', deploymentTarget);
        }

        if (provisionProfileSpecifier) {
            xcodeProj.updateBuildProperty('PROVISIONING_PROFILE_SPECIFIER', `"${provisionProfileSpecifier}"`);
        }

        if (codeSignIdentity) {
            const bc = xcodeProj.pbxXCBuildConfigurationSection();

            // xcodeProj.updateBuildProperty('CODE_SIGN_IDENTITY', `"${codeSignIdentity}"`, runScheme);
            // xcodeProj.updateBuildProperty('"CODE_SIGN_IDENTITY[sdk=iphoneos*]"', `"${codeSignIdentity}"`, runScheme);
            const cs1 = 'CODE_SIGN_IDENTITY';
            const cs2 = '"CODE_SIGN_IDENTITY[sdk=iphoneos*]"';
            for (const configName in bc) {
                const config = bc[configName];
                if ((runScheme && config.name === runScheme) || (!runScheme)) {
                    if (config.buildSettings[cs1]) config.buildSettings[cs1] = `"${codeSignIdentity}"`;
                    if (config.buildSettings[cs2]) config.buildSettings[cs2] = `"${codeSignIdentity}"`;
                }
            }
        }


        if (systemCapabilities) {
            const sysCapObj = {};
            for (const sk in systemCapabilities) {
                const val = systemCapabilities[sk];
                sysCapObj[sk] = { enabled: val === true ? 1 : 0 };
            }
            // const var1 = xcodeProj.getFirstProject().firstProject.attributes.TargetAttributes['200132EF1F6BF9CF00450340'];
            xcodeProj.addTargetAttribute('SystemCapabilities', sysCapObj);
        }

        // FONTS
        c.pluginConfigiOS.embeddedFontSources.forEach((v) => {
            xcodeProj.addResourceFile(v);
        });


        // PLUGINS
        parsePlugins(c, platform, (plugin, pluginPlat, key) => {
            if (pluginPlat.xcodeproj) {
                if (pluginPlat.xcodeproj.resourceFiles) {
                    pluginPlat.xcodeproj.resourceFiles.forEach((v) => {
                        xcodeProj.addResourceFile(path.join(appFolder, v));
                    });
                }
                if (pluginPlat.xcodeproj.sourceFiles) {
                    pluginPlat.xcodeproj.sourceFiles.forEach((v) => {
                        // const group = xcodeProj.hash.project.objects.PBXGroup['200132F21F6BF9CF00450340'];
                        xcodeProj.addSourceFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
                if (pluginPlat.xcodeproj.headerFiles) {
                    pluginPlat.xcodeproj.headerFiles.forEach((v) => {
                        xcodeProj.addHeaderFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
                if (pluginPlat.xcodeproj.buildPhases) {
                    pluginPlat.xcodeproj.buildPhases.forEach((v) => {
                        xcodeProj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'ShellScript', null, {
                            shellPath: v.shellPath || '/bin/sh',
                            shellScript: v.shellScript,
                            inputPaths: v.inputPaths || ['"$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"']
                        });
                    });
                }
            }
        });

        fs.writeFileSync(projectPath, xcodeProj.writeSync());
        resolve();
    });
});


// export const parseXcodeProjec2() => new Promise((resolve, reject) => {
// const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
// const xcodeProj = xcode.project(projectPath);
// xcodeProj.parse(() => {
//     const appId = getAppId(c, platform);
//     if (teamID) {
//         xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', teamID);
//     } else {
//         xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
//     }
//
//     xcodeProj.addTargetAttribute('ProvisioningStyle', provisioningStyle);
//     xcodeProj.addBuildProperty('CODE_SIGN_STYLE', provisioningStyle);
//     xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);
//
//     resolve();
// });
// })
