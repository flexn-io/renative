import { GetConfigPropFn, RnvApi, RnvApiLogger, RnvApiPrompt, RnvApiSpinner, RnvContextAnalytics } from './types';
import { generateApiDefaults } from './defaults';
import { getApi } from './provider';
import { DoResolveFn } from '../system/types';

export const createRnvApi = (_api?: {
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    logger: RnvApiLogger;
    getConfigProp: GetConfigPropFn;
    doResolve: DoResolveFn;
}) => {
    if (!_api && !global.RNV_API) {
        global.RNV_API = generateApiDefaults();
        return;
    }

    if (!global.RNV_API?.isDefault) return;
    const api: RnvApi = generateApiDefaults();

    api.spinner = _api?.spinner || api.spinner;
    api.prompt = _api?.prompt || api.prompt;
    api.analytics = _api?.analytics || api.analytics;
    api.logger = _api?.logger || api.logger;
    api.isDefault = false;

    // api.fsExistsSync = fsExistsSync;
    // api.fsReadFileSync = fsReadFileSync;
    // api.fsReaddirSync = fsReaddirSync;
    // api.fsWriteFileSync = fsWriteFileSync;
    // api.path = path;

    global.RNV_API = api;
};

createRnvApi();

export const inquirerPrompt: RnvApiPrompt['inquirerPrompt'] = (opts) => {
    return getApi().prompt.inquirerPrompt(opts);
};

export const inquirerSeparator: RnvApiPrompt['inquirerSeparator'] = (text?: string) => {
    return getApi().prompt.inquirerSeparator(text);
};

export const generateOptions: RnvApiPrompt['generateOptions'] = (inputData, isMultiChoice, mapping, renderMethod) => {
    return getApi().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
};

export const pressAnyKeyToContinue: RnvApiPrompt['pressAnyKeyToContinue'] = () => {
    return getApi().prompt.pressAnyKeyToContinue();
};
