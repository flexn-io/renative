import path from 'path';

export const createRnvConfig = (program, process, cmd, subCmd) => {
    const c = { cli: {}, paths: {}, files: {} };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.platformDefaults = PLATFORMS;
    c.appId = program.appConfigID;
    c.paths.rnvRootFolder = path.join(__dirname, '..');
    c.paths.rnvHomeFolder = path.join(__dirname, '..');
    c.paths.rnvPlatformTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'platformTemplates');
    c.paths.rnvPluginTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'pluginTemplates');
    c.paths.rnvPluginTemplatesConfigPath = path.join(c.paths.rnvPluginTemplatesFolder, 'plugins.json');
    c.paths.rnvPackagePath = path.join(c.paths.rnvRootFolder, 'package.json');
    c.paths.rnvPluginsFolder = path.join(c.paths.rnvHomeFolder, 'plugins');
    c.paths.rnvProjectTemplateFolder = path.join(c.paths.rnvRootFolder, 'projectTemplate');
    c.files.rnvPackage = JSON.parse(fs.readFileSync(c.paths.rnvPackagePath).toString());
};

export const parseRenativeConfigsSync = (c) => {
    console.log('YAAAAY');

    c.platform = c.program.platform;
    c.paths.projectRootFolder = base;
    c.paths.buildHooksFolder = path.join(c.paths.projectRootFolder, 'buildHooks/src');
    c.paths.buildHooksDistFolder = path.join(c.paths.projectRootFolder, 'buildHooks/dist');
    c.paths.buildHooksIndexPath = path.join(c.paths.buildHooksFolder, 'index.js');
    c.paths.buildHooksDistIndexPath = path.join(c.paths.buildHooksDistFolder, 'index.js');
    c.paths.projectSourceFolder = path.join(c.paths.projectRootFolder, 'src');
    c.paths.projectNpmLinkPolyfillPath = path.join(c.paths.projectRootFolder, 'npm_link_polyfill.json');
    c.paths.homeFolder = homedir;
    c.paths.globalConfigFolder = path.join(homedir, '.rnv');
    c.paths.globalConfigPath = path.join(c.paths.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
    c.paths.projectConfigPath = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_NAME);
    c.paths.projectConfigLocalPath = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_LOCAL_NAME);
    c.paths.appConfigsFolder = path.join(c.paths.projectRootFolder, 'appConfigs');
    c.paths.projectPackagePath = path.join(c.paths.projectRootFolder, 'package.json');
    c.paths.rnCliConfigPath = path.join(c.paths.projectRootFolder, RN_CLI_CONFIG_NAME);
    c.paths.babelConfigPath = path.join(c.paths.projectRootFolder, RN_BABEL_CONFIG_NAME);
    c.paths.projectConfigFolder = path.join(c.paths.projectRootFolder, 'projectConfig');
    c.paths.projectPluginsFolder = path.join(c.paths.projectConfigFolder, 'plugins');
};
