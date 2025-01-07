import path from 'path';
import { chalk, logDefault, logError, logInfo } from '../logger';
import { getContext } from '../context/provider';
import {
    copyFileSync,
    copyFolderContentsRecursiveSync,
    fsExistsSync,
    fsLstatSync,
    readObjectSync,
    writeFileSync,
} from '../system/fs';
import { ConfigFileTemplate } from '../schema/types';
import { inquirerPrompt } from '../api';
import { applyTemplate } from '../templates';
import { RnvPlatform } from '../types';

export const checkAndUpdateProjectIfRequired = async () => {
    logDefault('checkAndUpdateIfRequired');
    const c = getContext();
    const { platform } = c;
    const supportedPlatforms = c.files.project.config?.defaults?.supportedPlatforms;

    if (!platform) return;
    const { isMonorepo } = c.buildConfig;
    if (isMonorepo || typeof platform === 'boolean') return true;
    await applyTemplate();

    const allPlatforms = Object.keys(c.buildConfig?.platforms || {});
    if (!allPlatforms?.includes(platform)) {
        logError(`Platform ${platform} is not supported!`);
        return Promise.reject(`Platform ${platform} is not supported!`);
    }
    const templateConfigFile = readObjectSync<ConfigFileTemplate>(c.paths.template.configTemplate);

    if (templateConfigFile) {
        const missingFiles = _getMisFilesForPlatform({
            templateConfigFile,
            platform,
            projectPath: c.paths.project.dir,
            templatePath: c.paths.template.dir,
        });

        if (missingFiles.length || !supportedPlatforms?.includes(platform)) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: `You are trying to run platform ${chalk().bold.magenta(
                    platform
                )} which is not configured. Do you want to configure it now?`,
            });
            if (!confirm) {
                return Promise.reject('Cancelled by user');
            }

            if (supportedPlatforms) {
                if (!supportedPlatforms.includes(platform)) {
                    supportedPlatforms.push(platform);
                    if (c.files.project.config) {
                        writeFileSync(c.paths.project.config, c.files.project.config);
                    }
                }
            }

            missingFiles.forEach((mf) => {
                const destPath = path.join(c.paths.project.dir, mf);
                const sourcePath = path.join(c.paths.template.dir, mf);

                if (!fsExistsSync(destPath) && fsExistsSync(sourcePath)) {
                    try {
                        if (fsLstatSync(sourcePath).isDirectory()) {
                            logInfo(`Missing directory ${chalk().bold.white(destPath)}. COPYING from TEMPLATE...DONE`);
                            copyFolderContentsRecursiveSync(sourcePath, destPath);
                        } else {
                            logInfo(`Missing file ${chalk().bold.white(destPath)}. COPYING from TEMPLATE...DONE`);
                            copyFileSync(sourcePath, destPath);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }
    }

    return true;
};

const _getMisFilesForPlatform = (opts: {
    templateConfigFile: ConfigFileTemplate;
    platform: RnvPlatform;
    projectPath: string;
    templatePath: string;
}) => {
    const { templateConfigFile, platform, projectPath, templatePath } = opts;
    const includedPaths = templateConfigFile.templateConfig?.includedPaths || [];
    const result = includedPaths.find(
        (item) => typeof item !== 'string' && item.platforms && item.platforms.includes(platform!)
    );

    if (result && typeof result !== 'string') {
        const nonExistingFiles = result.paths.filter(
            (file) => !fsExistsSync(path.join(projectPath, file)) && fsExistsSync(path.join(templatePath, file))
        );
        return nonExistingFiles;
    }
    return [];
};
