const path = require('path');
const {
    createRnvContext,
    loadWorkspacesConfigSync,
    loadDefaultConfigTemplates,
    updateRenativeConfigs,
    overrideTemplatePlugins,
    createRnvApi,
    getConfigProp,
    doResolve,
    logError,
    RnvFileName,
    fsExistsSync,
    fsMkdirSync,
    fsReadFileSync,
    removeDirSync,
    revertOverrideToOriginal,
} = require('@rnv/core');

const Logger = require('@rnv/cli/lib/logger');
const RNV_HOME_DIR = path.join(__dirname, '..');

(async () => {
    try {
        createRnvApi({
            logger: Logger,
            getConfigProp,
            doResolve,
        });
        createRnvContext({ RNV_HOME_DIR });

        loadWorkspacesConfigSync();
        await loadDefaultConfigTemplates();
        await updateRenativeConfigs();
        await resetOverrides();

        await overrideTemplatePlugins();
    } catch (error) {
        logError(error);
    }
})();

const resetOverrides = async () => {
    const rnvFolder = path.join(process.cwd(), '.rnv');
    if (!fsExistsSync(rnvFolder)) {
        fsMkdirSync(rnvFolder);
    }
    const overrideDir = path.join(rnvFolder, 'overrides');

    const appliedOverrideFilePath = path.join(overrideDir, RnvFileName.appliedOverride);

    if (fsExistsSync(appliedOverrideFilePath)) {
        const appliedOverrides = JSON.parse(fsReadFileSync(appliedOverrideFilePath).toString());

        Object.keys(appliedOverrides).forEach((moduleName) => {
            const appliedVersion = appliedOverrides[moduleName].version;
            const packageJsonPath = path.join(process.cwd(), 'node_modules', moduleName, RnvFileName.package);

            if (fsExistsSync(packageJsonPath)) {
                const packageContent = JSON.parse(fsReadFileSync(packageJsonPath).toString());
                const currentVersion = packageContent.version;

                if (currentVersion === appliedVersion) {
                    const packageOverrides = appliedOverrides[moduleName];
                    Object.keys(packageOverrides).forEach((filePath) => {
                        if (filePath !== 'version') {
                            const backupPath = path.join(overrideDir, moduleName, filePath);
                            const destinationPath = path.join(process.cwd(), 'node_modules', moduleName, filePath);

                            revertOverrideToOriginal(destinationPath, backupPath);
                        }
                    });
                }
            }
        });
        removeDirSync(overrideDir);
        return true;
    }
    return false;
};
