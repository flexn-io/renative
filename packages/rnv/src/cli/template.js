import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import {
    isPlatformSupported,
    cleanNodeModules,
    isBuildSchemeSupported,
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    checkSdk,
    logError,
    getAppFolder,
    logDebug,
    logErrorPlatform,
    isSdkInstalled,
    logWarning,
    configureIfRequired,
    cleanPlatformIfRequired,
    askQuestion,
    finishQuestion
} from '../common';
import { IOS } from '../constants';
import { executeAsync, execCLI } from '../systemTools/exec';
import { executePipe } from '../projectTools/buildHooks';
import appRunner, { copyRuntimeAssets } from './app';
import { listTemplates, addTemplate, getTemplateOptions, applyTemplate } from '../templateTools';

const LIST = 'list';
const ADD = 'add';
const REMOVE = 'remove';
const APPLY = 'apply';

const PIPES = {
    ADD_BEFORE: 'add:before',
    ADD_AFTER: 'add:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case LIST:
        return _templateList(c);
    case ADD:
        return _templateAdd(c);
    case APPLY:
        return _templateApply(c);

    default:
        return Promise.reject(`Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _templateList = c => new Promise((resolve, reject) => {
    logTask('_templateList');
    listTemplates()
        .then(() => resolve())
        .catch(e => reject());
});

const _templateAdd = c => new Promise((resolve, reject) => {
    logTask('_templateAdd');

    addTemplate()
        .then(() => resolve())
        .catch(e => reject());
});

const _templateApply = c => new Promise((resolve, reject) => {
    logTask('_templateApply');

    const opts = getTemplateOptions();

    askQuestion(`Pick which template to apply ${chalk.yellow('(NOTE: your project content will be overriden!)')}: \n${opts.asString}`)
        .then(v => opts.pick(v))
        .then((v) => {
            finishQuestion();
            return Promise.resolve();
        })
        .then(() => applyTemplate(c, opts.selectedOption))
        .then(() => resolve())
        .catch(e => reject(e));
});

export { PIPES };

export default run;
