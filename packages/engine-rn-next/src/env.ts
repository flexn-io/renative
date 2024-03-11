import { chalk, fsExistsSync, getConfigProp, getContext, logWarning, parsePlugins } from '@rnv/core';
import path from 'path';
import { getExportDir } from './sdk';

export const EnvVars = {
    RNV_NEXT_TRANSPILE_MODULES: () => {
        return {
            RNV_NEXT_TRANSPILE_MODULES: getTranspileModules(),
        };
    },
    NEXT_BASE: () => {
        return _checkPagesDir();
    },
    NODE_ENV: () => {
        const c = getContext();
        const env = getConfigProp('environment');

        return {
            NODE_ENV: env || 'development',
        };
    },
};

const getTranspileModules = () => {
    const c = getContext();
    const transModules = getConfigProp('nextTranspileModules') || [];

    parsePlugins(
        c,
        c.platform,
        (plugin, pluginPlat, key) => {
            const { webpackConfig } = plugin;
            if (webpackConfig) {
                transModules.push(key);
                if (webpackConfig.nextTranspileModules?.length) {
                    webpackConfig.nextTranspileModules.forEach((module) => {
                        if (module.startsWith('.')) {
                            transModules.push(path.join(c.paths.project.dir, module));
                        } else {
                            transModules.push(module);
                        }
                    });
                }
            }
        },
        true
    );
    return transModules;
};

const _checkPagesDir = () => {
    const c = getContext();
    const pagesDir = getConfigProp('pagesDir');
    const distDir = getExportDir(c);
    const isExport = c._currentTask === 'export';

    if (pagesDir) {
        const pagesDirPath = path.join(c.paths.project.dir, pagesDir);
        if (!fsExistsSync(pagesDirPath)) {
            logWarning(
                `You configured custom ${c.platform}pagesDir: ${chalk().bold(
                    pagesDir
                )} in your renative.json but it is missing at ${chalk().red(pagesDirPath)}`
            );
        }
        return { NEXT_PAGES_DIR: pagesDir, NEXT_DIST_DIR: distDir, NEXT_EXPORT: isExport };
    }
    const fallbackPagesDir = 'src/app';
    logWarning(`You're missing ${c.platform}.pagesDir config. Defaulting to '${fallbackPagesDir}'`);

    const fallbackPagesDirPath = path.join(c.paths.project.dir, fallbackPagesDir);
    if (!fsExistsSync(fallbackPagesDirPath)) {
        logWarning(`Folder ${chalk().bold(
            fallbackPagesDir
        )} is missing. make sure your entry code is located there in order for next to work correctly!
Alternatively you can configure custom entry folder via ${c.platform}.pagesDir in renative.json`);
    }
    return { NEXT_PAGES_DIR: 'src/app', NEXT_DIST_DIR: distDir, NEXT_EXPORT: isExport };
};
