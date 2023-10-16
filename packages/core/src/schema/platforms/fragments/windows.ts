import { z } from 'zod';

export const PlatformWindowsFragment = {
    templateVSProject: z.optional(
        z.object({
            language: z.string().describe('Specify generated project language: cpp for C++ or cs for C#').optional(),
            arch: z.string().describe('Specification of targeted architecture').optional(),
            // experimentalNuGetDependency: z.boolean().optional(),
            // useWinUI3: z.boolean().optional(),
            // nuGetTestVersion: z.string().optional(),
            // reactNativeEngine: z.string().optional(),
            // nuGetTestFeed: z.string().optional(),
            // overwrite: z
            //     .boolean()
            //     .describe('Whether to attempt to override the existing builds files when running a build once more')
            //     .optional(),
            // release: z.boolean().describe('Enables full packaging of the app for release').optional(),
            // root: z
            //     .string()
            //     .describe('Project root folder location (not the app itself, which is in platformBuilds)')
            //     .optional(),

            // singleproc: z
            //     .boolean()
            //     .describe(
            //         'Opt out of multi-proc builds (only available in 0.64 and newer versions of react-native-windows)'
            //     )
            //     .optional(),
            // emulator: z.boolean().optional(),
            // device: z.boolean().optional(),
            // target: z.string().optional(),
            // remoteDebugging: z.boolean().optional(),
            // logging: z.boolean().describe('Logging all the build proccesses to console').optional(),
            // packager: z.boolean().optional(),
            // bundle: z.boolean().optional(),
            // launch: z.boolean().describe('Launches the application once the build process is finished').optional(),
            // autolink: z.boolean().describe('Launches the application once the build process is finished').optional(),
            // build: z.boolean().describe('Builds the application before launching it').optional(),
            // sln: z
            //     .string()
            //     .describe('Location of Visual Studio solution .sln file (wraps multiple projects)')
            //     .optional(),
            // proj: z
            //     .string()
            //     .describe('Root project directory for your React Native Windows project (not Visual Studio project)')
            //     .optional(),
            // appPath: z.string().describe('Full path to windows plaform build directory').optional(),
            // msbuildprops: z
            //     .string()
            //     .describe('Comma separated props to pass to msbuild, eg: prop1=value1,prop2=value2')
            //     .optional(),
            // buildLogDirectory: z
            //     .string()
            //     .describe('Full path to directory where builds logs should be stored, default - project path')
            //     .optional(),
            // info: z.boolean().describe('Print information about the build machine to console').optional(),
            // directDebugging: z.boolean().optional(),
            // telemetry: z
            //     .boolean()
            //     .describe('Send analytics data of @react-native-windows/cli usage to Microsoft')
            //     .optional(),
            // devPort: z.string().optional(),
            // additionalMetroOptions: z.record(z.any()).optional(),
            // packageExtension: z.string().optional(),
        })
    ),
};
