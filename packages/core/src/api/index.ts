import { getContext } from '../context/context';
import { RnvContextPrompt } from '../context/types';

export const inquirerPrompt: RnvContextPrompt['inquirerPrompt'] = (opts) => {
    return getContext().prompt.inquirerPrompt(opts);
};

export const generateOptions: RnvContextPrompt['generateOptions'] = (
    inputData,
    isMultiChoice,
    mapping,
    renderMethod
) => {
    return getContext().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
};

export const pressAnyKeyToContinue: RnvContextPrompt['pressAnyKeyToContinue'] = () => {
    return getContext().prompt.pressAnyKeyToContinue();
};
