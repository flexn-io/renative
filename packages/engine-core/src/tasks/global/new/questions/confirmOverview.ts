import {
    chalk,
    // getContext,
    // inquirerPrompt,
    printArrIntoBox,
    printBoxEnd,
    printBoxStart,
    printIntoBox,
} from '@rnv/core';
import type { NewProjectData } from '../types';

export const inquiryConfirm = async (data: NewProjectData) => {
    // const c = getContext();
    // const { ci } = c.program;
    _prepareProjectOverview(data);
    // if (!ci) {
    //     const { confirm } = await inquirerPrompt({
    //         type: 'confirm',
    //         name: 'confirm',
    //         message: `\n${data.confirmString}\nIs all this correct?`,
    //     });

    //     if (!confirm) {
    //         // TOOD: this should reset the whole process
    //         return;
    //     }
    // }
};

const _prepareProjectOverview = (data: NewProjectData) => {
    const tempString = `${data.optionTemplates.selectedOption}@${data.optionTemplates.selectedVersion}`;

    const highlight = chalk().green;

    let str = printBoxStart('🚀 ReNative Project Generator');
    str += printIntoBox('');
    str += printIntoBox(`Project Name (folder): ${highlight(data.projectName)}`);
    str += printIntoBox(`Workspace: ${highlight(data.optionWorkspaces.selectedOption)}`);
    str += printIntoBox(`Project Title: ${highlight(data.appTitle)}`);
    str += printIntoBox(`Project Version: ${highlight(data.version)}`);
    str += printIntoBox(`App ID: ${highlight(data.appID)}`);
    str += printIntoBox(`Project Template: ${highlight(tempString)}`);
    str += printIntoBox(`Git Enabled: ${highlight(data.gitEnabled)}`);
    str += printIntoBox('');
    str += printIntoBox('Project Platforms:');
    str += printArrIntoBox(data.optionPlatforms.selectedOptions || []);
    str += printBoxEnd();
    str += '\n';

    data.confirmString = str;
};
