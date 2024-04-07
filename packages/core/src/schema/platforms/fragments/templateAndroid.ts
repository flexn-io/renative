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
    children: z.lazy(() => zodResourcesChildWithChildren.array()),
});

export const zodAndroidResources = zodResourcesChildBase.extend({
    children: z.array(zodResourcesChildWithChildren),
}).describe(`Allows you to directly manipulate \`res/values files\` via json override mechanism
Injects / Overrides values in res/values files of generated android based project
> IMPORTANT: always ensure that your object contains \`tag\` and \`name\` to target correct tag to merge into
 `);
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
export interface ConfigTemplateAndroidResources extends z.infer<typeof zodAndroidResources> {}

// AndroidManifest.xml
// ==============================================================
export const zodManifestChildBase = z.object({
    tag: z.string(),
    'android:name': z.string(),
    'android:required': z.boolean().optional(),
    // 'android:name': '.MainApplication',
    // 'android:allowBackup': true,
    // 'android:largeHeap': true,
    // 'android:usesCleartextTraffic': true,
    // 'tools:targetApi': 28,
});

export const zodManifestChildWithChildren: z.ZodType<ConfigAndroidManifestChildType> = zodManifestChildBase.extend({
    children: z.lazy(() => zodManifestChildWithChildren.array()),
});

export const zodAndroidManifest = zodManifestChildBase.extend({
    package: z.string().optional(),
    children: z.array(zodManifestChildWithChildren).optional(),
}).describe(`Allows you to directly manipulate \`AndroidManifest.xml\` via json override mechanism
Injects / Overrides values in AndroidManifest.xml file of generated android based project
> IMPORTANT: always ensure that your object contains \`tag\` and \`android:name\` to target correct tag to merge into
 `);
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
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
                allprojects: z.object({
                    repositories: z
                        .record(z.string(), z.boolean())
                        .describe('Customize repositories section of build.gradle'),
                }),
                plugins: z.array(z.string()),
                buildscript: z.object({
                    repositories: z.record(z.string(), z.boolean()),
                    dependencies: z.record(z.string(), z.boolean()),
                }),
                dexOptions: z.record(z.string(), z.boolean()),
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
        settings_gradle: z.object({}),
        gradle_wrapper_properties: z.object({}),
        proguard_rules_pro: z.object({}),
    })
    .partial();
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
export interface ConfigTemplateAndroidBase extends z.infer<typeof templateAndroid> {}

export const zodTemplateAndroidFragment = z
    .object({
        templateAndroid: T<ConfigTemplateAndroidBase>(templateAndroid),
    })
    .partial()
    .describe('Allows more advanced modifications to Android based project template');
