/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */
// DEPS
import { Common, Constants } from 'rnv';

const chalk = require('chalk');
const path = require('path');
const username = require('username');
const uuid = require('uuid');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const findUp = require('find-up');
const configUtils_1 = require('./config/configUtils');
const generator_common_1 = require('./generator-common');

// EXTRACTS FROM RNV
const { getAppFolder, getAppTitle } = Common;
const { WINDOWS } = Constants;

// CONSTS
const bundleDir = 'Bundle';

// FUNCTIONS
async function generateCertificate(
    srcPath,
    currentUser,
    c
) {
    console.log('Generating self-signed certificate...');
    const appFolder = getAppFolder(c, true);
    if (os.platform() === 'win32') {
        try {
            // TO DO. What's with this timeout?
            const timeout = 10000; // 10 seconds;
            const thumbprint = childProcess
                .execSync(
                    `powershell -NoProfile -Command "Write-Output (New-SelfSignedCertificate -KeyUsage DigitalSignature -KeyExportPolicy Exportable -Subject 'CN=${currentUser}' -TextExtension @('2.5.29.37={text}1.3.6.1.5.5.7.3.3', '2.5.29.19={text}Subject Type:End Entity') -CertStoreLocation 'Cert:\\CurrentUser\\My').Thumbprint"`,
                    { timeout }
                )
                .toString()
                .trim();
            // TO DO. Does RNV generate it? Or should it be done here?
            // if (!fs.existsSync(path.join(windowsDir, newProjectName))) {
            //     fs.mkdirSync(path.join(windowsDir, newProjectName));
            // }
            childProcess.execSync(
                `powershell -NoProfile -Command "$pwd = (ConvertTo-SecureString -String password -Force -AsPlainText); Export-PfxCertificate -Cert 'cert:\\CurrentUser\\My\\${thumbprint}' -FilePath ${path.join(
                    appFolder,
                    c.runtime.appId,
                    c.runtime.appId
                )}_TemporaryKey.pfx -Password $pwd"`,
                { timeout }
            );
            console.log(
                chalk.green('Self-signed certificate generated successfully.')
            );
            return thumbprint;
        } catch (err) {
            console.log(chalk.yellow('Failed to generate Self-signed certificate.'));
        }
    }
    console.log(
        chalk.yellow('Using Default Certificate. Use Visual Studio to renew it.')
    );
    await generator_common_1.copyAndReplaceWithChangedCallback(
        path.join(srcPath, 'keys', 'MyApp_TemporaryKey.pfx'),
        c.paths.project.dir,
        path.join(appFolder, c.runtime.appId, `${c.runtime.appId}_TemporaryKey.pfx`)
    );
    return null;
}

const options = {
    language: 'cpp',
    experimentalNuGetDependency: false,
    useWinUI3: false,
    nuGetTestVersion: null,
    useHermes: false,
    nuGetTestFeed: null,
    overwrite: false
};

