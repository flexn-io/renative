import { generateOptions } from '../api';
import { getContext } from '../context/provider';
import { chalk, logInfo, logDefault, logWarning } from '../logger';
import { doResolve } from '../system/resolve';
import { writeRenativeConfigFile } from './utils';

export const checkIfTemplateConfigured = async () => {
    logDefault('checkIfTemplateConfigured');
    const c = getContext();
    if (c.program.skipDependencyCheck || c.buildConfig?.isTemplate) return true;
    if (!c.buildConfig.templates) {
        logWarning(
            `Your ${chalk().bold(c.paths.project.config)} does not contain ${chalk().bold(
                'templates'
            )} object. ReNative will skip template generation`
        );
        return false;
    }
    Object.keys(c.buildConfig.templates).forEach((k) => {
        const obj = c.buildConfig.templates?.[k] || { version: 'unknown template version' };
        if (!doResolve(k, false, { basedir: '../' }) && !doResolve(k, false)) {
            logInfo(
                `Your ${chalk().bold(`${k}@${obj.version}`)} template is missing in renative.json. CONFIGURING...DONE`
            );
            c._requiresNpmInstall = true;
            c.runtime.requiresBootstrap = true;
        }
        if (c.files.project.package.devDependencies) {
            if (c.files.project.package.devDependencies[k] !== obj.version) {
                logInfo(`Updating template ${chalk().bold(`${k}`)} => ${chalk().green(obj.version)}. ...DONE`);
            }

            c.files.project.package.devDependencies[k] = obj.version;
        }
    });

    writeRenativeConfigFile(c.paths.project.package, c.files.project.package);

    return true;
};

export const getTemplateOptions = (isGlobalScope?: boolean) => {
    const c = getContext();
    let defaultProjectTemplates;
    if (isGlobalScope) {
        defaultProjectTemplates = c.files.rnvPlugins.configProjectTemplates?.projectTemplates;
    } else {
        defaultProjectTemplates = c.buildConfig.projectTemplates || {};
    }

    return generateOptions(defaultProjectTemplates, false, null, (i, obj, mapping, defaultVal) => {
        const exists = c.buildConfig.templates?.[defaultVal];
        const installed = exists ? chalk().yellow(' (installed)') : '';
        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${installed} \n`;
    });
};
