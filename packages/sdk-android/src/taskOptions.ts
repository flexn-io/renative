import { createTaskOptionsMap } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        // key: 'skip-target-check',
        key: 'skipTargetCheck',
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
        // key: 'reset-adb',
        key: 'resetAdb',
        description: 'Forces to reset android adb',
    },
]);
