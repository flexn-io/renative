import chalk from 'chalk';

const hooks = {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
};

const pipes = {
    'app:configure:before': hooks.hello,
};

export { pipes, hooks };
