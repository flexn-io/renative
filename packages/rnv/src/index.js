import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { initializeBuilder, logComplete, logError } from './common';
import { addPlatform, removePlatform } from './platform';
import { runApp } from './runner';
import { createPlatforms } from './setup';

const ADD_PLATFORM = 'addPlatform';
const REMOVE_PLATFORM = 'removePlatform';
const RUN = 'run';
const CREATE_PLATFORMS = 'createPlatforms';

const run = (cmd, cmdOption, program, process) => {
    initializeBuilder(cmd, process, program).then(() => {
        switch (cmd) {
        case ADD_PLATFORM:
            addPlatform(cmdOption, program, process).then(() => logComplete()).catch(e => logError(e));
            break;
        case REMOVE_PLATFORM:
            removePlatform(cmdOption, program, process).then(() => logComplete()).catch(e => logError(e));
            break;
        case RUN:
            runApp(cmdOption, program, process).then(() => logComplete()).catch(e => logError(e));
            break;
        case CREATE_PLATFORMS:
            createPlatforms(cmdOption, program, process).then(() => logComplete()).catch(e => logError(e));
            break;
        }
    });
};


export default { run };
