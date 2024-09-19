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
import { listTizenTargets, launchTizenEmulator } from '../deviceManager';
import { CLI_TIZEN_EMULATOR, CLI_SDB_TIZEN } from '../constants';

const ERROR_MSG = {
    UNKNOWN_VM: 'does not match any VM',
    ALREADY_RUNNING: 'is running now',
};

jest.mock('@rnv/core');

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
            .mockImplementationOnce(() => Promise.resolve('Template: Mobile'));
        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        //WHEN
        await listTizenTargets('tizen');
        //THEN

        const correctResultString = 'Tizen Targets:\n[0]> emulatorTizen\n[1]> deviceTizen\n[2]> deviceMobile\n';
        // right now all of the devices are added to the end, no matter if -p tizen, -p tizenwatch or -p tizenmobile was called
        // when the function is updated, update the test as well, because it will fail
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

        const correctResultString = 'Tizen Targets:\n[0]> emulatorTizenwatch\n';
        // right now all of the devices are added to the end, no matter if -p tizen, -p tizenwatch or -p tizenmobile was called
        // when the function is updated, update the test as well, because it will fail
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

        const correctResultString = 'Tizen Targets:\n[0]> emulatorTizenmobile\n';
        // right now all of the devices are added to the end, no matter if -p tizen, -p tizenwatch or -p tizenmobile was called
        // when the function is updated, update the test as well, because it will fail
        expect(logToSummary).toHaveBeenCalledWith(correctResultString);
    });
});

describe('launchTizenEmulator', () => {
    it('should launch the specified emulator by name', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockResolvedValue(true);

        const result = await launchTizenEmulator('emulatorName');

        expect(logDefault).toHaveBeenCalledWith('launchTizenEmulator:emulatorName');
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulatorName',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should prompt the user to choose an emulator if name is true', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (execCLI as jest.Mock).mockResolvedValueOnce('emulator1\nemulator2').mockResolvedValueOnce('device1\ndevice2');
        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulator1' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenEmulator(true);
        expect(execCLI).toHaveBeenCalledWith(CLI_TIZEN_EMULATOR, 'list-vm');
        expect(execCLI).toHaveBeenCalledWith(CLI_SDB_TIZEN, 'devices');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: expect.any(Array),
        });
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulator1',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should hide real devices from prompt, if true is passed', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulator1\nemulator2')
            .mockResolvedValueOnce(
                'firstTrashLineThatTizenDeviceCmdReturns\n111.111.0.111:26101     device          UE43NU7192'
            );
        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulator1' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenEmulator(true, true);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: [], // not correct, because emulators are not mocked, but doesn't matter here, since its testing devices
        });
        expect(result).toBe(true);
    });
    it('should show real devices(same conditions as test above, just not passing 2nd param true to launchTizenEmulator) ', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (execCLI as jest.Mock)
            .mockResolvedValueOnce('emulator1\nemulator2')
            .mockResolvedValueOnce(
                'firstTrashLineThatTizenDeviceCmdReturns\n111.111.0.111:26101     device          UE43NU7192'
            );
        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulator1' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenEmulator(true);
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: [{ key: '111.111.0.111:26101', name: '111.111.0.111:26101', value: '111.111.0.111:26101' }],
        });
        expect(result).toBe(true);
    });
    it('should handle unknown VM error and retry with prompt', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockRejectedValueOnce(ERROR_MSG.UNKNOWN_VM);
        (execCLI as jest.Mock).mockResolvedValueOnce('emulator1\nemulator2').mockResolvedValueOnce('device1\ndevice2');
        (inquirerPrompt as jest.Mock).mockResolvedValue({ chosenEmulator: 'emulator1' });
        (executeAsync as jest.Mock).mockResolvedValue(true);
        const result = await launchTizenEmulator('unknownEmulator');
        expect(logError).toHaveBeenCalledWith('The VM/device "unknownEmulator" does not exist.');
        expect(execCLI).toHaveBeenCalledWith(CLI_TIZEN_EMULATOR, 'list-vm');
        expect(execCLI).toHaveBeenCalledWith(CLI_SDB_TIZEN, 'devices');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'chosenEmulator',
            type: 'list',
            message: 'which emulator or device would you like to launch?',
            choices: expect.any(Array),
        });
        expect(executeAsync).toHaveBeenCalledWith(
            'tizen-emulator launch --name emulator1',
            ExecOptionsPresets.SPINNER_FULL_ERROR_SUMMARY
        );
        expect(result).toBe(true);
    });
    it('should handle already running VM error and return true', async () => {
        const mockContext = { cli: { [CLI_TIZEN_EMULATOR]: 'tizen-emulator' }, platform: 'tizen' };
        const ctx = { ...getContext(), ...mockContext };
        createRnvContext(ctx);

        (executeAsync as jest.Mock).mockRejectedValueOnce(ERROR_MSG.ALREADY_RUNNING);
        const result = await launchTizenEmulator('runningEmulator');
        expect(logError).toHaveBeenCalledWith('The VM/device "runningEmulator" is already running.');
        expect(result).toBe(true);
    });
    it('should reject if no name is specified', async () => {
        await expect(launchTizenEmulator('')).rejects.toEqual('No emulator -t target name specified!');
    });
});
