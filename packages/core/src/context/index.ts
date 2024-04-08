import { fsExistsSync, fsReadFileSync } from '../system/fs';
import { CreateContextOptions, RnvContext, RnvContextPathObj } from './types';
import { generateContextDefaults } from './defaults';
import path from 'path';
import { mkdirSync } from 'fs';
import { isSystemWin } from '../system/is';
import { RnvFileName } from '../enums/fileName';
import { homedir } from 'os';
import { RnvFolderName } from '../enums/folderName';

export const generateContextPaths = (pathObj: RnvContextPathObj, dir: string, configName?: string) => {
    pathObj.dir = dir;
    pathObj.config = path.join(dir, configName || RnvFileName.renative);
    pathObj.configLocal = path.join(dir, RnvFileName.renativeLocal);
    pathObj.configPrivate = path.join(dir, RnvFileName.renativePrivate);
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

export const createRnvContext = (ctxOpts?: CreateContextOptions) => {
    // console.trace('CREATE_RNV_CONTEXT', !!ctxOpts, !!global.RNV_CONTEXT, global.RNV_CONTEXT?.isDefault);

    const isJestMode = process.env.JEST_WORKER_ID !== undefined;
    let haltExecution = false;
    if (!!ctxOpts && !!global.RNV_CONTEXT) {
        // Handle direct initialize of context
        if (!global.RNV_CONTEXT?.isDefault) {
            if (!isJestMode) {
                haltExecution = true;
            }
        } else {
            // if isDefault=true, we can safely reinitialize
            // as it means we are not fully initialized yet
        }
    } else if (!ctxOpts) {
        // Handle new imports of @rnv/core
        if (!global.RNV_CONTEXT) {
            if (!isJestMode) {
                // Initial empty context to be initialized
                global.RNV_CONTEXT = generateContextDefaults();
                return;
            } else {
                // We are in jest test mode. (multiple imports will occur due to mocking of imports in tests)
                // We do not initialize context but do not throw error
                return;
            }
        }
        // Full Context already initialized. Another @rnv/core instance has been just imported
        haltExecution = true;
    }

    if (haltExecution) {
        const msg =
            'This usually happens if you have multiple versions of @rnv/core dependencies located in your project or you are running project with global rnv (without npx).';
        const err = new Error(`

FATAL: Multiple instances of @rnv/core detected: 

1 (${global.RNV_CONTEXT.timeStart.toISOString()}) 
  ${global.RNV_CONTEXT.paths?.rnvCore?.dir || 'UNKNOWN (can happen if running older versions of RNV)'}
2 (${new Date().toISOString()}) 
  ${path.join(__dirname, '../..')}

${msg}
`);

        throw err;
    }

    const c: RnvContext = generateContextDefaults();

    c.program = ctxOpts?.program || c.program;
    c.process = ctxOpts?.process || c.process;
    c.command = ctxOpts?.cmd || c.command;
    c.subCommand = ctxOpts?.subCmd || c.subCommand;
    c.isSystemWin = process.platform === 'win32';
    c.isSystemLinux = process.platform === 'linux';
    c.isSystemMac = process.platform === 'darwin';

    global.RNV_CONTEXT = c;

    populateContextPaths(c, ctxOpts?.RNV_HOME_DIR);

    c.isDefault = false;
};

export const populateContextPaths = (c: RnvContext, RNV_HOME_DIR: string | undefined) => {
    // user ------------------
    c.paths.user.homeDir = homedir();
    c.paths.user.currentDir = path.resolve('.');

    // @rnv/core ------------------
    c.paths.rnvCore.dir = path.join(__dirname, '../..');
    c.paths.rnvCore.templateFilesDir = path.join(c.paths.rnvCore.dir, RnvFolderName.templateFiles);
    c.paths.rnvCore.package = path.join(c.paths.rnvCore.dir, RnvFileName.package);
    //TODO: move out. this is only for paths
    c.files.rnvCore.package = JSON.parse(fsReadFileSync(c.paths.rnvCore.package).toString());

    // rnv ------------------
    if (RNV_HOME_DIR) {
        c.paths.rnv.dir = RNV_HOME_DIR;
        c.paths.rnv.package = path.join(c.paths.rnv.dir, RnvFileName.package);
        //TODO: move out. this is only for paths
        c.files.rnv.package = JSON.parse(fsReadFileSync(c.paths.rnv.package).toString());
    }

    // dotRnv ------------------
    c.paths.dotRnv.dir = path.join(c.paths.user.homeDir, '.rnv');
    if (!fsExistsSync(c.paths.dotRnv.dir)) {
        mkdirSync(c.paths.dotRnv.dir);
    }
    c.paths.dotRnv.config = path.join(c.paths.dotRnv.dir, RnvFileName.renative);
    c.paths.dotRnv.configWorkspaces = path.join(c.paths.dotRnv.dir, RnvFileName.renativeWorkspaces);

    // workspace ------------------
    generateContextPaths(c.paths.workspace, c.paths.dotRnv.dir);

    // solution ------------------
    // TODO: generate solution root paths

    // project ------------------
    generateContextPaths(c.paths.project, c.paths.user.currentDir, c.program.opts().configName);
    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks');
    c.paths.buildHooks.src.dir = path.join(c.paths.buildHooks.dir, 'src');
    c.paths.buildHooks.dist.dir = path.join(c.paths.buildHooks.dir, 'dist');
    c.paths.buildHooks.src.index = path.join(c.paths.buildHooks.src.dir, 'index.js');
    c.paths.buildHooks.src.indexTs = path.join(c.paths.buildHooks.src.dir, 'index.ts');
    c.paths.buildHooks.dist.index = path.join(c.paths.buildHooks.dist.dir, 'index.js');
    c.paths.buildHooks.tsconfig = path.join(c.paths.buildHooks.dir, 'tsconfig.json');
    c.paths.project.nodeModulesDir = path.join(c.paths.project.dir, 'node_modules');
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(c.paths.project.dir, 'appConfigs');
    c.paths.project.package = path.join(c.paths.project.dir, RnvFileName.package);
    c.paths.project.dotRnvDir = path.join(c.paths.project.dir, '.rnv');
    c.paths.project.appConfigBase.dir = path.join(c.paths.project.dir, 'appConfigs', 'base');
    c.paths.project.appConfigBase.pluginsDir = path.join(c.paths.project.appConfigBase.dir, 'plugins');
    c.paths.project.appConfigBase.fontsDir = path.join(c.paths.project.appConfigBase.dir, 'fonts');
    c.paths.project.appConfigBase.fontsDirs = [c.paths.project.appConfigBase.fontsDir];
    c.paths.project.assets.dir = path.join(c.paths.project.dir, 'platformAssets');
    c.paths.project.assets.runtimeDir = path.join(c.paths.project.assets.dir, 'runtime');
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, RnvFileName.renativeRuntime);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');

    // runtime
    c.platform = c.program.opts().platform;
    populateLinkingInfo(c);
};

createRnvContext();
