import path from 'path';
import {
    getAppFolder,
    logTask,
    getConfigProp,
    addSystemInjects,
    writeCleanFile,
    getBuildFilePath,
    copyFolderContentsRecursiveSync,
    fsChmodSync,
} from '@rnv/core';
import { Context } from './types';

const GRADLE_SOURCE_PATH = path.join(__dirname, '../templates/gradleProject');

const copyGradleProjectTemplate = async (c: Context) => {
    logTask('copyGradleProjectTemplate');
    const appFolder = getAppFolder(c);

    copyFolderContentsRecursiveSync(GRADLE_SOURCE_PATH, appFolder);

    const gradlew = path.join(appFolder, 'gradlew');

    fsChmodSync(gradlew, '755');
};

export const parseGradleWrapperSync = (c: Context) => {
    logTask('parseGradleWrapperSync');

    copyGradleProjectTemplate(c);

    const appFolder = getAppFolder(c);
    const { platform } = c;

    c.payload.pluginConfigAndroid.gradleWrapperVersion = getConfigProp(c, platform, 'gradleWrapperVersion', '6.9.1');
    const injects = [
        {
            pattern: '{{INJECT_GRADLE_WRAPPER_VERSION}}',
            override: c.payload.pluginConfigAndroid.gradleWrapperVersion,
        },
    ];
    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, 'gradle/wrapper/gradle-wrapper.properties', GRADLE_SOURCE_PATH),
        path.join(appFolder, 'gradle/wrapper/gradle-wrapper.properties'),
        injects,
        undefined,
        c
    );
};
