import { TASK_APP_CREATE, PARAMS } from '../../core/constants';
import {
    chalk,
    logTask,
} from '../../core/systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';


export const taskRnvAppCreate = async (c) => {
    logTask('taskRnvAppCreate');

    const { conf } = await inquirerPrompt({
        name: 'conf',
        type: 'confirm',
        message: 'Do you want ReNative to create new sample appConfig for you?',
        warningMessage: `No app configs found for this project \nMaybe you forgot to run ${chalk().white('rnv template apply')} ?`
    });
    logTask('taskRnvAppCreate', `${conf} ${c.runtime?.appId}`);

    return true;
};

export default {
    description: 'Create new app config',
    fn: taskRnvAppCreate,
    task: TASK_APP_CREATE,
    params: PARAMS.withBase(),
    platforms: [],
};
