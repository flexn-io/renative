/* eslint-disable import/no-cycle */

import {
    logTask,
} from '../systemManager/logger';


export const taskRnvWorkspaceUpdate = async () => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate');
};

export default {
    description: '',
    fn: taskRnvWorkspaceUpdate,
    task: 'workspace',
    subTask: 'update',
    params: [],
    platforms: [],
};
