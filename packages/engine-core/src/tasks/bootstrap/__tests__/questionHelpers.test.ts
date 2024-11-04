import { validateAndAssign, configureConfigOverrides } from '../questionHelpers';
import { inquirerPrompt } from '@rnv/core';

jest.mock('@rnv/core', () => ({
    inquirerPrompt: jest.fn(),
    isYarnInstalled: jest.fn(),
    chalk: () => {
        return {
            bold: jest.fn(),
            green: jest.fn(),
        };
    },
}));

describe('validateAndAssign', () => {
    it('returns the value if it is valid', async () => {
        const validFn = jest.fn((): string | true => {
            return true;
        });
        const value = 'valid value';

        const result = await validateAndAssign(
            { value, validFn, name: 'test', defaultVal: 'default', message: 'message', warning: 'warning' },
            false
        );

        expect(result).toBe(value);
        expect(validFn).toHaveBeenCalledWith(value);
    });

    it('prompts the user if the value is not valid', async () => {
        const validFn = jest.fn(() => 'error message');
        const value = 'invalid value';
        const inquirerResponse = { test: 'user input' };
        (inquirerPrompt as jest.Mock).mockResolvedValue(inquirerResponse);

        const result = await validateAndAssign(
            { value, validFn, name: 'test', defaultVal: 'default', message: 'message', warning: 'warning' },
            false
        );

        expect(result).toBe(inquirerResponse.test);
        expect(validFn).toHaveBeenCalledWith(value);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'test',
            type: 'input',
            default: 'default',
            validate: validFn,
            message: 'message',
            warningMessage: undefined,
        });
    });
});

describe('configureConfigOverrides', () => {
    it('should modify renativeConfig based on supportedPlatforms', async () => {
        const data = {
            inputs: {
                supportedPlatforms: ['platform1', 'platform2'],
            },
            files: {
                project: {
                    renativeConfig: {
                        project: {
                            platforms: {
                                platform1: {},
                                platform2: {},
                                platform3: {},
                            },
                        },
                    },
                },
            },
        };

        await configureConfigOverrides(data as any);

        expect(data.files.project.renativeConfig.project.platforms).toEqual({
            platform1: {},
            platform2: {},
        });
        expect((data.files.project.renativeConfig.project as any).defaults).toEqual({
            supportedPlatforms: ['platform1', 'platform2'],
        });
    });
});
