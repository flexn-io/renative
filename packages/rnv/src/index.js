import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { initializeBuilder, logComplete, logError } from './common';
import { runApp, updateApp } from './cli/runner';
import { configure } from './cli/app';
import { createPlatforms, addPlatform, removePlatform } from './cli/platform';

const ADD_PLATFORM = 'addPlatform';
const REMOVE_PLATFORM = 'removePlatform';
const RUN = 'run';
const UPDATE = 'update';
const CREATE_PLATFORMS = 'createPlatforms';
const CONFIGURE = 'configure';

const run = (cmd, appId, program, process) => {
    initializeBuilder(cmd, appId, process, program).then((v) => {
        // const cmdConfig = {
        //
        // }
        switch (cmd) {
        case ADD_PLATFORM:
            addPlatform(v).then(() => logComplete()).catch(e => logError(e));
            break;
        case REMOVE_PLATFORM:
            removePlatform(v).then(() => logComplete()).catch(e => logError(e));
            break;
        case RUN:
            runApp(v).then(() => logComplete()).catch(e => logError(e));
            break;
        case CREATE_PLATFORMS:
            createPlatforms(v).then(() => logComplete()).catch(e => logError(e));
            break;
        case CONFIGURE:
            configure(v).then(() => logComplete()).catch(e => logError(e));
            break;
        case UPDATE:
            updateApp(v).then(() => logComplete()).catch(e => logError(e));
            break;
        }
    });
};


export default { run };
