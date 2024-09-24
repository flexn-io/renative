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
        await overrideTemplatePlugins();
    } catch (error) {
        logError(error);
    }
})();
