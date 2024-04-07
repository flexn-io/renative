import {
    chalk,
    fsExistsSync,
    fsReadFileSync,
    fsWriteFileSync,
    getConfigProp,
    getContext,
    logDebug,
    logWarning,
    parseFonts,
} from '@rnv/core';
import { copyFileSync, mkdirSync } from 'fs';
import path from 'path';

export const configureFonts = async () => {
    const c = getContext();

    // FONTS
    let fontsObj = 'export default [';

    const duplicateFontCheck: Array<string> = [];
    parseFonts((font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf') || font.includes('.woff')) {
            const keOriginal = font.split('.')[0];
            const keyNormalised = keOriginal.replace(/__/g, ' ');
            const includedFonts = getConfigProp('includedFonts');
            if (includedFonts) {
                if (
                    includedFonts.includes('*') ||
                    includedFonts.includes(keOriginal) ||
                    includedFonts.includes(keyNormalised)
                ) {
                    if (font && !duplicateFontCheck.includes(font)) {
                        duplicateFontCheck.push(font);
                        const fontSource = path.join(dir, font).replace(/\\/g, '\\\\');
                        if (fsExistsSync(fontSource)) {
                            // const fontFolder = path.join(appFolder, 'app/src/main/assets/fonts');
                            // mkdirSync(fontFolder);
                            // const fontDest = path.join(fontFolder, font);
                            // copyFileSync(fontSource, fontDest);
                            fontsObj += `{
                              fontFamily: '${keyNormalised}',
                              file: require('${fontSource}'),
                          },`;
                        } else {
                            logWarning(`Font ${chalk().bold(fontSource)} doesn't exist! Skipping.`);
                        }
                    }
                }
            }
        }
    });

    fontsObj += '];';
    if (!fsExistsSync(c.paths.project.assets.dir)) {
        mkdirSync(c.paths.project.assets.dir);
    }
    if (!fsExistsSync(c.paths.project.assets.runtimeDir)) {
        mkdirSync(c.paths.project.assets.runtimeDir);
    }
    const fontJsPath = path.join(c.paths.project.assets.dir, 'runtime', 'fonts.web.js');
    if (fsExistsSync(fontJsPath)) {
        const existingFileContents = fsReadFileSync(fontJsPath).toString();

        if (existingFileContents !== fontsObj) {
            logDebug('newFontsJsFile');
            fsWriteFileSync(fontJsPath, fontsObj);
        }
    } else {
        logDebug('newFontsJsFile');
        fsWriteFileSync(fontJsPath, fontsObj);
    }

    const templateFiles = path.resolve(__dirname, '..', 'templateFiles');
    copyFileSync(
        path.resolve(templateFiles, 'fontManager.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.js')
    );
    copyFileSync(
        path.resolve(templateFiles, 'fontManager.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.server.web.js')
    );
    copyFileSync(
        path.resolve(templateFiles, 'fontManager.web.js'),
        path.resolve(c.paths.project.assets.dir, 'runtime', 'fontManager.web.js')
    );

    return true;
};
