import { RnvApi, RnvApiPrompt, RnvApiSpinner, RnvContextAnalytics } from './types';
import { generateApiDefaults } from './defaults';

class ApiCls {
    // config: RnvContext;

    constructor() {
        global.RNV_API = generateApiDefaults();
    }

    initializeApi(c: RnvApi) {
        global.RNV_API = c;
        return c;
    }

    getApi(): RnvApi {
        return global.RNV_API;
    }
}

export const createRnvApi = ({
    spinner,
    prompt,
    analytics,
}: {
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
}) => {
    const api: RnvApi = generateApiDefaults();

    api.spinner = spinner;
    api.prompt = prompt;
    api.analytics = analytics;

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

export const generateOptions: RnvApiPrompt['generateOptions'] = (inputData, isMultiChoice, mapping, renderMethod) => {
    return getApi().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
};

export const pressAnyKeyToContinue: RnvApiPrompt['pressAnyKeyToContinue'] = () => {
    return getApi().prompt.pressAnyKeyToContinue();
};
