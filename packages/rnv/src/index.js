import { RewriteFrames } from '@sentry/integrations';
import Common, { initializeBuilder } from './common';
import { logComplete, logError } from './systemTools/logger';
import CLI from './cli';
import Constants from './constants';
import Exec from './systemTools/exec';
import FileUtils from './systemTools/fileutils';
import Doctor from './systemTools/doctor';
import PluginTools from './pluginTools';
import SetupTools from './setupTools';
import Config from './config';
import pkg from '../package.json';

import 'source-map-support/register';

const Sentry = require('@sentry/node');

Sentry.init({
    dsn: 'https://004caee3caa04c81a10f2ba31a945362@sentry.io/1795473',
    // dsn: 'http://93c73cf78e1247388ebd9e390d362ad3@localhost:9000/1',
    release: `rnv@${pkg.version}`,
    integrations: [new RewriteFrames({
        root: '/',
        iteratee: (frame) => {
            console.log('frameeee', frame);
            if (frame.filename.includes('rnv/dist/')) {
                frame.filename = frame.filename.split('rnv/dist/')[1];
            } else if (frame.filename.includes('/node_modules/')) {
                frame.filename = `node_modules/${frame.filename.split('/node_modules/')[1]}`;
            }
            return frame;
        }
    })]
});

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then(c => Config.initializeConfig(c))
        .then(c => CLI(c))
        .then(() => logComplete(true))
        .catch(e => logError(e, true));
};

export {
    Constants, Common, Exec, FileUtils,
    Doctor, PluginTools, SetupTools,
    run, CLI
};

export default { run, Config };
