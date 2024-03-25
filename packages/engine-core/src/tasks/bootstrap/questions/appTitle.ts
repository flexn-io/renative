import { getContext } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue, validateAndAssign } from '../questionHelpers';

const Question = async (data: NewProjectData) => {
    const c = getContext();
    const { title, ci } = c.program.opts();
    const { inputs, defaults } = data;
    const validator = (val: string) => checkInputValue(val) || 'Please enter a title';

    const result = await validateAndAssign(
        {
            value: title,
            validFn: validator,
            name: 'inputAppTitle',
            defaultVal: defaults.appTitle,
            message: "What's your project Title?",
            warning: 'Title was not provided',
        },
        ci
    );

    inputs.appTitle = result || defaults.appTitle;
};

export default Question;
