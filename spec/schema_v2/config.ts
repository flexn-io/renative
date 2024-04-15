import { z } from 'zod';

const WorkspaceID = z
    .string() //TODO: no spaces
    .describe(
        'Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS'
    );
type RnvConfigWorkspaceID = z.infer<typeof WorkspaceID>;

type RnvConfigProject = {
    workspaceID: string;
};

type RnvConfig = {
    // reantive.app.json
    app: {
        id: string;
        appConfigID: string;
        common: {};
    };
    // reantive.project.json
    project: {
        useTemplates: {
            '@rnv/template-configs': '1.1.2';
            '@rnv/template-starter': '12.0.4';
        };
        projectName: string;
        engines: {};
        extendsConfig: string;
        supportedPlatforms: [];
        platforms: {
            android: {
                buildSchemes: {};
            };
        };
        plugins: {
            'plugin-a': {};
        };
    };
    // reantive.template.json
    templateProject: {
        bootstrapConfig: {};
    };
    templateEngines: {
        engines: {};
    };
    templateIntegrations: {
        integrations: {};
    };
    templateProjects: {
        projects: {};
    };
    templatePlugins: {
        plugins: {};
    };
    // reantive.workspace.json
    workspace: {};
    // reantive.engine.json
    engine: {};
    // reantive.integration.json
    integration: {};
    // reantive.solution.json
    solution: {};
    // reantive.local.json
    local: {};
    // reantive.private.json
    private: {};
    // renative.runtime.json
    runtime: {};
    // reantive.templates.json
    // configTemplates: {
    //     plugins: {};
    //     templates: {};
    //     integrations: {};
    // };
};

type RnvConfig = {
    // reantive.app.json
    app: {
        id: string;
        appConfigID: string;
        common: {};
    };
    // reantive.project.json
    project: {
        projectName: string;
        engines: {};
        extendsConfig: string;
        supportedPlatforms: [];
        platforms: {
            android: {
                buildSchemes: {};
            };
        };
        plugins: {
            'plugin-a': {};
        };
    };
    // reantive.template.json
    template: {};
    // reantive.workspace.json
    workspace: {};
    // reantive.engine.json
    engine: {};
    // reantive.integration.json
    integration: {};
    // reantive.solution.json
    solution: {};
    // reantive.local.json
    local: {};
    // reantive.private.json
    private: {};
    // renative.runtime.json
    runtime: {};
    // reantive.templates.json
    configTemplates: {
        plugins: {};
        templates: {};
        integrations: {};
    };
};
