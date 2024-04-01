import { z } from 'zod';

export const zodPlatformWindowsFragment = z
    .object({
        templateVSProject: z
            .object({
                language: z.string().describe('Specify generated project language: cpp for C++ or cs for C#'),
                arch: z.string().describe('Specification of targeted architecture'),
                experimentalNuGetDependency: z.boolean(),
                useWinUI3: z.boolean(),
                nuGetTestVersion: z.string(),
                reactNativeEngine: z.string(),
                nuGetTestFeed: z.string(),
                overwrite: z
                    .boolean()
                    .describe(
                        'Whether to attempt to override the existing builds files when running a build once more'
                    ),
                release: z.boolean().describe('Enables full packaging of the app for release'),
                root: z
                    .string()
                    .describe('Project root folder location (not the app itself, which is in platformBuilds)'),
                singleproc: z
                    .boolean()
                    .describe(
                        'Opt out of multi-proc builds (only available in 0.64 and newer versions of react-native-windows)'
                    ),
                emulator: z.boolean(),
                device: z.boolean(),
                target: z.string(),
                remoteDebugging: z.boolean(),
                logging: z.boolean().describe('Logging all the build proccesses to console'),
                packager: z.boolean(),
                bundle: z.boolean(),
                launch: z.boolean().describe('Launches the application once the build process is finished'),
                autolink: z.boolean().describe('Launches the application once the build process is finished'),
                build: z.boolean().describe('Builds the application before launching it'),
                sln: z.string().describe('Location of Visual Studio solution .sln file (wraps multiple projects)'),
                proj: z
                    .string()
                    .describe(
                        'Root project directory for your React Native Windows project (not Visual Studio project)'
                    ),
                appPath: z.string().describe('Full path to windows plaform build directory'),
                msbuildprops: z
                    .string()
                    .describe('Comma separated props to pass to msbuild, eg: prop1=value1,prop2=value2'),
                buildLogDirectory: z
                    .string()
                    .describe('Full path to directory where builds logs should be stored, default - project path'),
                info: z.boolean().describe('Print information about the build machine to console'),
                directDebugging: z.boolean(),
                telemetry: z.boolean().describe('Send analytics data of @react-native-windows/cli usage to Microsoft'),
                devPort: z.string(),
                additionalMetroOptions: z.record(z.any()),
                packageExtension: z.string(),
            })
            .partial(),
    })
    .partial();
