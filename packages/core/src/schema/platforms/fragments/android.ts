import { z } from 'zod';
import { DEFAULTS } from '../../defaults';

export const zodPlatformAndroidFragment = z
    .object({
        enableAndroidX: z.union([z.boolean(), z.string()]).default(true).describe('Enables new android X architecture'),
        enableJetifier: z.union([z.boolean(), z.string()]).default(true).describe('Enables Jetifier'),
        signingConfig: z
            .string()
            .default('Debug')
            .describe('Equivalent to running `./gradlew/assembleDebug` or `./gradlew/assembleRelease`'),
        minSdkVersion: z
            .number()
            .default(28)
            .describe('Minimum Android SDK version device has to have in order for app to run'),
        multipleAPKs: z
            .boolean()
            .describe(
                'If set to `true`, apk will be split into multiple ones for each architecture: "armeabi-v7a", "x86", "arm64-v8a", "x86_64"'
            ),
        aab: z.boolean().describe('If set to true, android project will generate app.aab instead of apk'),
        extraGradleParams: z.string().describe('Allows passing extra params to gradle command'), //assembleAndroidTest -DtestBuildType=debug
        minifyEnabled: z.boolean().describe('Sets minifyEnabled buildType property in app/build.gradle'),
        targetSdkVersion: z
            .number()
            .describe(
                'Allows you define custom targetSdkVersion equivalent to: `targetSdkVersion = [VERSION]` in build.gradle'
            ),
        compileSdkVersion: z
            .number()
            .describe(
                'Allows you define custom compileSdkVersion equivalent to: `compileSdkVersion = [VERSION]` in build.gradle'
            ),
        kotlinVersion: z.string().default('1.7.10').describe('Allows you define custom kotlin version'),
        ndkVersion: z
            .string()
            .describe('Allows you define custom ndkVersion equivalent to: `ndkVersion = [VERSION]` in build.gradle'),
        supportLibVersion: z
            .string()
            .describe(
                'Allows you define custom supportLibVersion equivalent to: `supportLibVersion = [VERSION]` in build.gradle'
            ),
        googleServicesVersion: z
            .string()
            .describe(
                'Allows you define custom googleServicesVersion equivalent to: `googleServicesVersion = [VERSION]` in build.gradle'
            ),
        gradleBuildToolsVersion: z
            .string()
            .describe(
                "Allows you define custom gradle build tools version equivalent to:  `classpath 'com.android.tools.build:gradle:[VERSION]'`"
            ),
        gradleWrapperVersion: z
            .string()
            .describe(
                'Allows you define custom gradle wrapper version equivalent to: `distributionUrl=https\\://services.gradle.org/distributions/gradle-[VERSION]-all.zip`'
            ),
        excludedFeatures: z
            .array(z.string())
            .describe('Override features definitions in AndroidManifest.xml by exclusion'),
        includedFeatures: z
            .array(z.string())
            .describe('Override features definitions in AndroidManifest.xml by inclusion'),
        buildToolsVersion: z
            .string()
            .default(DEFAULTS.buildToolsVersion)
            .describe('Override android build tools version'),
        disableSigning: z.boolean(),
        storeFile: z.string().describe('Name of the store file in android project'),
        keyAlias: z.string().describe('Key alias of the store file in android project'),
        newArchEnabled: z.boolean().describe('Enables new arch for android. Default: false'),
        flipperEnabled: z.boolean().describe('Enables flipper  for ios. Default: true'),
    })
    .partial();

export type RnvPlatformAndroidFragment = z.infer<typeof zodPlatformAndroidFragment>;
