import chalk from 'chalk';
import { logTask } from '../common';
import { listWorkspaces } from '../projectTools/workspace';

// COMMANDS
const WORKSPACE = 'workspace';

// SUBB-COMMANDS
const LIST = 'list';

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('cli');

    switch (c.command) {
    case WORKSPACE:
        switch (c.subCommand) {
        case LIST:
            return listWorkspaces(c);
        }
        // TODO GIVE OPTIONS INSTEAD OF REJECT
        return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} does not support method ${chalk.white.bold(c.subCommand)}!`);
    }

    return Promise.reject(`cli: Command ${chalk.white.bold(c.command)} not supported!`);
};

// ##########################################
// PRIVATE
// ##########################################

export default run;
