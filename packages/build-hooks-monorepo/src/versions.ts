import path from 'path';
import fs from 'fs';
import { Doctor, FileUtils, Exec } from 'rnv';
import { parsePackages } from './parsePackages';

const { readObjectSync, writeFileSync } = FileUtils;

const updateDeps = (
    pkgConfig: any,
    depKey: string,
    packageNamesAll: Array<string>,
    packageConfigs: any,
    semVer = ''
) => {
    const { pkgFile } = pkgConfig;

    packageNamesAll.forEach((v) => {
        if (pkgFile) {
            let hasChanges = false;
            const currVer = pkgFile?.[depKey]?.[v];
            if (currVer) {
                const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;

                if (currVer !== newVer) {
                    //eslint-disable-next-line no-console
                    console.log('Found linked dependency to update:', v, currVer, newVer);
                    hasChanges = true;
                    pkgFile[depKey][v] = newVer;
                }
            }
            if (hasChanges) {
                const output = Doctor.fixPackageObject(pkgFile);
                FileUtils.writeFileSync(pkgConfig.pkgPath, output, 4, true);
            }
        }
    });
};

const updateRnvDeps = (pkgConfig: any, packageNamesAll: Array<string>, packageConfigs: any, semVer = '') => {
    const {
        rnvFile,
        pkgFile,
        metaFile,
        rnvPath,
        metaPath,
        plugTempFile,
        plugTempPath,
        templateConfigFile,
        templateConfigPath,
    } = pkgConfig;

    packageNamesAll.forEach((v) => {
        const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;
        if (rnvFile) {
            let hasRnvChanges = false;
            const templateVer = rnvFile?.templates?.[v]?.version;

            if (templateVer) {
                if (templateVer !== newVer) {
                    //eslint-disable-next-line no-console
                    console.log('Found linked plugin dependency to update:', v, templateVer, newVer);
                    hasRnvChanges = true;
                    rnvFile.templates[v].version = newVer;
                }
            }

            const rnvPlugin = rnvFile.plugins[v];
            if (rnvPlugin?.version) {
                rnvPlugin.version = `${newVer}`;
                hasRnvChanges = true;
            } else if (rnvPlugin) {
                if (!rnvPlugin.startsWith('source')) {
                    rnvFile.plugins[v] = newVer;
                    hasRnvChanges = true;
                }
            }

            if (hasRnvChanges) {
                const output = Doctor.fixPackageObject(rnvFile);
                FileUtils.writeFileSync(rnvPath, output, 4, true);
            }
        }

        if (metaFile) {
            metaFile.version = pkgFile.version;
            const output = Doctor.fixPackageObject(metaFile);
            writeFileSync(metaPath, output);
        }

        if (plugTempFile) {
            let hasChanges = false;
            const rnvPlugin = plugTempFile.pluginTemplates[v];
            if (rnvPlugin?.version) {
                rnvPlugin.version = `${newVer}`;
                hasChanges = true;
            } else if (rnvPlugin) {
                rnvFile.plugins[v] = newVer;
                hasChanges = true;
            }

            if (hasChanges) {
                const output = Doctor.fixPackageObject(plugTempFile);
                FileUtils.writeFileSync(plugTempPath, output, 4, true);
            }
        }

        if (templateConfigFile) {
            // leaving it for future packages that would need it
            updateTemplateConfigDeps(templateConfigFile, templateConfigPath, v, newVer);
        }
    });
};

const updateTemplateConfigDeps = (
    templateConfigFile: any,
    templateConfigPath: string,
    pkg: string,
    version: string
) => {
    let hasTemplateChanges = false;
    const packageTemplateDep = templateConfigFile.templateConfig?.packageTemplate?.dependencies;
    const packageTemplateDevDep = templateConfigFile.templateConfig?.packageTemplate?.devDependencies;

    if (packageTemplateDep?.[pkg] && packageTemplateDep[pkg] !== version) {
        packageTemplateDep[pkg] = version;
        hasTemplateChanges = true;
    }
    if (packageTemplateDevDep?.[pkg] && packageTemplateDevDep[pkg] !== version) {
        packageTemplateDevDep[pkg] = version;
        hasTemplateChanges = true;
    }

    if (hasTemplateChanges) {
        const output = Doctor.fixPackageObject(templateConfigFile);
        FileUtils.writeFileSync(templateConfigPath, output, 4, true);
    }
};

const updateExternalDeps = (pkgConfig: any, externalDependenciesVersions: Record<string, string>) => {
    const { templateConfigFile, templateConfigPath } = pkgConfig;
    if (templateConfigFile) {
        Object.keys(externalDependenciesVersions).forEach((v) => {
            updateTemplateConfigDeps(templateConfigFile, templateConfigPath, v, externalDependenciesVersions[v]);
        });
    }
};

export const updateVersions = async (c: any) => {
    const pkgDirPath = path.join(c.paths.project.dir, 'packages');
    const dirs = fs.readdirSync(pkgDirPath);

    const externalDependenciesVersions: any = {};

    const pkgConfig = parsePackages(c.paths.project.dir);

    dirs.forEach((dir) => {
        parsePackages(path.join(pkgDirPath, dir));
    });

    packageNamesAll.forEach((pkgName: string) => {
        const pkgConfig = packageConfigs[pkgName];
        updateDeps(pkgConfig, 'dependencies', packageNamesAll, packageConfigs);
        updateDeps(pkgConfig, 'devDependencies', packageNamesAll, packageConfigs);
        updateDeps(pkgConfig, 'optionalDependencies', packageNamesAll, packageConfigs);
        updateDeps(pkgConfig, 'peerDependencies', packageNamesAll, packageConfigs, '^');
        updateRnvDeps(pkgConfig, packageNamesAll, packageConfigs);
        updateExternalDeps(pkgConfig, externalDependenciesVersions);
    });
};
