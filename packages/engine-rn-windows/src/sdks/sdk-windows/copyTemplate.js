/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */
// DEPS
import { Common, FileUtils, Logger, ProjectManager } from 'rnv';

const path = require('path');
const username = require('username');
const uuid = require('uuid');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
// eslint-disable-next-line no-unused-vars
// const _ = require('lodash');
const findUp = require('find-up');
const generator_common_1 = require('./generator-common');
const configUtils_1 = require('./config/configUtils');

// EXTRACTS FROM RNV
const { getAppFolder, getAppTitle, getConfigProp } = Common;
const { copyFolderContentsRecursive, copyFolderContentsRecursiveSync } = FileUtils;
const { logError, logTask, logInfo, logWarning, logSuccess } = Logger;
const { copyAssetsFolder } = ProjectManager;

// CONSTS
const bundleDir = 'Bundle';

// FUNCTIONS
async function generateCertificate(srcPath, currentUser, c, options) {
    logTask('Generating self-signed certificate');
    const appFolder = getAppFolder(c, true);
    if (os.platform() === 'win32') {
        try {
            // TODO. What's with this timeout?
            const timeout = 10000; // 10 seconds;
            const thumbprint = childProcess
                .execSync(
                    // eslint-disable-next-line max-len
                    `powershell -NoProfile -Command "Write-Output (New-SelfSignedCertificate -KeyUsage DigitalSignature -KeyExportPolicy Exportable -Subject 'CN=${currentUser}' -TextExtension @('2.5.29.37={text}1.3.6.1.5.5.7.3.3', '2.5.29.19={text}Subject Type:End Entity') -CertStoreLocation 'Cert:\\CurrentUser\\My').Thumbprint"`,
                    { timeout }
                )
                .toString()
                .trim();
            childProcess.execSync(
                // eslint-disable-next-line max-len
                `powershell -NoProfile -Command "$pwd = (ConvertTo-SecureString -String password -Force -AsPlainText); Export-PfxCertificate -Cert 'cert:\\CurrentUser\\My\\${thumbprint}' -FilePath ${path.join(
                    appFolder,
                    c.runtime.appId,
                    c.runtime.appId
                )}_TemporaryKey.pfx -Password $pwd"`,
                { timeout }
            );
            logSuccess('Self-signed certificate generated successfully.');
            return thumbprint;
        } catch (err) {
            logError('Failed to generate Self-signed certificate.');
        }
    }
    logWarning('Using Default Certificate. Use Visual Studio to renew it.');
    await generator_common_1.copyAndReplaceWithChangedCallback(
        path.join(srcPath, 'keys', 'MyApp_TemporaryKey.pfx'),
        c.paths.project.dir,
        path.join(appFolder, c.runtime.appId, `${c.runtime.appId}_TemporaryKey.pfx`),
        undefined,
        options
    );
    return null;
}

