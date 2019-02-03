import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { setCurrentJob, logStart } from './common';
import { addPlatform, removePlatform } from './platform';
import { runApp } from './runner';
import { create } from './setup';

const ADD_PLATFORM = 'addPlatform';
const REMOVE_PLATFORM = 'removePlatform';
const RUN = 'run';
const CREATE = 'create';

const run = (cmd, cmdOption, program, process) => {
    logStart();
    setCurrentJob(cmd, process);

    switch (cmd) {
    case ADD_PLATFORM:
        addPlatform(cmdOption, program, process);
        break;
    case REMOVE_PLATFORM:
        removePlatform(cmdOption, program, process);
        break;
    case RUN:
        runApp(cmdOption, program, process);
        break;
    case CREATE:
        create(cmdOption, program, process);
        break;
    }
};


export default { run };
