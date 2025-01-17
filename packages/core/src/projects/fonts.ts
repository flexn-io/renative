import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { fsExistsSync, fsReaddirSync } from '../system/fs';
import { ParseFontsCallback } from './types';
import { RnvContext } from '../context/types';
import { parsePlugins } from '../plugins';
import { resolveRelativePackage } from './utils';

/**
 * Parses font files from various directories and applies a callback function to each font found.
 * This function performs the following operations:
 * 1. Logs the start of the font parsing process.
 * 2. Retrieves the current context which includes the build configuration and paths.
 * 3. Checks the project's build configuration for a fonts directory and applies the callback to each font found.
 * 4. Checks the app configuration for multiple font directories and applies the callback to each font found.
 *    If no directories are specified, it checks for a single fonts directory.
 * 5. Parses additional font sources specified in the configuration properties and applies the callback.
 * 6. Parses font sources specified in plugin configurations and applies the callback.
 *
 * @param callback A function to be called for each font found. It receives the font name and its directory as arguments.
 */
export const parseFonts = (callback: ParseFontsCallback) => {
    logDefault('parseFonts');

    const c = getContext();

    if (c.buildConfig) {
        // FONTS - PROJECT CONFIG
        if (fsExistsSync(c.paths.project.appConfigBase.fontsDir)) {
            fsReaddirSync(c.paths.project.appConfigBase.fontsDir).forEach((font) => {
                if (callback) {
                    callback(font, c.paths.project.appConfigBase.fontsDir);
                }
            });
        }
        // FONTS - APP CONFIG
        if (c.paths.appConfig.fontsDirs) {
            c.paths.appConfig.fontsDirs.forEach((v) => {
                if (fsExistsSync(v)) {
                    fsReaddirSync(v).forEach((font) => {
                        if (callback) callback(font, v);
                    });
                }
            });
        } else if (fsExistsSync(c.paths.appConfig.fontsDir)) {
            fsReaddirSync(c.paths.appConfig.fontsDir).forEach((font) => {
                if (callback) callback(font, c.paths.appConfig.fontsDir);
            });
        }
        _parseFontSources(c, getConfigProp('fontSources') || [], callback);
        // PLUGIN FONTS
        parsePlugins((plugin) => {
            if (plugin.config?.fontSources) {
                _parseFontSources(c, plugin.config?.fontSources, callback);
            }
        }, true);
    }
};

const _parseFontSources = (c: RnvContext, fontSourcesArr: Array<string>, callback: ParseFontsCallback) => {
    const fontSources = fontSourcesArr.map((v) => resolveRelativePackage(c, v));
    fontSources.forEach((fontSourceDir) => {
        if (fsExistsSync(fontSourceDir)) {
            fsReaddirSync(fontSourceDir).forEach((font) => {
                if (callback) callback(font, fontSourceDir);
            });
        }
    });
};
