import { getContext } from '@rnv/core';
import type { NewProjectData } from '../types';
import { validateAndAssign } from '../utils';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { id, ci } = c.program;
    const { inputs } = data;
    const validator = (appId: string) =>
        (typeof appId === 'string' && !!appId.match(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/)) ||
        'Please enter a valid app ID (com.test.app)';

    const result = await validateAndAssign(
        {
            value: id,
            validFn: validator,
            name: 'inputAppID',
            defaultVal: () => {
                inputs.appID = `com.mycompany.${inputs.projectName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
                return inputs.appID;
            },
            message: "What's your App ID?",
            warning: `Command contains invalid appId : ${id}`,
        },
        ci
    );

    inputs.appID = result ? result.replace(/\s+/g, '-').toLowerCase() : inputs.appID;
};

export default Question;
