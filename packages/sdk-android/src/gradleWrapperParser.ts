import path from 'path';
import { FileUtils, Logger, Common, RnvContext } from 'rnv';
import { Payload } from './types';

const { getAppFolder, getBuildFilePath, getConfigProp, addSystemInjects } = Common;
const { writeCleanFile } = FileUtils;
const { logTask } = Logger;

export const parseGradleWrapperSync = (c: RnvContext<Payload>) => {
    logTask('parseGradleWrapperSync');

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
        getBuildFilePath(c, platform, 'gradle/wrapper/gradle-wrapper.properties'),
        path.join(appFolder, 'gradle/wrapper/gradle-wrapper.properties'),
        injects,
        undefined,
        c
    );
};
