import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { getEngineRunnerByPlatform, registerPlatformEngine } from '../engines';
import { chalk, logInfo } from '../logger';
import { RnvTask, RnvTaskMap, RnvTaskOption } from './types';

const printCurrentPlatform = () => {
    const ctx = getContext();
    const msg = `Current platform: ${chalk().white.bold(ctx.platform)}`;
    logInfo(msg);
};

export const selectPlatformIfRequired = async (
    knownTaskInstance?: RnvTask<string>,
    registerEngineIfPlatformSelected?: boolean
) => {
    const c = getContext();
    // TODO: move this to more generic place?
    c.runtime.availablePlatforms = c.buildConfig.defaults?.supportedPlatforms || [];
    if (typeof c.platform !== 'string') {
        const taskName = getTaskNameFromCommand();
        const platforms = knownTaskInstance?.platforms || c.runtime.availablePlatforms;
        if (platforms) {
            if (platforms.length === 1) {
                logInfo(
                    `Task "${knownTaskInstance?.task}" has only one supported platform: "${platforms[0]}". Automatically selecting it.`
                );
                c.platform = platforms[0];
                c.program.opts().platform = c.platform;
            } else {
                const { platform } = await inquirerPrompt({
                    type: 'list',
                    name: 'platform',
                    message: `Pick a platform for task: "rnv ${knownTaskInstance?.task || taskName}"`,
                    choices: platforms,
                });
                c.platform = platform;
            }
            printCurrentPlatform();
        }
    } else {
        printCurrentPlatform();
    }
    // TODO: move all below to more generic place?
    if (registerEngineIfPlatformSelected) {
        await registerPlatformEngine(c.platform);
    }
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

export const generateRnvTaskMap = <OKey extends string>(
    taskArr: ReadonlyArray<RnvTask<OKey>>,
    config: { name?: string; packageName?: string }
) => {
    const tasks: RnvTaskMap<OKey> = {};

    const ownerID = config.packageName || config.name;
    if (!ownerID) throw new Error('generateRnvTaskMap() requires config.<packageName | name> to be defined!');

    taskArr.forEach((taskBlueprint) => {
        const taskInstance = { ...taskBlueprint };
        const plts = taskInstance.platforms || [];
        const key = `${config.name}:${plts.join('-')}:${taskInstance.task}`;
        taskInstance.ownerID = ownerID;
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
