/* eslint-disable import/no-cycle */
import { logDebug, logTask } from '../systemTools/logger';
import { isPlatformSupported } from '../platformTools';
import {
    getConfigProp,
    isBuildSchemeSupported
} from '../common';
import { checkSdk } from '../platformTools/sdkManager';
import { resolvePluginDependants } from '../pluginTools';
import Analytics from '../systemTools/analytics';
import {
    executePipe
} from '../projectTools/buildHooks';

import EngineRn from './engine-rn';
import EngineRnWeb from './engine-rn-web';
import EngineRnElectron from './engine-rn-electron';
import EngineRnNext from './engine-rn-next';
// import EngineRnElectronNext from './engine-rn-electron-next';

const ENGINES = {
    'engine-rn': EngineRn,
    'engine-rn-web': EngineRnWeb,
    'engine-rn-electron': EngineRnElectron,
    'engine-rn-next': EngineRnNext,
    // 'engine-rn-electron-next': EngineRnElectronNext
};

const EngineNoOp = {
    runTask: async (c, task) => {
        logTask('EngineNoOp:runTask');
        await isPlatformSupported(c);
        await isBuildSchemeSupported(c);
        return getEngineRunner(c).runTask(c, task);
    },
    applyTemplate: () => {
    }
};


export const getEngineByPlatform = (c, platform, ignoreMissingError) => {
    let selectedEngineKey;
    if (c.buildConfig && !!platform) {
        selectedEngineKey = getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];
        if (!selectedEngine && !ignoreMissingError) {
            logDebug(`ERROR: Engine: ${selectedEngineKey} does not exists or is not registered ${new Error()}`);
            // logRaw(new Error());
        }
        return selectedEngine;
    }
    return null;
};


export const getEngineRunner = (c, platform) => {
    const selectedEngine = getEngineByPlatform(c, platform || c.platform);
    if (!selectedEngine) {
        return EngineNoOp;
        // throw new Error(`Cound not find engine with ${chalk().white(c.platform)} platform support`);
    }
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        return EngineNoOp;
        //         throw new Error(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
        // ${Object.keys(ENGINES).join(', ')}`);
    }
    return engine;
};

export const initializeTask = async (c, task) => {
    c.runtime.task = task;

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await getEngineRunner(c).applyTemplate(c);
    await resolvePluginDependants(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });

    return executeTask(c, task);
};

const _executePipe = async (c, task, phase) => {
    let subCmd = '';
    if (c.subCommand) {
        subCmd = `:${c.subCommand}`;
    }
    return executePipe(c, `${task}${subCmd}:${phase}`);
};

export const executeTask = async (c, task, parentTask, originTask) => {
    if ((!c.program.only && !parentTask) || !parentTask) {
        logTask('executeTask', `task:${task} parent:${parentTask} origin:${originTask}`);
        await _executePipe(c, task, 'before');
        await getEngineRunner(c).executeTask(c, task, parentTask, originTask);
        await _executePipe(c, task, 'after');
    }
};
