/* eslint-disable import/no-cycle */

import {
    logTask,
} from '../core/systemManager/logger';


export const taskRnvWorkspaceUpdate = async (c, parentTask, originTask) => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate', `parent:${parentTask} origin:${originTask}`);
};

export default {
    description: '',
    fn: taskRnvWorkspaceUpdate,
    task: 'workspace',
    subTask: 'update',
    params: [],
    platforms: [],
};
