/* eslint-disable global-require, import/no-dynamic-require, valid-typeof */
/* eslint-disable import/no-cycle */

import fs from 'fs';
import { writeFileSync } from '../systemManager/fileutils';
import { logWarning } from '../systemManager/logger';
import { configSchema, WEB_HOSTED_PLATFORMS } from '../constants';
import { getConfigProp } from '../common';

class Config {
    constructor() {
        this.config = {};
    }

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


    getProjectConfig() {
        return this.config.files.project;
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
        const cfg = global
            ? require(paths.GLOBAL_RNV_CONFIG)
            : require(paths.project.config);

        const value = cfg[configSchema[key].key];
        if (value === undefined) return 'N/A';

        return value;
    }

    getMergedConfigValue(key) {
        let value = this.config.buildConfig?.[configSchema[key].key];
        if (value === undefined && configSchema[key].default) { value = configSchema[key].default; }
        return value;
    }

    listConfigValue(key) {
        let localVal = this.getConfigValueSeparate(key).toString();
        let globalVal = this.getConfigValueSeparate(key, true).toString();

        if (globalVal === 'N/A' && configSchema[key].default) { globalVal = configSchema[key].default; }
        if (localVal === 'N/A') localVal = globalVal;

        const table = [
            {
                Key: key,
                'Global Value': globalVal
            }
        ];

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
            logWarning(
                `Unsupported value provided for ${key}. Correct values are ${keySchema.values.join(
                    ', '
                )}`
            );
            return false;
        }

        return true;
    }

    setConfigValue(key, value) {
        const {
            program: { global },
            paths
        } = this.config;

        if (this.isConfigValueValid(key, value)) {
            let isValid = value;
            const configPath = global
                ? paths.GLOBAL_RNV_CONFIG
                : paths.project.config;
            const config = require(configPath);

            if (['true', 'false'].includes(isValid)) isValid = isValid === 'true'; // convert string to bool if it matches a bool value

            config[configSchema[key].key] = isValid;
            writeFileSync(configPath, config);
            return true;
        }
        return false;
    }

    get isWebHostEnabled() {
        const { hosted } = this.config.program;
        // if (debug) return false;
        const bundleAssets = getConfigProp(
            this.config,
            this.platform,
            'bundleAssets'
        );
        return (
            (hosted || !bundleAssets)
            && WEB_HOSTED_PLATFORMS.includes(this.platform)
        );
    }

    get isAnalyticsEnabled() {
        return this.getMergedConfigValue('analytics');
    }

    get projectPath() {
        return this.config.paths.project.dir;
    }
}

const Conf = new Config();

export default Conf;
