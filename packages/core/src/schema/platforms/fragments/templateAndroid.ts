import { z } from 'zod';
import type { ConfigAndroidManifestChildType, ConfigAndroidResourcesChildType } from '../../types';

const T = <T>(schema: z.ZodType<T>) => {
    return schema;
};

// strings.xml | values.xml | styles.xml
// ==============================================================
export const zodResourcesChildBase = z.object({
    tag: z.string(),
    name: z.optional(z.string()),
    parent: z.optional(z.string()),
    value: z.optional(z.string()),
});

export const zodResourcesChildWithChildren: z.ZodType<ConfigAndroidResourcesChildType> = zodResourcesChildBase.extend({
    children: z.lazy(() => zodResourcesChildWithChildren.array()).optional(),
});

export const zodAndroidResources = zodResourcesChildBase.extend({
    children: z.array(zodResourcesChildWithChildren).optional(),
}).describe(`Allows you to directly manipulate \`res/values files\` via json override mechanism
Injects / Overrides values in res/values files of generated android based project
> IMPORTANT: always ensure that your object contains \`tag\` and \`name\` to target correct tag to merge into
 `);
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigTemplateAndroidResources extends z.infer<typeof zodAndroidResources> {}

// AndroidManifest.xml
// ==============================================================
export const zodManifestChildBase = z.object({
    //Shared
    tag: z.string(),
    // TODO: to be removed once manifest and resource parsers are separated
    name: z.string().optional(),
    'android:name': z.string().optional(),
    'android:theme': z.string().optional(),
    'android:value': z.any().optional(),
    //Application
    'android:required': z.boolean().optional(),
    'android:allowBackup': z.boolean().optional(),
    'android:largeHeap': z.boolean().optional(),
    'android:label': z.string().optional(),
    'android:icon': z.string().optional(),
    'android:roundIcon': z.string().optional(),
    'android:banner': z.string().optional(),
    'tools:replace': z.string().optional(),
    'android:supportsRtl': z.boolean().optional(),
    'tools:targetApi': z.number().optional(),
    'android:usesCleartextTraffic': z.boolean().optional(),
    'android:appComponentFactory': z.string().optional(),
    //Activity
    'android:screenOrientation': z.string().optional(),
    'android:noHistory': z.boolean().optional(),
    'android:launchMode': z.string().optional(),
    'android:exported': z.boolean().optional(),
    'android:configChanges': z.string().optional(),
    'android:windowSoftInputMode': z.string().optional(),
});

export const zodManifestChildWithChildren: z.ZodType<ConfigAndroidManifestChildType> = zodManifestChildBase.extend({
    children: z.lazy(() => zodManifestChildWithChildren.array()).optional(),
});

export const zodAndroidManifest = z.object({
    tag: z.string(),
    package: z.string().optional(),
    'xmlns:android': z.string().optional(),
    'xmlns:tools': z.string().optional(),
    children: z.array(zodManifestChildWithChildren).optional(),
}).describe(`Allows you to directly manipulate \`AndroidManifest.xml\` via json override mechanism
Injects / Overrides values in AndroidManifest.xml file of generated android based project
> IMPORTANT: always ensure that your object contains \`tag\` and \`android:name\` to target correct tag to merge into
 `);
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigTemplateAndroidAndroidManifest extends z.infer<typeof zodAndroidManifest> {}

// MainActivity.kt
// ==============================================================
const zodMainActivity_kt = z
    .object({
        onCreate: z
            .string({})

            .default('super.onCreate(savedInstanceState)')
            .describe('Overrides super.onCreate method handler of MainActivity.kt'),
        imports: z.array(z.string()),
        methods: z.array(z.string()),
        createMethods: z.array(z.string()),
        resultMethods: z.array(z.string()),
    })
    .partial();
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigTemplateAndroidMainActivityKT extends z.infer<typeof zodMainActivity_kt> {}

// MainApplication.kt
// ==============================================================
const zodMainApplication_kt = z
    .object({
        imports: z.array(z.string()),
        methods: z.array(z.string()),
        createMethods: z.array(z.string()),
        packages: z.array(z.string()),
        packageParams: z.array(z.string()),
        // onCreate: z
        //     .string({})
        //     .default('super.onCreate(savedInstanceState)')
        //     .describe('Overrides super.onCreate method handler of MainActivity.java'),
    })
    .partial()
    .describe('Allows you to configure behaviour of MainActivity');
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigTemplateAndroidMainApplicationKT extends z.infer<typeof zodMainApplication_kt> {}

// templateAndroid
// ==============================================================
const templateAndroid = z
    .object({
        gradle_properties: z
            .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
            .describe('Overrides values in `gradle.properties` file of generated android based project'),
        build_gradle: z
            .object({
                plugins: z.array(z.string()),
                buildscript: z.object({
                    repositories: z.array(z.string()),
                    dependencies: z.array(z.string()),
                    ext: z.array(z.string()),
                    custom: z.array(z.string()),
                }),
                injectAfterAll: z.array(z.string()),
            })
            .partial()
            .describe('Overrides values in `build.gradle` file of generated android based project'),
        app_build_gradle: z
            .object({
                apply: z.array(z.string()),
                defaultConfig: z.array(z.string()),
                buildTypes: z.object({
                    debug: z.optional(z.array(z.string())),
                    release: z.optional(z.array(z.string())),
                }),

                afterEvaluate: z.array(z.string()),
                implementations: z.array(z.string()),
                implementation: z.string(),
            })
            .partial()
            .describe('Overrides values in `app/build.gradle` file of generated android based project'),
        AndroidManifest_xml: T<ConfigTemplateAndroidAndroidManifest>(zodAndroidManifest),
        strings_xml: T<ConfigTemplateAndroidResources>(zodAndroidResources),
        styles_xml: T<ConfigTemplateAndroidResources>(zodAndroidResources),
        colors_xml: T<ConfigTemplateAndroidResources>(zodAndroidResources),
        MainApplication_kt: T<ConfigTemplateAndroidMainApplicationKT>(zodMainApplication_kt),
        MainActivity_kt: T<ConfigTemplateAndroidMainActivityKT>(zodMainActivity_kt),
        SplashActivity_kt: z.object({}),
        settings_gradle: z.object({
            include: z.array(z.string()),
            project: z.array(z.string()),
        }),
        gradle_wrapper_properties: z.object({}),
        proguard_rules_pro: z.object({}),
    })
    .partial();
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigTemplateAndroidBase extends z.infer<typeof templateAndroid> {}

export const zodTemplateAndroidFragment = z
    .object({
        templateAndroid: T<ConfigTemplateAndroidBase>(templateAndroid),
    })
    .partial()
    .describe('Allows more advanced modifications to Android based project template');
