

const commonProps = {
    excludedPlugins: {
        type: 'array',
        items: { type: 'string' }
    },
    includedPlugins: {
        type: 'array',
        items: { type: 'string' }
    },
    includedPermissions: {
        type: 'array',
        items: { type: 'string' }
    },
    id: {
        type: 'string'
    },
    title: {
        type: 'string'
    },
    description: {
        type: 'string'
    },
    author: {
        additionalProperties: true,
        type: 'object'
    },
    includedFonts: {
        type: 'array',
        items: { type: 'string' }
    },
    backgroundColor: {
        type: 'string'
    },
    splashScreen: {
        type: 'boolean'
    },
    ignoreWarnings: {
        type: 'boolean'
    },
    ignoreLogs: {
        type: 'boolean'
    }
};

const commonPlatformProps = {
    ...commonProps,
    engine: {
        type: 'string'
    },
    entryFile: {
        type: 'string'
    },
    bundleAssets: {
        type: 'boolean'
    },
    bundleIsDev: {
        type: 'boolean'
    }
};

const androidPlatformProps = {
    enableAndroidX: {
        type: 'boolean'
    },
    enableHermes: {
        type: 'boolean'
    },
    signingConfig: {
        type: 'string'
    },
    minSdkVersion: {
        type: 'integer'
    },
    multipleAPKs: {
        type: 'boolean'
    },
    targetSdkVersion: {
        type: 'integer'
    },
    compileSdkVersion: {
        type: 'integer'
    },
    'gradle.properties': {
        additionalProperties: true,
        type: 'object'
    },
    AndroidManifest: {
        additionalProperties: true,
        type: 'object'
    },
    applyPlugin: {
        type: 'array'
    },
    excludedFeatures: {
        type: 'array'
    },
    includedFeatures: {
        type: 'array'
    }
};

const iosPlatformProps = {
    deploymentTarget: {
        type: 'string'
    },
    teamID: {
        type: 'string'
    },
    teamIdentifier: {
        type: 'string'
    },
    scheme: {
        type: 'string'
    },
    Podfile: {
        additionalProperties: true,
        type: 'object'
    },
    plist: {
        additionalProperties: true,
        type: 'object'
    },
    appleId: {
        type: 'string'
    },
    orientationSupport: {
        type: 'object',
        properties: {
            phone: {
                type: 'array',
            },
            tab: {
                type: 'array',
            }
        }
    },
    provisioningStyle: {
        type: 'string'
    },
    systemCapabilities: {
        additionalProperties: true,
        type: 'object'
    },
    entitlements: {
        additionalProperties: true,
        type: 'object'
    },
    runScheme: {
        type: 'string'
    },
    testFlightId: {
        type: 'string'
    },
    exportOptions: {
        type: 'object',
        additionalProperties: false,
        properties: {
            method: {
                type: 'string',
            },
            teamID: {
                type: 'string',
            },
            uploadBitcode: {
                type: 'boolean',
            },
            compileBitcode: {
                type: 'boolean',
            },
            uploadSymbols: {
                type: 'boolean',
            },
            signingStyle: {
                type: 'string',
            },
            signingCertificate: {
                type: 'string',
            }
        }
    }
};

const webPlatformProps = {
    pagesDir: {
        type: 'string'
    },
    webpackConfig: {
        additionalProperties: true,
        type: 'object'
    }
};

const tizenPlatformProps = {

};

const webosPlatformProps = {

};

const firefoxPlatformProps = {

};

const macosPlatformProps = {
    appleId: {
        type: 'string'
    }
};

const winPlatformProps = {

};

const buildSchemeProps = {
    buildSchemes: {
        additionalProperties: {
            type: 'object',
            additionalProperties: false,
            properties: {
                ...commonPlatformProps,
                ...androidPlatformProps,
                ...iosPlatformProps,
                ...webosPlatformProps,
                ...tizenPlatformProps,
                ...firefoxPlatformProps
            }
        },
        type: 'object'
    },
};

