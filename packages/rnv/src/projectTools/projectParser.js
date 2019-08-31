import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import merge from 'deepmerge';
import {
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    KAIOS,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
    ANDROID_SDK,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    TIZEN_SDK,
    WEBOS_SDK,
    KAIOS_SDK,
    FIREFOX_OS,
    FIREFOX_TV,
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RENATIVE_CONFIG_TEMPLATE_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    PLATFORMS,
    SUPPORTED_PLATFORMS
} from '../constants';
import { isPlatformActive, getAppFolder, getAppSubFolder, getBuildsFolder } from '../common';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from '../systemTools/fileutils';
import { executeAsync } from '../systemTools/exec';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';
import { getQuestion } from '../systemTools/prompt';
import { getMergedPlugin, parsePlugins } from '../pluginTools';
import { loadFile } from '../configTools/configParser';


export const checkAndCreateProjectPackage = c => new Promise((resolve) => {
    logTask('checkAndCreateProjectPackage');

    if (!fs.existsSync(c.paths.project.package)) {
        logInfo(`Looks like your ${c.paths.project.package} is missing. Let's create one for you!`);

        const packageName = c.files.project.config.projectName || c.paths.project.dir.split('/').pop();
        const version = c.files.project.config.defaults?.package?.version || '0.1.0';
        const templateName = c.files.project.config.defaults?.template || 'renative-template-hello-world';
        const rnvVersion = c.files.rnv.package.version;

        const pkgJson = {};
        pkgJson.name = packageName;
        pkgJson.version = version;
        pkgJson.dependencies = {
            renative: rnvVersion,
        };
        pkgJson.devDependencies = {
            rnv: rnvVersion,
        };
        pkgJson.devDependencies[templateName] = rnvVersion;
        const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);
        fs.writeFileSync(c.paths.project.package, pkgJsonStringClean);
    }

    loadFile(c.files.project, c.paths.project, 'package');

    resolve();
});

export const checkAndCreateGitignore = (c) => {
    logTask('checkAndCreateGitignore');
    const ignrPath = path.join(c.paths.project.dir, '.gitignore');
    if (!fs.existsSync(ignrPath)) {
        logInfo("Looks like your .gitignore is missing. Let's create one for you!");

        copyFileSync(path.join(c.paths.rnv.dir, 'supportFiles/gitignore-template'), ignrPath);
    }
};

