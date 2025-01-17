import path from 'path';
import { getAppConfigBuildsFolder, getAppFolder, getTimestampPathsConfig } from '../context/contextProps';
import { isPlatformActive } from '../platforms';
import { copyTemplatePluginsSync } from '../plugins';
import { copyFolderContentsRecursiveSync, fsExistsSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { generateConfigPropInjects } from '../system/injectors';
import { getContext } from '../context/provider';

/**
 * Copies various build-related folders to a destination path, merging configurations and handling deprecated paths.
 * This function performs the following operations:
 * 1. Logs the start of the copy process.
 * 2. Retrieves the current context, which contains configuration and runtime properties.
 * 3. Checks if the current platform is active; if not, the function exits early.
 * 4. Defines the destination path where folders will be copied.
 * 5. Retrieves timestamp paths configuration and generates configuration property injects.
 * 6. Merges project configuration folders into the destination path.
 * 7. Handles deprecated shared folder paths for web-hosted platforms and logs a warning if used.
 * 8. Merges additional app configuration folders, if they exist, into the destination path.
 * 9. Merges private app configuration folders from the workspace into the destination path.
 * 10. Copies template plugins using the current context.
 * 11. Resolves the promise upon completion of all operations.
 * The function utilizes various helper functions for path management and folder copying,
 * ensuring that configuration properties and timestamp paths are correctly injected.
 */
export const copyBuildsFolder = () =>
    new Promise<void>((resolve) => {
        logDefault('copyBuildsFolder');
        const c = getContext();

        if (!isPlatformActive(resolve)) return;

        const destPath = path.join(getAppFolder());
        const tsPathsConfig = getTimestampPathsConfig();
        generateConfigPropInjects();
        const allInjects = [...c.configPropsInjects, ...c.systemPropsInjects, ...c.runtimePropsInjects];

        // FOLDER MERGERS PROJECT CONFIG
        const sourcePath1 = getAppConfigBuildsFolder(c.paths.project.appConfigBase.dir);
        copyFolderContentsRecursiveSync(sourcePath1, destPath, true, undefined, false, allInjects, tsPathsConfig);

        // FOLDER MERGERS PROJECT CONFIG (PRIVATE)
        const sourcePath1sec = getAppConfigBuildsFolder(c.paths.workspace.project.appConfigBase.dir);
        copyFolderContentsRecursiveSync(sourcePath1sec, destPath, true, undefined, false, allInjects, tsPathsConfig);

        // DEPRECATED SHARED
        if (c.runtime.currentPlatform?.isWebHosted) {
            const sourcePathShared = path.join(c.paths.project.appConfigBase.dir, 'builds/_shared');
            if (fsExistsSync(sourcePathShared)) {
                logWarning('Folder builds/_shared is DEPRECATED. use builds/<PLATFORM> instead ');
            }
            copyFolderContentsRecursiveSync(sourcePathShared, getAppFolder(), true, undefined, false, allInjects);
        }

        // FOLDER MERGERS FROM APP CONFIG + EXTEND
        if (c.paths.appConfig.dirs) {
            c.paths.appConfig.dirs.forEach((v) => {
                const sourceV = getAppConfigBuildsFolder(v);
                copyFolderContentsRecursiveSync(sourceV, destPath, true, undefined, false, allInjects, tsPathsConfig);
            });
        } else {
            copyFolderContentsRecursiveSync(
                getAppConfigBuildsFolder(c.paths.appConfig.dir),
                destPath,
                true,
                undefined,
                false,
                allInjects,
                tsPathsConfig
            );
        }

        // FOLDER MERGERS FROM APP CONFIG (PRIVATE)
        const sourcePath0sec = getAppConfigBuildsFolder(c.paths.workspace.appConfig.dir);
        copyFolderContentsRecursiveSync(sourcePath0sec, destPath, true, undefined, false, allInjects, tsPathsConfig);

        copyTemplatePluginsSync(c);

        resolve();
    });
