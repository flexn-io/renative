

import { Common, Logger } from 'rnv';
import { copyProjectTemplateAndReplace } from './copyTemplate';

// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const cli = require('@react-native-windows/cli');
// TODO Is there a a workaround or function for this?
// eslint-disable-next-line global-require
const runWindows = require(
    '@react-native-windows/cli/lib-commonjs/runWindows/runWindows'
).runWindowsCommand.func;

const { logTask } = Logger;
const { getAppFolder, getConfigProp } = Common;

const defaultOptions = {
    language: 'cpp',
    experimentalNuGetDependency: false,
    useWinUI3: false,
    nuGetTestVersion: null,
    reactNativeEngine: 'chakra',
    nuGetTestFeed: null,
    overwrite: false
};


export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');

    const language = getConfigProp(c, c.platform, 'language', defaultOptions.language);

    // TODO Default options, need to configure this via renative.json
    const options = {
        release: false,
        root: c.paths.project.dir,
        arch: 'x86',
        singleproc: undefined,
        emulator: undefined,
        device: undefined,
        target: undefined,
        remoteDebugging: undefined,
        logging: true,
        packager: true,
        bundle: undefined,
        launch: true,
        autolink: false,
        build: true,
        deploy: true,
        sln: undefined,
        proj: c.paths.project.dir,
        msbuildprops: undefined,
        buildLogDirectory: undefined,
        info: undefined,
        directDebugging: undefined,
        telemetry: false
    };
    const args = [];

    const projectConfig = {
        windows: {
            sourceDir: getAppFolder(c, true),
            solutionFile: `${c.runtime.appId}.sln`,
            project: {
                projectName: c.runtime.appId,
                projectFile: `${c.runtime.appId}\\${c.runtime.appId}.vcxproj`,
                projectLang: language,
                // TODO Validate if this is ok
                projectGuid: c.runtime.appId
            },
            folder: c.paths.project.dir

        },
    };
    const config = {
        root: c.paths.project.dir,
        commands: cli.commands,
        platforms: {
            windows: {
                linkConfig: () => null,
                projectConfig: () => cli.projectConfig(c.paths.project.dir, {
                    project: projectConfig,
                }),
                dependencyConfig: cli.dependencyConfig,
                npmPackageName: 'react-native-windows',
            },
        },
        project: projectConfig
    };

    await runWindows(args, config, options);
    return true;
};

const copyWindowsTemplateProject = async (c) => {
    await copyProjectTemplateAndReplace(c, defaultOptions);
    return true;
};


export { copyWindowsTemplateProject as configureWindowsProject };