export const copyRuntimeAssets = c => new Promise((resolve, reject) => {
    logTask('copyRuntimeAssets');

    const destPath = path.join(c.paths.project.assets.dir, 'runtime');

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, 'assets/runtime');
            copyFolderContentsRecursiveSync(sourcePath, destPath);
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, 'assets/runtime');
        copyFolderContentsRecursiveSync(sourcePath, destPath);
    }

    // FONTS
    let fontsObj = 'export default [';

    if (c.buildConfig) {
        if (!c.buildConfig.common) {
            reject(`Your ${chalk.white(c.paths.appConfig.config)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ common: {} }')} object at root`);
            return;
        }
        if (fs.existsSync(c.paths.project.projectConfig.fontsDir)) {
            fs.readdirSync(c.paths.project.projectConfig.fontsDir).forEach((font) => {
                if (font.includes('.ttf') || font.includes('.otf')) {
                    const key = font.split('.')[0];
                    const { includedFonts } = c.buildConfig.common;
                    if (includedFonts) {
                        if (includedFonts.includes('*') || includedFonts.includes(key)) {
                            if (font) {
                                const fontSource = path.join(c.paths.project.projectConfig.dir, 'fonts', font);
                                if (fs.existsSync(fontSource)) {
                                    // const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                                    // mkdirSync(fontFolder);
                                    // const fontDest = path.join(fontFolder, font);
                                    // copyFileSync(fontSource, fontDest);
                                    fontsObj += `{
                                            fontFamily: '${key}',
                                            file: require('../../projectConfig/fonts/${font}'),
                                        },`;
                                } else {
                                    logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    fontsObj += '];';
    if (fs.existsSync(c.paths.project.assets.runtimeDir)) {
        mkdirSync(c.paths.project.assets.runtimeDir);
    }
    fs.writeFileSync(path.join(c.paths.project.assets.dir, 'runtime', 'fonts.js'), fontsObj);
    const supportFiles = path.resolve(c.paths.rnv.dir, 'supportFiles');
    copyFileSync(
        path.resolve(supportFiles, 'fontManager.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.js'),
    );
    copyFileSync(
        path.resolve(supportFiles, 'fontManager.web.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.web.js'),
    );

    resolve();
});


export const copySharedPlatforms = c => new Promise((resolve) => {
    logTask(`_copySharedPlatform:${c.platform}`);

    if (c.platform) {
        mkdirSync(path.resolve(c.paths.project.platformTemplatesDirs[c.platform], '_shared'));

        copyFolderContentsRecursiveSync(
            path.resolve(c.paths.project.platformTemplatesDirs[c.platform], '_shared'),
            path.resolve(c.paths.project.builds.dir, '_shared'),
        );
    }

    resolve();
});

const ASSET_PATH_ALIASES = {
    android: 'app/src/main',
    androidtv: 'app/src/main',
    androidwear: 'app/src/main',
    ios: '',
    tvos: '',
    tizen: '',
    tizenmobile: '',
    tizenwatch: '',
    webos: 'public',
    kaios: '',
    firefoxtv: '',
    firefoxos: ''
};

export const copyAssetsFolder = (c, platform, customFn) => new Promise((resolve, reject) => {
    logTask(`copyAssetsFolder:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    if (customFn) {
        customFn(c, platform)
            .then(v => resolve())
            .catch(e => reject(e));
        return;
    }

    const destPath = path.join(getAppSubFolder(c, platform), ASSET_PATH_ALIASES[platform]);

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, `assets/${platform}`);
            copyFolderContentsRecursiveSync(sourcePath, destPath);
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${platform}`);
        copyFolderContentsRecursiveSync(sourcePath, destPath);
    }

    resolve();
});

export const copyBuildsFolder = (c, platform) => new Promise((resolve, reject) => {
    logTask(`copyBuildsFolder:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform));

    // FOLDER MERGERS PROJECT CONFIG
    const sourcePath1 = getBuildsFolder(c, platform, c.paths.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1, destPath);

    // FOLDER MERGERS PROJECT CONFIG (PRIVATE)
    const sourcePath1sec = getBuildsFolder(c, platform, c.paths.private.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1sec, destPath);

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const sourceV = getBuildsFolder(c, platform, v);
            copyFolderContentsRecursiveSync(sourceV, destPath, c.paths.appConfig.dir);
        });
    } else {
        copyFolderContentsRecursiveSync(getBuildsFolder(c, platform, c.paths.appConfig.dir), destPath, c.paths.appConfig.dir);
    }

    // FOLDER MERGERS FROM APP CONFIG (PRIVATE)
    const sourcePath0sec = getBuildsFolder(c, platform, c.paths.private.appConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath0sec, destPath);

    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(c, platform, path.join(c.paths.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3, destPath);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(c, platform, path.join(c.paths.private.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(c, platform, path.join(c.paths.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getBuildsFolder(c, platform, path.join(c.paths.private.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath);
    });

    resolve();
});

export const cleanNodeModules = c => new Promise((resolve, reject) => {
    logTask(`cleanNodeModules:${c.paths.project.nodeModulesDir}`);
    removeDirs([
        path.join(c.paths.project.nodeModulesDir, 'react-native-safe-area-view/.git'),
        path.join(c.paths.project.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.project.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, 'react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git')
    ]).then(() => resolve()).catch(e => reject(e));
});

export const configureNodeModules = c => new Promise((resolve, reject) => {
    logTask('configureNodeModules');
    // Check node_modules
    if (!fs.existsSync(c.paths.project.nodeModulesDir) || c._requiresNpmInstall) {
        if (!fs.existsSync(c.paths.project.nodeModulesDir)) {
            logWarning(
                `Looks like your node_modules folder ${chalk.white(c.paths.project.nodeModulesDir)} is missing! Let's run ${chalk.white(
                    'npm install',
                )} first!`,
            );
        } else {
            logWarning(`Looks like your node_modules out of date! Let's run ${chalk.white('npm install')} first!`);
        }
        npmInstall(c).then(() => resolve()).catch(e => reject(e));
    } else {
        resolve();
    }
});

export const cleanPlaformAssets = c => new Promise((resolve, reject) => {
    logTask('cleanPlaformAssets');

    cleanFolder(c.paths.project.assets.dir).then(() => {
        mkdirSync(c.paths.project.assets.runtimeDir);
        resolve();
    });
});

export const npmInstall = (c, failOnError = false) => new Promise((resolve, reject) => {
    logTask('npmInstall');

    executeAsync(c, 'npm install')
        .then(() => {
            resolve();
        })
        .catch((e) => {
            if (failOnError) {
                logError(e);
                resolve();
            } else {
                logWarning(`${e}\n Seems like your node_modules is corrupted by other libs. ReNative will try to fix it for you`);
                cleanNodeModules(c)
                    .then(() => npmInstall(c, true))
                    .then(() => resolve())
                    .catch((e) => {
                        logError(e);
                        resolve();
                    });
            }
        });
});
