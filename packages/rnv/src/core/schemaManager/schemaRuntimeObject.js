

export const schemaRoot = {
    $id: 'http://renative.org/schemas/runtimeObject.json',
    type: 'object',
    additionalProperties: false,
    properties: {
        buildConfig: {
            additionalProperties: true,
            type: 'object',
        },
        cli: {
            additionalProperties: false,
            type: 'object',
        },
        files: {
            additionalProperties: false,
            type: 'object',
            properties: {
                rnv: {
                    additionalProperties: true,
                    type: 'object',
                },
                workspace: {
                    additionalProperties: true,
                    type: 'object',
                },
                defaultWorkspace: {
                    additionalProperties: true,
                    type: 'object',
                },
                project: {
                    additionalProperties: true,
                    type: 'object',
                },
                appConfig: {
                    additionalProperties: true,
                    type: 'object',
                },

                buildHooks: {
                    additionalProperties: true,
                    type: 'object',
                },
                home: {
                    additionalProperties: true,
                    type: 'object',
                },
                template: {
                    additionalProperties: true,
                    type: 'object',
                },
            }
        },
        paths: {
            additionalProperties: false,
            type: 'object',
            properties: {
                GLOBAL_RNV_DIR: {
                    type: 'string',
                },
                GLOBAL_RNV_CONFIG: {
                    type: 'string',
                },
                rnv: {
                    additionalProperties: true,
                    type: 'object',
                },
                workspace: {
                    additionalProperties: true,
                    type: 'object',
                },
                defaultWorkspace: {
                    additionalProperties: true,
                    type: 'object',
                },
                project: {
                    additionalProperties: true,
                    type: 'object',
                },
                appConfig: {
                    additionalProperties: true,
                    type: 'object',
                },

                buildHooks: {
                    additionalProperties: true,
                    type: 'object',
                },
                home: {
                    additionalProperties: true,
                    type: 'object',
                },
                template: {
                    additionalProperties: true,
                    type: 'object',
                },
            }
        },
        runtime: {
            additionalProperties: false,
            type: 'object',
            properties: {
                appId: {
                    type: 'string',
                },
                port: {
                    type: 'integer',
                },
                target: {
                    type: 'string',
                },
                scheme: {
                    type: 'string',
                },
                localhost: {
                    type: 'string',
                },
                timestamp: {
                    type: 'integer',
                },
                isWrapper: {
                    type: 'boolean',
                },
                missingEnginePlugins: {
                    additionalProperties: true,
                    type: 'object',
                },
                engine: {
                    additionalProperties: true,
                    type: 'object',
                },
                task: {
                    type: 'string',
                },
                bundleAssets: {
                    type: 'boolean',
                },
                hosted: {
                    type: 'boolean',
                },
                supportedPlatforms: {
                    type: 'array',
                },
            }
        },
        isBuildHooksReady: {
            type: 'boolean',
        },
        program: {
            additionalProperties: true,
            type: 'object',
        },
        process: {
            additionalProperties: true,
            type: 'object',
        },
        command: {
            type: 'string',
        },
        subCommand: {
            type: 'string',
        },
        platformDefaults: {
            additionalProperties: true,
            type: 'object',
        },
        platform: {
            additionalProperties: true,
            type: 'object',
        },
        timeStart: {
            additionalProperties: true,
            type: 'object',
        },
        rnvVersion: {
            type: 'string',
        },
        configPropsInjects: {
            type: 'array',
        },
        runtimePropsInjects: {
            type: 'array',
        },
        systemPropsInjects: {
            type: 'array',
        },
        _currentTask: {
        },
        buildHooks: {
            additionalProperties: true,
            type: 'object',
        },
        buildPipes: {
            additionalProperties: true,
            type: 'object',
        },
        isBuildHookReady: {
            additionalProperties: true,
            type: 'object',
        },
        rnv: {
            additionalProperties: true,
            type: 'object',
        },
        workspace: {
            additionalProperties: true,
            type: 'object',
        },
        defaultWorkspace: {
            additionalProperties: true,
            type: 'object',
        },
        project: {
            additionalProperties: true,
            type: 'object',
        },
        appConfig: {
            additionalProperties: true,
            type: 'object',
        },
        home: {
            additionalProperties: true,
            type: 'object',
        },
        template: {
            additionalProperties: true,
            type: 'object',
        }
    }
};

export const SCHEMAS_RUNTIME_OBJECT = [schemaRoot];
