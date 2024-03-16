import { ConfigFileProject, ConfigFileTemplate, NpmPackageFile, PlatformKey } from '@rnv/core';

export type NewProjectData = {
    appTitle?: string;
    inputAppTitle?: string;
    packageName?: string;
    defaultAppTitle?: string;
    defaultTemplate?: string;
    inputProjectName?: string;
    teamID?: string;
    appID?: string;
    inputAppID?: string;
    inputVersion?: string;
    defaultVersion: string;
    inputTemplate?: string;
    version?: string;
    optionTemplates: {
        selectedOption?: string;
        selectedVersion?: string;
        valuesAsObject?: Record<
            string,
            {
                title: string;
                key: string;
                description: string;
                path?: string;
            }
        >;
        valuesAsArray?: Array<{
            title: string;
            key: string;
        }>;
        keysAsArray?: Array<string>;
    };
    projectName?: string;
    optionWorkspaces: {
        selectedOption?: string;
        valuesAsObject?: Record<
            string,
            {
                title: string;
                key: string;
            }
        >;
        valuesAsArray?: Array<string>;
        keysAsArray?: Array<string>;
    };
    gitEnabled?: boolean;
    optionPlatforms: {
        selectedOptions?: Array<PlatformKey>;
    };
    confirmString?: string;
    defaultProjectName?: string;
    defaultWorkspace?: string;
    inputSupportedPlatforms?: Array<string>;
    inputWorkspace?: string;

    selectedInputTemplate?: string;
    renativeTemplateConfigExt?: any;
    confirmDeleteNodeModules?: boolean;
    confirmInRnvProject?: boolean;
    files: {
        template: {
            renativeTemplateConfig: ConfigFileTemplate;
            renativeConfig: ConfigFileProject;
        };
        project: {
            renativeConfig: ConfigFileProject;
            packageJson: NpmPackageFile;
        };
    };
};