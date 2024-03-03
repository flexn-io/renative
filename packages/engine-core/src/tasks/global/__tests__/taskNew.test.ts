import {
    createRnvApi,
    createRnvContext,
    fsExistsSync,
    getContext,
    writeFileSync,
    inquirerPrompt,
    getWorkspaceOptions,
    getTemplateOptions,
    checkAndCreateGitignore,
    commandExistsSync,
} from '@rnv/core';
import taskRnvNew from '../taskNew';

jest.mock('@rnv/core');
jest.mock('lodash/set');
jest.mock('path');
jest.mock('semver');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.new', async () => {
    //GIVEN
    const ctx = getContext();

    jest.mocked(checkAndCreateGitignore).mockReturnValue(Promise.resolve(true));
    jest.mocked(commandExistsSync).mockReturnValue(true);
    jest.mocked(fsExistsSync).mockReturnValue(true);

    jest.mocked(inquirerPrompt).mockReturnValue(
        Promise.resolve({
            inputProjectName: 'test',
            confirm: true,
            inputAppTitle: 'testtitle',
            inputAppID: 'com.test.app',
            inputVersion: '1.0.0',
            inputWorkspace: 'rnv',
            // inputTemplate: '@rnv/template-starter',
            // inputTemplateVersion: '1.0.0-canary.7',
            inputSupportedPlatforms: ['android', 'ios', 'web'],
            gitEnabled: true,
            confirmInRnvProject: true,
        })
    );

    jest.mocked(getWorkspaceOptions).mockReturnValue({
        keysAsArray: ['company', 'rnv'],
        valuesAsArray: [{ path: '/Users/someuser/.rnv' }, { path: '/Users/someuser/.company' }],
        keysAsObject: { rnv: 'rnv', company: 'company' },
        valuesAsObject: {
            rnv: { path: '/Users/someuser/.rnv' },
            company: { path: '/Users/someuser/.company' },
        },
        asString: ' [\x1B[90m1\x1B[39m]> \x1B[1mrnv\x1B[22m \n [\x1B[90m2\x1B[39m]> \x1B[1mcompany\x1B[22m \n',
        optionsAsArray: [
            ' [\x1B[90m1\x1B[39m]> \x1B[1mrnv\x1B[22m \n',
            ' [\x1B[90m2\x1B[39m]> \x1B[1mcompany\x1B[22m \n',
        ],
    });

    jest.mocked(getTemplateOptions).mockReturnValue({
        keysAsArray: ['@flexn/create-template-starter', '@rnv/template-starter'],
        valuesAsArray: [
            { description: "Multiplatform 'hello world' template" },
            {
                description: 'Advanced multiplatform template using flexn Create SDK',
            },
        ],
        keysAsObject: {
            '@rnv/template-starter': '@rnv/template-starter',
            '@flexn/create-template-starter': '@flexn/create-template-starter',
        },
        valuesAsObject: {
            '@rnv/template-starter': { description: "Multiplatform 'hello world' template" },
            '@flexn/create-template-starter': {
                description: 'Advanced multiplatform template using flexn Create SDK',
            },
        },
        asString:
            ' [\x1B[90m1\x1B[39m]> \x1B[1m@rnv/template-starter\x1B[22m \n' +
            ' [\x1B[90m2\x1B[39m]> \x1B[1m@flexn/create-template-starter\x1B[22m \n',
        optionsAsArray: [
            ' [\x1B[90m1\x1B[39m]> \x1B[1m@rnv/template-starter\x1B[22m \n',
            ' [\x1B[90m2\x1B[39m]> \x1B[1m@flexn/create-template-starter\x1B[22m \n',
        ],
    });

    ctx.program.ci = false;
    ctx.program.templateVersion = '1.0.0-canary.7';
    ctx.program.projectTemplate = '@rnv/template-starter';
    //WHEN
    await expect(taskRnvNew.fn?.(ctx)).resolves.toEqual(true);
    //THEN
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync).toHaveBeenCalledWith(undefined, {
        currentTemplate: '@rnv/template-starter',
        common: {
            id: 'com.test.app',
            title: 'testtitle',
        },
        defaults: {
            supportedPlatforms: ['android', 'ios', 'web'],
        },
        engines: {},
        isMonorepo: false,
        isNew: true,
        platforms: {},
        projectName: 'test',
        projectVersion: '1.0.0',
        templates: {
            '@rnv/template-starter': {
                version: '1.0.0-canary.7',
            },
        },
        workspaceID: 'rnv',
    });
    expect(checkAndCreateGitignore).toHaveBeenCalledTimes(1);
});