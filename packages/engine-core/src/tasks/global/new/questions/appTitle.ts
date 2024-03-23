import { getContext } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue, validateAndAssign } from '../utils';

export const inquiryAppTitle = async (data: NewProjectData) => {
    const c = getContext();
    const { title, ci } = c.program;
    const validator = (val: string) => checkInputValue(val) || 'Please enter a title';

    const result = await validateAndAssign(
        {
            value: title,
            validFn: validator,
            name: 'inputAppTitle',
            defaultVal: data.defaults.appTitle,
            message: "What's your project Title?",
            warning: 'Title was not provided',
        },
        ci
    );

    data.inputAppTitle = result;
    data.appTitle = data.inputAppTitle || data.defaults.appTitle;
};
