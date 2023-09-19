import { fsExistsSync, fsReadFileSync } from '../system/fs';
import { RENATIVE_CONFIG_LOCAL_NAME, RENATIVE_CONFIG_PRIVATE_NAME } from '../constants';
import { RnvContext, RnvContextPathObj } from './types';
import { generateContextDefaults } from './defaults';

import {
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_RUNTIME_NAME,
    RENATIVE_CONFIG_WORKSPACES_NAME,
    RENATIVE_CONFIG_PLUGINS_NAME,
    RENATIVE_CONFIG_TEMPLATES_NAME,
    RN_CLI_CONFIG_NAME,
    RN_BABEL_CONFIG_NAME,
    // PLATFORMS,
    USER_HOME_DIR,
} from '../constants';

import path from 'path';
import { mkdirSync } from 'fs';

export const generateContextPaths = (pathObj: RnvContextPathObj, dir: string, configName?: string) => {
    pathObj.dir = dir;
    pathObj.config = path.join(dir, configName || RENATIVE_CONFIG_NAME);
    pathObj.configLocal = path.join(dir, RENATIVE_CONFIG_LOCAL_NAME);
    pathObj.configPrivate = path.join(dir, RENATIVE_CONFIG_PRIVATE_NAME);
    pathObj.appConfigsDir = path.join(dir, '..');
};

export const createRnvContext = ({
    program,
    process,
    cmd,
    subCmd,
    RNV_HOME_DIR,
}: {
    program: any;
    process: any;
    cmd: string;
    subCmd: string;
    RNV_HOME_DIR: string;
}) => {
    const c: RnvContext = generateContextDefaults();

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    // c.platformDefaults = PLATFORMS;

    c.paths.rnv.dir = RNV_HOME_DIR;

    //TODO: find better way to deal with linking
    c.paths.IS_LINKED = path.dirname(RNV_HOME_DIR).split(path.sep).pop() === 'packages';
    c.paths.CURRENT_DIR = path.resolve('.');
    c.paths.RNV_NODE_MODULES_DIR = path.join(RNV_HOME_DIR, 'node_modules');

    c.paths.rnv.engines.dir = path.join(c.paths.rnv.dir, 'engineTemplates');
    c.paths.rnv.pluginTemplates.dir = path.join(c.paths.rnv.dir, 'pluginTemplates');

    c.paths.rnv.pluginTemplates.config = path.join(c.paths.rnv.pluginTemplates.dir, RENATIVE_CONFIG_PLUGINS_NAME);
    c.paths.rnv.projectTemplates.dir = path.join(c.paths.rnv.dir, 'coreTemplateFiles');
    c.paths.rnv.projectTemplates.config = path.join(c.paths.rnv.projectTemplates.dir, RENATIVE_CONFIG_TEMPLATES_NAME);
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');

    c.paths.rnv.projectTemplate.dir = path.join(c.paths.rnv.dir, 'coreTemplateFiles');
    c.files.rnv.package = JSON.parse(fsReadFileSync(c.paths.rnv.package).toString());

    c.platform = c.program.platform;
    c.paths.home.dir = USER_HOME_DIR;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(c.paths.GLOBAL_RNV_DIR, RENATIVE_CONFIG_NAME);
    c.paths.rnv.configWorkspaces = path.join(c.paths.GLOBAL_RNV_DIR, RENATIVE_CONFIG_WORKSPACES_NAME);

    if (!fsExistsSync(c.paths.GLOBAL_RNV_DIR)) {
        mkdirSync(c.paths.GLOBAL_RNV_DIR);
    }

    generateContextPaths(c.paths.project, c.paths.CURRENT_DIR, c.program.configName);

    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks/src');
    c.paths.buildHooks.dist.dir = path.join(c.paths.project.dir, 'buildHooks/dist');
    c.paths.buildHooks.index = path.join(c.paths.buildHooks.dir, 'index.js');
    c.paths.buildHooks.dist.index = path.join(c.paths.buildHooks.dist.dir, 'index.js');
    c.paths.project.nodeModulesDir = path.join(c.paths.project.dir, 'node_modules');
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(c.paths.project.dir, 'appConfigs');
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.rnCliConfig = path.join(c.paths.project.dir, RN_CLI_CONFIG_NAME);
    c.paths.project.babelConfig = path.join(c.paths.project.dir, RN_BABEL_CONFIG_NAME);
    // c.paths.project.npmLinkPolyfill = path.join(
    //     c.paths.project.dir,
    //     'npm_link_polyfill.json'
    // );
    c.paths.project.appConfigBase.dir = path.join(c.paths.project.dir, 'appConfigs', 'base');
    c.paths.project.appConfigBase.pluginsDir = path.join(c.paths.project.appConfigBase.dir, 'plugins');
    c.paths.project.appConfigBase.fontsDir = path.join(c.paths.project.appConfigBase.dir, 'fonts');
    c.paths.project.appConfigBase.fontsDirs = [c.paths.project.appConfigBase.fontsDir];
    c.paths.project.assets.dir = path.join(c.paths.project.dir, 'platformAssets');
    c.paths.project.assets.runtimeDir = path.join(c.paths.project.assets.dir, 'runtime');
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, RENATIVE_CONFIG_RUNTIME_NAME);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');

    generateContextPaths(c.paths.workspace, c.paths.GLOBAL_RNV_DIR);

    global.RNV_CONTEXT = c;
};

global.RNV_CONTEXT = generateContextDefaults();

export const getContext = (): RnvContext => {
    return global.RNV_CONTEXT;
};
