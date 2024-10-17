import type {
    ConfigFileBuildConfig,
    ConfigFileProject,
    ConfigFileTemplate,
    ConfigFileTemplates,
    NpmPackageFile,
    RnvPlatformKey,
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
        confirmProjectInstall?: boolean;
        appID?: string;
        appVersion?: string;
        projectName?: string;
        projectFolderName?: string;
        appTitle?: string;
        workspaceID?: string;
        packageName?: string;
        template?: TemplateOptionValue;
        supportedPlatforms?: Array<RnvPlatformKey>;
    };
    files: {
        template: {
            renativeTemplateConfig: ConfigFileTemplate;
            renativeConfig: Partial<ConfigFileProject>;
        };
        configTemplates: {
            config?: ConfigFileTemplates;
        };
        project: {
            renativeConfig: Partial<ConfigFileProject> & Pick<ConfigFileProject, 'project'>;
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
