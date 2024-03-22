import {
    NpmPackageFile,
    RnvFileName,
    RnvFolderName,
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
    inquirerSeparator,
    isYarnInstalled,
    listAndSelectNpmVersion,
    logInfo,
    mkdirSync,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData } from '../types';
import path from 'path';
import { checkInputValue } from '../utils';
import { saveProgressIntoProjectConfig } from '../projectGenerator';
import { merge } from 'lodash';

export const inquiryInstallTemplate = async (data: NewProjectData) => {
    const customTemplate = { name: 'Custom Template (npm)...', value: { key: 'custom' } };
    const localTemplate = { name: 'Local Template...', value: { key: 'local' } };
    const noTemplate = { name: 'No Template (blank project)', value: { key: 'none' } };

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

    // data.optionTemplates.keysAsArray.push(customTemplate);
    options.push(inquirerSeparator('Advanced:----------------'));
    options.push(customTemplate);
    options.push(localTemplate);
    options.push(noTemplate);
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
            loop: false,
            choices: options,
        });

        if (inputTemplate.key === customTemplate.value.key) {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'NPM package name:',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else if (inputTemplate.key === localTemplate.value.key) {
            const { inputTemplateLocal } = await inquirerPrompt({
                name: 'inputTemplateLocal',
                type: 'input',
                message: 'Path (absolute):',
            });
            localTemplatePath = inputTemplateLocal;
        } else if (inputTemplate.key === noTemplate.value.key) {
            // TODO: add support for no templates
            return Promise.reject('No templates NOT SUPPORTED YET');
        } else if (inputTemplate.path) {
            localTemplatePath = inputTemplate.path;
        } else {
            selectedInputTemplate = inputTemplate.key;
        }
    }

    const nmDir = path.join(c.paths.project.dir, RnvFolderName.dotRnv, RnvFolderName.npmCache);

    if (localTemplatePath) {
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template path ${localTemplatePath} does not exist`);
        }
        // await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add file:${localTemplatePath} --dev`, {
        //     cwd: c.paths.project.dir,
        // });
        const localTemplatePkgPath = path.join(localTemplatePath, RnvFileName.package);
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

        mkdirSync(nmTemplatePath);

        // TODO: read .npmignore and .gitignore and apply those rules
        const ignorePaths = [
            RnvFolderName.nodeModules,
            'package-lock.json',
            'yarn.lock',
            RnvFolderName.platformBuilds,
            'builds',
            RnvFolderName.platformAssets,
            RnvFolderName.secrets,
            RnvFolderName.dotRnv,
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

        // NOTE: this is a workaround for npm/yarn bug where manually added packages are overriden on next install
        const filePath = `file:${RnvFolderName.dotRnv}/${RnvFolderName.npmCache}/${data.optionTemplates.selectedOption}`;
        data.files.project.packageJson = merge(data.files.project.packageJson, {
            devDependencies: {
                [data.optionTemplates.selectedOption]: filePath,
            },
        });
        data.files.project.renativeConfig = merge(data.files.project.renativeConfig, {
            templates: {
                [data.optionTemplates.selectedOption]: {
                    version: filePath,
                },
            },
        });

        await saveProgressIntoProjectConfig(data);

        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm install'}`, {
            cwd: c.paths.project.dir,
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
