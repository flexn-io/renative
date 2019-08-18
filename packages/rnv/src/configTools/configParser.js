import path from 'path';
import fs from 'fs';
import {
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    KAIOS,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
    ANDROID_SDK,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    TIZEN_SDK,
    WEBOS_SDK,
    KAIOS_SDK,
    FIREFOX_OS,
    FIREFOX_TV,
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RNV_PRIVATE_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PLATFORMS
} from '../constants';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from '../systemTools/fileutils';
import { SUPPORTED_PLATFORMS } from '../common';


const base = path.resolve('.');
const homedir = require('os').homedir();

export const createRnvConfig = (program, process, cmd, subCmd) => {
    const c = {
        cli: {},
        runtime: {

        },
        paths: {
            rnv: {},
            project: {},
            app: {},
            private: {}
        },
        files: {
            rnv: {},
            project: {},
            app: {},
            private: {}
        }
    };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.platformDefaults = PLATFORMS;
    c.appId = program.appConfigID;
    c.paths.rnv.dir = path.join(__dirname, '../..');
    c.paths.rnvPlatformTemplatesFolder = path.join(c.paths.rnv.dir, 'platformTemplates');
    c.paths.rnvPluginTemplatesFolder = path.join(c.paths.rnv.dir, 'pluginTemplates');
    c.paths.rnvPluginTemplatesConfigPath = path.join(c.paths.rnvPluginTemplatesFolder, 'plugins.json');
    c.paths.rnvPackagePath = path.join(c.paths.rnv.dir, 'package.json');
    c.paths.rnvPluginsFolder = path.join(c.paths.rnv.dir, 'plugins');
    c.paths.rnvProjectTemplateFolder = path.join(c.paths.rnv.dir, 'projectTemplate');
    c.files.rnvPackage = JSON.parse(fs.readFileSync(c.paths.rnvPackagePath).toString());

    return c;
};

