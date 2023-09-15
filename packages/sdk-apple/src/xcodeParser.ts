import { provision } from 'ios-mobileprovision-finder';
import path from 'path';
import {
    Resolver,
    Logger,
    Constants,
    Common,
    PluginManager,
    FileUtils,
    logError,
    RenativeConfigPlatform,
    RnvPluginPlatform,
    inquirerPrompt,
} from 'rnv';
import { getAppFolderName } from './common';
import { parseProvisioningProfiles } from './provisionParser';
import { Context } from './types';

const { getAppFolder, getAppId, getConfigProp, getFlavouredProp } = Common;
const { fsExistsSync, writeFileSync, fsWriteFileSync } = FileUtils;
const { doResolve } = Resolver;
const { chalk, logTask, logWarning } = Logger;
const { IOS } = Constants;
const { parsePlugins } = PluginManager;

export const parseXcodeProject = async (c: Context) => {
    logTask('parseXcodeProject');
    const { platform } = c;
    // PROJECT
    c.payload.xcodeProj = {};
    c.payload.xcodeProj.provisioningStyle = getConfigProp(c, platform, 'provisioningStyle', 'Automatic');
    c.payload.xcodeProj.deploymentTarget = getConfigProp(c, platform, 'deploymentTarget', '14.0');
    c.payload.xcodeProj.provisionProfileSpecifier = getConfigProp(c, platform, 'provisionProfileSpecifier');
    c.payload.xcodeProj.provisionProfileSpecifiers = getConfigProp(c, platform, 'provisionProfileSpecifiers');
    c.payload.xcodeProj.codeSignIdentity = getConfigProp(c, platform, 'codeSignIdentity', 'iPhone Developer');

    c.payload.xcodeProj.codeSignIdentities = getConfigProp(c, platform, 'codeSignIdentities');

    c.payload.xcodeProj.systemCapabilities = getConfigProp(c, platform, 'systemCapabilities');
    c.payload.xcodeProj.excludedArchs = getConfigProp(c, platform, 'excludedArchs');
    c.payload.xcodeProj.runScheme = getConfigProp(c, platform, 'runScheme');
    c.payload.xcodeProj.teamID = getConfigProp(c, platform, 'teamID');
    c.payload.xcodeProj.id = getConfigProp(c, platform, 'id');
    c.payload.xcodeProj.appId = getAppId(c, platform);

    if (c.payload.xcodeProj.provisioningStyle !== 'Automatic' && !c.payload.xcodeProj.provisionProfileSpecifier) {
        const result = await parseProvisioningProfiles(c);

        let eligibleProfile: provision.MobileProvision | undefined;

        if (result?.eligable) {
            result.eligable.forEach((v) => {
                const bundleId = v.Entitlements['application-identifier'];

                if (bundleId === `${c.payload.xcodeProj?.teamID}.${c.payload.xcodeProj?.id}`) {
                    eligibleProfile = v;
                }
            });
        }

        if (eligibleProfile) {
            const { autoFix } = await inquirerPrompt({
                type: 'confirm',
                name: 'autoFix',
                message: `Found following eligible provisioning profile on your system: ${eligibleProfile.Entitlements['application-identifier']}. Do you want ReNative to fix your app confing?`,
                warningMessage:
                    'No provisionProfileSpecifier configured in appConfig despite setting provisioningStyle to manual',
            });
            if (autoFix) {
                c.payload.xcodeProj.provisionProfileSpecifier = eligibleProfile.Name;
                c.files.appConfig.config.platforms[platform].buildSchemes[c.program.scheme].provisionProfileSpecifier =
                    eligibleProfile.Name;
                writeFileSync(c.paths.appConfig.config, c.files.appConfig.config);
            }
        } else {
            const w =
                'Your build config has provisioningStyle set to manual but no provisionProfileSpecifier configured in appConfig and no available provisioning profiles availiable for';
            logWarning(`${w} ${c.payload.xcodeProj.id}`);
        }
    }

    await _parseXcodeProject(c, platform);
};

