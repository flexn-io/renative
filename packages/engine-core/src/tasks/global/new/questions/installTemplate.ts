import {
    NpmPackageFile,
    chalk,
    copyFileSync,
    copyFolderRecursiveSync,
    executeAsync,
    fsExistsSync,
    fsLstatSync,
    fsReaddirSync,
    getContext,
    getTemplateOptions,
    inquirerPrompt,
    isYarnInstalled,
    listAndSelectNpmVersion,
    logInfo,
    mkdirSync,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';

export const inquiryInstallTemplate = async (data: NewProjectData) => {
    const customTemplate = { name: 'Custom Template...', value: 'custom' };
    const localTemplate = { name: 'Local Template...', value: 'local' };

    const c = getContext();
    const { templateVersion, projectTemplate } = c.program;

    data.optionTemplates = getTemplateOptions();

    const options = [];
    const values = data.optionTemplates.valuesAsObject;
    if (values) {
        Object.keys(values).forEach((k) => {
            const val = values[k];
            if (val.description || val.path) {
                val.title = `${k} ${chalk().grey(`- ${val.path || val.description}`)}`;
            } else {
                val.title = k;
            }

            val.key = k;
            options.push({ name: val.title, value: val });
        });
    }

    const getTemplateKey = (val: string) => data.optionTemplates.valuesAsArray?.find((v) => v.title === val)?.key;

    // data.optionTemplates.keysAsArray.push(customTemplate);
    options.push(customTemplate);
    options.push(localTemplate);
    let selectedInputTemplate;
    let localTemplatePath: string | undefined;
    if (checkInputValue(projectTemplate)) {
        selectedInputTemplate = projectTemplate;
    } else {
        const { inputTemplate } = await inquirerPrompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaultTemplate,
            choices: options,
        });

        if (inputTemplate.key === customTemplate.value) {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'Type exact name of your template NPM package.',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else if (inputTemplate.key === localTemplate.value) {
            const { inputTemplateLocal } = await inquirerPrompt({
                name: 'inputTemplateLocal',
                type: 'input',
                message: 'Path (absolute):',
            });
            localTemplatePath = inputTemplateLocal;
        } else if (inputTemplate.path) {
            localTemplatePath = inputTemplate.path;
        } else {
            selectedInputTemplate = getTemplateKey(inputTemplate);
        }
    }

    const nmDir = path.join(c.paths.project.dir, 'node_modules');

    if (localTemplatePath) {
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template path ${localTemplatePath} does not exist`);
        }
        // await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add file:${localTemplatePath} --dev`, {
        //     cwd: c.paths.project.dir,
        // });
        const localTemplatePkgPath = path.join(localTemplatePath, 'package.json');
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template package ${localTemplatePkgPath} does not exist`);
        }
        const pkg = readObjectSync<NpmPackageFile>(localTemplatePkgPath);

        mkdirSync(nmDir);
        if (!pkg?.name) {
            return Promise.reject(`Invalid package ${localTemplatePkgPath} missing name field`);
        }
        data.optionTemplates.selectedOption = pkg.name;
        data.optionTemplates.selectedVersion = pkg.version;
        const nmTemplatePath = path.join(nmDir, pkg?.name);

        logInfo(`Found local template: ${data.optionTemplates.selectedOption}@${pkg.version}`);

        // await executeAsync(
        //     `${isYarnInstalled() ? 'yarn' : 'npm'} add ${data.optionTemplates.selectedOption}@${pkg.version} --dev`,
        //     {
        //         cwd: c.paths.project.dir,
        //     }
        // );

        mkdirSync(nmTemplatePath);

        // TODO: read .npmignore and .gitignore and apply those rules
        const ignorePaths = [
            'node_modules',
            'package-lock.json',
            'yarn.lock',
            'platformBuilds',
            'builds',
            'platformAssets',
            'secrets',
            '.rnv',
        ];
        fsReaddirSync(localTemplatePath).forEach((file) => {
            if (!ignorePaths.includes(file) && localTemplatePath) {
                const sourcePath = path.join(localTemplatePath, file);
                const destPath = path.join(nmTemplatePath, file);
                if (fsLstatSync(sourcePath).isDirectory()) {
                    copyFolderRecursiveSync(sourcePath, nmTemplatePath);
                } else {
                    copyFileSync(sourcePath, destPath);
                }
            }
        });
    } else {
        data.optionTemplates.selectedOption = selectedInputTemplate;

        let inputTemplateVersion;
        if (checkInputValue(templateVersion)) {
            inputTemplateVersion = templateVersion;
        } else {
            inputTemplateVersion = await listAndSelectNpmVersion(data.optionTemplates.selectedOption || '');
        }

        data.optionTemplates.selectedVersion = inputTemplateVersion;

        await executeAsync(
            `${isYarnInstalled() ? 'yarn' : 'npm'} add ${selectedInputTemplate}@${inputTemplateVersion} --dev`,
            {
                cwd: c.paths.project.dir,
            }
        );
        // Check if node_modules folder exists
        if (!fsExistsSync(nmDir)) {
            return Promise.reject(
                `${
                    isYarnInstalled() ? 'yarn' : 'npm'
                } add ${selectedInputTemplate}@${inputTemplateVersion} : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
            );
        }
    }

    // Add rnv to package.json
    // await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add rnv@${c.rnvVersion}`, {
    //     cwd: c.paths.project.dir,
    // });
};
