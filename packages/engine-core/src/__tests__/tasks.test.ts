import {
    createRnvApi,
    createRnvContext,
    executeAsync,
    executeTask,
    getContext,
    removeDirs,
    writeFileSync,
} from '@rnv/core';
import taskRnvClean from '../tasks/task.rnv.clean';
import taskRnvKill from '../tasks/task.rnv.kill';
import taskRnvNew from '../tasks/task.rnv.new';
import taskRnvPlatformConfigure from '../tasks/task.rnv.platform.configure';
import taskRnvPlatformList from '../tasks/task.rnv.platform.list';

jest.mock('fs');
jest.mock('child_process');
jest.mock('@rnv/core');
jest.mock('inquirer');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

test('Execute task.rnv.platform.list', async () => {
    //GIVEN
    const ctx = getContext();
    //WHEN
    await expect(taskRnvPlatformList.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform list', undefined);
});

test('Execute task.rnv.platform.configure', async () => {
    //GIVEN
    const ctx = getContext();
    //WHEN
    await expect(taskRnvPlatformConfigure.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'project configure', 'platform configure', undefined);
});

test('Execute task.rnv.kill', async () => {
    //GIVEN
    const ctx = getContext();
    ctx.paths.project.configExists = true;
    //WHEN
    await expect(taskRnvKill.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(executeTask).toHaveBeenCalledWith(ctx, 'app configure', 'kill', undefined);
});

test('Execute task.rnv.clean', async () => {
    //GIVEN
    const ctx = getContext();
    const { inquirerPrompt } = require('@rnv/core');
    inquirerPrompt.mockReturnValue(
        Promise.resolve({ confirm: true, confirmBuilds: true, confirmLocals: true, confirmCache: true })
    );
    ctx.program.ci = false;
    //WHEN
    await expect(taskRnvClean.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(removeDirs).toHaveBeenCalledTimes(3);
    expect(executeAsync).toHaveBeenCalledWith(ctx, 'watchman watch-del-all');
    expect(executeAsync).toHaveBeenCalledWith(
        ctx,
        'npx rimraf -I $TMPDIR/metro-* && npx rimraf -I $TMPDIR/react-* && npx rimraf -I $TMPDIR/haste-*'
    );
});

test('Execute task.rnv.new', async () => {
    //GIVEN
    const ctx = getContext();
    const {
        inquirerPrompt,
        getWorkspaceOptions,
        getTemplateOptions,
        checkAndCreateGitignore,
        commandExistsSync,
    } = require('@rnv/core');

    checkAndCreateGitignore.mockReturnValue(Promise.resolve(true));
    commandExistsSync.mockReturnValue(true);

    inquirerPrompt.mockReturnValue(
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

    getWorkspaceOptions.mockReturnValue({
        keysAsArray: ['company', 'rnv'],
        valuesAsArray: [{ path: '/Users/someuser/.rnv' }, { path: '/Users/someuser/.company' }],
        keysAsObject: { rnv: true, company: true },
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

    getTemplateOptions.mockReturnValue({
        keysAsArray: ['@flexn/create-template-starter', '@rnv/template-starter'],
        valuesAsArray: [
            { description: "Multiplatform 'hello world' template" },
            {
                description: 'Advanced multiplatform template using flexn Create SDK',
            },
        ],
        keysAsObject: {
            '@rnv/template-starter': true,
            '@flexn/create-template-starter': true,
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
    await expect(taskRnvNew.fn(ctx)).resolves.toEqual(true);
    //THEN
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync).toHaveBeenCalledWith(undefined, {
        currentTemplate: '@rnv/template-starter',
        defaults: {
            supportedPlatforms: ['android', 'ios', 'web'],
        },
        engines: {},
        isMonorepo: false,
        isNew: true,
        platforms: {},
        projectName: 'test',
        templates: {
            '@rnv/template-starter': {
                version: '1.0.0-canary.7',
            },
        },
        workspaceID: 'rnv',
    });
    expect(checkAndCreateGitignore).toHaveBeenCalledTimes(1);
});

// TODO Mocking isSystemWin to true does not work. Need to figure out how to have different values for each test
// test('Execute task.rnv.clean on Windows', async () => {
//     const opts = {
//         detached: false,
//         stdio: 'ignore'
//     };
//     const configure = generateMockConfig({});
//     const child_process = require('child_process');
//     jest.doMock('../../src/core/system/utils.ts', () => ({
//         isSystemWin: true
//     }));

//     await expect(taskRnvClean.fn(configure, true)).resolves.toEqual(true);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'del /q/f/s %TEMP%\\*'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'dotnet nuget locals all --clear'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'npm cache clean --force & yarn cache clean --all'], opts);
//     expect(child_process.spawn).toHaveBeenCalledWith('cmd.exe', ['/C', 'watchman watch-del-all'], opts);
// });
// describe('Test task.rnv.platform.list', () => {
//     // const MOCK_FILE_INFO = {
//     //     '/path/to/file1.ts': 'console.log("file1 contents");',
//     //     '/path/to/file2.txt': 'file2 contents',
//     // };
//     //
//     // beforeEach(() => {
//     //     // Set up some mocked out file info before each test
//     //     require('fs').__setMockFiles(MOCK_FILE_INFO);
//     // });
//
//
//     it('should execute task', async () => {
//         task.fn(c);
//         const engineManager = require('../../core/engineManager/index.ts');
//         await expect(task.fn(c, null, originTask)).resolves.toEqual(true);
//         expect(engineManager.executeTask).toHaveBeenCalledWith(c, 'project configure', 'platform list', originTask);
//
//         // expect(fileSummary.length).toBe(2);
//     });
// });

// const mocks = {
//     executeTask: jest.fn(),
//     logToSummary: jest.fn()
// };
