import { RnvApi, RnvApiLogger, RnvApiPrompt, RnvApiSpinner, RnvContextAnalytics } from './types';
import { generateApiDefaults } from './defaults';

class ApiCls {
    constructor() {
        global.RNV_API = generateApiDefaults();
    }

    initializeApi(api: RnvApi) {
        global.RNV_API = api;

        return api;
    }

    getApi(): RnvApi {
        return global.RNV_API;
    }
}

export const createRnvApi = ({
    spinner,
    prompt,
    analytics,
    logger,
}: {
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    logger: RnvApiLogger;
}) => {
    const api: RnvApi = generateApiDefaults();

    api.spinner = spinner;
    api.prompt = prompt;
    api.analytics = analytics;
    api.logger = logger;

    return api;
};

const Api = new ApiCls();

export { Api };

export const getApi = (): RnvApi => {
    return Api.getApi();
};

export const inquirerPrompt: RnvApiPrompt['inquirerPrompt'] = (opts) => {
    return getApi().prompt.inquirerPrompt(opts);
};

export const inquirerSeparator: RnvApiPrompt['inquirerSeparator'] = () => {
    return getApi().prompt.inquirerSeparator();
};

export const generateOptions: RnvApiPrompt['generateOptions'] = (inputData, isMultiChoice, mapping, renderMethod) => {
    return getApi().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
};

export const pressAnyKeyToContinue: RnvApiPrompt['pressAnyKeyToContinue'] = () => {
    return getApi().prompt.pressAnyKeyToContinue();
};
