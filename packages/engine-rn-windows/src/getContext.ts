import { getContext as _getContext, getConfigProp as _getConfigProp, ConfigPropKeyMerged } from '@rnv/core';
import type { GetContext } from '.';
// re-export the original getContext with newly decorated type
export const getContext = _getContext as GetContext;

export type ConfigPropWindows = {
    language: 'cpp';
    experimentalNuGetDependency: boolean;
    useWinUI3: boolean;
    nuGetTestVersion: null;
    reactNativeEngine: 'chakra';
    nuGetTestFeed: null;
    overwrite: boolean;
    // Whether it's a release build
    release: boolean;
    // Where app entry .js file is
    root: string | undefined;
    // 'x86' | 'x64' | 'ARM' | 'ARM64'
    arch: 'x86' | 'x64' | 'ARM' | 'ARM64';
    // TODO By default this leaves open MSBuild proccesses in the background
    // which will hang the run if it is run with -r flag
    // -----------------------------------------------------------------------
    // Opt out of multi-proc builds
    singleproc: true;
    // Deploy to the emulator ??
    emulator: undefined;
    // Deploy to a device ??
    device: undefined;
    // Device GUID to deploy to
    target: undefined;
    // Boolean - Run using remote JS proxy
    remoteDebugging: undefined;
    // Enables logging of build steps
    logging: boolean;
    // Do not launch packager while building
    packager: true;
    // Enable Bundle configuration.
    bundle: boolean;
    // Launch the app after deployment
    launch: true;
    // Run autolinking
    autolink: boolean;
    // Build the solution
    build: true;
    // Deploy the app to an emulator
    deploy: true;
    // Solution file to build
    sln: undefined;
    // Where the proj directory is
    proj: undefined;
    // Where the build is placed (default is full path to platformBuilds/projectName_windows)
    appPath: undefined;
    // Comma separated props to pass to msbuild; eg: prop1=value1;prop2=value2
    msbuildprops: undefined;
    buildLogDirectory: undefined;
    info: boolean;
    // Number - Enable direct debugging on specified port
    directDebugging: undefined;
    // Sending telemetry that allows analysis of usage and failures of the react-native-windows CLI to Microsoft
    telemetry: true;
    // Bundler port to run on
    devPort: undefined;
    // Additional options/args passed to react native's cli's metro server start function
    additionalMetroOptions: any;
    // UWP App can be packaged into .appx or .msix
    packageExtension: 'appx' | 'appx';
};

export const getConfigProp = <K extends ConfigPropKeyMerged<ConfigPropWindows>>(key: K) => {
    return _getConfigProp<ConfigPropWindows, K>(key);
};
