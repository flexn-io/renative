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
    cleanPlatformIfRequired
} from '../common';
import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { IOS } from '../constants';
import { executeAsync, execCLI } from '../systemTools/exec';
import { executePipe } from '../projectTools/buildHooks';
import appRunner, { copyRuntimeAssets } from './app';
import { listTemplates, addTemplate, getTemplateOptions, getInstalledTemplateOptions, applyTemplate } from '../templateTools';

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
        return Promise.reject(`cli:template Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _templateList = c => new Promise((resolve, reject) => {
    logTask('_templateList');
    listTemplates(c)
        .then(() => resolve())
        .catch(e => reject(e));
});

const _templateAdd = c => new Promise((resolve, reject) => {
    logTask('_templateAdd');

    const opts = getTemplateOptions(c);

    askQuestion(`Pick which template to install : \n${opts.asString}`)
        .then(v => opts.pick(v))
        .then(() => addTemplate(c, opts))
        .then(() => resolve())
        .catch(e => reject(e));
});

const _templateApply = c => new Promise((resolve, reject) => {
    logTask(`_templateApply:${c.program.template}`);

    if (c.program.template) {
        applyTemplate(c, c.program.template)
            .then(() => resolve())
            .catch(e => reject(e));
    } else {
        const opts = getInstalledTemplateOptions(c);

        askQuestion(`Pick which template to apply ${chalk.yellow('(NOTE: your project content will be overriden!)')}: \n${opts.asString}`)
            .then(v => opts.pick(v))
            .then((v) => {
                finishQuestion();
                return Promise.resolve();
            })
            .then(() => applyTemplate(c, opts.selectedOption))
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

export { PIPES };

export default run;
