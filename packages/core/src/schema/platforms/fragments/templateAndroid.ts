import { z } from 'zod';
import type { ConfigAndroidManifestChildType } from '../../types';

const T = <T>(schema: z.ZodType<T>) => {
    return schema;
};

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

// type ManifestFeature = {
//     tag: string;
//     'android:name': string;
//     'android:required': boolean;
//     children?: Array<ManifestFeature>;
// };

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
export interface ConfigTemplateAndroidAndroidManifest extends z.infer<typeof zodAndroidManifest> {}

const MainActivity_kt = z
    .object({
        onCreate: z
            .string({})

            .default('super.onCreate(savedInstanceState)')
            .describe('Overrides super.onCreate method handler of MainActivity.java'),
        imports: z.array(z.string()),
        methods: z.array(z.string()),
        createMethods: z.array(z.string()),
        resultMethods: z.array(z.string()),
    })
    .partial();
export interface ConfigTemplateAndroidMainActivityKT extends z.infer<typeof MainActivity_kt> {}

const MainApplication_kt = z
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
export interface ConfigTemplateAndroidMainApplicationKT extends z.infer<typeof MainApplication_kt> {}

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
        strings_xml: z.object({
            children: z.array(
                z.object({
                    tag: z.string(),
                    name: z.string().optional(),
                    child_value: z.string().optional(),
                })
            ),
        }),
        MainActivity_kt: T<ConfigTemplateAndroidMainActivityKT>(MainActivity_kt),
        MainApplication_kt: T<ConfigTemplateAndroidMainApplicationKT>(MainApplication_kt),
        settings_gradle: z.object({}),
        gradle_wrapper_properties: z.object({}),
        SplashActivity_java: z.object({}),
        styles_xml: z.object({}),
        colors_xml: z.object({}),
        proguard_rules_pro: z.object({}),
    })
    .partial();
export interface ConfigTemplateAndroidBase extends z.infer<typeof templateAndroid> {}

export const zodTemplateAndroidFragment = z
    .object({
        templateAndroid: T<ConfigTemplateAndroidBase>(templateAndroid),
    })
    .partial()
    .describe('Allows more advanced modifications to Android based project template');
