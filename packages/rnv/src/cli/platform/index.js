import fs from 'fs';
import { logTask, logWarning } from '../../common';
import {
    IOS, ANDROID, ANDROID_TV, ANDROID_WEAR,
    WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH,
} from '../../constants';

import TizenPlatform from './tizen';
import IOSPlatform from './ios';
import TVOSPlatform from './tvos';
import { cleanFolder } from '../../fileutils';

const CONFIGURE = 'configure';
const UPDATE = 'update';
const LIST = 'list';
const ADD = 'add';
const REMOVE = 'remove';

// ##########################################
// PUBLIC API
// ##########################################

const run = (config) => {
    logTask('run');

    switch (config.subCommand) {
    case CONFIGURE:
        return _runCreatePlatforms(config);
    case UPDATE:
        return Promise.resolve();
    case LIST:
        return Promise.resolve();
    case ADD:
        return Promise.resolve();
    case REMOVE:
        return Promise.resolve();
    default:
        return Promise.reject(`Sub-Command ${config.subCommand} not supported`);
    }
};

async function _runCreatePlatforms(config) {
    logTask('_runCreatePlatforms');

    await _runCleanPlaformFolders(config);
    await _runCleanPlaformAssets(config);

        .then(() => _runCopyPlatforms(config))
        .then(() => resolve())
        .catch(e => reject(e));
}

async function _runCleanPlaformFolders(config) {
    await cleanFolder(config.platformBuildsFolder);
}

async function _runCleanPlaformAssets(config) {
    await cleanFolder(config.platformAssetsFolder);
}

async function _checkAndCreatePlatforms(config) {
    logTask('_checkAndCreatePlatforms');

    if (!fs.existsSync(config.platformBuildsFolder)) {
        logWarning('Platforms not created yet. creating them for you...');

        const newCommand = Object.assign({}, config);
        newCommand.subCommand = 'configure';
        newCommand.program = { appConfig: 'helloWorld' };

        await run(newCommand);
    }
}

export default {
    [TIZEN]: TizenPlatform,
    [IOS]: IOSPlatform,
    [TVOS]: TVOSPlatform,
};
