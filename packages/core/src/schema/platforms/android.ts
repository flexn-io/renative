import { z } from 'zod';
import { TemplateAndroidBase } from './decorators/templateAndroidBase';
import { PlatformBase } from './base';
import { DEFAULTS } from '../defaults';

const EnableAndroidX = z.union([z.boolean(), z.string()]).default(true).describe('Enables new android X architecture');

export const PlatformAndroidPartialSchema = {
    enableAndroidX: z.optional(EnableAndroidX),
    signingConfig: z.optional(
        z
            .string()
            .default('Debug')
            .describe('Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`')
    ),
    reactNativeEngine: z.optional(
        z
            .enum(['jsc', 'v8-android', 'v8-android-nointl', 'v8-android-jit', 'v8-android-jit-nointl', 'hermes'])
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
        z.object({
            ...TemplateAndroidBase,

            settings_gradle: z.optional(z.object({})),
            gradle_wrapper_properties: z.optional(z.object({})),
            MainActivity_java: z.optional(
                z.object({
                    onCreate: z
                        .string({})
                        .optional()
                        .default('super.onCreate(savedInstanceState)')
                        .describe('Overrides super.onCreate method handler of MainActivity.java'),
                })
            ),
            MainApplication_java: z.optional(
                z
                    .object({
                        // onCreate: z
                        //     .string({})
                        //     .optional()
                        //     .default('super.onCreate(savedInstanceState)')
                        //     .describe('Overrides super.onCreate method handler of MainActivity.java'),
                    })
                    .describe('Allows you to configure behaviour of MainActivity')
            ),
            SplashActivity_java: z.optional(z.object({})),
            styles_xml: z.optional(z.object({})),
            colors_xml: z.optional(z.object({})),
            strings_xml: z.optional(z.object({})),
            proguard_rules_pro: z.optional(z.object({})),
        })
    ),
    aab: z.optional(z.boolean().describe('If set to true, android project will generate app.aab instead of apk')),
    extraGradleParams: z.optional(z.string().describe('Allows passing extra params to gradle command')), //assembleAndroidTest -DtestBuildType=debug
    minifyEnabled: z.optional(z.boolean().describe('Sets minifyEnabled buildType property in app/build.gradle')),
    targetSdkVersion: z.optional(
        z
            .number()
            .describe(
                'Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` in build.gradle'
            )
    ),
    compileSdkVersion: z.optional(
        z
            .number()
            .describe(
                'Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` in build.gradle'
            )
    ),
    kotlinVersion: z.optional(z.string().default('1.7.10').describe('Allows you define custom kotlin version')),
    ndkVersion: z.optional(
        z
            .string()
            .describe('Allows you define custom ndkVersion equivalent to: `ndkVersion = [VERSION]` in build.gradle')
    ),
    supportLibVersion: z.optional(
        z
            .string()
            .describe(
                'Allows you define custom supportLibVersion equivalent to: `supportLibVersion = [VERSION]` in build.gradle'
            )
    ),
    googleServicesVersion: z.optional(
        z
            .string()
            .describe(
                'Allows you define custom googleServicesVersion equivalent to: `googleServicesVersion = [VERSION]` in build.gradle'
            )
    ),
    gradleBuildToolsVersion: z.optional(
        z
            .string()
            .describe(
                "Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`"
            )
    ),
    gradleWrapperVersion: z.optional(
        z
            .string()
            .describe(
                'Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`'
            )
    ),
    excludedFeatures: z.optional(
        z.array(z.string()).describe('Override features definitions in AndroidManifest.xml by exclusion')
    ),
    includedFeatures: z.optional(
        z.array(z.string()).describe('Override features definitions in AndroidManifest.xml by inclusion')
    ),
    buildToolsVersion: z.optional(
        z.string().default(DEFAULTS.buildToolsVersion).describe('Override android build tools version')
    ),
    disableSigning: z.boolean().optional(),
    storeFile: z.array(z.string()).describe('Name of the store file in android project').optional(),
    keyAlias: z.array(z.string()).describe('Key alias of the store file in android project').optional(),
};

export const PlatformAndroid = PlatformBase.extend(PlatformAndroidPartialSchema);