export const schemaPlatforms = {
    $id: 'http://renative.org/schemas/platforms.json',
    required: [
        'id'
    ],
    definitions: {
        android: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...androidPlatformProps
            }
        },
        ios: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...iosPlatformProps
            }
        },
        tizen: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...tizenPlatformProps
            }
        },
        webos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...webosPlatformProps
            }
        },
        web: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...webPlatformProps
            }
        },
        firefox: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...firefoxPlatformProps,
            }
        },
        macos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...macosPlatformProps
            }
        },
        windows: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...winPlatformProps
            }
        }
    }

};

export const schemaRoot = {
    $id: 'http://renative.org/schemas/renative.json',
    type: 'object',
    additionalProperties: false,
    properties: {
        common: {
            additionalProperties: false,
            description: 'Common config props used as default',
            type: 'object',
            properties: {
                ...commonProps,
                ...buildSchemeProps
            }
        },
        platforms: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ios: {
                    $ref: 'platforms.json#/definitions/ios'
                },
                android: {
                    $ref: 'platforms.json#/definitions/android'
                },
                web: {
                    $ref: 'platforms.json#/definitions/web'
                },
                tvos: {
                    $ref: 'platforms.json#/definitions/ios'
                },
                androidtv: {
                    $ref: 'platforms.json#/definitions/android'
                },
                webos: {
                    $ref: 'platforms.json#/definitions/webos'
                },
                macos: {
                    $ref: 'platforms.json#/definitions/macos'
                },
                tizen: {
                    $ref: 'platforms.json#/definitions/tizen'
                },
                windows: {
                    $ref: 'platforms.json#/definitions/macos'
                },
                firefoxtv: {
                    $ref: 'platforms.json#/definitions/firefox'
                },
                firefoxos: {
                    $ref: 'platforms.json#/definitions/firefox'
                },
                tizenmobile: {
                    $ref: 'platforms.json#/definitions/tizen'
                },
                tizenwatch: {
                    $ref: 'platforms.json#/definitions/tizen'
                },
                androidwear: {
                    $ref: 'platforms.json#/definitions/android'
                },
                kaios: {
                    $ref: 'platforms.json#/definitions/firefox'
                }
            }
        },
        sdks: {
            additionalProperties: true,
            type: 'object'
        },
        env: {
            additionalProperties: true,
            type: 'object'
        },
        defaultTargets: {
            additionalProperties: true,
            type: 'object'
        },
        plugins: {
            additionalProperties: true,
            type: 'object'
        },
        projectName: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        extend: {
            type: 'string'
        },
        projectTemplates: {
            additionalProperties: true,
            type: 'object'
        },
        permissions: {
            additionalProperties: true,
            type: 'object'
        },
        workspaceID: {
            type: 'string'
        },
        version: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        id: {
            type: 'string'
        },
        isWrapper: {
            type: 'boolean'
        },
        enableAnalytics: {
            type: 'boolean'
        },
        paths: {
            additionalProperties: false,
            type: 'object',
            properties: {
                appConfigsDir: {
                    type: 'string'
                },
                entryDir: {
                    type: 'string'
                },
                platformAssetsDir: {
                    type: 'string'
                },
                platformBuildsDir: {
                    type: 'string'
                },
                projectConfigDir: {
                    type: 'string'
                },
                pluginTemplates: {
                    additionalProperties: true,
                    type: 'object'
                }
            }
        },
        tasks: {
            additionalProperties: true,
            type: 'object'
        },
        pipes: {
            type: 'array'
        },
        defaults: {
            additionalProperties: true,
            type: 'object'
        },
        pluginTemplates: {
            additionalProperties: true,
            type: 'object'
        },
        templates: {
            additionalProperties: true,
            type: 'object'
        },
        currentTemplate: {
            type: 'string'
        },
        crypto: {
            additionalProperties: true,
            type: 'object'
        },
        integrations: {
            additionalProperties: true,
            type: 'object'
        },
        publish: {
            additionalProperties: true,
            type: 'object'
        },
        runtime: {
            additionalProperties: true,
            type: 'object'
        },
        hidden: {
            type: 'boolean'
        }
    }
};

export const SCHEMAS = [schemaRoot, schemaPlatforms];
