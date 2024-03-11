import path from 'path';
import {
    fsExistsSync,
    copyFileSync,
    fsWriteFileSync,
    fsReadFileSync,
    copyFolderContentsRecursiveSync,
    fsMkdirSync,
    getAppFolder,
    getConfigProp,
    doResolvePath,
    parseFonts,
    parsePlugins,
    getContext,
} from '@rnv/core';
import { getAppFolderName } from './common';

export const ejectXcodeProject = async () => {
    const c = getContext();
    const isMonorepo = getConfigProp('isMonorepo');
    const monoRoot = getConfigProp('monoRoot');

    const rootMonoProjectPath = isMonorepo ? path.join(c.paths.project.dir, monoRoot || '../..') : c.paths.project.dir;
    const rootProjectPath = c.paths.project.dir;

    const appFolder = getAppFolder();
    const appFolderName = getAppFolderName();

    //= ==========
    // xcodeproj
    //= ==========
    const xcodeProjPath = path.join(appFolder, `${appFolderName}.xcodeproj/project.pbxproj`);

    if (fsExistsSync(xcodeProjPath)) {
        const projAsString = fsReadFileSync(xcodeProjPath).toString();

        const pathRnMatch = `${path.join(rootMonoProjectPath, 'node_modules', 'react-native')}/`;
        // eslint-disable-next-line no-template-curly-in-string
        const pathRnReplace = '${SRCROOT}/rn_static/node_modules/react-native/';

        const pathNmMatch = `${path.join(rootMonoProjectPath, 'node_modules')}/`;
        // eslint-disable-next-line no-template-curly-in-string
        const pathNmReplace = '${SRCROOT}/rn_modules/';

        const pathFontsmMatch = `${path.join(rootProjectPath, 'appConfigs/base/fonts')}/`;
        // eslint-disable-next-line no-template-curly-in-string
        const pathFontsReplace = '${SRCROOT}/fonts/';

        const projSanitised = projAsString
            .replaceAll(pathRnMatch, pathRnReplace)
            .replaceAll(pathNmMatch, pathNmReplace)
            .replaceAll(pathFontsmMatch, pathFontsReplace);

        fsWriteFileSync(xcodeProjPath, projSanitised);
    }

    //= ==========
    // Podfile
    //= ==========

    const podfilePath = path.join(appFolder, 'Podfile');

    if (podfilePath) {
        const podfileAsString = fsReadFileSync(podfilePath).toString();

        const pathRnMatch = `${path.join(rootMonoProjectPath, 'node_modules', 'react-native')}/`;
        const pathRnReplace = './rn_static/node_modules/react-native/';

        const pathNmMatch = `${path.join(rootMonoProjectPath, 'node_modules')}/`;
        const pathNmReplace = './rn_modules/';

        const podfileSanitised = podfileAsString
            .replaceAll(pathRnMatch, pathRnReplace)
            .replaceAll(pathNmMatch, pathNmReplace);

        fsWriteFileSync(podfilePath, podfileSanitised);
    }

    //= ==========
    // Plugins
    //= ==========

    parsePlugins(c, c.platform, (_plugin, pluginPlat, key) => {
        const podPath = doResolvePath(key);
        const extensionsFilter = ['.h', '.m', '.swift', '.c', '.podspec', '.rb', '.mm'];
        // const excludeFolders = ['node_modules', 'android'];

        if (podPath) {
            const destPath = path.join(appFolder, 'rn_modules', key);
            copyFolderContentsRecursiveSync(
                podPath,
                destPath,
                false,
                undefined,
                false,
                undefined,
                undefined,
                c,
                extensionsFilter
            );
            copyFileSync(path.join(podPath, 'package.json'), path.join(destPath, 'package.json'));
        }
    });

    // try {
    //     cleanEmptyFoldersRecursively(path.join(appFolder, 'rn_modules'));
    // } catch (e) {
    //     logWarning(e);
    // }

    //= ==========
    // Fonts
    //= ==========

    parseFonts((font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const includedFonts = getConfigProp('includedFonts');
            if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                const fontSource = path.join(dir, font);
                if (fsExistsSync(fontSource)) {
                    const pathNmMatch = `${path.join(rootMonoProjectPath, 'node_modules')}`;
                    const pathNmReplace = path.join(appFolder, 'rn_modules');
                    const destDir = dir.replace(pathNmMatch, pathNmReplace);

                    if (!fsExistsSync(destDir)) {
                        fsMkdirSync(destDir);
                    }

                    const destPath = path.join(destDir, font);
                    copyFileSync(fontSource, destPath);
                }
            }
        }
    });
};
