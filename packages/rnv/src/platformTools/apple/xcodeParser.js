import path from 'path';
import fs from 'fs';
import {
    getAppFolder,
    getAppId,
    getConfigProp,
    getFlavouredProp
} from '../../common';
import {
    logTask,
    logWarning
} from '../../systemTools/logger';
import { inquirerPrompt } from '../../systemTools/prompt';
import { IOS, TVOS } from '../../constants';
import { parsePlugins } from '../../pluginTools';
import { getAppFolderName } from './index';
import { parseProvisioningProfiles } from './provisionParser';
import { writeFileSync } from '../../systemTools/fileutils';

export const parseXcodeProject = async (c, platform) => {
    logTask('parseXcodeProject');
    // PROJECT
    c.runtime.xcodeProj = {};
    c.runtime.xcodeProj.provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    c.runtime.xcodeProj.deploymentTarget = getConfigProp(c, platform, 'deploymentTarget', '10.0');
    c.runtime.xcodeProj.provisionProfileSpecifier = getConfigProp(c, platform, 'provisionProfileSpecifier');
    c.runtime.xcodeProj.codeSignIdentity = getConfigProp(c, platform, 'codeSignIdentity', 'iPhone Developer');
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
                writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
            }
        } else {
            logWarning(`Your build config has provisioningStyle set to manual but no provisionProfileSpecifier configured in appConfig and no available provisioning profiles availiable for ${c.runtime.xcodeProj.id}`);
        }
    }

    await _parseXcodeProject(c, platform);
};

const _parseXcodeProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('_parseXcodeProject');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const xcode = require(`${c.paths.project.nodeModulesDir}/xcode`);
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

        xcodeProj.updateBuildProperty('CODE_SIGN_IDENTITY', `"${codeSignIdentity}"`);
        xcodeProj.updateBuildProperty('"CODE_SIGN_IDENTITY[sdk=iphoneos*]"', `"${codeSignIdentity}"`);

        // if (codeSignIdentity) {
        //     const bc = xcodeProj.pbxXCBuildConfigurationSection();
        //     const cs1 = 'CODE_SIGN_IDENTITY';
        //     const cs2 = '"CODE_SIGN_IDENTITY[sdk=iphoneos*]"';
        //     for (const configName in bc) {
        //         const config = bc[configName];
        //         if ((runScheme && config.name === runScheme) || (!runScheme)) {
        //             if (config.buildSettings?.[cs1]) config.buildSettings[cs1] = `"${codeSignIdentity}"`;
        //             if (config.buildSettings?.[cs2]) config.buildSettings[cs2] = `"${codeSignIdentity}"`;
        //         }
        //     }
        // }

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
            const xcodeprojObj = getFlavouredProp(c, pluginPlat, 'xcodeproj');
            if (xcodeprojObj) {
                if (xcodeprojObj.resourceFiles) {
                    xcodeprojObj.resourceFiles.forEach((v) => {
                        xcodeProj.addResourceFile(path.join(appFolder, v));
                    });
                }
                if (xcodeprojObj.sourceFiles) {
                    xcodeprojObj.sourceFiles.forEach((v) => {
                        // const group = xcodeProj.hash.project.objects.PBXGroup['200132F21F6BF9CF00450340'];
                        xcodeProj.addSourceFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
                if (xcodeprojObj.headerFiles) {
                    xcodeprojObj.headerFiles.forEach((v) => {
                        xcodeProj.addHeaderFile(v, null, '200132F21F6BF9CF00450340');
                    });
                }
                if (xcodeprojObj.buildPhases) {
                    xcodeprojObj.buildPhases.forEach((v) => {
                        xcodeProj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'ShellScript', null, {
                            shellPath: v.shellPath || '/bin/sh',
                            shellScript: v.shellScript,
                            inputPaths: v.inputPaths || ['"$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"']
                        });
                    });
                }
                if (xcodeprojObj.frameworks) {
                    for (const k in xcodeprojObj.frameworks) {
                        let fPath;
                        let opts;
                        if (k.startsWith('./')) {
                            fPath = path.join(appFolder, k.replace('./', ''));
                            opts = {
                                customFramework: true,
                                embed: true,
                                link: true,
                            };
                        } else {
                            fPath = path.join('System/Library/Frameworks', k);
                            opts = {
                                embed: true
                            };
                        }
                        xcodeProj.addFramework(fPath, opts);
                    }
                }
                if (xcodeprojObj.buildSettings) {
                    for (const k in xcodeprojObj.buildSettings) {
                        xcodeProj.addToBuildSettings(k, xcodeprojObj.buildSettings[k]);
                    }
                }
            }
        });
        fs.writeFileSync(projectPath, xcodeProj.writeSync());
        resolve();
    });
});
