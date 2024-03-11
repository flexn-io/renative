import path from 'path';
import { fsExistsSync, fsWriteFileSync, loadFile, readObjectSync } from '../system/fs';
import { logDefault, logWarning, logInfo } from '../logger';
import { RnvContext } from '../context/types';
import { ConfigFileTemplate } from '../schema/configFiles/types';
import { ConfigName } from '../enums/configName';
import { getContext } from '../context/provider';

const packageJsonIsValid = (c: RnvContext) => {
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

    if (!packageJsonIsValid(c)) {
        logInfo(`Your ${c.paths.project.package} is missing. CREATING...DONE`);

        const packageName = c.files.project.config?.projectName || c.paths.project.dir.split('/').pop();
        const packageVersion = c.files.project.config?.projectVersion || '0.1.0';
        const templateName = c.files.project.config?.currentTemplate;
        if (!templateName) {
            logWarning('You are missing currentTemplate in your renative.json');
        }
        const rnvVersion = c.files.rnv.package.version;

        if (templateName) {
            c.paths.template.configTemplate = path.join(
                c.paths.project.dir,
                'node_modules',
                templateName,
                ConfigName.renativeTemplate
            );
        }

        const templateObj = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);

        const pkgJson = templateObj?.templateConfig?.package_json || {};
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
                c.files.project.config?.templates[templateName]?.version || 'latest';
        }
        const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);
        fsWriteFileSync(c.paths.project.package, pkgJsonStringClean);
    }

    loadFile(c.files.project, c.paths.project, 'package');

    return true;
};
