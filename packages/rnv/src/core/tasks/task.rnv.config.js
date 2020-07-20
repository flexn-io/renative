import { printTable } from 'console-table-printer';

import { logWarning } from '../systemManager/logger';
import { configSchema } from '../constants';
import Config from '../configManager/config';

export const rnvConfig = () => {
    const [, key, value] = Config.rnvArguments; // first arg is config so it's useless
    if (key === 'list') {
        const rows = [];
        Object.keys(configSchema).forEach(k => rows.push(Config.listConfigValue(k)));

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
        printTable(Config.listConfigValue(key));
    } else if (Config.setConfigValue(key, value)) { printTable(Config.listConfigValue(key)); }

    return true;
};
