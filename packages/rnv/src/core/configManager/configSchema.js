

// ==================================================
// ENGINE PROPS
// ==================================================

const engineRnConfig = {

};

const engineRnWebConfig = {
    electronConfig: {
        docs: {
            description: 'Electron based config',
            example: ''
        },
        additionalProperties: true,
        type: 'object'
    },
    webpackConfig: {
        additionalProperties: true,
        type: 'object'
    },
    devServerHost: {
        type: 'string'
    }
};

const engineRnElectronConfig = {
    webpackConfig: {
        additionalProperties: true,
        type: 'object'
    },
    electronConfig: {
        additionalProperties: true,
        type: 'object'
    },
    BrowserWindow: {
        type: 'object',
        additionalProperties: false,
        properties: {
            width: {
                type: 'integer',
            },
            height: {
                type: 'integer',
            },
            webPreferences: {
                additionalProperties: true,
                type: 'object',
            }
        }
    }
};

// ==================================================
// COMMON PROPS
// ==================================================

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
    permissions: {
        docs: {
            description: 'DEPRECATED in favor of includedPermissions'
        },
        type: 'array',
        items: { type: 'string' }
    },
    runtime: {
        additionalProperties: true,
        type: 'object'
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
    },
    license: {
        type: 'string'
    },
    timestampAssets: {
        type: 'boolean'
    },
    versionedAssets: {
        type: 'boolean'
    },
    ext: {
        additionalProperties: true,
        type: 'object'
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
    },
    deploy: {
        additionalProperties: true,
        type: 'object',
        properties: {
            type: {
                type: 'string',
            }
        }
    }
};

// ==================================================
// PLATFORM PROPS
// ==================================================

const androidPlatformProps = {
    ...engineRnConfig,
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
    universalApk: {
        type: 'boolean'
    },
    aab: {
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
    'build.gradle': {
        additionalProperties: true,
        type: 'object'
    },
    'app/build.gradle': {
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
    storeFile: {
        type: 'string'
    },
    storePassword: {
        type: 'string'
    },
    keyAlias: {
        type: 'string'
    },
    keyPassword: {
        type: 'string'
    },
    excludedFeatures: {
        type: 'array'
    },
    includedFeatures: {
        type: 'array'
    }
};

const iosPlatformProps = {
    ...engineRnConfig,
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
    xcodeproj: {
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
        },
        examples: [
            {
                phone: [
                    'UIInterfaceOrientationPortrait',
                    'UIInterfaceOrientationPortraitUpsideDown',
                    'UIInterfaceOrientationLandscapeLeft',
                    'UIInterfaceOrientationLandscapeRight'
                ],
                tab: [
                    'UIInterfaceOrientationPortrait',
                    'UIInterfaceOrientationPortraitUpsideDown',
                    'UIInterfaceOrientationLandscapeLeft',
                    'UIInterfaceOrientationLandscapeRight'
                ]
            }
        ],
    },
    appDelegateApplicationMethods: {
        type: 'object',
        properties: {
            didFinishLaunchingWithOptions: {
                type: 'array',
            },
            open: {
                type: 'array',
            },
            supportedInterfaceOrientationsFor: {
                type: 'array',
            },
            didReceiveRemoteNotification: {
                type: 'array',
            },
            didFailToRegisterForRemoteNotificationsWithError: {
                type: 'array',
            },
            didReceive: {
                type: 'array',
            },
            didRegister: {
                type: 'array',
            },
            didRegisterForRemoteNotificationsWithDeviceToken: {
                type: 'array',
            }
        }
    },
    provisioningStyle: {
        type: 'string'
    },
    codeSignIdentity: {
        type: 'string'
    },
    provisionProfileSpecifier: {
        type: 'string'
    },
    provisioningProfiles: {
        additionalProperties: true,
        type: 'object',
    },
    systemCapabilities: {
        additionalProperties: true,
        type: 'object',
        examples: [
            {
                'com.apple.SafariKeychain': false,
                'com.apple.Wallet': false,
                'com.apple.HealthKit': false,
                'com.apple.ApplicationGroups.iOS': false,
                'com.apple.iCloud': true,
                'com.apple.DataProtection': false,
                'com.apple.HomeKit': false,
                'com.apple.ClassKit': false,
                'com.apple.VPNLite': false,
                'com.apple.AutoFillCredentialProvider': false,
                'com.apple.AccessWiFi': false,
                'com.apple.InAppPurchase': false,
                'com.apple.HotspotConfiguration': false,
                'com.apple.Multipath': false,
                'com.apple.GameCenter.iOS': false,
                'com.apple.BackgroundModes': false,
                'com.apple.InterAppAudio': false,
                'com.apple.WAC': false,
                'com.apple.Push': true,
                'com.apple.NearFieldCommunicationTagReading': false,
                'com.apple.ApplePay': false,
                'com.apple.Keychain': false,
                'com.apple.Maps.iOS': false,
                'com.apple.Siri': false,
                'com.apple.NetworkExtensions.iOS': false
            }
        ]
    },
    entitlements: {
        additionalProperties: true,
        type: 'object'
    },
    runScheme: {
        type: 'string'
    },
    sdk: {
        type: 'string'
    },
    testFlightId: {
        type: 'string'
    },
    appDelegateMethods: {
        additionalProperties: true,
        type: 'object'
    },
    appDelegateImports: {
        type: 'array'
    },
    firebaseId: {
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
            },
            provisioningProfiles: {
                additionalProperties: true,
                type: 'object',
            }
        }
    }
};

