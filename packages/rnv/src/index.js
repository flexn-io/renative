import Common, { initializeBuilder } from './common';
import Logger, { logComplete, logError } from './systemTools/logger';
import CLI from './cli';
import Constants from './constants';
import Exec from './systemTools/exec';
import FileUtils from './systemTools/fileutils';
import Doctor from './systemTools/doctor';
import PlatformTools from './platformTools';
import PluginTools from './pluginTools';
import SetupTools from './setupTools';
import Config from './config';
import pkg from '../package.json';

const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://004caee3caa04c81a10f2ba31a945362@sentry.io/1795473', release: `rnv@${pkg.version}` });

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => logComplete(true))
        .catch(e => logError(e, true));
};

export {
    Constants, Common, Exec, FileUtils,
    PlatformTools, Doctor, PluginTools, SetupTools, Logger,
    run, CLI
};

export default { run, Config };
