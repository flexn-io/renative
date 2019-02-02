import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';

const run = (program, command, argv) => {
    const [context, file, ...args] = process.argv;
    console.log(chalk.white.bold('\nrnv is Firing Up!!! 🔥\n'));
    console.log('CONFIG', program.config);
    console.log('ARGV', argv);
    console.log('CMD', command);
    console.log('CONTEXT', context);
    console.log('FILE', file);
    console.log('ARGS', args);
};


export default { run };
