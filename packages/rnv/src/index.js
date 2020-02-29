import Common, { initializeBuilder } from './common';
import Logger, { logComplete, logError } from './systemTools/logger';
import CLI from './cli';
import Constants from './constants';
import Exec from './systemTools/exec';
import FileUtils from './systemTools/fileutils';
import Doctor from './systemTools/doctor';
import PluginTools from './pluginTools';
import SetupTools from './setupTools';
import Config from './config';
import Analytics from './systemTools/analytics';

import 'source-map-support/register';

Analytics.initialize();

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => logComplete(true))
        .catch(e => logError(e, true));
};

export {
    Constants, Common, Exec, FileUtils,
    Doctor, PluginTools, SetupTools, Logger,
    run, CLI
};

export default { run, Config };
