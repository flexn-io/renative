import { z } from 'zod';

export const PlatformCommonAndroid = z.object({
    //     'gradle.properties': {
    //         additionalProperties: true,
    //         type: 'object',
    //         description: 'Overrides values in `gradle.properties` file of generated android based project',
    //         examples: [
    //             {
    //                 'gradle.properties': {
    //                     'android.debug.obsoleteApi': true,
    //                     'debug.keystore': 'debug.keystore',
    //                     'org.gradle.daemon': true,
    //                     'org.gradle.parallel': true,
    //                     'org.gradle.configureondemand': true,
    //                 },
    //             },
    //         ],
    //     },
    //     'build.gradle': {
    //         additionalProperties: true,
    //         type: 'object',
    //         description: 'Overrides values in `build.gradle` file of generated android based project',
    //         examples: [
    //             {
    //                 allprojects: {
    //                     repositories: {
    //                         'maven { url "https://dl.bintray.com/onfido/maven" }': true,
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    //     'app/build.gradle': {
    //         additionalProperties: true,
    //         type: 'object',
    //         description: 'Overrides values in `app/build.gradle` file of generated android based project',
    //         examples: [
    //             {
    //                 apply: ["plugin: 'io.fabric'"],
    //             },
    //         ],
    //     },
    //     AndroidManifest: {
    //         additionalProperties: true,
    //         type: 'object',
    //         description: `Allows you to directly manipulate \`AndroidManifest.xml\` via json override mechanism
    // Injects / Overrides values in AndroidManifest.xml file of generated android based project
    // > IMPORTANT: always ensure that your object contains \`tag\` and \`android:name\` to target correct tag to merge into
    // `,
    //         examples: [
    //             {
    //                 children: [
    //                     {
    //                         tag: 'application',
    //                         'android:name': '.MainApplication',
    //                         children: [
    //                             {
    //                                 tag: 'activity',
    //                                 'android:name': 'com.ahmedadeltito.photoeditor.PhotoEditorActivity',
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //             {
    //                 children: [
    //                     {
    //                         tag: 'application',
    //                         'android:name': '.MainApplication',
    //                         'android:allowBackup': true,
    //                         'android:largeHeap': true,
    //                         'android:usesCleartextTraffic': true,
    //                         'tools:targetApi': 28,
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     applyPlugin: {
    //         type: 'array',
    //     },
    //     BuildGradle: {
    //         type: 'object',
    //         description: 'Allows you to customize `build.gradle` file',
    //         properties: {
    //             allprojects: {
    //                 type: 'object',
    //                 properties: {
    //                     repositories: {
    //                         type: 'object',
    //                         description: 'Customize repositories section of build.gradle',
    //                         additionalProperties: true,
    //                         examples: [
    //                             {
    //                                 "flatDir { dirs 'libs'}": true,
    //                             },
    //                         ],
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     implementation: {
    //         type: 'object',
    //     },
});
