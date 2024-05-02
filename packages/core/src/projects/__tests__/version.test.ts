import { versionCheck } from '../version';
import { logDefault } from '../../logger';
import { inquirerPrompt } from '../../api';
import { generateContextDefaults } from '../../context/defaults';
import { upgradeProjectDependencies } from '../../configs/configProject';

jest.mock('../../logger');
jest.mock('../../api');
jest.mock('../../configs/configProject');
jest.mock('../../api', () => ({
    inquirerPrompt: jest.fn().mockResolvedValue({ chosenAction: 'Upgrade project to 2.0.0' }),
}));
jest.mock('../../logger', () => ({
    logDefault: jest.fn(),
    getCurrentCommand: jest.fn(),
    chalk: () => {
        return { red: jest.fn(), bold: jest.fn() };
    },
}));

describe('versionCheck', () => {
    it('not upgrading project', async () => {
        const context = generateContextDefaults();
        context.runtime.versionCheckCompleted = true;
        context.files.project.config = {
            skipAutoUpdate: true,
        };
        context.program.opts = () => ({ skipDependencyCheck: false });

        const result = await versionCheck(context);

        expect(result).toBe(true);
        expect(logDefault).toHaveBeenCalledWith('versionCheck');
        expect(upgradeProjectDependencies).not.toHaveBeenCalled();
    });
    it('upgrading project', async () => {
        const context = generateContextDefaults();
        context.runtime.versionCheckCompleted = false;
        context.files.project.config = {
            skipAutoUpdate: false,
        };
        context.files.project.package = {
            devDependencies: {
                '@rnv/core': '1.0.0',
            },
        };
        context.files.rnvCore = {
            package: {
                version: '2.0.0',
            },
        };
        context.program.opts = () => ({ skipDependencyCheck: false });

        const result = await versionCheck(context);

        expect(result).toBe(true);
        expect(logDefault).toHaveBeenCalledWith('versionCheck');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            message: 'What to do next?',
            type: 'list',
            name: 'chosenAction',
            choices: [
                'Continue and skip updating package.json',
                'Continue and update package.json',
                'Upgrade project to 2.0.0',
            ],
            warningMessage: expect.any(String),
        });
        expect(upgradeProjectDependencies).toHaveBeenCalledWith('2.0.0');
    });
});
