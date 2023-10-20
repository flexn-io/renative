import { generateOptions } from '../api';
import { RnvContext } from '../context/types';
import { chalk, logInfo, logTask, logWarning } from '../logger';
import { doResolve } from '../system/resolve';
import { writeRenativeConfigFile } from './utils';

export const checkIfTemplateConfigured = async (c: RnvContext) => {
    logTask('checkIfTemplateConfigured');
    if (c.program.skipDependencyCheck || c.files.project.config?.isTemplate) return true;
    if (!c.buildConfig.templates) {
        logWarning(
            `Your ${chalk().white(c.paths.project.config)} does not contain ${chalk().white(
                'templates'
            )} object. ReNative will skip template generation`
        );
        return false;
    }
    Object.keys(c.buildConfig.templates).forEach((k) => {
        const obj = c.buildConfig.templates?.[k] || { version: 'unknown template version' };
        if (!doResolve(k, false, { basedir: '../' }) && !doResolve(k, false)) {
            logInfo(
                `Your ${chalk().white(`${k}@${obj.version}`)} template is missing in renative.json. CONFIGURING...DONE`
            );
            c._requiresNpmInstall = true;
            c.runtime.requiresBootstrap = true;
        }
        if (c.files.project.package.devDependencies) {
            if (c.files.project.package.devDependencies[k] !== obj.version) {
                logInfo(`Updating template ${chalk().white(`${k}`)} => ${chalk().green(obj.version)}. ...DONE`);
            }

            c.files.project.package.devDependencies[k] = obj.version;
        }
    });

    writeRenativeConfigFile(c, c.paths.project.package, c.files.project.package);

    return true;
};

export const getTemplateOptions = (c: RnvContext, isGlobalScope?: boolean) => {
    let defaultProjectTemplates;
    if (isGlobalScope) {
        defaultProjectTemplates = c.files.rnv.projectTemplates.config?.projectTemplates;
    } else {
        defaultProjectTemplates = c.buildConfig.projectTemplates || {};
    }

    return generateOptions(defaultProjectTemplates, false, null, (i, obj, mapping, defaultVal) => {
        const exists = c.buildConfig.templates?.[defaultVal];
        const installed = exists ? chalk().yellow(' (installed)') : '';
        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)}${installed} \n`;
    });
};
