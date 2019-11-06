/* eslint-disable global-require, import/no-dynamic-require */
import { printTable } from 'console-table-printer';

import Config from '../config';
import { logWarning } from './logger';
import { writeObjectSync } from './fileutils';

const configSchema = {
    analytics: {
        type: Boolean,
        values: [true, false],
        key: 'disableAnalytics',
        reverse: true, // if value is true it means disabled and vice-versa, so it's easier to have it enabled by default
    }
};

const _getValue = (key, global) => {
    const { paths } = Config.getConfig();
    const globalConfig = require(paths.GLOBAL_RNV_CONFIG);
    const localConfig = require(paths.project.config);

    let value = global ? globalConfig[key] : localConfig[key];

    switch (configSchema[key].type) {
    case Boolean:
        value = !!value;
        break;
    default:
        break;
    }

    if (configSchema[key].reverse) value = !value;
    return value;
};

const _listValue = (key) => {
    const table = [{
        Key: key,
        'Project Value': _getValue(key),
        'Global Value': _getValue(key, true)
    }];

    printTable(table);
};

const rnvConfig = () => {
    const [, key, value] = Config.rnvArguments; // first arg is config so it's useless
    const { program: { global } } = Config;

    console.log({ key, value, global });

    if (key === 'list') {
        console.log('bla bla bla, echo everything');
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
        _listValue(key);
    }
    if (global) {

    }

    return true;
};

export default rnvConfig;
