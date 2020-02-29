/* eslint-disable global-require, import/no-dynamic-require, valid-typeof */
import { printTable } from 'console-table-printer';
import fs from 'fs';
import chalk from 'chalk';
import semver from 'semver';

import { writeFileSync } from './systemTools/fileutils';
import { npmInstall, executeAsync } from './systemTools/exec';
import { logWarning, logTask, logError } from './systemTools/logger';
import { inquirerPrompt } from './systemTools/prompt';
import { configSchema, WEB_HOSTED_PLATFORMS } from './constants';

export const CLI_PROPS = [
    'provisioningStyle',
    'codeSignIdentity',
    'provisionProfileSpecifier'
];

class Config {
    constructor() {
        this.config = {};
    }

    // async initializeConfig(cmd, subCmd, program) {
    //     this.config = await initializeBuilder(cmd, subCmd, process, program);
    // }

    initializeConfig(c) {
        this.config = c;
        return c;
    }

    getConfig() {
        return this.config;
    }

    get command() {
        return this.config.command;
    }

    get subCommand() {
        return this.config.subCommand;
    }

    get rnvArguments() {
        // commander is stupid https://github.com/tj/commander.js/issues/53
        const { args, rawArgs } = this.config.program;
        const argsCopy = [...args];
        let missingArg = rawArgs[rawArgs.indexOf(argsCopy[1]) + 1];
        if (missingArg?.[0] === '-') {
            if (rawArgs[rawArgs.indexOf(argsCopy[1]) + 2]) {
                missingArg = rawArgs[rawArgs.indexOf(argsCopy[1]) + 2];
            } else {
                missingArg = undefined;
            }
        }
        if (rawArgs.length === 3) missingArg = undefined;
        argsCopy[2] = missingArg;
        return argsCopy.filter(arg => !!arg);
    }

    async injectProjectDependency(dependency, version, type, skipInstall = false) {
        const currentPackage = this.config.files.project.package;
        const existingPath = this.config.paths.project.package;
        if (!currentPackage[type]) currentPackage[type] = {};
        currentPackage[type][dependency] = version;
        writeFileSync(existingPath, currentPackage);
        if (!skipInstall) await npmInstall();
        return true;
    }

    getProjectConfig() {
        return this.config.files.project;
    }

    async checkRequiredPackage(pkg, version = false, type, skipAsking = false, skipInstall = false) {
        if (!pkg) return false;
        const projectConfig = this.getProjectConfig();

        if (!projectConfig.package[type]?.[pkg]) {
            // package does not exist, adding it
            let confirm = skipAsking;
            if (!confirm) {
                const resp = await inquirerPrompt({
                    type: 'confirm',
                    message: `You do not have ${pkg} installed. Do you want to add it now?`
                });
                // eslint-disable-next-line prefer-destructuring
                confirm = resp.confirm;
            }

            if (confirm) {
                let latestVersion = 'latest';
                if (!version) {
                    try {
                        latestVersion = await executeAsync(`npm show ${pkg} version`);
                        // eslint-disable-next-line no-empty
                    } catch (e) {}
                }
                return this.injectProjectDependency(pkg, version || latestVersion, type, skipInstall);
            }
        } else if (!version) {
            // package exists, checking version only if version is not
            const currentVersion = projectConfig.package[type][pkg];
            let latestVersion = false;
            try {
                latestVersion = await executeAsync(`npm show ${pkg} version`);
                // eslint-disable-next-line no-empty
            } catch (e) {}
            if (latestVersion) {
                let updateAvailable = false;

                try {
                    // semver might fail if you have a path instead of a version (like when you are developing)
                    updateAvailable = semver.lt(currentVersion, latestVersion);
                    // eslint-disable-next-line no-empty
                } catch (e) {}

                if (updateAvailable) {
                    let confirm = skipAsking;
                    if (!confirm) {
                        const resp = await inquirerPrompt({
                            type: 'confirm',
                            message: `Seems like ${pkg}@${currentVersion} is installed while there is a newer version, ${pkg}@${latestVersion}. Do you want to upgrade?`
                        });
                        // eslint-disable-next-line prefer-destructuring
                        confirm = resp.confirm;
                    }

                    if (confirm) {
                        return this.injectProjectDependency(pkg, latestVersion, type, skipInstall);
                    }
                }
            }
        }

        return false;
    }

    async injectPlatformDependencies(platform) {
        const npmDeps = this.config.files?.rnv?.platformTemplates?.config?.platforms?.[platform]?.npm;

        if (npmDeps) {
            const promises = Object.keys(npmDeps).reduce((acc, type) => { // iterate over dependencies, devDepencencies or optionalDependencies
                Object.keys(npmDeps[type]).forEach((dep) => { // iterate over deps
                    acc.push(this.checkRequiredPackage(dep, npmDeps[type][dep], type, true, true));
                });
                return acc;
            }, []);

            const installed = await Promise.all(promises);

            if (installed.some(i => i === true)) { // do npm i only if something new is added
                await npmInstall();
            }
        }

        // add other deps that are not npm
    }

    get platform() {
        return this.config.platform;
    }

    get isRenativeProject() {
        return this.config?.paths?.project?.configExists || false;
    }

    get program() {
        return this.config.program;
    }

    get paths() {
        return this.config.paths;
    }

    // RNV CONFIG
    getConfigValueSeparate(key, global = false) {
        const { paths } = this.config;

        if (!global && !fs.existsSync(paths.project.config)) return 'N/A'; // string because there might be a setting where we will use null
        const cfg = global ? require(paths.GLOBAL_RNV_CONFIG) : require(paths.project.config);

        const value = cfg[configSchema[key].key];
        if (value === undefined) return 'N/A';

        return value;
    }

