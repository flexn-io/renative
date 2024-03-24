import {
    RnvTaskOptionPresets,
    logTask,
    RnvTask,
    RnvTaskName,
    updateRenativeConfigs,
    logToSummary,
    applyTemplate,
    configureTemplateFiles,
    generateLocalJsonSchemas,
} from '@rnv/core';
import inquiryBootstrapQuestions from './questions/bootstrapQuestions';
import inquiryGit from './questions/confirmGit';
import inquiryIsRenativeProject from './questions/isRenativeProject';
import inquiryHasNodeModules from './questions/hasNodeModules';
import inquiryProjectName from './questions/projectName';
import inquiryWorkspace from './questions/workspace';
import inquirySupportedPlatforms from './questions/supportedPlatforms';
import inquiryAppTitle from './questions/appTitle';
import inquiryAppID from './questions/appID';
import inquiryAppVersion from './questions/projectVersion';
import inquiryInstallTemplate from './questions/installTemplate';
import inquiryApplyTemplate from './questions/applyTemplate';
import inquiryBookmarkTemplate from './questions/bookmarkTemplate';
import inquiryAppConfigs from './questions/appConfigs';

import { processChdirToProject } from './utils';
import {
    configureConfigOverrides,
    generateProjectOverview,
    initNewProject,
    saveProgressIntoProjectConfig,
    telemetryNewProject,
} from './projectGenerator';

const taskNew = async () => {
    logTask('taskNew');
    // Initialize Project
    const payload = await initNewProject();
    // Initial questions
    await inquiryProjectName(payload);
    await inquiryIsRenativeProject(payload);
    await inquiryHasNodeModules(payload);
    await inquiryWorkspace(payload);
    await saveProgressIntoProjectConfig(payload);
    // Switch execution context to new directory
    await processChdirToProject();
    // Install template only (this avoids whole npm project install)
    await inquiryInstallTemplate(payload);
    await inquiryApplyTemplate(payload);
    await saveProgressIntoProjectConfig(payload);
    // Gather project/app info
    await inquiryBookmarkTemplate(payload);
    await inquiryAppTitle(payload);
    await inquiryAppID(payload);
    await inquiryAppVersion(payload);
    await saveProgressIntoProjectConfig(payload);

    await inquirySupportedPlatforms(payload);
    await inquiryBootstrapQuestions(payload);
    await inquiryGit(payload);
    // Configure final config overrides
    await updateRenativeConfigs();
    await configureConfigOverrides(payload);
    await saveProgressIntoProjectConfig(payload);
    // Now we can apply template (required for appConfigs to be generated properly)
    await applyTemplate();
    await configureTemplateFiles();
    await generateLocalJsonSchemas();
    await inquiryAppConfigs(payload);
    // Telementry
    await telemetryNewProject(payload);

    logToSummary(generateProjectOverview(payload));

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
