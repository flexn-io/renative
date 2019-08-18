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
    c.paths.rnvRootFolder = path.join(__dirname, '../..');
    c.paths.rnvPlatformTemplatesFolder = path.join(c.paths.rnvRootFolder, 'platformTemplates');
    c.paths.rnvPluginTemplatesFolder = path.join(c.paths.rnvRootFolder, 'pluginTemplates');
    c.paths.rnvPluginTemplatesConfigPath = path.join(c.paths.rnvPluginTemplatesFolder, 'plugins.json');
    c.paths.rnvPackagePath = path.join(c.paths.rnvRootFolder, 'package.json');
    c.paths.rnvPluginsFolder = path.join(c.paths.rnvRootFolder, 'plugins');
    c.paths.rnvProjectTemplateFolder = path.join(c.paths.rnvRootFolder, 'projectTemplate');
    c.files.rnvPackage = JSON.parse(fs.readFileSync(c.paths.rnvPackagePath).toString());

    return c;
};

export const parseRenativeConfigsSync = (c) => {
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
    c.paths.project.config = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_NAME);
    c.paths.projectConfigLocalPath = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_LOCAL_NAME);
    c.paths.appConfigsFolder = path.join(c.paths.projectRootFolder, 'appConfigs');
    c.paths.projectPackagePath = path.join(c.paths.projectRootFolder, 'package.json');
    c.paths.rnCliConfigPath = path.join(c.paths.projectRootFolder, RN_CLI_CONFIG_NAME);
    c.paths.babelConfigPath = path.join(c.paths.projectRootFolder, RN_BABEL_CONFIG_NAME);
    c.paths.projectConfigFolder = path.join(c.paths.projectRootFolder, 'projectConfig');
    c.paths.projectPluginsFolder = path.join(c.paths.projectConfigFolder, 'plugins');

    try {
        c.files.projectPackage = JSON.parse(fs.readFileSync(c.paths.projectPackagePath).toString());

        const rnvVersionRunner = c.files.rnvPackage.version;
        const rnvVersionProject = c.files.projectPackage.devDependencies?.rnv;

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
            if (c.files.projectPackage.supportedPlatforms) {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = c.files.projectPackage.supportedPlatforms;
            } else {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = SUPPORTED_PLATFORMS;
            }

            logWarning(`You're missing ${chalk.white('supportedPlatforms')} in your ${chalk.white(c.paths.project.config)}. ReNative will generate temporary one`);
        }
        c.isWrapper = c.files.projectConfig.isWrapper;
        c.paths.globalConfigFolder = getRealPath(c, c.files.projectConfig.globalConfigFolder, 'globalConfigFolder', c.paths.globalConfigFolder);
        c.paths.globalConfigPath = path.join(c.paths.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
        if (c.files.projectPackage) {
            c.paths.privateProjectFolder = path.join(c.paths.globalConfigFolder, c.files.projectPackage.name);
            c.paths.privateProjectConfigFolder = path.join(c.paths.privateProjectFolder, 'projectConfig');
            c.paths.privateAppConfigsFolder = path.join(c.paths.privateProjectFolder, 'appConfigs');
        }
        c.paths.appConfigsFolder = getRealPath(c, c.files.projectConfig.appConfigsFolder, 'appConfigsFolder', c.paths.appConfigsFolder);
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
        c.paths.projectPluginsFolder = getRealPath(c, c.files.projectConfig.projectPlugins, 'projectPlugins', c.paths.projectPluginsFolder);
        c.paths.projectNodeModulesFolder = path.join(c.paths.projectRootFolder, 'node_modules');
        c.paths.rnvNodeModulesFolder = path.join(c.paths.rnvRootFolder, 'node_modules');
        c.paths.runtimeConfigPath = path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME);
        c.paths.projectConfigFolder = getRealPath(
            c,
            c.files.projectConfig.projectConfigFolder,
            'projectConfigFolder',
            c.paths.projectConfigFolder,
        );
        c.paths.pluginConfigPath = path.join(c.paths.projectConfigFolder, 'plugins.json');
        c.paths.permissionsConfigPath = path.join(c.paths.projectConfigFolder, 'permissions.json');
        c.paths.fontsConfigFolder = path.join(c.paths.projectConfigFolder, 'fonts');
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
