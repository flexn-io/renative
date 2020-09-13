import { chalk, logToSummary, logTask } from '../core/systemManager/logger';
import { PARAMS } from '../core/constants';

export const taskRnvHelp = () => {
    logTask('taskRnvHelp');

    const cmdsString = '';
    // Object.keys(c.COMMANDS).forEach((key) => {
    //     cmdsString += `${key}, `;
    // });

    logToSummary(`
${chalk().bold.white('COMMANDS:')}

${cmdsString}

${chalk().bold.white('OPTIONS:')}

'-i, --info', 'Show full debug info'
'-u, --update', 'Force update dependencies (iOS only)'
'-p, --platform <value>', 'Select specific platform' // <ios|android|web|...>
'-c, --appConfigID <value>', 'Select specific appConfigID' // <ios|android|web|...>
'-t, --target <value>', 'Select specific simulator' // <.....>
'-d, --device [value]', 'Select connected device'
'-s, --scheme <value>', 'Select build scheme' // <Debug | Release>
'-f, --filter <value>', 'Filter Value'
'-l, --list', 'Return list of items related to command' // <alpha|beta|prod>
'-r, --reset', 'Also perform reset'
'-b, --blueprint', 'Blueprint for targets'
'-h, --host <value>', 'Custom Host IP'
'-x, --exeMethod <value>', 'Executable method in buildHooks'
'-P, --port <value>', 'Custom Port'
'-H, --help', 'Help'
'-D, --debug', 'enable remote debugger'
'-G, --global', 'Flag for setting a config value for all RNV projects'
'--hosted', 'Run in a hosted environment (skip bundleAssets)'
'--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect'
`);
};

export default {
    description: 'Display generic help',
    fn: taskRnvHelp,
    task: 'help',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
