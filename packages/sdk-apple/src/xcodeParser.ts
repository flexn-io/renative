import {
    RnvPlatform,
    chalk,
    doResolve,
    fsExistsSync,
    fsWriteFileSync,
    getAppFolder,
    getConfigProp,
    getFlavouredProp,
    inquirerPrompt,
    logError,
    logDefault,
    logWarning,
    parsePlugins,
    writeFileSync,
} from '@rnv/core';
import { provision } from 'ios-mobileprovision-finder';
import path from 'path';
import { getAppFolderName } from './common';
import { parseProvisioningProfiles } from './provisionParser';
import { getAppId } from '@rnv/sdk-utils';
import { Context, getContext } from './getContext';

export const parseXcodeProject = async () => {
    const c = getContext();
    logDefault('parseXcodeProject');
    const { platform } = c;
    if (!platform) return;
    // PROJECT
    c.payload.xcodeProj = {};
    c.payload.xcodeProj.provisioningStyle =
        c.program.opts().provisioningStyle || getConfigProp('provisioningStyle') || 'Automatic';
    c.payload.xcodeProj.deploymentTarget = getConfigProp('deploymentTarget') || '14.0';
    c.payload.xcodeProj.provisionProfileSpecifier =
        c.program.opts().provisionProfileSpecifier || getConfigProp('provisionProfileSpecifier');
    c.payload.xcodeProj.provisionProfileSpecifiers = getConfigProp('provisionProfileSpecifiers') || {};
    c.payload.xcodeProj.codeSignIdentity =
        c.program.opts().codeSignIdentity || getConfigProp('codeSignIdentity') || 'iPhone Developer';

    c.payload.xcodeProj.codeSignIdentities = getConfigProp('codeSignIdentities');

    c.payload.xcodeProj.systemCapabilities = getConfigProp('systemCapabilities');
    c.payload.xcodeProj.excludedArchs = getConfigProp('excludedArchs');
    c.payload.xcodeProj.runScheme = getConfigProp('runScheme');
    c.payload.xcodeProj.teamID = getConfigProp('teamID');
    c.payload.xcodeProj.id = getConfigProp('id');
    c.payload.xcodeProj.appId = getAppId();

    if (c.payload.xcodeProj.provisioningStyle !== 'Automatic' && !c.payload.xcodeProj.provisionProfileSpecifier) {
        const result = await parseProvisioningProfiles(c);

        let eligibleProfile: provision.MobileProvision | undefined;

        if (result?.eligible) {
            result.eligible.forEach((v) => {
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
            const schemeToUpdate =
                c.files.appConfig.config?.project?.platforms?.[platform]?.buildSchemes?.[c.program.opts().scheme];
            if (autoFix && schemeToUpdate && c.files.appConfig.config) {
                c.payload.xcodeProj.provisionProfileSpecifier = eligibleProfile.Name;
                if ('provisionProfileSpecifier' in schemeToUpdate) {
                    schemeToUpdate.provisionProfileSpecifier = eligibleProfile.Name;
                }

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

const _parseXcodeProject = (c: Context, platform: RnvPlatform) =>
    new Promise<void>((resolve) => {
        logDefault('_parseXcodeProject');
        const xcodePath = doResolve('xcode');
        if (!xcodePath) {
            logError(`Cannot resolve xcode path`);
            return;
        }
        const xcode = require(xcodePath);
        // const xcode = require(`${c.paths.project.nodeModulesDir}/xcode`);
        const appFolder = getAppFolder();
        const appFolderName = getAppFolderName();
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

            if (platform === 'ios') {
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

            const templateXcode = getConfigProp('templateXcode');

            const xcodeprojObj1 = templateXcode?.project_pbxproj;

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
            parsePlugins((plugin, pluginPlat) => {
                const templateXcode = getFlavouredProp(pluginPlat, 'templateXcode');

                const xcodeprojObj = templateXcode?.project_pbxproj;
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
                            xcodeProj.addToBuildSettings(k, xcodeprojObj.buildSettings?.[k]);
                        });
                    }
                }
            });

            // FONTS
            // Cocoapods take care of this
            xcodeProj.pbxCreateGroup('Resources');
            c.payload.pluginConfigiOS.embeddedFontSources.forEach((v) => {
                xcodeProj.addResourceFile(v, { variantGroup: false });
            });

            fsWriteFileSync(projectPath, xcodeProj.writeSync());
            resolve();
        });
    });
