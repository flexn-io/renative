import {
    createRnvContext,
    fsExistsSync,
    execCLI,
    executeAsync,
    logToSummary,
    getContext,
    logDefault,
    logError,
    inquirerPrompt,
    ExecOptionsPresets,
} from '@rnv/core';
import { listTizenTargets, launchTizenTarget } from '../deviceManager';
import { CLI_TIZEN_EMULATOR, CLI_SDB_TIZEN } from '../constants';

const ERROR_MSG = {
    UNKNOWN_VM: 'does not match any VM',
    ALREADY_RUNNING: 'is running now',
};

jest.mock('@rnv/core');
jest.mock('@rnv/sdk-utils');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('listTizenTargets', () => {
    it('listTizenTargets when calling npx rnv target list -p tizen', async () => {
        //GIVEN
        createRnvContext();
        const execCLIMock = jest.mocked(execCLI);
        execCLIMock
            .mockImplementationOnce(() => Promise.resolve('emulatorTizen\nemulatorMobile'))
            .mockImplementationOnce(() => Promise.resolve('List of devices attached\ndeviceTizen\ndeviceMobile'))
            .mockImplementationOnce(() => Promise.resolve('Template: Tizen'))
            .mockImplementationOnce(() => Promise.resolve('Template: Mobile'))
            .mockImplementationOnce(() => Promise.resolve('profile_name:tv'))
            .mockImplementationOnce(() => Promise.resolve('profile_name:mobile'));

        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        //WHEN
        await listTizenTargets('tizen');
        //THEN

        const correctResultString = 'Tizen targets:\n[0]> emulatorTizen\n[1]> deviceTizen\n';
        expect(logToSummary).toHaveBeenCalledWith(correctResultString);
    });
    it('listTizenTargets when calling npx rnv target list -p tizenwatch', async () => {
        //GIVEN
        const execCLIMock = jest.mocked(execCLI);
        createRnvContext();
        execCLIMock
            .mockImplementationOnce(() => Promise.resolve('emulatorTizenmobile\nemulatorTizenwatch'))
            .mockImplementationOnce(() => Promise.resolve('')) // the return for devices
            .mockImplementationOnce(() => Promise.resolve('Template: Tizen'))
            .mockImplementationOnce(() => Promise.resolve('Template: Wearable'));
        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        //WHEN
        await listTizenTargets('tizenwatch');
        //THEN

        const correctResultString = 'Tizen targets:\n[0]> emulatorTizenwatch\n';
        expect(logToSummary).toHaveBeenCalledWith(correctResultString);
    });
    it('listTizenTargets when calling npx rnv target list -p tizenmobile', async () => {
        //GIVEN
        const execCLIMock = jest.mocked(execCLI);
        createRnvContext();
        execCLIMock
            .mockImplementationOnce(() => Promise.resolve('emulatorTizenmobile\nemulatorTizenwatch'))
            .mockImplementationOnce(() => Promise.resolve('')) // the return for devices
            .mockImplementationOnce(() => Promise.resolve('Template: Mobile'))
            .mockImplementationOnce(() => Promise.resolve('Template: Wearable'));
        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        //WHEN
        await listTizenTargets('tizenmobile');
        //THEN

        const correctResultString = 'Tizen targets:\n[0]> emulatorTizenmobile\n';
        expect(logToSummary).toHaveBeenCalledWith(correctResultString);
    });
});

