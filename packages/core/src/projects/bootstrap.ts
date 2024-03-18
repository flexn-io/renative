import path from 'path';
import { copyFolderContentsRecursiveSync, readObjectSync, writeFileSync, fsExistsSync } from '../system/fs';
import { installPackageDependencies, isYarnInstalled } from './npm';
import { executeAsync } from '../system/exec';
import { logDefault, logInfo } from '../logger';
import { configureTemplateFiles, configureEntryPoint } from '../templates';
import { parseRenativeConfigs } from '../configs';
import { ConfigFileApp, ConfigFileEngine, ConfigFileProject, ConfigFileTemplate } from '../schema/configFiles/types';
import { ConfigName } from '../enums/configName';
import { getContext } from '../context/provider';

export const checkAndBootstrapIfRequired = async () => {
    logDefault('checkAndBootstrapIfRequired');
    const c = getContext();

    const template: string = c.program?.template;
    if (!c.paths.project.configExists && template) {
        await executeAsync(`${isYarnInstalled() ? 'yarn' : 'npm'} add ${template}`, {
            cwd: c.paths.project.dir,
        });

        const templateArr = template.split('@').filter((v) => v !== '');
        const templateDir = template.startsWith('@') ? `@${templateArr[0]}` : templateArr[0];
        const templatePath = path.join(c.paths.project.dir, 'node_modules', templateDir);

        c.paths.template.dir = templatePath;
        c.paths.template.configTemplate = path.join(templatePath, ConfigName.renativeTemplate);

        const templateObj = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);
        const appConfigPath = path.join(c.paths.project.appConfigsDir, c.program.appConfigID, 'renative.json');
        //TODO: Investigate whether we really need to support this: supportedPlatforms inside appconfig
        const appConfigObj = readObjectSync<ConfigFileApp & ConfigFileProject>(appConfigPath);
        const supportedPlatforms = appConfigObj?.defaults?.supportedPlatforms || [];
        //=========
        const engineTemplates = c.files.rnvPlugins.configProjectTemplates?.engineTemplates;
        const rnvPlatforms = c.files.rnvPlugins.configProjectTemplates?.platformTemplates || {};
        const activeEngineKeys: Array<string> = [];

        if (engineTemplates) {
            supportedPlatforms.forEach((supPlat) => {
                Object.keys(engineTemplates).forEach((eKey) => {
                    if (engineTemplates[eKey].id === rnvPlatforms[supPlat]?.engine) {
                        activeEngineKeys.push(eKey);
                    }
                });
            });
        }

        if (!templateObj) {
            return;
        }

        const config = {
            ...templateObj,
        };

        // Clean unused engines
        if (config.engines) {
            Object.keys(config.engines).forEach((k) => {
                if (!activeEngineKeys.includes(k)) {
                    delete config.engines?.[k];
                }
            });
        }

        if (config.templateConfig?.package_json) {
            const pkgJson = config.templateConfig.package_json;
            if (!pkgJson.devDependencies) pkgJson.devDependencies = {};
            if (!pkgJson.dependencies) pkgJson.dependencies = {};
            c.files.project.package = pkgJson;

            const installPromises: Array<Promise<string>> = [];
            Object.keys(pkgJson.devDependencies).forEach((devDepKey) => {
                if (activeEngineKeys.includes(devDepKey)) {
                    installPromises.push(
                        executeAsync(`npx yarn add ${devDepKey}@${pkgJson.devDependencies?.[devDepKey]}`, {
                            cwd: c.paths.project.dir,
                        })
                    );
                }
            });

            if (installPromises.length) {
                await Promise.all(installPromises);

                logInfo('Installed engines DONE');

                activeEngineKeys.forEach((aek) => {
                    const engineConfigPath = path.join(
                        c.paths.project.dir,
                        'node_modules',
                        aek,
                        'renative.engine.json'
                    );
                    const eConfig = readObjectSync<ConfigFileEngine>(engineConfigPath);
                    if (eConfig?.platforms) {
                        supportedPlatforms.forEach((supPlat) => {
                            const engPlatNpm = eConfig.platforms?.[supPlat]?.npm;
                            if (engPlatNpm) {
                                const engPlatDeps = engPlatNpm.dependencies;
                                const deps = pkgJson.dependencies || {};
                                pkgJson.dependencies = deps;
                                if (engPlatDeps) {
                                    Object.keys(engPlatDeps).forEach((engPlatDepKey) => {
                                        if (!deps[engPlatDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatDepKey}`);
                                            deps[engPlatDepKey] = engPlatDeps[engPlatDepKey];
                                        }
                                    });
                                }

                                const engPlatDevDeps = engPlatNpm.devDependencies;
                                if (engPlatDevDeps) {
                                    Object.keys(engPlatDevDeps).forEach((engPlatDevDepKey) => {
                                        pkgJson.devDependencies = pkgJson.devDependencies || {};
                                        if (!pkgJson.devDependencies[engPlatDevDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatDevDepKey}`);
                                            pkgJson.devDependencies[engPlatDevDepKey] =
                                                engPlatDevDeps[engPlatDevDepKey];
                                        }
                                    });
                                }

                                const engPlatOptDeps = engPlatNpm.optionalDependencies;
                                if (engPlatOptDeps) {
                                    Object.keys(engPlatOptDeps).forEach((engPlatOptDepKey) => {
                                        pkgJson.optionalDependencies = pkgJson.optionalDependencies || {};
                                        if (!pkgJson.optionalDependencies[engPlatOptDepKey]) {
                                            logInfo(`Installing active engine dependency ${engPlatOptDepKey}`);
                                            pkgJson.optionalDependencies[engPlatOptDepKey] =
                                                engPlatOptDeps[engPlatOptDepKey];
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }

            writeFileSync(c.paths.project.package, pkgJson);
        }

        delete config.templateConfig;
        writeFileSync(c.paths.project.config, config);

        const appConfigsPath = path.join(templatePath, 'appConfigs');
        if (fsExistsSync(appConfigsPath)) {
            copyFolderContentsRecursiveSync(appConfigsPath, path.join(c.paths.project.appConfigsDir));
        }

        await installPackageDependencies();

        if (c.program.npxMode) {
            return;
        }

        await parseRenativeConfigs();

        await configureTemplateFiles();
        await configureEntryPoint(c.platform);
        // await applyTemplate(c);

        // copyFolderContentsRecursiveSync(templatePath, c.paths.project.dir);
    }
    return true;
};
