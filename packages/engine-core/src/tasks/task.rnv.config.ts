import { printTable } from 'console-table-printer';

import { logWarning, logTask, configSchema, PARAMS, Context, getCliArguments, RnvTaskFn } from 'rnv';

export const taskRnvConfig: RnvTaskFn = async (c) => {
    logTask('taskRnvConfig');

    const [, key, value] = getCliArguments(c); // first arg is config so it's useless
    if (key === 'list') {
        const rows: Array<any> = [];
        //TODO: is this really needed?
        Object.keys(configSchema).forEach((k) => rows.push(Context.listConfigValue(k)));

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
        printTable(Context.listConfigValue(key));
    } else if (Context.setConfigValue(key, value)) {
        printTable(Context.listConfigValue(key));
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
