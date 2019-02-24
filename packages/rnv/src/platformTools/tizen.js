import { logTask } from '../common';
import { execShellAsync } from '../exec';

function launchTizenSimulator(c, name) {
    logTask('launchTizenSimulator');

    if (name) {
        return execShellAsync(`em-cli launch --name ${name}`);
    }
    return Promise.reject('No simulator -t target name specified!');
}

export { launchTizenSimulator };
