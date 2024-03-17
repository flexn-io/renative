import { getContext, createRnvContext, logSuccess } from '@rnv/core';
import taskNew from '../taskNew';
import {
    generateNewProject,
    initNewProject,
    saveProgressIntoProjectConfig,
    telemetryNewProject,
} from '../projectGenerator';
import { NewProjectData } from '../types';
import { inquiryProjectName } from '../questions/projectName';
import { processChdirToProject } from '../utils';
import { inquiryIsRenativeProject } from '../questions/isRenativeProject';
import { inquiryHasNodeModules } from '../questions/hasNodeModules';
import { inquiryInstallTemplate } from '../questions/installTemplate';
import { inquiryApplyTemplate } from '../questions/applyTemplate';
import { inquiryAppTitle } from '../questions/appTitle';
import { inquiryAppID } from '../questions/appID';
import { inquiryAppVersion } from '../questions/projectVersion';
import { inquiryWorkspace } from '../questions/workspace';
import { inquirySupportedPlatforms } from '../questions/supportedPlatforms';
import { inquiryBootstrapQuestions } from '../questions/bootstrapQuestions';
import { inquiryGit } from '../questions/confirmGit';
import { inquiryBookmarkTemplate } from '../questions/bookmarkTemplate';
import { inquiryConfirm } from '../questions/confirmOverview';

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
jest.mock('../questions/bookmarkTemplate');
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
        defaultVersion: 'MOCK_VERSION',
        defaultTemplate: 'MOCK_TEMPLATE',
        optionTemplates: {},
        optionWorkspaces: {},
        optionPlatforms: {},
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
    expect(inquiryBookmarkTemplate).toHaveBeenCalledWith(payload);
    expect(inquiryConfirm).toHaveBeenCalledWith(payload);
    expect(generateNewProject).toHaveBeenCalledWith(payload);
    expect(telemetryNewProject).toHaveBeenCalledWith(payload);
    expect(logSuccess).toHaveBeenCalled();
});
