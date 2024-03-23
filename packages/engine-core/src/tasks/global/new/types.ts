import { ConfigFileApp, ConfigFileProject, ConfigFileTemplate, NpmPackageFile, PlatformKey } from '@rnv/core';

export type NewProjectData = {
    appTitle?: string;
    inputAppTitle?: string;
    packageName?: string;
    inputProjectName?: string;
    teamID?: string;
    inputAppID?: string;
    inputVersion?: string;
    inputTemplate?: string;
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
    inputSupportedPlatforms?: Array<string>;
    inputWorkspace?: string;
    selectedInputTemplate?: string;
    renativeTemplateConfigExt?: any;
    confirmDeleteNodeModules?: boolean;
    confirmInRnvProject?: boolean;
    // -------------------------------
    defaults: {
        appVersion: string;
        templateName: string;
        projectName: string;
        appTitle: string;
        workspaceID: string;
    };
    inputs: {
        tepmplate: {
            name: string;
            version?: string;
            description?: string;
            path?: string;
        };
    };
    files: {
        template: {
            renativeTemplateConfig: ConfigFileTemplate;
            renativeConfig: ConfigFileProject;
        };
        project: {
            renativeConfig: ConfigFileProject;
            packageJson: NpmPackageFile;
            renativeAppConfig: ConfigFileApp;
        };
    };
};
