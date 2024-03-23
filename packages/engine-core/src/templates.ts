import { chalk, generateOptions, getContext } from '@rnv/core';

export const getTemplateOptions = (isGlobalScope?: boolean) => {
    const c = getContext();
    let defaultProjectTemplates;
    if (isGlobalScope) {
        defaultProjectTemplates = c.files.rnvConfigTemplates.config?.projectTemplates;
    } else {
        defaultProjectTemplates = c.buildConfig.projectTemplates || {};
    }

    return generateOptions(defaultProjectTemplates, false, null, (i, obj, mapping, defaultVal) => {
        const exists = c.buildConfig.templates?.[defaultVal];
        const installed = exists ? chalk().yellow(' (installed)') : '';
        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${installed} \n`;
    });
};
