import { logInfo, fsExistsSync, fsRenameSync, fsSymlinkSync, mkdirSync, inquirerPrompt } from '@rnv/core';
import { traverseTargetProject, getSourceDir } from '../linker';
import task from '../taskLink';

jest.mock('@rnv/core');
jest.mock('../linker');

describe('taskLink', () => {
    it('should link packages correctly', async () => {
        // GIVEN
        const mockPackage = {
            name: 'test-package',
            cacheDir: '/path/to/cache',
            nmPath: '/path/to/nm',
            isBrokenLink: false,
            isLinked: false,
            skipLinking: false,
            nmPathExists: true,
            unlinkedPathExists: false,
            sourcePath: '/path/to/source',
            unlinkedPath: '/path/to/unlinked',
        };

        (traverseTargetProject as jest.Mock).mockReturnValue([mockPackage]);
        (getSourceDir as jest.Mock).mockReturnValue('/path/to/source');
        (inquirerPrompt as jest.Mock).mockResolvedValue({ selectedLinkableProjects: [mockPackage] });

        // WHEN
        await task.fn?.({} as any);

        // THEN
        expect(traverseTargetProject).toHaveBeenCalledWith('/path/to/source');
        expect(inquirerPrompt).toHaveBeenCalledWith({
            name: 'selectedLinkableProjects',
            type: 'checkbox',
            message: `Found following packages to link?`,
            default: [mockPackage],
            loop: false,
            choices: [{ name: 'test-package', value: mockPackage }],
        });
        expect(fsExistsSync).toHaveBeenCalledWith(mockPackage.cacheDir);
        expect(mkdirSync).toHaveBeenCalledWith(mockPackage.unlinkedPath);
        expect(fsRenameSync).toHaveBeenCalledWith(mockPackage.nmPath, mockPackage.unlinkedPath);
        expect(fsSymlinkSync).toHaveBeenCalledWith(mockPackage.sourcePath, mockPackage.nmPath);
        expect(logInfo).toHaveBeenCalledWith('✔ test-package (/path/to/nm)');
    });
});
