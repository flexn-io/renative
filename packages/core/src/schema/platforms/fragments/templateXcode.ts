import { z } from 'zod';

const T = <T>(schema: z.ZodType<T>) => {
    return schema;
};
const zodAppDelegateMethod = z.array(
    z.union([
        z.string(),
        z.object({
            order: z.number(),
            value: z.string(),
            weight: z.number(),
        }),
    ])
);
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
export interface ConfigTemplateXcodeAppDelegateMethod extends z.infer<typeof zodAppDelegateMethod> {}

const zodXcodeApplication_mm = z
    .object({
        didFinishLaunchingWithOptions: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        applicationDidBecomeActive: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        open: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        supportedInterfaceOrientationsFor: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didReceiveRemoteNotification: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didFailToRegisterForRemoteNotificationsWithError: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didReceive: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didRegister: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didRegisterForRemoteNotificationsWithDeviceToken: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        continue: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didConnectCarInterfaceController: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
        didDisconnectCarInterfaceController: T<ConfigTemplateXcodeAppDelegateMethod>(zodAppDelegateMethod),
    })
    .partial();
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
export interface ConfigTemplateXcodeApplication extends z.infer<typeof zodXcodeApplication_mm> {}

const project_pbxproj = z
    .object({
        sourceFiles: z.array(z.string()),
        resourceFiles: z.array(z.string()),
        headerFiles: z.array(z.string()),
        buildPhases: z.array(
            z.object({
                shellPath: z.string(),
                shellScript: z.string(),
                inputPaths: z.array(z.string()),
            })
        ),
        frameworks: z.array(z.string()),
        buildSettings: z.record(z.string(), z.string()),
    })
    .partial();
// We using interfaces to reduce the size of d.ts files (zod + types in d.ts files are huge)
export interface ConfigTemplateXcodeProjectPbxproj extends z.infer<typeof project_pbxproj> {}

export const zodTemplateXcodeFragment = z
    .object({
        templateXcode: z
            .object({
                Podfile: z
                    .object({
                        injectLines: z.array(z.string()),
                        post_install: z.array(z.string()),
                        sources: z
                            .array(z.string())
                            .describe('Array of URLs that will be injected on top of the Podfile as sources'),
                        podDependencies: z.array(z.string()),
                        staticPods: z.array(z.string()),
                        header: z
                            .array(z.string())
                            .describe('Array of strings that will be injected on top of the Podfile'),
                    })
                    .partial()
                    .describe('Allows to manipulate Podfile'),
                project_pbxproj: T<ConfigTemplateXcodeProjectPbxproj>(project_pbxproj),
                AppDelegate_mm: z
                    .object({
                        appDelegateMethods: z
                            .object({
                                application: T<ConfigTemplateXcodeApplication>(zodXcodeApplication_mm),
                                userNotificationCenter: z
                                    .object({
                                        willPresent: zodAppDelegateMethod,
                                        didReceiveNotificationResponse: zodAppDelegateMethod,
                                    })
                                    .partial(),
                                custom: z.array(z.string()),
                            })
                            .partial(),

                        appDelegateImports: z.array(z.string()),
                    })
                    .partial(),
                AppDelegate_h: z
                    .object({
                        appDelegateImports: z.array(z.string()),
                        appDelegateExtensions: z.array(z.string()),
                        appDelegateMethods: z.array(z.string()),
                    })
                    .partial(),
                Info_plist: z.record(z.string(), z.string()),
            })
            .partial(),
    })
    .partial();
