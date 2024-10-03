import path from 'path';
import merge from 'deepmerge';
import { fsExistsSync, fsWriteFileSync, loadFile, readObjectSync } from '../system/fs';
import { logDefault, logWarning, logInfo } from '../logger';
import { RnvFileName } from '../enums/fileName';
import { getContext } from '../context/provider';
import { type NpmPackageFile } from '../configs/types';
import { getUpdatedConfigFile, writeRenativeConfigFile } from '../configs/utils';
import type { ConfigFileTemplate } from '../schema/types';

export const updatePackage = (override: Partial<NpmPackageFile>) => {
    const c = getContext();
    const newPackage: NpmPackageFile = merge(c.files.project.package, override);
    writeRenativeConfigFile(c.paths.project.package, newPackage);
    c.files.project.package = newPackage;
    c._requiresNpmInstall = true;
};

const packageJsonIsValid = () => {
    const c = getContext();
    if (!fsExistsSync(c.paths.project.package)) return false;
    const pkg = readObjectSync(c.paths.project.package);
    if (!pkg) return false;
    // yarn add creates a package.json with only dependencies, that is not valid
    if (Object.keys(pkg).length === 1 && Object.keys(pkg)[0] === 'dependencies') return false;
    return true;
};

export const checkAndCreateProjectPackage = async () => {
    logDefault('checkAndCreateProjectPackage');

    const c = getContext();

    if (!packageJsonIsValid()) {
        logInfo(`Your ${c.paths.project.package} is missing. CREATING...DONE`);

        const packageName = c.files.project.config?.project?.projectName || c.paths.project.dir.split('/').pop();
        const packageVersion = c.files.project.config?.project?.projectVersion || '0.1.0';
        const templateName = c.files.project.config?.template?.templateConfig?.name;
        if (!templateName) {
            logWarning('You are missing currentTemplate in your renative config file');
        }
        const rnvVersion = c.files.rnvCore.package.version;

        if (templateName) {
            c.paths.template.configTemplate = path.join(
                c.paths.project.dir,
                'node_modules',
                templateName,
                RnvFileName.renativeTemplate
            );
        }

        const originalTemplateObj = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);
        if (originalTemplateObj) {
            const templateObj = await getUpdatedConfigFile(originalTemplateObj);
            const pkgJson = templateObj?.template?.templateConfig?.package_json || {};
            pkgJson.name = packageName;
            pkgJson.version = packageVersion;
            pkgJson.dependencies = pkgJson.dependencies || {};
            // No longer good option to assume same version
            // pkgJson.dependencies.renative = rnvVersion;
            pkgJson.devDependencies = pkgJson.devDependencies || {};
            if (rnvVersion) {
                pkgJson.devDependencies.rnv = rnvVersion;
            }

            if (templateName) {
                pkgJson.devDependencies[templateName] =
                    c.files.project.config?.template?.templateConfig?.version || 'latest';
            }
            const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);
            fsWriteFileSync(c.paths.project.package, pkgJsonStringClean);
        }
    }

    await loadFile(c.files.project, c.paths.project, 'package');

    return true;
};
