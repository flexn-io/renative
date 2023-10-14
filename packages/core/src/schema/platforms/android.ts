import { z } from 'zod';
import { TemplateAndroidBase } from './templateAndroidBase';

const EnableAndroidX = z.boolean().default(true).describe('Enables new android X architecture');

export const PlatformAndroid = z.object({
    enableAndroidX: z.optional(EnableAndroidX),
    signingConfig: z.optional(
        z
            .string()
            .default('Debug')
            .describe('Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`')
    ),
    reactNativeEngine: z.optional(
        z
            .enum(['v8-android', 'v8-android-nointl', 'v8-android-jit', 'v8-android-jit-nointl', 'hermes'])
            .default('hermes')
            .describe('Allows you to define specific native render engine to be used')
    ),
    minSdkVersion: z.optional(
        z.number().default(28).describe('Minimum Android SDK version device has to have in order for app to run')
    ),
    multipleAPKs: z.optional(
        z
            .boolean()
            .describe(
                'If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"'
            )
    ),
    templateAndroid: z.optional(
        TemplateAndroidBase.merge(
            z.object({
                settings_gradle: z.object({}),
                gradle_wrapper_properties: z.object({}),
                MainActivity_java: z.object({}),
                MainApplication_java: z
                    .object({
                        onCreate: z.object({
                            //         onCreate: {
                            //             type: 'string',
                            //             description: 'Overrides super.onCreate method handler of MainActivity.kt',
                            //             default: 'super.onCreate(savedInstanceState)',
                            //             examples: ['super.onCreate(null)', 'super.onCreate(savedInstanceState)'],
                            //         },
                        }),
                    })
                    .describe('Allows you to configure behaviour of MainActivity'),
                SplashActivity_java: z.object({}),
                styles_xml: z.object({}),
                colors_xml: z.object({}),
                strings_xml: z.object({}),
                proguard_rules_pro: z.object({}),
            })
        )
    ),

    // aab: {
    //     type: 'boolean',
    //     description: 'If set to true, android project will generate app.aab instead of apk',
    //     default: false,
    //     examples: [false, true],
    // },
    // extraGradleParams: {
    //     type: 'string',
    //     description: 'Allows passing extra params to gradle command',
    //     examples: ['assembleAndroidTest -DtestBuildType=debug'],
    // },
    // minifyEnabled: {
    //     type: 'boolean',
    //     description: 'Sets minifyEnabled buildType property in app/build.gradle',
    //     default: false,
    //     examples: [false, true],
    // },
    // targetSdkVersion: {
    //     type: 'integer',
    //     description: 'Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` ',
    //     examples: [28, 29],
    // },
    // compileSdkVersion: {
    //     type: 'integer',
    //     description: 'Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` ',
    //     examples: [28, 29],
    // },
    // gradleBuildToolsVersion: {
    //     type: 'integer',
    //     description:
    //         "Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`",
    //     default: '3.3.1',
    //     examples: ['3.3.1', '4.1.0'],
    // },
    // gradleWrapperVersion: {
    //     type: 'integer',
    //     description:
    //         'Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`',
    //     default: '5.5',
    //     examples: ['5.5', '6.7.1'],
    // },
    // storeFile: {
    //     type: 'string',
    // },
    // storePassword: {
    //     type: 'string',
    //     description: `${SENSITIVE}storePassword for keystore file`,
    // },
    // keyAlias: {
    //     type: 'string',
    // },
    // keyPassword: {
    //     type: 'string',
    //     description: `${SENSITIVE}keyPassword for keystore file`,
    // },
    // excludedFeatures: {
    //     type: 'array',
    // },
    // includedFeatures: {
    //     type: 'array',
    // },
});
