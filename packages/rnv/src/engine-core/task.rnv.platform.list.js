/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import { chalk, logToSummary, logTask } from '../core/systemManager/logger';
import { generateOptions } from '../cli/prompt';
import { executeTask } from '../core/engineManager';
import { TASK_PLATFORM_LIST, TASK_PROJECT_CONFIGURE } from '../core/constants';

const _genPlatOptions = (c) => {
    const opts = generateOptions(
        c.buildConfig.defaults.supportedPlatforms,
        true,
        null,
        (i, obj, mapping, defaultVal) => {
            const isEjected = c.paths.project.platformTemplatesDirs[
                obj
            ].includes(c.paths.rnv.platformTemplates.dir)
                ? chalk().green('(connected)')
                : chalk().yellow('(ejected)');
            return ` [${chalk().white(i + 1)}]> ${chalk().bold(
                defaultVal
            )} - ${isEjected} \n`;
        }
    );
    return opts;
};

export const taskRnvPlatformList = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformList', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_LIST, originTask);

    const opts = _genPlatOptions(c);
    logToSummary(`Platforms:\n\n${opts.asString}`);
};

export default {
    description: '',
    fn: taskRnvPlatformList,
    task: 'platform list',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
