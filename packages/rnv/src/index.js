import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { addPlatform } from './platform';

const ADD_PLATFORM = 'addPlatform';
const REMOVE_PLATFORM = 'removePlatform';

const run = (cmd, cmdOption, program, process) => {
    console.log(chalk.white.bold('\n------------------------\n RNV is Firing Up!!! 🔥\n------------------------\n'));
    // console.log(cmd, cmdOption, program.info);

    switch (cmd) {
    case ADD_PLATFORM:

        addPlatform(cmdOption, program, process);
        break;
    }
};


export default { run };
