import { getContext, createRnvContext } from '@rnv/core';
import taskNew from '../taskNew';
import {
    generateNewProject,
    initNewProject,
    saveProgressIntoProjectConfig,
    telemetryNewProject,
} from '../projectGenerator';
import { NewProjectData } from '../types';
import { processChdirToProject } from '../utils';

import inquiryBootstrapQuestions from '../questions/bootstrapQuestions';
import inquiryGit from '../questions/confirmGit';
import inquiryIsRenativeProject from '../questions/isRenativeProject';
import inquiryHasNodeModules from '../questions/hasNodeModules';
import inquiryConfirm from '../questions/confirmOverview';
import inquiryProjectName from '../questions/projectName';
import inquiryWorkspace from '../questions/workspace';
import inquirySupportedPlatforms from '../questions/supportedPlatforms';
import inquiryAppTitle from '../questions/appTitle';
import inquiryAppID from '../questions/appID';
import inquiryAppVersion from '../questions/projectVersion';
import inquiryInstallTemplate from '../questions/installTemplate';
import inquiryApplyTemplate from '../questions/applyTemplate';
import inquiryBookmarkTemplate from '../questions/bookmarkTemplate';

jest.mock('@rnv/core');
jest.mock('lodash/set');
jest.mock('path');
jest.mock('semver');
jest.mock('../utils');
jest.mock('../questions/bootstrapQuestions');
jest.mock('../questions/appTitle');
jest.mock('../questions/installTemplate');
jest.mock('../questions/applyTemplate');
jest.mock('../questions/bookmarkTemplate');
jest.mock('../questions/appID');
jest.mock('../questions/projectVersion');
jest.mock('../questions/workspace');
jest.mock('../questions/hasNodeModules');
jest.mock('../questions/confirmOverview');
jest.mock('../questions/isRenativeProject');
jest.mock('../questions/projectName');
jest.mock('../questions/supportedPlatforms');
jest.mock('../questions/confirmGit');
jest.mock('../projectGenerator');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('Execute task.rnv.new', async () => {
    // GIVEN
    const ctx = getContext();
    const payload: NewProjectData = {
        defaults: {
            appVersion: 'MOCK_VERSION',
            templateName: 'MOCK_TEMPLATE',
            projectName: 'MOCK_PROJECT_NAME',
            appTitle: 'MOCK_APP_TITLE',
            workspaceID: 'MOCK_WORKSPACE',
        },
        inputs: {},
        files: {
            project: {
                renativeConfig: {},
                packageJson: {},
                renativeAppConfig: {},
            },
            template: {
                renativeTemplateConfig: {},
                renativeConfig: {},
            },
        },
    };
    jest.mocked(initNewProject).mockResolvedValue(payload);
    // WHEN
    const result = await taskNew.fn?.(ctx);
    // THEN
    expect(result).toEqual(true);
    expect(initNewProject).toHaveBeenCalled();
    expect(inquiryProjectName).toHaveBeenCalledWith(payload);
    expect(processChdirToProject).toHaveBeenCalled();
    expect(inquiryIsRenativeProject).toHaveBeenCalledWith(payload);
    expect(inquiryHasNodeModules).toHaveBeenCalledWith(payload);
    expect(inquiryInstallTemplate).toHaveBeenCalledWith(payload);
    expect(inquiryApplyTemplate).toHaveBeenCalledWith(payload);
    expect(saveProgressIntoProjectConfig).toHaveBeenCalledWith(payload);
    expect(inquiryAppTitle).toHaveBeenCalledWith(payload);
    expect(inquiryAppID).toHaveBeenCalledWith(payload);
    expect(inquiryAppVersion).toHaveBeenCalledWith(payload);
    expect(saveProgressIntoProjectConfig).toHaveBeenCalledWith(payload);
    expect(inquiryWorkspace).toHaveBeenCalledWith(payload);
    expect(inquirySupportedPlatforms).toHaveBeenCalledWith(payload);
    expect(inquiryBootstrapQuestions).toHaveBeenCalledWith(payload);
    expect(inquiryGit).toHaveBeenCalledWith(payload);
    expect(inquiryConfirm).toHaveBeenCalledWith(payload);
    expect(inquiryBookmarkTemplate).toHaveBeenCalledWith(payload);
    expect(generateNewProject).toHaveBeenCalledWith(payload);
    expect(telemetryNewProject).toHaveBeenCalledWith(payload);
});
