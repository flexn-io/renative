import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { logDefault } from '../logger';
import { fsExistsSync, fsReaddirSync } from '../system/fs';
import { ParseFontsCallback } from './types';
import { RnvContext } from '../context/types';
import { parsePlugins } from '../plugins';
import { resolveRelativePackage } from './utils';

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
            if (plugin.config?.plugin?.fontSources) {
                _parseFontSources(c, plugin.config?.plugin?.fontSources, callback);
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
