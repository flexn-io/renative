import { RnvTaskOptionPresets, logTask, RnvTask, RnvTaskName, updateRenativeConfigs } from '@rnv/core';
import inquiryBootstrapQuestions from './questions/bootstrapQuestions';
import inquiryGit from './questions/confirmGit';
import inquiryIsRenativeProject from './questions/isRenativeProject';
import inquiryHasNodeModules from './questions/hasNodeModules';
import inquiryConfirm from './questions/confirmOverview';
import inquiryProjectName from './questions/projectName';
import inquiryWorkspace from './questions/workspace';
import inquirySupportedPlatforms from './questions/supportedPlatforms';
import inquiryAppTitle from './questions/appTitle';
import inquiryAppID from './questions/appID';
import inquiryAppVersion from './questions/projectVersion';
import inquiryInstallTemplate from './questions/installTemplate';
import inquiryApplyTemplate from './questions/applyTemplate';
import inquiryBookmarkTemplate from './questions/bookmarkTemplate';
import { processChdirToProject } from './utils';
import {
    generateNewProject,
    initNewProject,
    saveProgressIntoProjectConfig,
    telemetryNewProject,
} from './projectGenerator';

const taskNew = async () => {
    logTask('taskNew');
    // Initialize Project
    const payload = await initNewProject();

    // Interactive Questions Required
    await inquiryProjectName(payload);
    await inquiryIsRenativeProject(payload);
    await inquiryHasNodeModules(payload);
    await inquiryWorkspace(payload);

    await saveProgressIntoProjectConfig(payload);
    await processChdirToProject();

    await inquiryInstallTemplate(payload);
    await inquiryApplyTemplate(payload);
    await saveProgressIntoProjectConfig(payload);

    await inquiryBookmarkTemplate(payload);
    await inquiryAppTitle(payload);
    await inquiryAppID(payload);
    await inquiryAppVersion(payload);
    await saveProgressIntoProjectConfig(payload);

    await inquirySupportedPlatforms(payload);
    await inquiryBootstrapQuestions(payload);
    await inquiryGit(payload);
    await inquiryConfirm(payload);
    // Generate Project
    await updateRenativeConfigs();
    await generateNewProject(payload);
    // Telementry
    await telemetryNewProject(payload);

    return true;
};

const Task: RnvTask = {
    description: 'Create new ReNative project',
    fn: taskNew,
    task: RnvTaskName.new,
    options: RnvTaskOptionPresets.withBase(),
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
