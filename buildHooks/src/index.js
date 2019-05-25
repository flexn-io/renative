import chalk from 'chalk';

const hooks = {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
    fixPlugins: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD DDDDD!')}\n`);
        console.log('SLKSJKLS', JSON.stringify(c.paths, null, 2));

        resolve();
    }),
};

const pipes = {
    'app:configure:before': hooks.hello,
};

export { pipes, hooks };
