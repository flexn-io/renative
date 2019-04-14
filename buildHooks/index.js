import chalk from 'chalk';

const hooks = {
    app: {
        before: 'hello',
    },
};

export { hooks };

export default {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
};
