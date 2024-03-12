import { RnvTaskOptionPresets, chalk, logSuccess, logTask, RnvTask, RnvTaskName } from '@rnv/core';
import { inquiryBootstrapQuestions } from './questions/bootstrapQuestions';
import { inquiryGit } from './questions/confirmGit';
import { inquiryIsRenativeProject } from './questions/isRenativeProject';
import { inquiryHasNodeModules } from './questions/hasNodeModules';
import { inquiryConfirm } from './questions/confirmOverview';
import { inquiryProjectName } from './questions/projectName';
import { inquiryProjectDetails } from './questions/projectDetails';
import { inquiryWorkspace } from './questions/workspace';
import { inquiryTemplate } from './questions/template';
import { inquirySupportedPlatforms } from './questions/supportedPlatforms';
import { initNewProject, logTelemetry } from './projectGenerator';

const taskNew = async () => {
    logTask('taskNew');

    const data = await initNewProject();

    await inquiryIsRenativeProject();
    await inquiryHasNodeModules();
    await inquiryProjectName({ data });
    await inquiryProjectDetails({ data });
    await inquiryWorkspace({ data });
    await inquiryTemplate({ data });
    await inquirySupportedPlatforms({ data });
    await inquiryBootstrapQuestions({ data });
    await inquiryGit({ data });
    await inquiryConfirm({ data });

    await logTelemetry({ data });

    logSuccess(
        `Your project is ready! navigate to project ${chalk().bold(`cd ${data.projectName}`)} and run ${chalk().bold(
            'npx rnv run'
        )} to see magic happen!`
    );

    return true;
};

const Task: RnvTask = {
    description: 'Create new ReNative project',
    fn: taskNew,
    task: RnvTaskName.new,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
