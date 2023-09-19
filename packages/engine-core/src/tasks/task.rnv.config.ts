import { printTable } from 'console-table-printer';

import {
    logWarning,
    logTask,
    configSchema,
    PARAMS,
    getCliArguments,
    RnvTaskFn,
    getContext,
    fsExistsSync,
    writeFileSync,
} from '@rnv/core';

const getConfigValueSeparate = (key: string, global = false) => {
    const { paths } = getContext();

    if (!global && !fsExistsSync(paths.project.config)) return 'N/A'; // string because there might be a setting where we will use null
    const cfg = global ? require(paths.GLOBAL_RNV_CONFIG) : require(paths.project.config);

    const value = cfg[configSchema[key].key];
    if (value === undefined) return 'N/A';

    return value;
};

const isConfigValueValid = (key: string, value: string | boolean) => {
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
};

const setConfigValue = (key: string, value: string | boolean) => {
    const {
        program: { global },
        paths,
    } = getContext();

    if (isConfigValueValid(key, value)) {
        let isValid = value;
        const configPath = global ? paths.GLOBAL_RNV_CONFIG : paths.project.config;
        const config = require(configPath);

        if (typeof isValid === 'string') {
            if (['true', 'false'].includes(isValid)) isValid = isValid === 'true'; // convert string to bool if it matches a bool value
        }

        config[configSchema[key].key] = isValid;
        writeFileSync(configPath, config);
        return true;
    }
    return false;
};

const listConfigValue = (key: string) => {
    let localVal = getConfigValueSeparate(key).toString();
    let globalVal = getConfigValueSeparate(key, true).toString();

    if (globalVal === 'N/A' && configSchema[key].default) {
        globalVal = configSchema[key].default;
    }
    if (localVal === 'N/A') localVal = globalVal;

    const table: Array<Record<string, any>> = [
        {
            Key: key,
            'Global Value': globalVal,
        },
    ];

    if (localVal !== 'N/A') {
        table[0]['Project Value'] = localVal;
    }

    return table;
};

export const taskRnvConfig: RnvTaskFn = async (c) => {
    logTask('taskRnvConfig');

    const [, key, value] = getCliArguments(c); // first arg is config so it's useless
    if (key === 'list') {
        const rows: Array<any> = [];
        //TODO: is this really needed?
        Object.keys(configSchema).forEach((k) => rows.push(listConfigValue(k)));

        printTable([].concat(...rows));
        return true;
    }

    // validate args
    if (!key) {
        // @todo add inquirer with list of options
        logWarning('Please specify a config');
        return true;
    }
    if (!configSchema[key]) {
        logWarning(`Unknown config ${key}`);
        return true;
    }

    if (!value) {
        // list the value
        printTable(listConfigValue(key));
    } else if (setConfigValue(key, value)) {
        printTable(listConfigValue(key));
    }

    return true;
};

export default {
    description: 'Edit or display RNV configs',
    fn: taskRnvConfig,
    task: 'config',
    params: PARAMS.withBase(),
    platforms: [],
};
