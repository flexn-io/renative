import ora from '../../../cli/ora';
import { RnvConfig } from '../../configManager/types';
import { execCLI } from '../../systemManager/exec';

export const waitForEmulator = async (
    c: RnvConfig,
    cli: string,
    command: string,
    callback: (resp: string | true) => boolean
): Promise<boolean> => {
    let attempts = 0;
    const maxAttempts = 30;
    const CHECK_INTEVAL = 2000;
    const { maxErrorLength } = c.program;
    const spinner = ora('Waiting for emulator to boot...').start();

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            execCLI(c, cli, command, {
                silent: true,
                timeout: 10000,
                maxErrorLength,
            })
                .then((resp) => {
                    if (callback(resp)) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail("Can't connect to the running emulator. Try restarting it.");
                        return reject("Can't connect to the running emulator. Try restarting it.");
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail("Can't connect to the running emulator. Try restarting it.");
                        return reject("Can't connect to the running emulator. Try restarting it.");
                    }
                });
        }, CHECK_INTEVAL);
    });
};
