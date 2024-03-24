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
    inquirerPrompt,
    inquirerSeparator,
    isYarnInstalled,
    listAndSelectNpmVersion,
    logInfo,
    mkdirSync,
    readObjectSync,
} from '@rnv/core';
import type { NewProjectData, TemplateOption } from '../types';
import path from 'path';
import { checkInputValue } from '../questionHelpers';
import { saveProgressIntoProjectConfig } from '../questionHelpers';
import { merge } from 'lodash';

const Question = async (data: NewProjectData) => {
    const { inputs, defaults, files } = data;

    const customTemplate: TemplateOption = { name: 'Custom Template (npm)...', value: { type: 'custom' } };
    const localTemplate: TemplateOption = { name: 'Local Template...', value: { type: 'local' } };
    const noTemplate: TemplateOption = { name: 'No Template (blank project)', value: { type: 'none' } };

    const c = getContext();
    const { templateVersion, projectTemplate } = c.program;

    const projectTemplates = c.buildConfig.projectTemplates || {}; // c.files.rnvConfigTemplates.config?.projectTemplates || {};

    const options: TemplateOption[] = [];
    let defaultOverride;
    Object.keys(projectTemplates).forEach((k) => {
        const value = projectTemplates[k];
        const option: TemplateOption = {
            name: `${k} ${chalk().grey(`- ${value.localPath || value.description}`)}`,
            value: { ...value, type: 'existing' },
        };
        options.push(option);
        if (value.localPath) {
            defaultOverride = option.value;
        }
    });

    options.push(inquirerSeparator('Advanced:----------------'));
    options.push(customTemplate);
    options.push(localTemplate);
    options.push(noTemplate);
    let localTemplatePath: string | undefined;

    inputs.tepmplate = {};

    if (checkInputValue(projectTemplate)) {
        inputs.tepmplate.packageName = projectTemplate;
    } else {
        const iRes = await inquirerPrompt({
            name: 'inputTemplate',
            type: 'list',
            message: 'What template to use?',
            default: defaultOverride || defaults.templateName,
            loop: false,
            choices: options,
        });
        const result: TemplateOption['value'] = iRes.inputTemplate;
        inputs.tepmplate.type = result.type;

        if (result.type === 'custom') {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'NPM package name:',
            });
            inputs.tepmplate.packageName = inputTemplateCustom;
        } else if (result.type === 'local') {
            const { inputTemplateLocal } = await inquirerPrompt({
                name: 'inputTemplateLocal',
                type: 'input',
                message: 'Path (absolute):',
            });
            localTemplatePath = inputTemplateLocal;
        } else if (result.type === 'none') {
            // TODO: add support for no templates
            return Promise.reject('No templates NOT SUPPORTED YET');
        } else if (result.type === 'existing') {
            if (result.localPath) {
                localTemplatePath = result.localPath;
            } else {
                inputs.tepmplate.packageName = result.packageName;
            }
        }
    }

    const nmDir = path.join(c.paths.project.dir, RnvFolderName.dotRnv, RnvFolderName.npmCache);

    if (localTemplatePath) {
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template path ${localTemplatePath} does not exist`);
        }
        const localTemplatePkgPath = path.join(localTemplatePath, RnvFileName.package);
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template package ${localTemplatePkgPath} does not exist`);
        }
        const pkg = readObjectSync<NpmPackageFile>(localTemplatePkgPath);

        mkdirSync(nmDir);
        if (!pkg?.name) {
            return Promise.reject(`Invalid package ${localTemplatePkgPath} missing name field`);
        }

        inputs.tepmplate.packageName = pkg.name;
        inputs.tepmplate.version = pkg.version;
        inputs.tepmplate.localPath = localTemplatePath;

        if (!inputs.tepmplate) return;

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

        if (!inputs.tepmplate.packageName) {
            return;
        }

        // NOTE: this is a workaround for npm/yarn bug where manually added packages are overriden on next install
        const filePath = `file:${RnvFolderName.dotRnv}/${RnvFolderName.npmCache}/${inputs.tepmplate.packageName}`;
        files.project.packageJson = merge(files.project.packageJson, {
            devDependencies: {
                [inputs.tepmplate?.packageName]: filePath,
            },
        });
        files.project.renativeConfig = merge(files.project.renativeConfig, {
            templates: {
                [inputs.tepmplate.packageName]: {
                    version: filePath,
                },
            },
        });

        await saveProgressIntoProjectConfig(data);

        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm install'}`, {
            cwd: c.paths.project.dir,
        });
    } else {
        if (checkInputValue(templateVersion)) {
            inputs.tepmplate.version = templateVersion;
        } else {
            inputs.tepmplate.version = await listAndSelectNpmVersion(inputs.tepmplate.packageName || '');
        }

        await executeAsync(
            `${isYarnInstalled() ? 'yarn' : 'npm'} add ${inputs.tepmplate.packageName}@${
                inputs.tepmplate.version
            } --dev`,
            {
                cwd: c.paths.project.dir,
            }
        );
        // Check if node_modules folder exists
        if (!fsExistsSync(nmDir)) {
            return Promise.reject(
                `${isYarnInstalled() ? 'yarn' : 'npm'} add ${inputs.tepmplate.packageName}@${
                    inputs.tepmplate.version
                } : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
            );
        }
    }
};

export default Question;