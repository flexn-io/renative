

// ==================================================
// ENGINE PROPS
// ==================================================

const engineRnConfig = {

};

const engineRnWebConfig = {
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
        type: 'object',
        description: 'Allows you to configure electron app as per https://www.electron.build/',
        examples: [
            {
                mac: {
                    target: [
                        'dmg',
                        'mas',
                        'mas-dev'
                    ],
                    hardenedRuntime: true
                },
                dmg: {
                    sign: false
                },
                mas: {
                    type: 'distribution',
                    hardenedRuntime: false
                }
            }
        ]
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

const commonRuntimeProps = {
    runtime: {
        additionalProperties: true,
        type: 'object',
        description: 'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code',
        examples: [
            {
                someRuntimeProperty: 'foo'
            }
        ]
    },
};

const commonProps = {
    ...commonRuntimeProps,
    excludedPlugins: {
        type: 'array',
        items: { type: 'string' },
        description: 'Defines an array of all excluded plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: excludedPlugins is evaluated after includedPlugins',
        examples: [
            ['*'],
            ['react-native-google-cast', 'react-navigation-tabs']
        ]
    },
    includedPlugins: {
        type: 'array',
        items: { type: 'string' },
        description: 'Defines an array of all included plugins for specific config or buildScheme. only full keys as defined in `plugin` should be used.\n\nNOTE: includedPlugins is evaluated before excludedPlugins',
        examples: [
            ['*'],
            ['react-native-google-cast', 'react-navigation-tabs']
        ]
    },
    includedPermissions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Allows you to include specific permissions by their KEY defined in `permissions` object',
        examples: [
            ['*'],
            [
                'INTERNET',
                'CAMERA',
                'SYSTEM_ALERT_WINDOW',
                'RECORD_AUDIO',
                'RECORD_VIDEO',
                'READ_EXTERNAL_STORAGE',
                'WRITE_EXTERNAL_STORAGE',
                'ACCESS_FINE_LOCATION',
                'ACCESS_COARSE_LOCATION',
                'VIBRATE',
                'ACCESS_NETWORK_STATE',
                'ACCESS_WIFI_STATE',
                'RECEIVE_BOOT_COMPLETED',
                'WRITE_CONTACTS',
                'READ_CONTACTS'
            ]
        ]
    },
    permissions: {
        description: '> DEPRECATED in favor of includedPermissions',
        type: 'array',
        items: { type: 'string' }
    },
    id: {
        type: 'string'
    },
    title: {
        type: 'string',
        description: 'Title of your app will be used to create title of the binary. ie App title of installed app iOS/Android app or Tab title of the website',
        examples: [
            'Awesome App'
        ]
    },
    description: {
        type: 'string',
        description: 'General description of your app. This prop will be injected to actual projects where description field is applicable',
        examples: [
            'This app does awesome things'
        ]
    },
    author: {
        additionalProperties: true,
        type: 'object'
    },
    includedFonts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of fonts you want to include in specific app or scheme. Should use exact font file (without the extension) located in `./appConfigs/base/fonts` or `*` to mark all',
        examples: [
            ['*'],
            [
                'TimeBurner',
                'Entypo'
            ]
        ]
    },
    backgroundColor: {
        type: 'string',
        description: 'Defines root view backgroundColor for all platforms in HEX format',
        examples: [
            '#FFFFFF',
            '#222222'
        ]
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

const platformCommonProps = {
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

const commonIosProps = {
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
    appDelegateMethods: {
        additionalProperties: true,
        type: 'object'
    },
    appDelegateImports: {
        type: 'array'
    },
};

const commonAndroidProps = {
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
        type: 'object',
        description: 'Allows you to directly manipulate `AndroidManifest.xml` via json override mechanism',
        examples: [
            {
                children: [
                    {
                        tag: 'application',
                        'android:name': '.MainApplication',
                        children: [
                            {
                                tag: 'activity',
                                'android:name': 'com.ahmedadeltito.photoeditor.PhotoEditorActivity'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    applyPlugin: {
        type: 'array'
    },
};


// ==================================================
// PLATFORM PROPS
// ==================================================

const platformAndroidProps = {
    ...engineRnConfig,
    ...commonAndroidProps,
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

const platformIosProps = {
    ...engineRnConfig,
    ...commonIosProps,
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

    provisioningStyle: {
        type: 'string'
    },
    codeSignIdentity: {
        type: 'string',
        description: 'Special property which tells Xcode how to build your project',
        examples: [
            'iPhone Developer',
            'iPhone Distribution'
        ]
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

const platformWebProps = {
    ...engineRnWebConfig,
    pagesDir: {
        type: 'string'
    },
    environment: {
        type: 'string'
    }
};

const platformTizenProps = {
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

const platformWebosProps = {
    ...engineRnWebConfig
};

const platformFirefoxProps = {
    ...engineRnWebConfig
};

const platformMacosProps = {
    ...engineRnElectronConfig,
    appleId: {
        type: 'string'
    }
};

const platformWindowsProps = {
    ...engineRnElectronConfig
};

const platformChromecastProps = {
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
                description: {
                    type: 'string',
                    description: 'Custom description of the buildScheme will be displayed directly in cli if you run rnv with an empty paramener `-s`',
                    examples: [
                        'This is some build scheme'
                    ]
                },
                ...platformCommonProps,
                ...platformAndroidProps,
                ...platformIosProps,
                ...platformWebProps,
                ...platformWebosProps,
                ...platformTizenProps,
                ...platformFirefoxProps,
                ...platformMacosProps,
                ...platformChromecastProps
            }
        },
        type: 'object'
    },
};

// ==================================================
// PLUGIN PROPS
// ==================================================

const pluginAndroidProps = {
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
    podName: {
        type: 'string'
    },
    podNames: {
        type: 'array'
    }
};

const commonPluginPlatformProps = {
    webpackConfig: {
        additionalProperties: true,
        type: 'object'
    },
    enabled: {
        type: 'boolean'
    },
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
        description: '> DEPRECATED in favour of `webpackConfig`'
    },
    webpackConfig: {
        additionalProperties: false,
        type: 'object',
        description: 'Allows you to configure webpack bahaviour per each individual plugin',
        properties: {
            modulePaths: {
                type: ['boolean', 'object'],
                additionalProperties: true,
            },
            moduleAliases: {
                type: ['boolean', 'object'],
                additionalProperties: true,
            }
        }
    },
    android: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
            ...commonAndroidProps,
            ...pluginAndroidProps
        }
    },
    androidtv: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
            ...commonAndroidProps,
            ...pluginAndroidProps
        }
    },
    androidwear: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
            ...commonAndroidProps,
            ...pluginAndroidProps
        }
    },
    ios: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
            ...commonIosProps,
            ...pluginIosProps,
        }
    },
    tvos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
            ...commonIosProps,
            ...pluginIosProps,
        }
    },
    tizen: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    webos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    web: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    chromecast: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    firefox: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    macos: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
        }
    },
    windows: {
        additionalProperties: false,
        type: 'object',
        properties: {
            ...commonPluginPlatformProps,
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
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformAndroidProps
            }
        },
        ios: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformIosProps
            }
        },
        tvos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformIosProps
            }
        },
        tizen: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformTizenProps
            }
        },
        webos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformWebosProps
            }
        },
        web: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformWebProps
            }
        },
        chromecast: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformChromecastProps
            }
        },
        firefox: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformFirefoxProps,
            }
        },
        macos: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformMacosProps
            }
        },
        windows: {
            additionalProperties: false,
            type: 'object',
            properties: {
                ...platformCommonProps,
                ...buildSchemeProps,
                ...platformWindowsProps
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
            type: 'object',
            description: 'Common config props used as default props for all available buildSchemes',
            examples: [
                {
                    author: {
                        name: 'Pavel Jacko',
                        email: 'Pavel Jacko <i@pavjacko.com>',
                        url: 'https://github.com/pavjacko'
                    },
                    license: 'MIT',
                    includedPlugins: ['*'],
                    includedFonts: ['*'],
                    backgroundColor: '#111111',
                    runtime: {
                        welcomeMessage: 'Hello ReNative!'
                    }
                }
            ],
            properties: {
                ...commonProps,
                ...buildSchemeProps
            }
        },
        ...commonRuntimeProps,
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
            type: 'object',
            description: 'List of SDK locations used by RNV. This property is usually located in your `WORKSPACE/renative.json`',
            examples: [
                {
                    ANDROID_SDK: '/Users/paveljacko/Library/Android/sdk',
                    ANDROID_NDK: '/Users/paveljacko/Library/Android/sdk/ndk-bundle',
                    TIZEN_SDK: '/Users/paveljacko/tizen-studio',
                    WEBOS_SDK: '/opt/webOS_TV_SDK',
                    KAIOS_SDK: '/Applications/Kaiosrt.app'
                }
            ]
        },
        // env: {
        //     additionalProperties: true,
        //     type: 'object'
        // },
        defaultTargets: {
            additionalProperties: true,
            type: 'object',
            description: 'List of default target simulators and emulators',
            examples: [
                {
                    android: 'Nexus_5X_API_26',
                    androidtv: 'Android_TV_1080p_API_22',
                    androidwear: 'Android_Wear_Round_API_28',
                    ios: 'iPhone 8',
                    tvos: 'Apple TV 4K',
                    tizen: 'T-samsung-5.5-x86',
                    tizenwatch: 'W-5.5-circle-x86',
                    tizenmobile: 'M-5.5-x86',
                    webos: 'emulator'
                }
            ]
        },
        plugins: {
            type: 'object',
            description: 'Define all plugins available in your project. you can then use `includedPlugins` and `excludedPlugins` props to define active and inactive plugins per each app config',
            examples: [
                {
                    renative: 'source:rnv',
                    react: 'source:rnv',
                    'react-native-cached-image': 'source:rnv',
                    'react-native-web-image-loader': 'source:rnv',
                    'react-native-gesture-handler': {
                        version: '1.0.0'
                    },
                }
            ],
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
            type: 'string',
            description: 'Name of the project which will be used in workspace as folder name. this will also be used as part of the KEY in crypto env var generator',
            examples: [
                'my-project',
                'myProject'
            ]
        },
        // name: {
        //     type: 'string'
        // },
        extend: {
            type: 'string'
        },
        projectTemplates: {
            additionalProperties: true,
            type: 'object',
            description: 'Custom list of renative templates (NPM package names) which will be displayed during `rnv new` project bootstrap. This prop usually resides in workspace config.',
            examples: [
                {
                    'my-custom-template': {}
                }
            ]
        },
        permissions: {
            additionalProperties: false,
            type: 'object',
            description: 'Permission definititions which can be used by app configs via `includedPermissions` and `excludedPermissions` to customize permissions for each app',
            examples: [
                {
                    ios: {},
                    android: {}
                }
            ],
            properties: {
                android: {
                    additionalProperties: true,
                    type: 'object',
                    description: 'Android SDK specific permissions',
                    examples: [
                        {
                            INTERNET: {
                                key: 'android.permission.INTERNET',
                                security: 'normal'
                            },
                            SYSTEM_ALERT_WINDOW: {
                                key: 'android.permission.SYSTEM_ALERT_WINDOW',
                                security: 'signature'
                            }
                        }
                    ]
                },
                ios: {
                    additionalProperties: true,
                    type: 'object',
                    description: 'iOS SDK specific permissions',
                    examples: [
                        {
                            NSAppleMusicUsageDescription: {
                                desc: 'Get favorite music'
                            },
                            NSBluetoothPeripheralUsageDescription: {
                                desc: 'Allow you to use your bluetooth to play music'
                            },
                            NSCalendarsUsageDescription: {
                                desc: 'Calendar for add events'
                            },
                            NSCameraUsageDescription: {
                                desc: 'Need camera to scan QR Codes'
                            },
                            NSLocationWhenInUseUsageDescription: {
                                desc: 'Geolocation tags for photos'
                            },
                            NSMicrophoneUsageDescription: {
                                desc: 'Need microphone for videos'
                            },
                            NSMotionUsageDescription: {
                                desc: 'To know when device is moving'
                            },
                            NSPhotoLibraryAddUsageDescription: {
                                desc: 'Need library to save images'
                            },
                            NSPhotoLibraryUsageDescription: {
                                desc: 'Allows to upload images from photo library'
                            },
                            NSSpeechRecognitionUsageDescription: {
                                desc: 'Speech Recognition to run in app commands'
                            },
                            NSContactsUsageDescription: {
                                desc: 'Get contacts list'
                            },
                            NSFaceIDUsageDescription: {
                                desc: 'Requires FaceID access to allows you quick and secure access.'
                            },
                            NSLocationAlwaysUsageDescription: {
                                desc: 'Geolocation tags for photos'
                            },
                            NSBluetoothAlwaysUsageDescription: {
                                desc: 'Allow you to use your bluetooth to play music'
                            },
                            NSLocationAlwaysAndWhenInUseUsageDescription: {
                                desc: 'Geolocation tags for photos'
                            }
                        }
                    ]
                }
            }
        },
        workspaceID: {
            type: 'string',
            description: 'Workspace ID your project belongs to. This will mach same folder name in the root of your user directory. ie `~/` on macOS',
            examples: [
                'rnv',
                'myCustomWorkspace',
            ],
        },
        version: {
            type: 'string',
            description: 'Semver style version of your app.',
            examples: [
                '0.1.0',
                '1.0.0',
                '1.0.0-alpha.1',
                '1.0.0-RC.7',
                '1.0.0-feature-x.0',
            ],
        },
        versionCode: {
            description: 'Manual verride of generated version code',
            type: 'string',
            examples: [
                '1000',
                '10023'
            ],
        },
        versionCodeFormat: {
            description: 'allows you to fine-tune auto generated version codes',
            examples: [
                '00.00.00',
                '00.00.00.00.00'
            ],
            docs: {
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
            type: 'object',
            description: 'Stores installed templates info in your project.\n\nNOTE: This prop will be updated by rnv if you run `rnv template install`',
            examples: [
                {
                    'renative-template-hello-world': {
                        version: '0.31.0'
                    }
                }
            ]
        },
        currentTemplate: {
            type: 'string'
        },
        crypto: {
            additionalProperties: false,
            type: 'object',
            description: 'This prop enables automatic encryp and decrypt of sensitive information in your project',
            properties: {
                encrypt: {
                    additionalProperties: false,
                    type: 'object',
                    properties: {
                        dest: {
                            type: 'string',
                            description: 'Location of encrypted file in your project used as destination of encryption from your workspace',
                            examples: [
                                'PROJECT_HOME/ci/privateConfigs.enc'
                            ]
                        }
                    }
                },
                decrypt: {
                    additionalProperties: false,
                    type: 'object',
                    properties: {
                        source: {
                            type: 'string',
                            description: 'Location of encrypted file in your project used as source of decryption into your workspace',
                            examples: [
                                'PROJECT_HOME/ci/privateConfigs.enc'
                            ]
                        }
                    }
                },
            }
        },
        integrations: {
            additionalProperties: true,
            type: 'object'
        },
        publish: {
            additionalProperties: true,
            type: 'object'
        },
        private: {
            additionalProperties: true,
            type: 'object',
            description: 'Special object which contains private info. this object should be used only in `renative.private.json` files and never commited to your repository. Private files usually reside in your workspace and are subject to crypto encryption if enabled. RNV will warn you if it finds private key in your regular `renative.json` file',
            examples: [
                {
                    myPrivateKy: '6568347563858739'
                }
            ]
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
