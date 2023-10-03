import path from 'path';
import { MonorepoConfig } from './types';
import { writeFileSync } from '@rnv/core';

// const patchDependency = (newVer, depKey, pkgFile, semVer) => {
//     let hasChanges = false;
//     const currVer = pkgFile?.[depKey]?.[v];
//     if (currVer) {
//         const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;

//         if (currVer !== newVer) {
//             console.log('Found linked dependency to update:', v, currVer, newVer);
//             hasChanges = true;
//             pkgFile[depKey][v] = newVer;
//         }
//     }
//     return hasChanges;
// };

export const syncAllDependencies = (config: MonorepoConfig) => {
    const monoConfigArr = Object.values(config);

    monoConfigArr.forEach((pkgConfig) => {
        const { pkgFile, rnvFile } = pkgConfig;

        const semVer = '';
        monoConfigArr.forEach((pkgConfigIn) => {
            const v = pkgConfigIn.pkgName;
            if (pkgFile && v) {
                let hasChanges = false;
                const currVer = pkgFile?.[depKey]?.[v];
                if (currVer) {
                    const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;

                    if (currVer !== newVer) {
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

            const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;

            if (rnvFile) {
                let hasRnvChanges = false;
                const templateVer = rnvFile?.templates?.[v]?.version;
                if (templateVer) {
                    const newVer = `${semVer}${packageConfigs[v].pkgFile?.version}`;
                    if (templateVer !== newVer) {
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
                    FileUtils.writeFileSync(pkgConfig.rnvPath, output, 4, true);
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
                    writeFileSync(plugTempPath, output, 4, true);
                }
            }

            if (templateConfigFile) {
                // leaving it for future packages that would need it
                updateTemplateConfigDeps(templateConfigFile, templateConfigPath, v, newVer);
            }
        });
    });
};

export const overridePackageVersions = (c: any, version: string, versionedPackages: Array<string>) => {
    const v = {
        version: version,
    };
    const pkgFolder = path.join(c.paths.project.dir, 'packages');
    updateJson(c.paths.project.package, v);

    versionedPackages.forEach((pkgName: string) => {
        updateJson(path.join(pkgFolder, pkgName, 'package.json'), v);
    });
};