    getMergedConfigValue(key) {
        let value = this.config.buildConfig?.[configSchema[key].key];
        if (value === undefined && configSchema[key].default) value = configSchema[key].default;
        return value;
    }

    listConfigValue(key) {
        let localVal = this.getConfigValueSeparate(key).toString();
        let globalVal = this.getConfigValueSeparate(key, true).toString();

        if (globalVal === 'N/A' && configSchema[key].default) globalVal = configSchema[key].default;
        if (localVal === 'N/A') localVal = globalVal;

        const table = [{
            Key: key,
            'Global Value': globalVal
        }];


        if (localVal !== 'N/A') {
            table[0]['Project Value'] = localVal;
        }

        return table;
    }

    isConfigValueValid(key, value) {
        const keySchema = configSchema[key];
        if (!keySchema) {
            logWarning(`Unknown config param ${key}`);
            return false;
        }

        if (keySchema.values && !keySchema.values.includes(value)) {
            logWarning(`Unsupported value provided for ${key}. Correct values are ${keySchema.values.join(', ')}`);
            return false;
        }

        return true;
    }

    setConfigValue(key, value) {
        const { program: { global }, paths } = this.config;

        if (this.isConfigValueValid(key, value)) {
            const configPath = global ? paths.GLOBAL_RNV_CONFIG : paths.project.config;
            const config = require(configPath);

            if (['true', 'false'].includes(value)) value = value === 'true'; // convert string to bool if it matches a bool value

            config[configSchema[key].key] = value;
            writeFileSync(configPath, config);
            return true;
        }
        return false;
    }

    getValueOrMergedObject(resultCli, resultScheme, resultPlatforms, resultCommon) {
        if (resultCli !== undefined) {
            return resultCli;
        }
        if (resultScheme !== undefined) {
            if (Array.isArray(resultScheme) || typeof resultScheme !== 'object') return resultScheme;
            const val = Object.assign(resultCommon || {}, resultPlatforms || {}, resultScheme);
            return val;
        }
        if (resultPlatforms !== undefined) {
            if (Array.isArray(resultPlatforms) || typeof resultPlatforms !== 'object') return resultPlatforms;
            return Object.assign(resultCommon || {}, resultPlatforms);
        }
        if (resultPlatforms === null) return null;
        return resultCommon;
    }


    getConfigProp(c, platform, key, defaultVal) {
        if (!c.buildConfig) {
            logError('getConfigProp: c.buildConfig is undefined!');
            return null;
        }
        const p = c.buildConfig.platforms[platform];
        const ps = c.runtime.scheme;
        let resultPlatforms;
        let scheme;
        if (p) {
            scheme = p.buildSchemes ? p.buildSchemes[ps] : undefined;
            resultPlatforms = c.buildConfig.platforms[platform][key];
        }

        scheme = scheme || {};
        const resultCli = CLI_PROPS.includes(key) ? c.program[key] : undefined;
        const resultScheme = scheme[key];
        const resultCommon = c.buildConfig.common?.[key];

        let result = this.getValueOrMergedObject(resultCli, resultScheme, resultPlatforms, resultCommon);

        if (result === undefined) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined
        logTask(`getConfigProp:${platform}:${key}:${result}`, chalk.grey);
        return result;
    }

    get isWebHostEnabled() {
        const { hosted } = this.config.program;
        // if (debug) return false;
        const bundleAssets = this.getConfigProp(this.config, this.platform, 'bundleAssets');
        return (hosted || !bundleAssets) && WEB_HOSTED_PLATFORMS.includes(this.platform);
    }

    get isAnalyticsEnabled() {
        return this.getMergedConfigValue('analytics');
    }

    get projectPath() {
        return this.config.paths.project.dir;
    }

    //     getBuildConfig() {
    //         return this.config.buildConfig;
    //     }

    //     updateLocalConfig() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     updateGlobalonfig() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     updateCLIPath() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     getPath(path) { // getPath(RNV_PLUGINTEMPLATES_DIR) / PROJECT_BUILDS_DIR...
    //         return this.config.paths[path];
    //     }

    //     get getInfo() {
    //         return this.c.program.info;
    //     }

    //     get platform() {
    //         return this.config.program.platform;
    //     }

    //     get mono() {
    //         return this.config.program.mono;
    //     }

    //     get target() {}

//     set target(newTarget) {
//         this.config.target = newTarget;
//         this.initializeConfig();
//     }
}

const Conf = new Config();
// excluded from Config because for some reason passing this function to RNV as a handler makes it lose it's context
const rnvConfigHandler = () => {
    const [, key, value] = Conf.rnvArguments; // first arg is config so it's useless
    if (key === 'list') {
        const rows = [];
        Object.keys(configSchema).forEach(k => rows.push(Conf.listConfigValue(k)));

        printTable([].concat(...rows));
        return true;
    }

    // validate args
    if (!key) { // @todo add inquirer with list of options
        logWarning('Please specify a config');
        return true;
    }
    if (!configSchema[key]) {
        logWarning(`Unknown config ${key}`);
        return true;
    }

    if (!value) {
        // list the value
        printTable(Conf.listConfigValue(key));
    } else if (Conf.setConfigValue(key, value)) printTable(Conf.listConfigValue(key));

    return true;
};

export default Conf;
export { rnvConfigHandler };
