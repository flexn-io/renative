import { z } from 'zod';

const T = <T>(schema: z.ZodType<T>) => {
    return schema;
};
const _zodAppDelegateMethod = z.array(
    z.union([
        z.string(),
        z.object({
            order: z.number(),
            value: z.string(),
            weight: z.number(),
        }),
    ])
);
export interface ConfigTemplateXcodeAppDelegateMethod extends z.infer<typeof _zodAppDelegateMethod> {}
export const zodAppDelegateMethod = T<ConfigTemplateXcodeAppDelegateMethod>(_zodAppDelegateMethod);

const _application = z
    .object({
        didFinishLaunchingWithOptions: zodAppDelegateMethod,
        applicationDidBecomeActive: zodAppDelegateMethod,
        open: zodAppDelegateMethod,
        supportedInterfaceOrientationsFor: zodAppDelegateMethod,
        didReceiveRemoteNotification: zodAppDelegateMethod,
        didFailToRegisterForRemoteNotificationsWithError: zodAppDelegateMethod,
        didReceive: zodAppDelegateMethod,
        didRegister: zodAppDelegateMethod,
        didRegisterForRemoteNotificationsWithDeviceToken: zodAppDelegateMethod,
        continue: zodAppDelegateMethod,
        didConnectCarInterfaceController: zodAppDelegateMethod,
        didDisconnectCarInterfaceController: zodAppDelegateMethod,
    })
    .partial();
export interface ConfigTemplateXcodeApplication extends z.infer<typeof _application> {}

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
                                application: T<ConfigTemplateXcodeApplication>(_application),
                                userNotificationCenter: z
                                    .object({
                                        willPresent: zodAppDelegateMethod,
                                        didReceiveNotificationResponse: zodAppDelegateMethod,
                                    })
                                    .partial(),
                            })
                            .partial(),

                        appDelegateImports: z.array(z.string()),
                    })
                    .partial(),
                AppDelegate_h: z
                    .object({
                        appDelegateImports: z.array(z.string()),
                        appDelegateExtensions: z.array(z.string()),
                    })
                    .partial(),
                Info_plist: z.object({}),
            })
            .partial(),
    })
    .partial();
