import { printTable } from 'console-table-printer';

import { logWarning, logTask } from '../../core/systemManager/logger';
import { configSchema, PARAMS } from '../../core/constants';
import Config from '../../core/configManager/config';
import { getCliArguments } from '../../core/common';

export const taskRnvConfig = (c) => {
    logTask('taskRnvConfig');

    const [, key, value] = getCliArguments(c); // first arg is config so it's useless
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

export default {
    description: 'Edit or display RNV configs',
    fn: taskRnvConfig,
    task: 'config',
    params: PARAMS.withBase(),
    platforms: [],
};
