import * as taskHelpers from '../taskHelpers';
import { getContext } from '../../context/provider';
import { registerPlatformEngine } from '../../engines';
import * as engines from '../../engines';
import { inquirerPrompt } from '../../api';
import { logInfo } from '../../logger';
import { generateContextDefaults } from '../../context/defaults';

jest.mock('../../context/provider');
jest.mock('../../api');
jest.mock('../../logger', () => ({
    ...jest.requireActual('../../logger'),
    logInfo: jest.fn(),

    chalk: () => ({
        bold: {
            white: jest.fn().mockReturnValue('mocked value'),
        },
    }),
}));

describe('selectPlatformIfRequired', () => {
    it('selects the platform and registers the engine', async () => {
        // GIVEN
        const knownTaskInstance = {
            task: 'test-task',
            platforms: ['ios'],
            description: 'test-description',
            key: 'key',
        };

        const context = generateContextDefaults();
        context.buildConfig.defaults = { supportedPlatforms: ['ios'] };
        context.runtime.availablePlatforms = [];
        context.runtime.engine = undefined;
        context.program.opts = () => ({ platform: undefined });

        jest.mocked(getContext).mockReturnValue(context);
        const getTaskNameFromCommandMock = jest.spyOn(taskHelpers, 'getTaskNameFromCommand');
        getTaskNameFromCommandMock.mockReturnValue('test-command');
        jest.mocked(inquirerPrompt).mockResolvedValue({ platform: 'ios' });
        const registerPlatformEngineMock = jest.spyOn(engines, 'registerPlatformEngine');
        registerPlatformEngineMock.mockResolvedValue(undefined);
        const engineRunner = { runtimeExtraProps: { prop: 'value' } };
        const getEngineRunnerByPlatformMock = jest.spyOn(engines, 'getEngineRunnerByPlatform');
        getEngineRunnerByPlatformMock.mockReturnValue(engineRunner as any);

        // WHEN
        await taskHelpers.selectPlatformIfRequired(knownTaskInstance, true);

        // THEN
        expect(logInfo).toHaveBeenCalledWith(
            'Task "test-task" has only one supported platform: "ios". Automatically selecting it.'
        );
        expect(context.platform).toBe('ios');
        expect(registerPlatformEngine).toHaveBeenCalledWith('ios');
        expect(context.runtime.engine).toBe(engineRunner);
        expect(context.runtime.runtimeExtraProps).toEqual({ prop: 'value' });
    });
});
