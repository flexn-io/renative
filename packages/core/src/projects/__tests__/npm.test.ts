import { checkNpxIsInstalled, listAndSelectNpmVersion } from '../npm';
import { logWarning } from '../../logger';
import { inquirerPrompt } from '../../api';
import { executeAsync, commandExistsSync } from '../../system/exec';

jest.mock('../../logger');
jest.mock('command-exists');
jest.mock('../../api');
jest.mock('../../system/exec');

beforeEach(() => {
    jest.resetAllMocks();
});

describe('checkNpxIsInstalled', () => {
    it('installs npx if not installed and user confirms', async () => {
        // GIVEN
        jest.mocked(commandExistsSync).mockReturnValue(false);
        jest.mocked(inquirerPrompt).mockResolvedValue({ confirm: true });
        const executeAsyncMock = jest.mocked(executeAsync).mockResolvedValue('MOCK_RESULT');

        // WHEN
        await checkNpxIsInstalled();

        // THEN
        expect(logWarning).toHaveBeenCalledWith('npx is not installed, please install it before running this command');
        expect(executeAsyncMock).toHaveBeenCalledWith('npm install -g npx');
    });

    it('fetches and processes versions and tags, and prompts user to select a version', async () => {
        // GIVEN
        const npmPackage = 'test-package';
        const versionsStr = "'1.0.0', '1.0.1', '1.1.0'";
        const tagsStr = 'latest: 1.1.0\nbeta: 1.0.1';
        jest.mocked(executeAsync).mockImplementation((command) => {
            if (command.includes('versions')) {
                return Promise.resolve(versionsStr);
            } else if (command.includes('dist-tag ls')) {
                return Promise.resolve(tagsStr);
            }
            return Promise.resolve('');
        });
        jest.mocked(inquirerPrompt).mockResolvedValue({ inputTemplateVersion: '1.1.0' });

        // WHEN
        const selectedVersion = await listAndSelectNpmVersion(npmPackage);

        // THEN
        expect(selectedVersion).toBe('1.1.0');
        expect(jest.mocked(executeAsync)).toHaveBeenCalledWith(`npm view ${npmPackage} versions`);
        expect(jest.mocked(executeAsync)).toHaveBeenCalledWith(`npm dist-tag ls ${npmPackage}`);
        expect(jest.mocked(inquirerPrompt)).toHaveBeenCalledWith({
            name: 'inputTemplateVersion',
            type: 'list',
            message: `What ${npmPackage} version to use?`,
            default: '1.1.0',
            loop: false,
            choices: [
                { name: '1.1.0 (@latest)', value: '1.1.0' },
                { name: '1.0.1 (@beta)', value: '1.0.1' },
                { name: '1.0.0', value: '1.0.0' },
            ],
        });
    });
});
