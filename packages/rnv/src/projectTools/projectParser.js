import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    WEB_HOSTED_PLATFORMS,
} from '../constants';
import { getAppFolder, getAppSubFolder, getBuildsFolder } from '../common';
import {
    cleanFolder, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, writeFileSync
} from '../systemTools/fileutils';
import { isPlatformActive } from '../platformTools';
import { npmInstall } from '../systemTools/exec';
import {
    logTask,
    logWarning, logDebug, logInfo
} from '../systemTools/logger';
import { getMergedPlugin, parsePlugins } from '../pluginTools';
import { loadFile } from '../configTools/configParser';
import { inquirerPrompt } from '../systemTools/prompt';
import { isSystemWin } from '../utils';


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

    if (c.buildConfig) {
        if (!c.buildConfig.common) {
            reject(`Your ${chalk.white(c.paths.appConfig.config)} is missconfigured. (Maybe you have older version?). Missing ${chalk.white('{ common: {} }')} object at root`);
            return;
        }
    }

    // FONTS
    let fontsObj = 'export default [';


    parseFonts(c, (font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const { includedFonts } = c.buildConfig.common;
            if (includedFonts) {
                if (includedFonts.includes('*') || includedFonts.includes(key)) {
                    if (font) {
                        const fontSource = path.join(dir, font);

                        let relativePath = dir.replace(c.paths.project.dir, '');
                        if (isSystemWin) relativePath = relativePath.replace(/\\/g, '/'); // strings don't like windows backslashes
                        if (fs.existsSync(fontSource)) {
                            // const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                            // mkdirSync(fontFolder);
                            // const fontDest = path.join(fontFolder, font);
                            // copyFileSync(fontSource, fontDest);
                            fontsObj += `{
                              fontFamily: '${key}',
                              file: require('../..${relativePath}/${font}'),
                          },`;
                        } else {
                            logWarning(`Font ${chalk.white(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            }
        }
    });


    fontsObj += '];';
    if (!fs.existsSync(c.paths.project.assets.runtimeDir)) {
        mkdirSync(c.paths.project.assets.runtimeDir);
    }
    const fontJsPath = path.join(c.paths.project.assets.dir, 'runtime', 'fonts.js');
    if (fs.existsSync(fontJsPath)) {
        const existingFileContents = fs.readFileSync(fontJsPath).toString();

        if (existingFileContents !== fontsObj) {
            logDebug('newFontsJsFile');
            fs.writeFileSync(fontJsPath, fontsObj);
        }
    } else {
        logDebug('newFontsJsFile');
        fs.writeFileSync(fontJsPath, fontsObj);
    }

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


export const parseFonts = (c, callback) => {
    logTask('parseFonts');

    if (c.buildConfig) {
        // FONTS - PROJECT CONFIG
        if (fs.existsSync(c.paths.project.projectConfig.fontsDir)) {
            fs.readdirSync(c.paths.project.projectConfig.fontsDir).forEach((font) => {
                if (callback) callback(font, c.paths.project.projectConfig.fontsDir);
            });
        }
        // FONTS - APP CONFIG
        if (c.paths.appConfig.fontsDirs) {
            c.paths.appConfig.fontsDirs.forEach((v) => {
                if (fs.existsSync(v)) {
                    fs.readdirSync(v).forEach((font) => {
                        if (callback) callback(font, v);
                    });
                }
            });
        } else if (fs.existsSync(c.paths.appConfig.fontsDir)) {
            fs.readdirSync(c.paths.appConfig.fontsDir).forEach((font) => {
                if (callback) callback(font, c.paths.appConfig.fontsDir);
            });
        }
    }
};


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
    firefoxos: '',
    windows: '',
    macos: '',
    web: 'public'
};

export const copyAssetsFolder = async (c, platform, customFn) => {
    logTask(`copyAssetsFolder:${platform}`);

    if (!isPlatformActive(c, platform)) return;

    if (customFn) {
        return customFn(c, platform);
    }

    const destPath = path.join(getAppSubFolder(c, platform), ASSET_PATH_ALIASES[platform]);

    // FOLDER MERGERS FROM APP CONFIG + EXTEND
    if (c.paths.appConfig.dirs) {
        const hasAssetFolder = c.paths.appConfig.dirs.filter(v => fs.existsSync(path.join(v, `assets/${platform}`))).length;
        if (!hasAssetFolder) {
            await generateDefaultAssets(c, platform, path.join(c.paths.appConfig.dirs[0], `assets/${platform}`));
        }
        c.paths.appConfig.dirs.forEach((v) => {
            const sourcePath = path.join(v, `assets/${platform}`);
            copyFolderContentsRecursiveSync(sourcePath, destPath);
        });
    } else {
        const sourcePath = path.join(c.paths.appConfig.dir, `assets/${platform}`);
        if (!fs.existsSync(sourcePath)) {
            await generateDefaultAssets(c, platform, sourcePath);
        }
        copyFolderContentsRecursiveSync(sourcePath, destPath);
    }
};

const generateDefaultAssets = async (c, platform, sourcePath) => {
    logTask(`generateDefaultAssets:${platform}`);
    let confirmAssets = true;
    if (c.program.ci === false) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: `It seems you don't have assets configured in ${chalk.white(sourcePath)} do you want generate default ones?`
        });
        confirmAssets = confirm;
    }

    if (confirmAssets) {
        copyFolderContentsRecursiveSync(path.join(c.paths.rnv.dir, `projectTemplate/assets/${platform}`), sourcePath);
    }
};

export const copyBuildsFolder = (c, platform) => new Promise((resolve, reject) => {
    logTask(`copyBuildsFolder:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform));

    // FOLDER MERGERS PROJECT CONFIG
    const sourcePath1 = getBuildsFolder(c, platform, c.paths.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1, destPath);

    // FOLDER MERGERS PROJECT CONFIG (PRIVATE)
    const sourcePath1sec = getBuildsFolder(c, platform, c.paths.workspace.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1sec, destPath);

    if (WEB_HOSTED_PLATFORMS.includes(platform)) {
        // FOLDER MERGERS _SHARED
        const sourcePathShared = path.join(c.paths.project.projectConfig.dir, 'builds/_shared');
        copyFolderContentsRecursiveSync(sourcePathShared, path.join(c.paths.project.builds.dir, '_shared'));
    }

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
    const sourcePath0sec = getBuildsFolder(c, platform, c.paths.workspace.appConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath0sec, destPath);

    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(c, platform, path.join(c.paths.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3, destPath);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(c, platform, path.join(c.paths.workspace.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(c, platform, path.join(c.paths.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getBuildsFolder(c, platform, path.join(c.paths.workspace.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath);
    });

    resolve();
});

export const upgradeProjectDependencies = (c, version) => {
    logTask('upgradeProjectDependencies');

    const thw = 'renative-template-hello-world';
    const tb = 'renative-template-blank';
    const devDependencies = c.files.project.package?.devDependencies;
    if (devDependencies?.rnv) {
        devDependencies.rnv = version;
    }
    if (devDependencies[thw]) {
        devDependencies[thw] = version;
    }
    if (devDependencies[tb]) {
        devDependencies[tb] = version;
    }
    if (devDependencies?.renative) {
        devDependencies.renative = version;
    }

    writeFileSync(c.paths.project.package, c.files.project.package);

    if (c.files.project.config?.templates?.[thw]?.version) c.files.project.config.templates[thw].version = version;
    if (c.files.project.config?.templates?.[tb]?.version) c.files.project.config.templates[tb].version = version;

    c._requiresNpmInstall = true;

    writeFileSync(c.paths.project.config, c.files.project.config);
};

export const configureNodeModules = c => new Promise((resolve, reject) => {
    logTask('configureNodeModules');
    // Check node_modules
    if (!fs.existsSync(c.paths.project.nodeModulesDir) || c._requiresNpmInstall && !c.runtime.skipPackageUpdate) {
        if (!fs.existsSync(c.paths.project.nodeModulesDir)) {
            logWarning(
                `Looks like your node_modules folder ${chalk.white(c.paths.project.nodeModulesDir)} is missing! Let's run ${chalk.white(
                    'npm install',
                )} first!`,
            );
        } else {
            logWarning(`Looks like your node_modules out of date! Let's run ${chalk.white('npm install')} first!`);
        }
        c._requiresNpmInstall = false;
        npmInstall().then(() => resolve()).catch(e => reject(e));
    } else {
        resolve();
    }
});

export const cleanPlaformAssets = async (c) => {
    logTask('cleanPlaformAssets');

    await cleanFolder(c.paths.project.assets.dir);
    mkdirSync(c.paths.project.assets.runtimeDir);
    return true;
};
