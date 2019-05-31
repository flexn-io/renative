import chalk from 'chalk';
import { logTask } from '../common';
import { listHooks, executeHook, listPipes } from '../buildHooks';

const RUN = 'run';
const LIST = 'list';
const PIPES = 'pipes';

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case RUN:
        return executeHook(c);
    case LIST:
        return listHooks(c);
    case PIPES:
        return listPipes(c);
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

export default run;
