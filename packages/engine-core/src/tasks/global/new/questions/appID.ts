import { getContext } from '@rnv/core';
import type { NewProjectData } from '../types';
import { validateAndAssign } from '../utils';

export const inquiryAppID = async (data: NewProjectData) => {
    const c = getContext();
    const { id, ci } = c.program;
    const validator = (appId: string) =>
        (typeof appId === 'string' && !!appId.match(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/)) ||
        'Please enter a valid app ID (com.test.app)';

    const result = await validateAndAssign(
        {
            value: id,
            validFn: validator,
            name: 'inputAppID',
            defaultVal: () => {
                data.inputAppID = `com.mycompany.${data.inputProjectName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
                return data.inputAppID;
            },
            message: "What's your App ID?",
            warning: `Command contains invalid appId : ${id}`,
        },
        ci
    );

    data.inputAppID = result ? result.replace(/\s+/g, '-').toLowerCase() : data.inputAppID;
};
