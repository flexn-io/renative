import { z } from 'zod';
import { PlatformSharedAndroid } from './configPlatformSharedAndroid';

const EnableAndroidX = z.boolean().default(true).describe('Enables new android X architecture');

export const PlatformAndroid = PlatformSharedAndroid.merge(
    z.object({
        enableAndroidX: z.optional(EnableAndroidX),

        // enableHermes: {
        //     type: 'boolean',
        //     default: false,
        //     description: '> DEPRECATED in favour of `reactNativeEngine`',
        //     examples: [true, false],
        // },
        // reactNativeEngine: {
        //     type: 'string',
        //     default: 'default',
        //     description: 'Allows you to define specific native render engine to be used',
        //     examples: [true, false],
        // },
        // signingConfig: {
        //     type: 'string',
        //     default: 'Debug',
        //     description: 'Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`',
        //     examples: ['default', 'v8-android', 'v8-android-nointl', 'v8-android-jit', 'v8-android-jit-nointl', 'hermes'],
        // },
        // minSdkVersion: {
        //     type: 'integer',
        //     default: 21,
        //     examples: [21, 22],
        // },
        // multipleAPKs: {
        //     type: 'boolean',
        //     default: false,
        //     description:
        //         'If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"',
        //     examples: [true, false],
        // },
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
        // mainActivity: {
        //     type: 'object',
        //     description: 'Allows you to configure behaviour of MainActivity.kt',
        //     default: '{}',
        //     properties: {
        //         onCreate: {
        //             type: 'string',
        //             description: 'Overrides super.onCreate method handler of MainActivity.kt',
        //             default: 'super.onCreate(savedInstanceState)',
        //             examples: ['super.onCreate(null)', 'super.onCreate(savedInstanceState)'],
        //         },
        //     },
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
    })
);