const _parseXcodeProject = (c: Context, platform: string) =>
    new Promise<void>((resolve) => {
        logTask('_parseXcodeProject');
        const xcodePath = doResolve('xcode');
        if (!xcodePath) {
            logError(`Cannot resolve xcode path`);
            return;
        }
        const xcode = require(xcodePath);
        // const xcode = require(`${c.paths.project.nodeModulesDir}/xcode`);
        const appFolder = getAppFolder(c);
        const appFolderName = getAppFolderName(c, platform);
        const projectPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);
        const xcodeProj = xcode.project(projectPath);
        xcodeProj.parse(() => {
            const {
                provisioningStyle,
                deploymentTarget,
                provisionProfileSpecifier,
                provisionProfileSpecifiers,
                excludedArchs,
                codeSignIdentity,
                codeSignIdentities,
                systemCapabilities,
                teamID,
                appId,
            } = c.payload.xcodeProj || {};

            if (teamID) {
                xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', teamID);
            } else {
                xcodeProj.updateBuildProperty('DEVELOPMENT_TEAM', '""');
            }

            xcodeProj.addTargetAttribute('ProvisioningStyle', provisioningStyle);
            xcodeProj.addBuildProperty('CODE_SIGN_STYLE', provisioningStyle);
            xcodeProj.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', appId);

            if (platform === IOS) {
                xcodeProj.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', deploymentTarget);
            }

            if (provisionProfileSpecifier) {
                xcodeProj.updateBuildProperty('PROVISIONING_PROFILE_SPECIFIER', `"${provisionProfileSpecifier}"`);
            }

            if (provisionProfileSpecifiers) {
                Object.keys(provisionProfileSpecifiers).forEach((key) =>
                    xcodeProj.updateBuildProperty(
                        `"PROVISIONING_PROFILE_SPECIFIER[${key}]"`,
                        `"${provisionProfileSpecifiers[key]}"`
                    )
                );
            }

            if (excludedArchs) {
                const tempExcludedArchs: string[] = [];

                if (typeof excludedArchs.forEach === 'function') {
                    excludedArchs.forEach((arch) => {
                        if (typeof arch === 'string') tempExcludedArchs.push(arch);
                        if (typeof arch === 'object') {
                            Object.keys(arch).forEach((key) => {
                                xcodeProj.updateBuildProperty(`"EXCLUDED_ARCHS[${key}]"`, `"${arch[key]}"`);
                            });
                        }
                    });
                }

                if (tempExcludedArchs.length) {
                    xcodeProj.updateBuildProperty('EXCLUDED_ARCHS', `"${tempExcludedArchs.join(' ')}"`);
                }
            }

            xcodeProj.updateBuildProperty('CODE_SIGN_IDENTITY', `"${codeSignIdentity}"`);
            xcodeProj.updateBuildProperty('"CODE_SIGN_IDENTITY[sdk=iphoneos*]"', `"${codeSignIdentity}"`);

            if (codeSignIdentities) {
                Object.keys(codeSignIdentities).forEach((key) =>
                    xcodeProj.updateBuildProperty(`"CODE_SIGN_IDENTITY[${key}]"`, `"${codeSignIdentities[key]}"`)
                );
            }

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
                const sysCapObj: Record<string, { enabled: number }> = {};
                Object.keys(systemCapabilities).forEach((sk) => {
                    const val = systemCapabilities[sk];
                    sysCapObj[sk] = { enabled: val === true ? 1 : 0 };
                });
                // const var1 = xcodeProj.getFirstProject().firstProject.attributes.TargetAttributes['200132EF1F6BF9CF00450340'];
                xcodeProj.addTargetAttribute('SystemCapabilities', sysCapObj);
            }

            const xcodeprojObj1 = getConfigProp<RenativeConfigPlatform['xcodeproj']>(c, c.platform, 'xcodeproj');

            if (xcodeprojObj1?.sourceFiles) {
                xcodeprojObj1.sourceFiles.forEach((v) => {
                    const filePath = path.join(appFolder, v);
                    if (fsExistsSync(filePath)) {
                        xcodeProj.addSourceFile(filePath, null, '200132F21F6BF9CF00450340');
                    } else {
                        logWarning(
                            `You are trying to inject native file which does not exists: ${chalk().red(
                                filePath
                            )}. Skipping.`
                        );
                    }
                });
            }

            // PLUGINS
            parsePlugins(c, platform as RnvPluginPlatform, (plugin, pluginPlat) => {
                const xcodeprojObj = getFlavouredProp<RenativeConfigPlatform['xcodeproj']>(c, pluginPlat, 'xcodeproj');
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
                                inputPaths: v.inputPaths || ['"$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"'],
                            });
                        });
                    }
                    if (xcodeprojObj.frameworks) {
                        Object.keys(xcodeprojObj.frameworks).forEach((k) => {
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
                                    embed: true,
                                };
                            }
                            xcodeProj.addFramework(fPath, opts);
                        });
                    }
                    if (xcodeprojObj.buildSettings) {
                        Object.keys(xcodeprojObj.buildSettings).forEach((k) => {
                            xcodeProj.addToBuildSettings(k, xcodeprojObj.buildSettings[k]);
                        });
                    }
                }
            });

            // FONTS
            // Cocoapods take care of this
            c.payload.pluginConfigiOS.embeddedFontSources.forEach((v) => {
                xcodeProj.addResourceFile(v, { variantGroup: false });
            });

            fsWriteFileSync(projectPath, xcodeProj.writeSync());
            resolve();
        });
    });
