import path from 'path';
import {
    getAppFolder,
    logDefault,
    getConfigProp,
    writeCleanFile,
    copyFolderContentsRecursiveSync,
    fsChmodSync,
    DEFAULTS,
    getContext,
} from '@rnv/core';
import { addSystemInjects, getBuildFilePath } from '@rnv/sdk-utils';

const GRADLE_SOURCE_PATH = path.join(__dirname, '../templates/gradleProject');

const copyGradleProjectTemplate = async () => {
    logDefault('copyGradleProjectTemplate');
    const appFolder = getAppFolder();

    copyFolderContentsRecursiveSync(GRADLE_SOURCE_PATH, appFolder);

    const gradlew = path.join(appFolder, 'gradlew');

    fsChmodSync(gradlew, '755');
};

export const parseGradleWrapperSync = () => {
    const c = getContext();
    logDefault('parseGradleWrapperSync');

    copyGradleProjectTemplate();

    const appFolder = getAppFolder();

    c.payload.pluginConfigAndroid.gradleWrapperVersion =
        getConfigProp('gradleWrapperVersion') || DEFAULTS.gradleWrapperVersion;
    const injects = [
        {
            pattern: '{{INJECT_GRADLE_WRAPPER_VERSION}}',
            override: c.payload.pluginConfigAndroid.gradleWrapperVersion,
        },
    ];
    addSystemInjects(injects);

    writeCleanFile(
        getBuildFilePath('gradle/wrapper/gradle-wrapper.properties', GRADLE_SOURCE_PATH),
        path.join(appFolder, 'gradle/wrapper/gradle-wrapper.properties'),
        injects,
        undefined,
        c
    );
};
