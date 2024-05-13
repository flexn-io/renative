import {
    ConfigFileProject,
    ConfigFileTemplate,
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
import { getContext } from '../../../getContext';

const mergeIntoProjectConfig = (data: NewProjectData, updateObj: ConfigFileProject) => {
    const { files } = data;
    files.project.renativeConfig = merge(files.project.renativeConfig, updateObj);
};

const mergeIntoProjectPackage = (data: NewProjectData, updateObj: NpmPackageFile) => {
    const { files } = data;
    files.project.packageJson = merge(files.project.packageJson, updateObj);
};

const Question = async (data: NewProjectData) => {
    const { inputs, defaults, files } = data;
    const customTemplate: TemplateOption = { name: 'Custom Template (npm)...', value: { type: 'custom' } };
    const localTemplate: TemplateOption = { name: 'Local Template...', value: { type: 'local' } };
    const noTemplate: TemplateOption = { name: 'No Template (blank project)', value: { type: 'none' } };

    const c = getContext();
    const { templateVersion, projectTemplate } = c.program.opts();

    const projectTemplates = c.buildConfig.projectTemplates || {}; // c.files.rnvConfigTemplates.config?.projectTemplates || {};

    const options: TemplateOption[] = [];
    let defaultOverride;
    Object.keys(projectTemplates).forEach((k) => {
        const value = projectTemplates[k];
        const option: TemplateOption = {
            name: `${k} ${chalk().grey(`- ${value.localPath || value.description}`)}`,
            value: { ...value, type: 'existing', packageName: value?.packageName || k },
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

    inputs.template = {};

    if (checkInputValue(projectTemplate)) {
        inputs.template.packageName = projectTemplate;
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
        inputs.template.type = result.type;

        if (result.type === 'custom') {
            const { inputTemplateCustom } = await inquirerPrompt({
                name: 'inputTemplateCustom',
                type: 'input',
                message: 'NPM package name:',
            });
            inputs.template.packageName = inputTemplateCustom;
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
                inputs.template.packageName = result.packageName;
            }
        }
    }

    const npmCacheDir = path.join(c.paths.project.dir, RnvFolderName.dotRnv, RnvFolderName.npmCache);

    if (localTemplatePath) {
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template path ${localTemplatePath} does not exist`);
        }
        const templateConfigPath = path.join(localTemplatePath, RnvFileName.renativeTemplate);
        if (!fsExistsSync(templateConfigPath)) {
            return Promise.reject(`Renative template config path ${templateConfigPath} does not exist. Are you sure the path provided is a correct template folder?`);
        }
        const localTemplatePkgPath = path.join(localTemplatePath, RnvFileName.package);
        if (!fsExistsSync(localTemplatePath)) {
            return Promise.reject(`Local template package ${localTemplatePkgPath} does not exist`);
        }
        const pkg = readObjectSync<NpmPackageFile>(localTemplatePkgPath);

        mkdirSync(npmCacheDir);
        if (!pkg?.name) {
            return Promise.reject(`Invalid package ${localTemplatePkgPath} missing name field`);
        }

        inputs.template.packageName = pkg.name;
        inputs.template.version = pkg.version;
        inputs.template.localPath = localTemplatePath;

        if (!inputs.template) return;

        const nmTemplatePath = path.join(npmCacheDir, pkg?.name);

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

        if (!inputs.template.packageName) {
            return;
        }
        // NOTE: this is a workaround for npm/yarn bug where manually added packages are overriden on next install
        const filePath = `file:${RnvFolderName.dotRnv}/${RnvFolderName.npmCache}/${inputs.template.packageName}`;
        mergeIntoProjectPackage(data, {
            devDependencies: {
                [inputs.template?.packageName]: filePath,
            },
        });
        mergeIntoProjectConfig(data, {
            templateConfig: {
                name: inputs.template.packageName,
                version: filePath,
            },
        });
        await saveProgressIntoProjectConfig(data);
        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm install'}`, {
            cwd: c.paths.project.dir,
        });
    } else {
        if (checkInputValue(templateVersion)) {
            inputs.template.version = templateVersion;
        } else if (inputs.template.packageName) {
            inputs.template.version = await listAndSelectNpmVersion(inputs.template.packageName);
        } else {
            return Promise.reject('Template package name is required');
        }

        await executeAsync(
            `${isYarnInstalled() ? 'yarn' : 'npm'} add ${inputs.template.packageName}@${inputs.template.version} --dev`,
            {
                cwd: c.paths.project.dir,
            }
        );
        if (inputs.template.packageName && inputs.template.version) {
            // We update our in-memory package.json with the new template
            mergeIntoProjectPackage(data, {
                devDependencies: {
                    [inputs.template.packageName]: inputs.template.version,
                },
            });
        }
        mergeIntoProjectConfig(data, {
            templateConfig: {
                name: inputs.template.packageName,
                version: inputs.template.version,
            },
        });
        await saveProgressIntoProjectConfig(data);
        // Check if node_modules folder exists
        const nmDir = path.join(c.paths.project.dir, 'node_modules');
        if (!fsExistsSync(nmDir)) {
            return Promise.reject(
                `${isYarnInstalled() ? 'yarn' : 'npm'} add ${inputs.template.packageName}@${
                    inputs.template.version
                } : FAILED. this could happen if you have package.json accidentally created somewhere in parent directory`
            );
        }
    }

    if (!inputs.template.packageName) {
        return;
    }

    const templateDir = path.join(c.paths.project.dir, 'node_modules', inputs.template.packageName);

    const renativeTemplateConfig =
        readObjectSync<ConfigFileTemplate>(path.join(templateDir, RnvFileName.renativeTemplate)) || {};
    if (renativeTemplateConfig) {
        files.template.renativeTemplateConfig = renativeTemplateConfig;
    }

    const renativeConfig = readObjectSync<ConfigFileProject>(path.join(templateDir, RnvFileName.renative));
    if (renativeConfig) {
        files.template.renativeConfig = renativeConfig;
    }
};

export default Question;
