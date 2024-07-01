jest.mock('@rnv/core');

import { logToSummary, readObjectSync, fsExistsSync, validateRenativeProjectSchema } from '@rnv/core';

beforeEach(() => {
    jest.resetAllMocks();
});

describe('createTask', () => {
    it('checks validity and config health of the project', async () => {
        // GIVEN
        const task = require('../taskDoctor').default;

        const ctx = {
            paths: {
                'workspace.config': '/path/to/workspace.config',
                'workspace.project.config': '/path/to/workspace.project.config',
                'workspace.appConfig.configs': [
                    '/path/to/workspace.appConfig.config1',
                    '/path/to/workspace.appConfig.config2',
                ],
                'project.config': '/path/to/project.config',
                'appConfig.configs': ['/path/to/appConfig.config1', '/path/to/appConfig.config2'],
            },
        };

        (fsExistsSync as jest.Mock).mockReturnValue(true);
        (readObjectSync as jest.Mock).mockReturnValue({});
        (validateRenativeProjectSchema as jest.Mock).mockReturnValue({ success: true });

        // WHEN

        await task.fn({ ctx });

        // THEN

        expect(logToSummary).toHaveBeenCalledWith(
            expect.stringMatching(/^RENATIVE JSON SCHEMA VALIDITY CHECK:\s*PASSED 7 files$/)
        );
    });
    it('handles invalid schema', async () => {
        // GIVEN
        const task = require('../taskDoctor').default;

        const ctx = {
            paths: {
                'workspace.config': '/path/to/workspace.config',
            },
        };

        (fsExistsSync as jest.Mock).mockReturnValue(true);
        (readObjectSync as jest.Mock).mockReturnValue({});
        (validateRenativeProjectSchema as jest.Mock).mockReturnValue({
            success: false,
            error: { errors: [{ path: 'path', message: 'message' }] },
        });

        // WHEN
        await task.fn({ ctx });

        // THEN
        expect(logToSummary).toHaveBeenCalledWith(
            expect.stringMatching(
                /^RENATIVE JSON SCHEMA VALIDITY CHECK:\s*\n\s*Invalid schema in \/path\/to\/workspace\.config\. ISSUES:\s*path: message$/
            )
        );
    });
});
