import { fsExistsSync, fsReadFileSync } from '../system/fs';
import { CreateContextOptions, RnvContext, RnvContextPathObj } from './types';
import { USER_HOME_DIR, generateContextDefaults } from './defaults';
import path from 'path';
import { mkdirSync } from 'fs';
import { isSystemWin } from '../system/is';
import { ConfigName } from '../enums/configName';

export const generateContextPaths = (pathObj: RnvContextPathObj, dir: string, configName?: string) => {
    pathObj.dir = dir;
    pathObj.config = path.join(dir, configName || ConfigName.renative);
    pathObj.configLocal = path.join(dir, ConfigName.renativeLocal);
    pathObj.configPrivate = path.join(dir, ConfigName.renativePrivate);
    pathObj.appConfigsDir = path.join(dir, '..');
};

const populateLinkingInfo = (ctx: RnvContext) => {
    //TODO: find better way to deal with linking?
    ctx.paths.IS_LINKED = path.dirname(ctx.paths.rnv.dir).split(path.sep).pop() === 'packages';

    const npxLoc = isSystemWin ? '\\rnv\\bin\\index.js' : '/node_modules/.bin/rnv';
    const rnvPath = process.argv[1];
    const rnvExecWorkspaceRoot = rnvPath.split(npxLoc)[0];

    const isNpxMode = path.join(ctx.paths.project.dir, 'node_modules').includes(rnvExecWorkspaceRoot);

    ctx.paths.IS_NPX_MODE = isNpxMode;
};

export const createRnvContext = (ctx?: CreateContextOptions) => {
    if (!ctx && !global.RNV_CONTEXT) {
        // Initial empty context to be initialized
        global.RNV_CONTEXT = generateContextDefaults();
        return;
    }

    if (!global.RNV_CONTEXT?.isDefault) {
        // Full Context already initialized. Another RNV is trying to initialize

        if (global.RNV_CONTEXT.paths.rnv.dir !== ctx?.RNV_HOME_DIR) {
            // If locations of RNV do not match throw warning as this might produce problems!
            console.log(`
=======
WARNING: it seems your project is executed with 2 different versions of RNV: 
INITIAL (Will be used) located at: ${global.RNV_CONTEXT.paths.rnv.dir}.
NEW: (Will NOT be used) located at: v${ctx?.RNV_HOME_DIR}.
--
This usually happens if:
A) you have multiple versions of rnv dependencies located in your repository
B) you are running project with global rnv (without npx).
--
This might result in unexpected issues! 
Make sure all your rnv dependencies are of same version and you are executing with npx prefix
=======
`);
        }
        return;
    }
    const c: RnvContext = generateContextDefaults();

    c.program = ctx?.program || c.program;
    c.process = ctx?.process || c.process;
    c.command = ctx?.cmd || c.command;
    c.subCommand = ctx?.subCmd || c.subCommand;
    c.isSystemWin = isSystemWin;

    c.paths.rnv.dir = ctx?.RNV_HOME_DIR || c.paths.rnv.dir;

    c.paths.CURRENT_DIR = path.resolve('.');
    c.paths.RNV_NODE_MODULES_DIR = path.join(c.paths.rnv.dir, 'node_modules');

    c.paths.rnv.engines.dir = path.join(c.paths.rnv.dir, 'engineTemplates');
    c.paths.rnv.pluginTemplates.overrideDir = path.join(c.paths.rnv.dir, 'pluginTemplates');

    c.paths.rnv.pluginTemplates.config = path.join(c.paths.rnv.pluginTemplates.overrideDir, ConfigName.renativePlugins);
    c.paths.rnv.projectTemplates.dir = path.join(c.paths.rnv.dir, 'coreTemplateFiles');
    c.paths.rnv.projectTemplates.config = path.join(c.paths.rnv.projectTemplates.dir, ConfigName.renativeTemplates);
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');

    c.paths.rnv.projectTemplate.dir = path.join(c.paths.rnv.dir, 'coreTemplateFiles');
    c.files.rnv.package = JSON.parse(fsReadFileSync(c.paths.rnv.package).toString());

    c.platform = c.program.platform;
    c.paths.home.dir = USER_HOME_DIR;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(c.paths.GLOBAL_RNV_DIR, ConfigName.renative);
    c.paths.rnv.configWorkspaces = path.join(c.paths.GLOBAL_RNV_DIR, ConfigName.renativeWorkspaces);

    if (!fsExistsSync(c.paths.GLOBAL_RNV_DIR)) {
        mkdirSync(c.paths.GLOBAL_RNV_DIR);
    }

    generateContextPaths(c.paths.project, c.paths.CURRENT_DIR, c.program.configName);

    // TODO: generate solution root

    populateLinkingInfo(c);
    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks');
    c.paths.buildHooks.src.dir = path.join(c.paths.buildHooks.dir, 'src');
    c.paths.buildHooks.dist.dir = path.join(c.paths.buildHooks.dir, 'dist');
    c.paths.buildHooks.src.index = path.join(c.paths.buildHooks.src.dir, 'index.js');
    c.paths.buildHooks.src.indexTs = path.join(c.paths.buildHooks.src.dir, 'index.ts');
    c.paths.buildHooks.dist.index = path.join(c.paths.buildHooks.dist.dir, 'index.js');
    c.paths.buildHooks.tsconfig = path.join(c.paths.buildHooks.dir, 'tsconfig.json');
    // c.paths.buildHooks.tsconfig = path.join(__dirname, '../../supportFiles/tsconfig.hooks.json');
    c.paths.project.nodeModulesDir = path.join(c.paths.project.dir, 'node_modules');
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(c.paths.project.dir, 'appConfigs');
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.dotRnvDir = path.join(c.paths.project.dir, '.rnv');
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
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, ConfigName.renativeRuntime);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');

    generateContextPaths(c.paths.workspace, c.paths.GLOBAL_RNV_DIR);

    global.RNV_CONTEXT = c;
};

createRnvContext();
