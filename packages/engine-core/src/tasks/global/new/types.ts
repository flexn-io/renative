import type {
    ConfigFileBuildConfig,
    ConfigFileProject,
    ConfigFileTemplate,
    NpmPackageFile,
    PlatformKey,
} from '@rnv/core';

export type NewProjectData = {
    defaults: {
        appVersion: string;
        templateName: string;
        projectName: string;
        appTitle: string;
        workspaceID: string;
    };
    inputs: {
        bootstrapQuestions?: any;
        confirmDeleteNodeModules?: boolean;
        confirmInRnvProject?: boolean;
        confirmEnableGit?: boolean;
        appID?: string;
        appVersion?: string;
        projectName?: string;
        projectFolderName?: string;
        appTitle?: string;
        workspaceID?: string;
        packageName?: string;
        tepmplate?: TemplateOptionValue;
        supportedPlatforms?: Array<PlatformKey>;
    };
    files: {
        template: {
            renativeTemplateConfig: ConfigFileTemplate;
            renativeConfig: ConfigFileProject;
        };
        project: {
            renativeConfig: ConfigFileProject;
            packageJson: NpmPackageFile;
            // renativeAppConfig: ConfigFileApp;
        };
    };
};

type TemplateOptionValue = {
    type?: 'existing' | 'custom' | 'local' | 'none';
    version?: string;
} & Required<ConfigFileBuildConfig>['projectTemplates'][string];

export type TemplateOption = {
    name: string;
    value: TemplateOptionValue;
};
