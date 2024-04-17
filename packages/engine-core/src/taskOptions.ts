import { createTaskOptionsMap } from '@rnv/core';

export const TaskOptions = createTaskOptionsMap([
    {
        key: 'key',
        shortcut: 'k',
        isValueType: true,
        isRequired: true,
        description: 'Pass the key/password',
    },
]);