// Existing high cyclomatic complexity
export async function copyProjectTemplateAndReplace(c, options) {
    if (!c.paths.project.dir) {
        throw new Error('Need a path to copy to');
    }

    const appTitle = getAppTitle(c, c.platform);
    const appFolder = getAppFolder(c, true);
    const RNIconsPluginPath = path.join(
        path.dirname(
            require.resolve('react-native-vector-icons/package.json', {
                paths: [c.paths.project.dir],
            })
        ),
        'Fonts'
    );

    const language = getConfigProp(c, c.platform, 'language', options.language);
    const experimentalNuGetDependency = getConfigProp(
        c,
        c.platform,
        'experimentalNuGetDependency',
        options.experimentalNuGetDependency
    );
    const useWinUI3 = getConfigProp(c, c.platform, 'useWinUI3', options.useWinUI3);
    const nuGetTestVersion = getConfigProp(c, c.platform, 'nuGetTestVersion', options.nuGetTestVersion);
    const useHermes = !!getConfigProp(c, c.platform, 'reactNativeEngine', options.reactNativeEngine) === 'hermes';
    const nuGetTestFeed = getConfigProp(c, c.platform, 'nuGetTestFeed', options.nuGetTestFeed);

    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder));
    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder, c.runtime.appId));

    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder, c.runtime.appId, bundleDir));
    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder, c.runtime.appId, 'BundleBuilder'));

    const namespaceCpp = toCppNamespace(c.runtime.appId);
    if (experimentalNuGetDependency) {
        logInfo('Using experimental NuGet dependency.');
    }
    if (useWinUI3) {
        logInfo('Using experimental WinUI3 dependency.');
    }

    // eslint-disable-next-line global-require
    const reactNative = require('react-native/package.json');
    const rnVersion = parseFloat(reactNative.version);

    let RNWTemplatePath;
    let srcPath;
    let sharedPath;
    // In 0.64 version of RN Windows the location was changed and some folders were renamed (separation between lib abd app)
    if (rnVersion >= 0.64) {
        RNWTemplatePath = path.join(
            path.dirname(
                require.resolve('react-native-windows/package.json', {
                    paths: [c.paths.project.dir],
                })
            ),
            'template'
        );
        // TODO Add support for developing libs, not just apps using renative (RN Windows added this in 0.64 version)
        srcPath = path.join(RNWTemplatePath, `${language}-app`);
        sharedPath = path.join(RNWTemplatePath, 'shared-app');
    } else if (rnVersion >= 0.63) {
        RNWTemplatePath = path.join(
            path.dirname(
                require.resolve('@react-native-windows/cli/package.json', {
                    paths: [c.paths.project.dir],
                })
            ),
            'templates'
        );
        srcPath = path.join(RNWTemplatePath, `${language}`);
        sharedPath = path.join(RNWTemplatePath, 'shared');
    } else {
        logError("ReNative's React Native Windows engine does not support version of React Native older than 0.63");
    }

    const projDir = 'proj';
    const projectGuid = uuid.v4();
    // eslint-disable-next-line global-require
    const rnwVersion = require('react-native-windows/package.json').version;
    const nugetVersion = nuGetTestVersion || rnwVersion;
    const packageGuid = uuid.v4();
    const currentUser = username.sync(); // Gets the current username depending on the platform.
    let mainComponentName = c.runtime.appId;
    const appJsonPath = await findUp('app.json', { cwd: c.paths.project.dir });
    if (appJsonPath) {
        mainComponentName = JSON.parse(fs.readFileSync(appJsonPath, 'utf8')).name;
    }

    let certificateThumbprint;
    if (!fs.existsSync(path.join(appFolder, c.runtime.appId, `${c.runtime.appId}_TemporaryKey.pfx`))) {
        certificateThumbprint = await generateCertificate(srcPath, currentUser, c, options);
    } else {
        logInfo('[generateCertificate] Certificate already exists, skipping generation of a new one.');
    }

    const xamlNamespace = useWinUI3 ? 'Microsoft.UI.Xaml' : 'Windows.UI.Xaml';
    const xamlNamespaceCpp = toCppNamespace(xamlNamespace);
    const winui3PropsPath = require.resolve('react-native-windows/PropertySheets/WinUI.props', {
        paths: [process.cwd()],
    });
    const winui3Props = configUtils_1.readProjectFile(winui3PropsPath);
    const winui3Version = configUtils_1.findPropertyValue(winui3Props, 'WinUI3Version', winui3PropsPath);
    const csNugetPackages = [
        {
            id: 'Microsoft.NETCore.UniversalWindowsPlatform',
            version: '6.2.9',
        },
    ];
    const cppNugetPackages = [
        {
            id: 'Microsoft.Windows.CppWinRT',
            version: rnVersion > 0.64 ? '2.0.210312.4' : '2.0.200615.7',
            propsTopOfFile: true,
            hasProps: true,
            hasTargets: true,
        },
        {
            id: useWinUI3 ? 'Microsoft.WinUI' : 'Microsoft.UI.Xaml',
            version: useWinUI3 ? winui3Version : '2.3.191129002',
            hasProps: false,
            hasTargets: false,
        },
    ];
    if (experimentalNuGetDependency) {
        csNugetPackages.push({
            id: 'Microsoft.ReactNative.Managed',
            version: nugetVersion,
        });
        cppNugetPackages.push({
            id: 'Microsoft.ReactNative',
            version: nugetVersion,
            hasProps: false,
            hasTargets: true,
        });
        cppNugetPackages.push({
            id: 'Microsoft.ReactNative.Cxx',
            version: nugetVersion,
            hasProps: false,
            hasTargets: true,
        });
    }
    if (useHermes && rnVersion > 0.64) {
        cppNugetPackages.push({
            id: 'ReactNative.Hermes.Windows',
            version: '0.7.2',
            hasProps: false,
            hasTargets: true,
        });
    }

    const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo', false);
    const monoRoot = getConfigProp(c, c.platform, 'monoRoot') || '..\\..';

    const templateVars = {
        rnwPackagePath: isMonorepo
            ? `${monoRoot.replace(/\//g, '\\')}\\..\\..\\node_modules\\react-native-windows`
            : '..\\..\\node_modules\\react-native-windows',
        useMustache: true,
        regExpPatternsToRemove: [],
        name: c.runtime.appId,
        namespace: namespaceCpp,
        title: appTitle,
        namespaceCpp,
        languageIsCpp: language === 'cpp',
        mainComponentName,
        // Visual Studio is very picky about the casing of the guids for projects, project references and the solution
        // https://www.bing.com/search?q=visual+studio+project+guid+casing&cvid=311a5ad7f9fc41089507b24600d23ee7&FORM=ANAB01&PC=U531
        // we therefore have to precariously use the right casing in the right place or risk building in VS breaking.
        projectGuidLower: `{${projectGuid.toLowerCase()}}`,
        projectGuidUpper: `{${projectGuid.toUpperCase()}}`,
        // packaging and signing variables:
        packageGuid,
        currentUser,
        certificateThumbprint,
        useExperimentalNuget: experimentalNuGetDependency,
        nuGetTestFeed,
        // cpp template variables
        useWinUI3,
        useHermes,
        xamlNamespace,
        xamlNamespaceCpp,
        cppNugetPackages,
        // Development port config
        devPort: c.runtime.port || 8092,
        // cs template variables
        csNugetPackages,
        // autolinking template variables
        autolinkPropertiesForProps: '',
        autolinkProjectReferencesForTargets: '',
        autolinkCsUsingNamespaces: '',
        autolinkCsReactPackageProviders: '',
        autolinkCppIncludes: '',
        autolinkCppPackageProviders: '\n    UNREFERENCED_PARAMETER(packageProviders);',
        hasAdditionalAssets: RNIconsPluginPath && fs.existsSync(RNIconsPluginPath),
    };
    const commonMappings = [
        // app common mappings
        {
            from: path.join(RNWTemplatePath, 'index.windows.bundle'),
            to: path.join(appFolder, c.runtime.appId, bundleDir, 'index.windows.bundle'),
        },
        {
            from: path.join(srcPath, projDir, 'MyApp.sln'),
            to: path.join(appFolder, `${c.runtime.appId}.sln`),
        },
        {
            from: path.join(RNWTemplatePath, 'index.windows.bundle'),
            to: path.join(appFolder, c.runtime.appId, bundleDir, 'index.windows.bundle'),
        },
        {
            from: path.join(RNWTemplatePath, 'app.json'),
            to: 'app.json',
        },
        {
            from: path.join(RNWTemplatePath, 'app.json'),
            to: path.join(appFolder, c.runtime.appId, bundleDir, 'assets', 'app.json'),
        },
    ];

    // Do not override metro inside the project if one already exists
    if (!fs.existsSync(path.join(c.paths.project.dir, 'metro.config.js'))) {
        commonMappings.push({
            from: path.join(RNWTemplatePath, 'metro.config.js'),
            to: 'metro.config.js',
        });
    }

    if (!fs.existsSync(path.join(appFolder, c.runtime.appId, bundleDir, 'assets'))) {
        fs.mkdirSync(path.join(appFolder, c.runtime.appId, bundleDir, 'assets'), { recursive: true });
    }

    for (const mapping of commonMappings) {
        await generator_common_1.copyAndReplaceWithChangedCallback(
            mapping.from,
            c.paths.project.dir,
            mapping.to,
            templateVars,
            options
        );
    }
    if (language === 'cs') {
        const csMappings = [
            // cs app mappings
            {
                from: path.join(srcPath, projDir, 'MyApp.csproj'),
                to: path.join(appFolder, c.runtime.appId, `${c.runtime.appId}.csproj`),
            },
        ];

        for (const mapping of csMappings) {
            await generator_common_1.copyAndReplaceWithChangedCallback(
                mapping.from,
                c.paths.project.dir,
                mapping.to,
                templateVars,
                options
            );
        }
    } else {
        const cppMappings = [
            // cpp app mappings
            {
                from: path.join(srcPath, projDir, 'MyApp.vcxproj'),
                to: path.join(appFolder, c.runtime.appId, `${c.runtime.appId}.vcxproj`),
            },
            {
                from: path.join(srcPath, projDir, 'MyApp.vcxproj.filters'),
                to: path.join(appFolder, c.runtime.appId, `${c.runtime.appId}.vcxproj.filters`),
            },
            {
                from: path.join(srcPath, projDir, 'packages.config'),
                to: path.join(appFolder, c.runtime.appId, 'packages.config'),
            },
        ];

        for (const mapping of cppMappings) {
            await generator_common_1.copyAndReplaceWithChangedCallback(
                mapping.from,
                c.paths.project.dir,
                mapping.to,
                templateVars,
                options
            );
        }
    }

    // This is default in version 0.64 of react native windows, but not in 0.63 or lower
    if (options.experimentalNuGetDependency || rnVersion > 0.64) {
        // shared proj
        if (fs.existsSync(path.join(sharedPath, projDir))) {
            const sharedProjMappings = [];
            sharedProjMappings.push({
                from: path.join(sharedPath, projDir, 'NuGet.Config'),
                to: path.join(appFolder, 'NuGet.Config'),
            });
            if (fs.existsSync(path.join(sharedPath, projDir, 'ExperimentalFeatures.props'))) {
                sharedProjMappings.push({
                    from: path.join(sharedPath, projDir, 'ExperimentalFeatures.props'),
                    to: path.join(appFolder, 'ExperimentalFeatures.props'),
                });
            }
            for (const mapping of sharedProjMappings) {
                await generator_common_1.copyAndReplaceWithChangedCallback(
                    mapping.from,
                    c.paths.project.dir,
                    mapping.to,
                    templateVars,
                    options
                );
            }
        }
    }

    // Firstly attempt to copy assets specified in project, if user has none specified use default from renative
    await copyAssetsFolder(c, c.platform, c.runtime.appId);

    // shared assets
    if (fs.existsSync(path.join(sharedPath, 'assets'))) {
        copyFolderContentsRecursiveSync(
            path.join(sharedPath, 'assets'),
            path.join(appFolder, c.runtime.appId, 'Assets'),
            true,
            false,
            // Must not override, project defined assets used, if new ones are added later on - rebuild will cover it
            true
        );
    }

    // Non relative path to appFolder is needed
    const appFolderFull = getAppFolder(c);
    // react native vector icons fonts
    // Only copy the files if the plugin is added to the project, aka plugin dir exists
    if (RNIconsPluginPath && fs.existsSync(RNIconsPluginPath)) {
        // Default React Native Windows Debug apps use this location
        copyFolderContentsRecursive(RNIconsPluginPath, path.join(appFolderFull, c.runtime.appId, 'Assets'));

        // Default React Native Windows Release apps use this location
        copyFolderContentsRecursive(RNIconsPluginPath, path.join(appFolderFull, c.runtime.appId, 'Bundle', 'assets'));

        const glyphmapsDir = path.join(
            appFolderFull,
            c.runtime.appId,
            'Assets',
            'node_modules',
            'react-native-vector-icons',
            'glyphmaps'
        );
        if (!fs.existsSync(glyphmapsDir)) {
            fs.mkdirSync(glyphmapsDir, { recursive: true });
        }
        // TODO. Not sure if this is needed, but RN Windows does this in a regular project by default
        const RNIconsGlyphmapsPluginPath = path.join(
            path.dirname(
                require.resolve('react-native-vector-icons/package.json', {
                    paths: [c.paths.project.dir],
                })
            ),
            'glyphmaps'
        );

        copyFolderContentsRecursive(RNIconsGlyphmapsPluginPath, glyphmapsDir);
    }
    // shared src
    if (fs.existsSync(path.join(sharedPath, 'src'))) {
        await generator_common_1.copyAndReplaceAll(
            path.join(sharedPath, 'src'),
            c.paths.project.dir,
            path.join(appFolder, c.runtime.appId),
            templateVars,
            options
        );
    }
    // src
    if (fs.existsSync(path.join(srcPath, 'src'))) {
        await generator_common_1.copyAndReplaceAll(
            path.join(srcPath, 'src'),
            c.paths.project.dir,
            path.join(appFolder, c.runtime.appId),
            templateVars,
            options
        );
    }
}

function toCppNamespace(namespace) {
    return namespace.replace(/\./g, '::');
}
