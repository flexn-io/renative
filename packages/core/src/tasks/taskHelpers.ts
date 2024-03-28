import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { getEngineRunnerByPlatform } from '../engines';
import { RnvTask, RnvTaskMap, RnvTaskOption } from './types';

export const selectPlatformIfRequired = async () => {
    const c = getContext();
    if (!c.platform) {
        const taskName = getTaskNameFromCommand();
        const platforms = c.runtime.availablePlatforms;
        if (platforms) {
            if (platforms.length === 1) {
                c.platform = platforms[0];
            } else {
                const { platform } = await inquirerPrompt({
                    type: 'list',
                    name: 'platform',
                    message: `Pick a platform for task: "rnv ${taskName}"`,
                    choices: platforms,
                });
                c.platform = platform;
            }
        }
    }
    // TODO: move this to more generic place?
    c.runtime.availablePlatforms = c.buildConfig.defaults?.supportedPlatforms || [];
    c.runtime.engine = getEngineRunnerByPlatform(c.platform);
    c.runtime.runtimeExtraProps = c.runtime.engine?.runtimeExtraProps || {};
};

export const getTaskNameFromCommand = (): string | undefined => {
    const c = getContext();
    if (!c.command) return undefined;
    let taskName = '';

    if (c.command) taskName = c.command;
    if (c.subCommand) taskName += ` ${c.subCommand}`;

    return taskName;
};

export const generateRnvTaskMap = (taskArr: Array<RnvTask>, config: { name: string }) => {
    const tasks: RnvTaskMap = {};

    taskArr.forEach((taskBlueprint) => {
        const taskInstance = { ...taskBlueprint };
        const plts = taskInstance.platforms || [];
        const key = `${config.name}:${plts.join('-')}:${taskInstance.task}`;
        taskInstance.ownerID = config.name;
        taskInstance.key = key;
        tasks[key] = taskInstance;
    });
    // if (extedTaskMaps) {
    //     extedTaskMaps.forEach((taskMap) => {
    //         Object.keys(taskMap).forEach((key) => {
    //             tasks[key] = taskMap[key];
    //         });
    //     });
    // }
    return tasks;
};

export const generateStringFromTaskOption = (opt: RnvTaskOption) => {
    let cmd = '';
    if (opt.shortcut) {
        cmd += `-${opt.shortcut}, `;
    }
    cmd += `--${opt.key}`;
    if (opt.isVariadic) {
        if (opt.isRequired) {
            cmd += ` <value...>`;
        } else {
            cmd += ` [value...]`;
        }
    } else if (opt.isValueType) {
        if (opt.isRequired) {
            cmd += ` <value>`;
        } else {
            cmd += ` [value]`;
        }
    }
    return cmd;
};

// const ACCEPTED_CONDITIONS = ['platform', 'target', 'appId', 'scheme'] as const;

export const shouldSkipTask = ({ taskName }: { taskName: string }) => {
    const c = getContext();
    // const task = taskKey as RenativeConfigRnvTaskName;
    // const originTask = originRnvTaskName as RenativeConfigRnvTaskName;
    const tasks = c.buildConfig?.tasks;
    c.runtime.platform = c.platform;
    if (!tasks) return false;

    if (c.program.opts().skipTasks?.split) {
        const skipTaskArr = c.program.opts().skipTasks.split(',');
        if (skipTaskArr.includes(taskName)) return true;
    }

    // if (Array.isArray(tasks)) {
    //     for (let k = 0; k < tasks.length; k++) {
    //         const t = tasks[k];
    //         if (t.name === task) {
    //             if (t.filter) {
    //                 const conditions = t.filter.split('&');
    //                 let conditionsToMatch = conditions.length;
    //                 conditions.forEach((con: string) => {
    //                     const conArr = con.split('=');
    //                     const conKey = conArr[0] as ACKey;
    //                     if (ACCEPTED_CONDITIONS.includes(conKey)) {
    //                         const rt = c.runtime;
    //                         if (rt[conKey] === conArr[1]) {
    //                             conditionsToMatch--;
    //                         }
    //                     } else {
    //                         logWarning(
    //                             `Condition ${con} not valid. only following keys are valid: ${ACCEPTED_CONDITIONS.join(
    //                                 ','
    //                             )} SKIPPING...`
    //                         );
    //                     }
    //                 });
    //                 if (conditionsToMatch === 0) {
    //                     if (t.ignore) {
    //                         _logSkip(task);
    //                         return true;
    //                     }
    //                 }
    //             } else if (t.ignore) {
    //                 _logSkip(task);
    //                 return true;
    //             }
    //         }
    //     }
    // } else if (c.platform) {
    //     const ignoreTask = tasks[task]?.platform?.[c.platform]?.ignore;
    //     if (ignoreTask) {
    //         _logSkip(task);
    //         return true;
    //     }
    //     if (!originTask) {
    //         return false;
    //     }
    //     const ignoreTasks = tasks[originTask]?.platform?.[c.platform]?.ignoreTasks || [];
    //     if (ignoreTasks.includes(task)) {
    //         logInfo(`Task ${task} marked to skip during rnv ${originTask}. SKIPPING...`);
    //         return true;
    //     }
    // }

    return false;
};
