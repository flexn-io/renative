import {
    ConfigFileTemplates,
    RnvFileName,
    executeAsync,
    fsExistsSync,
    getContext,
    isYarnInstalled,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';

const Question = async (data: NewProjectData): Promise<void> => {
    const c = getContext();
    const { files } = data;

    const cnfTemplatesName = '@rnv/config-templates';
    const cnfDepVer =
        files.template.renativeTemplateConfig?.projectTemplate?.templateConfig?.package_json?.devDependencies?.[
            cnfTemplatesName
        ];
    if (cnfDepVer) {
        // If we find the config-templates package in the devDependencies of the project's package.json,
        // we will use it as source for engines
        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${cnfTemplatesName}@${cnfDepVer} --dev`, {
            cwd: c.paths.project.dir,
        });
        const ctCnfPath = path.join(c.paths.project.nodeModulesDir, cnfTemplatesName, RnvFileName.renativeTemplates);
        if (fsExistsSync(ctCnfPath)) {
            files.configTemplates.config = readObjectSync<ConfigFileTemplates>(ctCnfPath) || undefined;
        }
    }

    if (!files.configTemplates.config) {
        // As fallback we'll use current rnv executor's config-templates
        files.configTemplates.config = c.files.rnvConfigTemplates.config;
    }
};

export default Question;
