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
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RNV_PRIVATE_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PLATFORMS,
    SUPPORTED_PLATFORMS
} from '../constants';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from '../systemTools/fileutils';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';
import { getQuestion } from '../systemTools/prompt';


export const checkAndCreateProjectPackage = (c, data) => {
    logTask(`checkAndCreateProjectPackage:${data.packageName}`);
    const {
        packageName, appTitle, appID, supportedPlatforms,
    } = data;

    if (!fs.existsSync(c.paths.project.package)) {
        logInfo("Looks like your package.json is missing. Let's create one for you!");

        const pkgJson = {};
        pkgJson.name = packageName;
        pkgJson.title = appTitle;
        pkgJson.version = data.version;
        pkgJson.dependencies = {
            renative: 'latest',
        };
        pkgJson.devDependencies = {
            rnv: c.files.rnv.package.version,
        };
        pkgJson.devDependencies[data.optionTemplates.selectedOption] = 'latest';

        const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);

        fs.writeFileSync(c.paths.project.package, pkgJsonStringClean);
    }
};

export const checkAndCreateProjectConfig = (c, data) => {
    logTask('checkAndCreateProjectConfig');
    const {
        packageName, appTitle, appID, supportedPlatforms,
    } = data;
    // Check Project Config
    if (!fs.existsSync(c.paths.project.config)) {
        logInfo(`You're missing ${RNV_PROJECT_CONFIG_NAME} file in your root project! Let's create one!`);

        const defaultProjectConfigs = {
            supportedPlatforms: data.optionPlatforms.selectedOptions,
            template: data.optionTemplates.selectedOption,
            defaultAppId: appID.toLowerCase()
        };

        const obj = JSON.parse(fs.readFileSync(path.join(c.paths.rnv.projectTemplate.dir, 'rnv-config.json')));

        obj.defaults = defaultProjectConfigs;

        writeObjectSync(path.join(c.paths.project.dir, RNV_PROJECT_CONFIG_NAME), obj);
    }
};

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
    const aPath = path.join(c.paths.project.assets.dir, 'runtime');
    const cPath = path.join(c.paths.appConfig.dir, 'assets/runtime');
    copyFolderContentsRecursiveSync(cPath, aPath);

    // copyFileSync(c.paths.appConfig.config, path.join(c.paths.project.assets.dir, RNV_APP_CONFIG_NAME));
    fs.writeFileSync(path.join(c.paths.project.assets.dir, RNV_APP_CONFIG_NAME), JSON.stringify(c.buildConfig, null, 2));

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
