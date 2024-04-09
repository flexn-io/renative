import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { getEngineRunnerByPlatform } from '../engines';
import { chalk } from '../logger';
import { RnvPlatform } from '../types';
import { initializeTask } from './taskExecutors';
import { getRegisteredTasks } from './taskRegistry';
import { RnvTask } from './types';

const isTaskSupportedOnPlatform = (task: RnvTask, platform: RnvPlatform) => {
    if (!task.platforms) return true;

    const selectedEngineID = getEngineRunnerByPlatform(platform)?.config.name;
    if (task.ownerType === 'engine' && selectedEngineID && task.ownerID && task.ownerID !== selectedEngineID) {
        // If we already specified platform we can skip tasks registered to unsupported engines
        return false;
    }
    if (platform && !task.platforms.includes(platform)) {
        // We can also filter out tasks that are not supported on current platform
        return false;
    }
    return true;
};

const groupingWizard = async (tasks: RnvTask[]) => {
    const ctx = getContext();
    const initialValue = ctx.program.args?.join(' ');
    const filteredTasks = tasks.filter((task) => isTaskSupportedOnPlatform(task, ctx.platform));
    const optionsMap: Record<string, { name: string; value: RnvTask[] }> = {};
    filteredTasks.forEach((taskInstance) => {
        const prefix = taskInstance.task.split(' ')[0];
        const sharesPrefix = filteredTasks.filter((t) => t.task.split(' ')[0] === prefix).length > 1;
        if (sharesPrefix) {
            optionsMap[prefix] = {
                name: `${prefix}${chalk().gray('...')}`,
                value: [...(optionsMap[prefix]?.value ?? []), taskInstance],
            };
        } else {
            optionsMap[taskInstance.task] = {
                name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
                value: [taskInstance],
            };
        }
    });
    const options = Object.values(optionsMap).sort((a, b) =>
        a.value[0].isPriorityOrder ? -1 : b.value.length - a.value.length
    );
    const initialValueMatch = Object.entries(optionsMap).filter(([k]) => k === initialValue)?.[0]?.[1]?.value;
    const selected =
        initialValueMatch ??
        ((
            await inquirerPrompt({
                type: 'autocomplete',
                source: async (_, input) =>
                    options.filter((o) => o.name.toLowerCase().includes(input?.toLowerCase() ?? '')),
                initialValue,
                name: 'selected',
                message: `Pick a command`,
                loop: false,
                choices: options,
                pageSize: 15,
            })
        ).selected as RnvTask[]);
    return selected.length === 1 ? selected[0] : await disambiguatingWizard(selected);
};

const disambiguatingWizard = async (tasks: RnvTask[]) => {
    const ctx = getContext();
    if (!ctx.platform) {
        const uniquePlatforms = Array.from(
            new Set(
                tasks
                    .flatMap((t) => t.platforms ?? [])
                    .filter((p) => ctx.buildConfig.defaults?.supportedPlatforms?.includes(p))
            )
        );
        const isPlatformDisambiguating = uniquePlatforms.some((platform) =>
            tasks.some((task) => !isTaskSupportedOnPlatform(task, platform))
        );
        if (isPlatformDisambiguating) {
            ctx.platform = (
                await inquirerPrompt({
                    type: 'autocomplete',
                    source: async (_, input) =>
                        uniquePlatforms.filter((p) => p.toLowerCase().includes(input?.toLowerCase() ?? '')),
                    name: 'selected',
                    message: `Pick a platform`,
                    loop: false,
                    choices: uniquePlatforms,
                    pageSize: 15,
                })
            ).selected;
            // TODO reuse with selectPlatformIfRequired ?
            // await registerPlatformEngine(c.platform);
            // c.runtime.engine = getEngineRunnerByPlatform(c.platform);
            // c.runtime.runtimeExtraProps = c.runtime.engine?.runtimeExtraProps || {};
        }
    }
    const filteredTasks = tasks.filter((task) => isTaskSupportedOnPlatform(task, ctx.platform));
    const options = filteredTasks
        .map((taskInstance) => {
            const isAmbiguous = filteredTasks.filter((t) => t.task === taskInstance.task).length > 1;
            return {
                name: `${taskInstance.task} ${
                    isAmbiguous ? chalk().gray(`(${taskInstance.ownerID}) `) : ''
                }${chalk().gray(taskInstance.description)}`,
                value: taskInstance,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    if (options.length === 1) return options[0].value;
    return (
        await inquirerPrompt({
            type: 'autocomplete',
            source: async (_, input) =>
                options.filter((o) => o.name.toLowerCase().includes(input?.toLowerCase() ?? '')),
            name: 'selected',
            message: `Pick a command`,
            loop: false,
            choices: options,
            pageSize: 15,
        })
    ).selected as RnvTask;
};

export const runInteractiveWizard = async () => {
    const ctx = getContext();
    const selected = await groupingWizard(Object.values(getRegisteredTasks()));
    const taskArr = selected.task.split(' ');
    ctx.command = taskArr[0];
    ctx.subCommand = taskArr[1] || null;
    return initializeTask(selected);
};