describe('launchTizenTarget', () => {
    it('should launch the specified emulator by name', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockResolvedValue(true);

        const result = await launchTizenTarget('emulatorName');

        expect(logDefault).toHaveBeenCalledWith('launchTizenTarget:emulatorName');
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulatorName',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should prompt the user to choose an emulator if name is true', async () => {
        // logic - 2 emulators(tizen and mobile type), 2 devices(tv and mobile type). Since platform: 'tizen' is passed to context, its same as if npx rnv run -p tizen was called.
        // so it should show only tizen/tv type emulators and devices

        // GIVEN
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);
        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulatorTizen\nemulatorMobile')
            .mockResolvedValueOnce('List of devices attached\n111.111.111:11111\n222.222.222:22222')
            .mockResolvedValueOnce('Template: Tizen')
            .mockResolvedValueOnce('Template: Mobile')
            .mockResolvedValueOnce('profile_name:tv')
            .mockResolvedValueOnce('profile_name:mobile');

        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulatorTizen' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenTarget(true);
        expect(execCLI).toHaveBeenCalledWith(CLI_TIZEN_EMULATOR, 'list-vm');
        expect(execCLI).toHaveBeenCalledWith(CLI_SDB_TIZEN, 'devices');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: [
                {
                    key: 'emulatorTizen',
                    name: 'emulatorTizen',
                    value: 'emulatorTizen',
                },
                {
                    key: '111.111.111:11111',
                    name: '111.111.111:11111',
                    value: '111.111.111:11111',
                },
            ],
            default: 'emulatorTizen',
        });
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulatorTizen',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should hide real devices from prompt, if the second paramater of launchTizenTarget() is true', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulatorTizen\nemulatorMobile')
            .mockResolvedValueOnce(
                'firstTrashLineThatTizenDeviceCmdReturns\n111.111.111.111:11111     device          UE43NU7192'
            )
            .mockResolvedValueOnce('Template: Tizen')
            .mockResolvedValueOnce('Template: Mobile')
            .mockResolvedValueOnce('profile_name:tv');

        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulatorTizen' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenTarget(true, true);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator would you like to launch?',
            default: 'emulatorTizen',
            choices: [
                {
                    key: 'emulatorTizen',
                    name: 'emulatorTizen',
                    value: 'emulatorTizen',
                },
            ], // there is a tizen emulator, and a tizen device(because of the profile_name:tv mock value return), but since hideDevices(2nd param) is true, only the emulator should be shown
        });
        expect(result).toBe(true);
    });
    it('should show real devices(same conditions as test above, just not passing 2nd param true to launchTizenTarget) ', async () => {
        //GIVEN
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulatorTizen\nemulatorMobile')
            .mockResolvedValueOnce(
                'firstTrashLineThatTizenDeviceCmdReturns\n111.111.111.111:11111     device          UE43NU7192'
            )
            .mockResolvedValueOnce('Template: Tizen')
            .mockResolvedValueOnce('Template: Mobile')
            .mockResolvedValueOnce('profile_name:tv');

        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulator1' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        //WHEN
        const result = await launchTizenTarget(true);

        //THEN
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: [
                { key: 'emulatorTizen', name: 'emulatorTizen', value: 'emulatorTizen' },
                { key: '111.111.111.111:11111', name: '111.111.111.111:11111', value: '111.111.111.111:11111' },
            ],
            default: 'emulatorTizen',
        });
        expect(result).toBe(true);
    });
    it('should handle unknown VM error and retry with prompt', async () => {
        //GIVEN
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockRejectedValueOnce(ERROR_MSG.UNKNOWN_VM);
        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulatorTizen\nemulatorMobile')
            .mockResolvedValueOnce(
                'firstTrashLineThatTizenDeviceCmdReturns\n111.111.111.111:11111     device          UE43NU7192'
            )
            .mockResolvedValueOnce('Template: Tizen')
            .mockResolvedValueOnce('Template: Mobile')
            .mockResolvedValueOnce('profile_name:tv');
        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulatorTizen' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenTarget('unknownEmulator');
        expect(logError).toHaveBeenCalledWith('The VM/device "unknownEmulator" does not exist.');
        expect(execCLI).toHaveBeenCalledWith(CLI_TIZEN_EMULATOR, 'list-vm');
        expect(execCLI).toHaveBeenCalledWith(CLI_SDB_TIZEN, 'devices');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: [
                {
                    key: 'emulatorTizen',
                    name: 'emulatorTizen',
                    value: 'emulatorTizen',
                },
                {
                    key: '111.111.111.111:11111',
                    name: '111.111.111.111:11111',
                    value: '111.111.111.111:11111',
                },
            ],
            default: 'emulatorTizen',
        });
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulatorTizen',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should handle already running VM error and return true', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockRejectedValueOnce(ERROR_MSG.ALREADY_RUNNING);
        const result = await launchTizenTarget('runningEmulator');
        expect(logError).toHaveBeenCalledWith('The VM/device "runningEmulator" is already running.');
        expect(result).toBe(true);
    });
    it('should reject if no name is specified', async () => {
        await expect(launchTizenTarget('')).rejects.toEqual('No emulator -t target name specified!');
    });
});
