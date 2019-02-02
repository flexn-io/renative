import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';

const run = (cmdValue, cmdOption, program, process) => {
    console.log(chalk.white.bold('\n------------------------\n RNV is Firing Up!!! 🔥\n------------------------\n'));
    console.log(cmdValue, cmdOption, program.info);
};


export default { run };
