import { getContext } from '@rnv/core';
import type { NewProjectData } from '../types';
import { validateAndAssign } from '../questionHelpers';
import semver from 'semver';
import { merge } from 'lodash';

const Question = async (data: NewProjectData) => {
    const c = getContext();
    const { appVersion, ci } = c.program;

    const validator = (version: string) =>
        !!semver.valid(semver.coerce(version)) || 'Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.)';

    const result = await validateAndAssign(
        {
            value: appVersion,
            validFn: validator,
            name: 'inputVersion',
            defaultVal: data.defaults.appVersion,
            message: "What's your project version?",
            warning: `Command contains invalid appVersion. Please enter a valid semver version (1.0.0, 42.6.7.9.3-alpha, etc.`,
        },
        ci
    );

    data.inputs.appVersion = result || data.defaults.appVersion;
    data.files.project.packageJson = merge(data.files.project.packageJson, { version: data.inputs.appVersion });
};

export default Question;
