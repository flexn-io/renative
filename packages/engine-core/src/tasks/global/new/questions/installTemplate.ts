import {
    ConfigFileBuildConfig,
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

type TemplateOption = {
    name: string;
    value: {
        key: 'existing' | 'custom' | 'local' | 'none';
    } & Required<ConfigFileBuildConfig>['projectTemplates'][string];
};

export const inquiryInstallTemplate = async (data: NewProjectData) => {
    const customTemplate: TemplateOption = { name: 'Custom Template (npm)...', value: { key: 'custom' } };
    const localTemplate: TemplateOption = { name: 'Local Template...', value: { key: 'local' } };
    const noTemplate: TemplateOption = { name: 'No Template (blank project)', value: { key: 'none' } };

    const c = getContext();
    const { templateVersion, projectTemplate } = c.program;

    const projectTemplates = c.buildConfig.projectTemplates || {}; // c.files.rnvConfigTemplates.config?.projectTemplates || {};

    const options: TemplateOption[] = [];
    Object.keys(projectTemplates).forEach((k) => {
        const value = projectTemplates[k];
        options.push({
            name: `${k} ${chalk().grey(`- ${value.localPath || value.description}`)}`,
            value: { ...value, key: 'existing' },
        });
    });

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
        const iRes = await inquirerPrompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: data.defaults.templateName,
            loop: false,
            choices: options,
        });
        const result: TemplateOption['value'] = iRes.inputTemplate;

        if (result.key === 'custom') {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'NPM package name:',
            });
            selectedInputTemplate = inputTemplateCustom;
        } else if (result.key === 'local') {
            const { inputTemplateLocal } = await inquirerPrompt({
                name: 'inputTemplateLocal',
                type: 'input',
                message: 'Path (absolute):',
            });
            localTemplatePath = inputTemplateLocal;
        } else if (result.key === 'none') {
            // TODO: add support for no templates
            return Promise.reject('No templates NOT SUPPORTED YET');
        } else if (result.key === 'existing') {
            if (result.localPath) {
                localTemplatePath = result.localPath;
            } else {
                selectedInputTemplate = result.packageName;
            }
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

        data.inputs.tepmplate.name = pkg.name;
        data.inputs.tepmplate.version = pkg.version;
        data.inputs.tepmplate.path = localTemplatePath;
        const nmTemplatePath = path.join(nmDir, pkg?.name);

        logInfo(`Found local template: ${pkg.name}@${pkg.version}`);

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
        const filePath = `file:${RnvFolderName.dotRnv}/${RnvFolderName.npmCache}/${data.inputs.tepmplate.name}`;
        data.files.project.packageJson = merge(data.files.project.packageJson, {
            devDependencies: {
                [data.inputs.tepmplate.name]: filePath,
            },
        });
        data.files.project.renativeConfig = merge(data.files.project.renativeConfig, {
            templates: {
                [data.inputs.tepmplate.name]: {
                    version: filePath,
                },
            },
        });

        await saveProgressIntoProjectConfig(data);

        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm install'}`, {
            cwd: c.paths.project.dir,
        });
    } else {
        data.inputs.tepmplate.name = selectedInputTemplate;

        let inputTemplateVersion;
        if (checkInputValue(templateVersion)) {
            inputTemplateVersion = templateVersion;
        } else {
            inputTemplateVersion = await listAndSelectNpmVersion(data.inputs.tepmplate.name || '');
        }

        data.inputs.tepmplate.version = inputTemplateVersion;

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
