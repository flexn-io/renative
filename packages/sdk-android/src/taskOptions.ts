import { createTaskOptionsMap } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        key: 'skip-target-check',
        altKey: 'skipTargetCheck',
        description: 'Skip Android target check, just display the raw adb devices to choose from',
    },
    {
        key: 'filter',
        shortcut: 'f',
        isValueType: true,
        isRequired: true,
        description: 'Filter value',
    },
    {
        key: 'reset-adb',
        altKey: 'resetAdb',
        description: 'Forces to reset android adb',
    },
]);
