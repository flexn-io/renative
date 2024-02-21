import { createRnvApi, inquirerPrompt } from '../api';

jest.mock('fs');
jest.mock('../logger/index.ts');

describe('Api tests', () => {
    beforeAll(() => {
        createRnvApi();
    });

    it('test default inquirerPrompt', () => {
        expect(inquirerPrompt({ type: 'list' })).toReturn();
    });
});

// export const inquirerPrompt: RnvApiPrompt['inquirerPrompt'] = (opts) => {
//     return getApi().prompt.inquirerPrompt(opts);
// };

// export const inquirerSeparator: RnvApiPrompt['inquirerSeparator'] = (text?: string) => {
//     return getApi().prompt.inquirerSeparator(text);
// };

// export const generateOptions: RnvApiPrompt['generateOptions'] = (inputData, isMultiChoice, mapping, renderMethod) => {
//     return getApi().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
// };

// export const pressAnyKeyToContinue: RnvApiPrompt['pressAnyKeyToContinue'] = () => {
//     return getApi().prompt.pressAnyKeyToContinue();
// };