// Existing high cyclomatic complexity
// eslint-disable-next-line complexity
export async function copyProjectTemplateAndReplace(
    c
) {
    if (!c.paths.project.dir) {
        throw new Error('Need a path to copy to');
    }

    // React-native init only allows alphanumerics in project names, but other
    // new project tools (like create-react-native-module) are less strict.

    // TO DO. Is this needed?
    // -------------------------------------------------------------------
    // Similar to the above, but we want to retain namespace separators
    // if (projectType === 'lib') {
    //     namespace = namespace
    //         .split(/[.:]+/)
    //         .map(pascalCase)
    //         .join('.');
    // }
    // -------------------------------------------------------------------

    // TO DO. Can this be considered namespace?
    const appTitle = getAppTitle(c, WINDOWS);
    const appFolder = getAppFolder(c, true);

    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder));
    generator_common_1.createDir(path.join(c.paths.project.dir, appFolder, c.runtime.appId));
    // if (projectType === 'app') {
    generator_common_1.createDir(
        path.join(c.paths.project.dir, appFolder, c.runtime.appId, bundleDir)
    );
    generator_common_1.createDir(
        path.join(c.paths.project.dir, appFolder, c.runtime.appId, 'BundleBuilder')
    );
    // }
    const { language } = options;
    const namespaceCpp = toCppNamespace(appTitle);
    if (options.experimentalNuGetDependency) {
        console.log('Using experimental NuGet dependency.');
    }
    if (options.useWinUI3) {
        console.log('Using experimental WinUI3 dependency.');
    }
    const RNWTemplatePath = path.join(path.dirname(require.resolve('react-native-windows/package.json', {
        paths: [c.paths.project.dir],
    })), 'template');
    const projDir = 'proj';
    const srcPath = path.join(RNWTemplatePath, `${language}-app`);
    const sharedPath = path.join(RNWTemplatePath, 'shared-app');
    const projectGuid = uuid.v4();
    // eslint-disable-next-line global-require
    const rnwVersion = require('react-native-windows/package.json').version;
    const nugetVersion = options.nuGetTestVersion || rnwVersion;
    const packageGuid = uuid.v4();
    const currentUser = username.sync(); // Gets the current username depending on the platform.
    let mainComponentName = c.runtime.appId;
    const appJsonPath = await findUp('app.json', { cwd: c.paths.project.dir });
    if (appJsonPath) {
        mainComponentName = JSON.parse(fs.readFileSync(appJsonPath, 'utf8')).name;
    }
    const certificateThumbprint = await generateCertificate(
        srcPath,
        currentUser,
        c
    );

    const xamlNamespace = options.useWinUI3
        ? 'Microsoft.UI.Xaml'
        : 'Windows.UI.Xaml';
    const xamlNamespaceCpp = toCppNamespace(xamlNamespace);
    const winui3PropsPath = require.resolve(
        'react-native-windows/PropertySheets/WinUI.props',
        { paths: [process.cwd()] }
    );
    const winui3Props = configUtils_1.readProjectFile(winui3PropsPath);
    const winui3Version = configUtils_1.findPropertyValue(
        winui3Props,
        'WinUI3Version',
        winui3PropsPath
    );
    const csNugetPackages = [
        {
            id: 'Microsoft.NETCore.UniversalWindowsPlatform',
            version: '6.2.9',
        },
    ];
    const cppNugetPackages = [
        {
            id: 'Microsoft.Windows.CppWinRT',
            version: '2.0.210312.4',
            propsTopOfFile: true,
            hasProps: true,
            hasTargets: true,
        },
        {
            id: options.useWinUI3 ? 'Microsoft.WinUI' : 'Microsoft.UI.Xaml',
            version: options.useWinUI3 ? winui3Version : '2.3.191129002',
            hasProps: false,
            hasTargets: false,
        },
    ];
    if (options.experimentalNuGetDependency) {
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
    if (options.useHermes) {
        cppNugetPackages.push({
            id: 'ReactNative.Hermes.Windows',
            version: '0.7.2',
            hasProps: false,
            hasTargets: true,
        });
    }
    const templateVars = {
        useMustache: true,
        regExpPatternsToRemove: [],
        name: c.runtime.appId,
        namespace: appTitle,
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
        useExperimentalNuget: options.experimentalNuGetDependency,
        nuGetTestFeed: options.nuGetTestFeed,
        // cpp template variables
        useWinUI3: options.useWinUI3,
        useHermes: options.useHermes,
        xamlNamespace,
        xamlNamespaceCpp,
        cppNugetPackages,
        // cs template variables
        csNugetPackages,
        // autolinking template variables
        autolinkPropertiesForProps: '',
        autolinkProjectReferencesForTargets: '',
        autolinkCsUsingNamespaces: '',
        autolinkCsReactPackageProviders: '',
        autolinkCppIncludes: '',
        autolinkCppPackageProviders:
      '\n    UNREFERENCED_PARAMETER(packageProviders);',
    };
    const commonMappings = [
        // app common mappings
        {
            from: path.join(RNWTemplatePath, 'index.windows.bundle'),
            to: path.join(
                appFolder,
                c.runtime.appId,
                bundleDir,
                'index.windows.bundle'
            ),
        },
        {
            from: path.join(srcPath, projDir, 'MyApp.sln'),
            to: path.join(appFolder, `${c.runtime.appId}.sln`),
        },
    ];

    for (const mapping of commonMappings) {
        await generator_common_1.copyAndReplaceWithChangedCallback(
            mapping.from,
            c.paths.project.dir,
            mapping.to,
            templateVars,
            options.overwrite
        );
    }
    if (language === 'cs') {
        const csMappings = [
            // cs app mappings
            {
                from: path.join(srcPath, projDir, 'MyApp.csproj'),
                to: path.join(
                    appFolder,
                    c.runtime.appId,
                    `${c.runtime.appId}.csproj`
                ),
            },
        ];

        for (const mapping of csMappings) {
            await generator_common_1.copyAndReplaceWithChangedCallback(
                mapping.from,
                c.paths.project.dir,
                mapping.to,
                templateVars,
                options.overwrite
            );
        }
    } else {
        const cppMappings = [
            // cpp app mappings
            {
                from: path.join(srcPath, projDir, 'MyApp.vcxproj'),
                to: path.join(
                    appFolder,
                    c.runtime.appId,
                    `${c.runtime.appId}.vcxproj`
                ),
            },
            {
                from: path.join(srcPath, projDir, 'MyApp.vcxproj.filters'),
                to: path.join(
                    appFolder,
                    c.runtime.appId,
                    `${c.runtime.appId}.vcxproj.filters`
                ),
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
                options.overwrite
            );
        }
    }
    // shared proj
    if (fs.existsSync(path.join(sharedPath, projDir))) {
        const sharedProjMappings = [];
        sharedProjMappings.push({
            from: path.join(sharedPath, projDir, 'NuGet.Config'),
            to: path.join(appFolder, 'NuGet.Config'),
        });
        if (
            fs.existsSync(
                path.join(sharedPath, projDir, 'ExperimentalFeatures.props')
            )
        ) {
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
                options.overwrite
            );
        }
    }
    // shared assets
    if (fs.existsSync(path.join(sharedPath, 'assets'))) {
        await generator_common_1.copyAndReplaceAll(
            path.join(sharedPath, 'assets'),
            c.paths.project.dir,
            path.join(appFolder, c.runtime.appId, 'Assets'),
            templateVars,
            options.overwrite
        );
    }
    // shared src
    if (fs.existsSync(path.join(sharedPath, 'src'))) {
        await generator_common_1.copyAndReplaceAll(
            path.join(sharedPath, 'src'),
            c.paths.project.dir,
            path.join(appFolder, c.runtime.appId),
            templateVars,
            options.overwrite
        );
    }
    // src
    if (fs.existsSync(path.join(srcPath, 'src'))) {
        await generator_common_1.copyAndReplaceAll(
            path.join(srcPath, 'src'),
            c.paths.project.dir,
            path.join(appFolder, c.runtime.appId),
            templateVars,
            options.overwrite
        );
    }

    console.log(chalk.white.bold('To run your app on UWP:'));
    console.log(chalk.white('   rnv run -p windows'));
}

function toCppNamespace(namespace) {
    return namespace.replace(/\./g, '::');
}
