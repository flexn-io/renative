import { getContext, inquirerPrompt, populateContextPaths } from '@rnv/core';

export const processChdirToProject = async () => {
    const c = getContext();
    // In order to execute rnv from new origin (sub folder we need to reset paths to new cwd())
    process.chdir(c.paths.project.dir);
    populateContextPaths(c, c.paths.rnv.dir);
    return true;
};

export const checkInputValue = (value: string | boolean): boolean => {
    return value && typeof value === 'string' && value !== '' ? true : false;
};

export const validateAndAssign = async (
    {
        value,
        validFn,
        name,
        defaultVal,
        message,
        warning,
    }: {
        value: string;
        validFn: (value: string) => true | string;
        name: string;
        defaultVal: (() => string) | string | undefined;
        message: string;
        warning: string;
    },
    ci: boolean
): Promise<string> => {
    const isValid = validFn(value);
    if (value && isValid === true) {
        return value;
    } else {
        const warningMessage = typeof isValid === 'string';
        const answer = await inquirerPrompt({
            name,
            type: 'input',
            default: defaultVal,
            validate: validFn,
            message,
            warningMessage: ci && warningMessage ? warning : undefined,
        });
        return answer[name];
    }
};
