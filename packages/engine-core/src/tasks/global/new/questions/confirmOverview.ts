import {
    chalk,
    getContext,
    inquirerPrompt,
    printArrIntoBox,
    printBoxEnd,
    printBoxStart,
    printIntoBox,
} from '@rnv/core';
import type { NewProjectData } from '../types';

export const inquiryConfirm = async (data: NewProjectData) => {
    const c = getContext();
    const { ci } = c.program;
    _prepareProjectOverview(data);
    if (!ci) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            name: 'confirm',
            message: `\n${data.confirmString}\nIs all this correct?`,
        });

        if (!confirm) {
            return;
        }
    }
};

const _prepareProjectOverview = (data: NewProjectData) => {
    data.appTitle = data.inputAppTitle || data.defaultAppTitle;
    data.teamID = '';
    data.appID = data.inputAppID ? data.inputAppID.replace(/\s+/g, '-').toLowerCase() : data.appID;
    data.version = data.inputVersion || data.defaultVersion;
    const tempString = `${data.optionTemplates.selectedOption}@${data.optionTemplates.selectedVersion}`;

    const highlight = chalk().green;

    let str = printBoxStart('🚀  ReNative Project Generator');
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
    str += printIntoBox('');
    str += printIntoBox('Project Structure:');
    str += printIntoBox('');
    str += printIntoBox(data.projectName || 'UNKNOWN');
    str += chalk().gray(`│   ├── appConfigs            # Application flavour configuration files/assets │
│   │   └── [APP_ID]          # Example application flavour                    │
│   │       ├── assets        # Platform assets injected to ./platformAssets   │
│   │       ├── builds        # Platform files injected to ./platformBuilds    │
│   │       ├── fonts             # Folder for all custom fonts                │
│   │       ├── plugins           # Multi-platform plugins injections          │
│   │       └── renative.json # Application flavour config                     │
│   ├── platformAssets        # Generated cross-platform assets                │
│   ├── platformBuilds        # Generated platform app projects                │
│   ├── src                   # Source code files                              │
│   ├── index.*.js            # Entry files                                    │
│   └── renative.json         # ReNative project configuration                 │
`);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    data.confirmString = str;
};
