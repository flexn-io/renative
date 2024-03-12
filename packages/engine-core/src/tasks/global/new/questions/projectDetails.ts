import { getContext, inquirerPrompt } from '@rnv/core';
import type { NewProjectData } from '../types';
import { checkInputValue } from '../utils';
import semver from 'semver';

export const inquiryProjectDetails = async ({ data }: { data: NewProjectData }) => {
    const c = getContext();
    const { title, id, appVersion, ci } = c.program;
    const validator = {
        validateAppTitle: (val: string) => checkInputValue(val) || 'Please enter a title',
        validateAppID: (appId: string) =>
            (typeof appId === 'string' && !!appId.match(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/)) ||
            'Please enter a valid appID (com.test.app)',
        validateAppVersion: (version: string) =>
            !!semver.valid(semver.coerce(version)) ||
            'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)',
    };

    const inputValues = [
        {
            value: title,
            validFn: validator.validateAppTitle,
            name: 'inputAppTitle',
            defaultVal: data.defaultAppTitle,
            message: "What's your project Title?",
            warning: 'Title was not provided',
        },
        {
            value: id,
            validFn: validator.validateAppID,
            name: 'inputAppID',
            defaultVal: () => {
                data.appID = `com.mycompany.${data.inputProjectName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
                return data.appID;
            },
            message: "What's your App ID?",
            warning: `Command contains invalid appId : ${id}`,
        },
        {
            value: appVersion,
            validFn: validator.validateAppVersion,
            name: 'inputVersion',
            defaultVal: data.defaultVersion,
            message: "What's your Version?",
            warning: `Command contains invalid appVersion. Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.`,
        },
    ];

    const validateAndAssign = async ({
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
    }): Promise<string> => {
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
                warningMessage: ci && warningMessage && warning,
            });
            return answer[name];
        }
    };
    const inputsResult = [];
    for (const value of inputValues) {
        const res = await validateAndAssign(value);
        inputsResult.push(res);
    }

    data.packageName = data?.appTitle?.replace(/\s+/g, '-').toLowerCase();

    const [inputAppTitle, inputAppID, inputVersion] = inputsResult;
    data.inputAppTitle = inputAppTitle;
    data.inputAppID = inputAppID;
    data.inputVersion = inputVersion;
};
