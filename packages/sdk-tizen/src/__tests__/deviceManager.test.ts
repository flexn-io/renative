import { createRnvContext, fsExistsSync } from '@rnv/core';
import { listTizenTargets } from '../deviceManager';
import { execCLI, logToSummary } from '@rnv/core';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('DeviceManager', () => {
    it('listTizenTargets when calling npx rnv target list -p tizen', async () => {
        //GIVEN
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