const webPlatformProps = {
    ...engineRnWebConfig,
    pagesDir: {
        type: 'string'
    },
    environment: {
        type: 'string'
    }
};

const tizenPlatformProps = {
    ...engineRnWebConfig,
    package: {
        type: 'string'
    },
    certificateProfile: {
        type: 'string'
    },
    appName: {
        type: 'string'
    }
};

const webosPlatformProps = {
    ...engineRnWebConfig
};

const firefoxPlatformProps = {
    ...engineRnWebConfig
};

const macosPlatformProps = {
    ...engineRnElectronConfig,
    appleId: {
        type: 'string'
    }
};

const winPlatformProps = {
    ...engineRnElectronConfig
};

const castPlatformProps = {
    ...engineRnWebConfig
};

// ==================================================
// BUILD SCHEME PROPS
// ==================================================

const buildSchemeProps = {
    buildSchemes: {
        additionalProperties: {
            type: 'object',
            additionalProperties: false,
            properties: {
                enabled: {
                    type: 'boolean'
                },
                ...commonPlatformProps,
                ...androidPlatformProps,
                ...iosPlatformProps,
                ...webPlatformProps,
                ...webosPlatformProps,
                ...tizenPlatformProps,
                ...firefoxPlatformProps,
                ...macosPlatformProps,
                ...castPlatformProps
            }
        },
        type: 'object'
    },
};

// ==================================================
// PLUGIN PROPS
// ==================================================

const pluginAndroidProps = {
    enabled: {
        type: 'boolean'
    },
    package: {
        type: 'string'
    },
    projectName: {
        type: 'string'
    },
    skipImplementation: {
        type: 'boolean'
    },
    afterEvaluate: {
        type: 'array'
    }
};

const pluginIosProps = {
    enabled: {
        type: 'boolean'
    },
    podName: {
        type: 'string'
    },
    podNames: {
        type: 'array'
    }
};


const pluginProps = {
    enabled: {
        type: 'boolean'
    },
    props: {
        additionalProperties: true,
        type: 'object'
    },
    version: {
        type: 'string'
    },
    source: {
        type: 'string'
    },
    'no-npm': {
        type: 'boolean'
    },
    npm: {
        additionalProperties: true,
        type: 'object',
    },
    pluginDependencies: {
        type: ['array', 'null'],
    },
    // DEPRECATED
    webpack: {
        additionalProperties: true,
        type: 'object',
    },
    webpackConfig: {
        additionalProperties: true,
        type: 'object',
    },
    android: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...pluginAndroidProps,
            ...androidPlatformProps
        }
    },
    androidtv: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...pluginAndroidProps,
            ...androidPlatformProps
        }
    },
    ios: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...pluginIosProps,
            ...iosPlatformProps
        }
    },
    tvos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...pluginIosProps,
            ...iosPlatformProps
        }
    },
    tizen: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...tizenPlatformProps
        }
    },
    webos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...webosPlatformProps
        }
    },
    web: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...webPlatformProps
        }
    },
    chromecast: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...castPlatformProps
        }
    },
    firefox: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...firefoxPlatformProps,
        }
    },
    macos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...macosPlatformProps
        }
    },
    windows: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...winPlatformProps
        }
    }
};

// ==================================================
// SCHEMA
// ==================================================

export const schemaPlatforms = {
    $id: 'http://renative.org/schemas/platforms.json',
    // required: [
    //     'id'
    // ],
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
        tvos: {
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
                ...buildSchemeProps,
                ...tizenPlatformProps
            }
        },
        webos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...webosPlatformProps
            }
        },
        web: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...webPlatformProps
            }
        },
        chromecast: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...castPlatformProps
            }
        },
        firefox: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...firefoxPlatformProps,
            }
        },
        macos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
                ...macosPlatformProps
            }
        },
        windows: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...commonPlatformProps,
                ...buildSchemeProps,
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
            // docs: {
            //     description: 'Common config props used as default',
            // },
            additionalProperties: false,
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
                chromecast: {
                    $ref: 'platforms.json#/definitions/chromecast'
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
            type: 'object',
            additionalProperties: {
                type: ['object', 'string'],
                additionalProperties: false,
                properties: {
                    ...pluginProps
                }
                // if: {
                //     type: 'object'
                // },
                // then: {
                //     additionalProperties: false,
                //     properties: {
                //         ...pluginProps
                //     }
                // },
                // else: {
                //     additionalProperties: false,
                // }
                // anyOf: [
                //     {
                //         type: 'object',
                //         additionalProperties: false,
                //         properties: {
                //             ...pluginProps
                //         }
                //     },
                //     { type: 'string' }
                // ]
            }
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
        versionCode: {
            type: 'string'
        },
        versionCodeFormat: {
            docs: {
                description: 'allows you to fine-tune auto generated version codes',
                example: `
default value: 00.00.00

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 10203

---

"versionCodeFormat" : "00.00.00.00.00"

IN: 1.2.3-rc.4+build.56 OUT: 102030456

IN: 1.2.3 OUT: 102030000`
            },
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
            additionalProperties: false,
            type: 'object',
            properties: {
                supportedPlatforms: {
                    type: 'array'
                },
                template: {
                    type: 'string'
                },
                schemes: {
                    type: 'object'
                },
                targets: {
                    type: 'object'
                },
                ports: {
                    type: 'object'
                }
            }
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
        },
        ext: {
            additionalProperties: true,
            type: 'object',
        }
    }
};

export const SCHEMAS = [schemaRoot, schemaPlatforms];
