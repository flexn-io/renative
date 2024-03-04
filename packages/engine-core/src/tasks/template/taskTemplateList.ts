import {
    logToSummary,
    logTask,
    getTemplateOptions,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskTemplateList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTemplateList');

    if (c.paths.project.configExists) {
        await executeTask(c, TaskKey.projectConfigure, TaskKey.templateList, originTask);
    }
    const opts = getTemplateOptions(c, !c.paths.project.configExists);
    logToSummary(`Templates:\n\n${opts.asString}`);
    return true;
};

const Task: RnvTask = {
    description: 'Show list of available templates',
    fn: taskTemplateList,
    task: TaskKey.templateList,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