export const parseRenativeConfigsSync = (c) => {
    c.platform = c.program.platform;

    c.paths.home.dir = homedir;
    c.paths.project.dir = base;

    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.config = path.join(c.paths.project.dir, RNV_PROJECT_CONFIG_NAME);
    c.paths.project.configLocal = path.join(c.paths.project.dir, RNV_PROJECT_CONFIG_LOCAL_NAME);
    c.paths.project.appConfigsDir = path.join(c.paths.project.dir, 'appConfigs');
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.rnCliConfig = path.join(c.paths.project.dir, RN_CLI_CONFIG_NAME);
    c.paths.project.babelConfig = path.join(c.paths.project.dir, RN_BABEL_CONFIG_NAME);
    c.paths.project.npmLinkPolyfill = path.join(c.paths.project.dir, 'npm_link_polyfill.json');
    c.paths.project.projectConfig.dir = path.join(c.paths.project.dir, 'projectConfig');
    c.paths.project.projectConfig.pluginsDir = path.join(c.paths.project.projectConfig.dir, 'plugins');

    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks/src');
    c.paths.buildHooks.dist.dir = path.join(c.paths.project.dir, 'buildHooks/dist');
    c.paths.buildHooks.index = path.join(c.paths.buildHooks.dir, 'index.js');
    c.paths.buildHooks.dist.index = path.join(c.paths.buildHooks.dist.dir, 'index.js');


    c.paths.private.dir = path.join(homedir, '.rnv');
    c.paths.private.config = path.join(c.paths.private.dir, RNV_GLOBAL_CONFIG_NAME);


    try {
        c.files.project.package = JSON.parse(fs.readFileSync(c.paths.project.package).toString());

        const rnvVersionRunner = c.files.rnvPackage.version;
        const rnvVersionProject = c.files.project.package.devDependencies?.rnv;

        if (rnvVersionRunner && rnvVersionProject) {
            if (rnvVersionRunner !== rnvVersionProject) {
                const recCmd = chalk.white(`$ npx ${getCurrentCommand(true)}`);
                logWarning(`You are running $rnv v${chalk.red(rnvVersionRunner)} against project built with $rnv v${chalk.red(rnvVersionProject)}.
This might result in unexpected behaviour! It is recommended that you run your rnv command with npx prefix: ${recCmd} .`);
            }
        }
    } catch (e) {
        // IGNORE
    }


    c.runtime.hasProjectConfigInCurrentDir = fs.existsSync(c.paths.project.config);

    if (c.runtime.hasProjectConfigInCurrentDir) {
        c.files.projectConfig = JSON.parse(fs.readFileSync(c.paths.project.config).toString());
        if (c.files.projectConfig.defaultPorts) {
            for (const pk in c.files.projectConfig.defaultPorts) {
                c.platformDefaults[pk].defaultPort = c.files.projectConfig.defaultPorts[pk];
            }
        }
        if (!c.files.projectConfig.defaultProjectConfigs) {
            logWarning(`You're missing ${chalk.white('defaultProjectConfigs')} in your ${chalk.white(c.paths.project.config)}. ReNative will generate temporary one`);
            c.files.projectConfig.defaultProjectConfigs = {};
        }
        if (!c.files.projectConfig.defaultProjectConfigs.supportedPlatforms) {
            if (c.files.project.package.supportedPlatforms) {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = c.files.project.package.supportedPlatforms;
            } else {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = SUPPORTED_PLATFORMS;
            }

            logWarning(`You're missing ${chalk.white('supportedPlatforms')} in your ${chalk.white(c.paths.project.config)}. ReNative will generate temporary one`);
        }
        c.isWrapper = c.files.projectConfig.isWrapper;
        c.paths.private.dir = getRealPath(c, c.files.projectConfig.globalConfigFolder, 'globalConfigFolder', c.paths.private.dir);
        c.paths.private.config = path.join(c.paths.private.dir, RNV_GLOBAL_CONFIG_NAME);
        if (c.files.project.package) {
            c.paths.privateProjectFolder = path.join(c.paths.private.dir, c.files.project.package.name);
            c.paths.privateProjectConfigFolder = path.join(c.paths.privateProjectFolder, 'projectConfig');
            c.paths.privateAppConfigsFolder = path.join(c.paths.privateProjectFolder, 'appConfigs');
        }
        c.paths.project.appConfigsDir = getRealPath(c, c.files.projectConfig.appConfigsFolder, 'appConfigsFolder', c.paths.project.appConfigsDir);
        c.paths.platformTemplatesFolders = _generatePlatformTemplatePaths(c);
        c.paths.platformAssetsFolder = getRealPath(
            c,
            c.files.projectConfig.platformAssetsFolder,
            'platformAssetsFolder',
            c.paths.platformAssetsFolder,
        );
        c.paths.platformBuildsFolder = getRealPath(
            c,
            c.files.projectConfig.platformBuildsFolder,
            'platformBuildsFolder',
            c.paths.platformBuildsFolder,
        );
        c.paths.project.projectConfig.pluginsDir = getRealPath(c, c.files.projectConfig.projectPlugins, 'projectPlugins', c.paths.project.projectConfig.pluginsDir);
        c.paths.projectNodeModulesFolder = path.join(c.paths.project.dir, 'node_modules');
        c.paths.rnvNodeModulesFolder = path.join(c.paths.rnv.dir, 'node_modules');
        c.paths.runtimeConfigPath = path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME);
        c.paths.project.projectConfig.dir = getRealPath(
            c,
            c.files.projectConfig.projectConfigFolder,
            'projectConfigFolder',
            c.paths.project.projectConfig.dir,
        );
        c.paths.pluginConfigPath = path.join(c.paths.project.projectConfig.dir, 'plugins.json');
        c.paths.permissionsConfigPath = path.join(c.paths.project.projectConfig.dir, 'permissions.json');
        c.paths.fontsConfigFolder = path.join(c.paths.project.projectConfig.dir, 'fonts');
    }
};

const _generatePlatformTemplatePaths = (c) => {
    const pt = c.files.projectConfig.platformTemplatesFolders || {};
    const originalPath = c.files.projectConfig.platformTemplatesFolder || 'RNV_HOME/platformTemplates';
    const result = {};
    SUPPORTED_PLATFORMS.forEach((v) => {
        if (!pt[v]) {
            result[v] = getRealPath(
                c,
                originalPath,
                'platformTemplatesFolder',
                originalPath,
            );
        } else {
            result[v] = getRealPath(
                c,
                pt[v],
                'platformTemplatesFolder',
                originalPath,
            );
        }
    });
    return result;
};
