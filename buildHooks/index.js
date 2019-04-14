import chalk from 'chalk';

export default {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
};
