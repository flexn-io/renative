import path from 'path';
import { Common, FileUtils, Logger } from 'rnv';

const { getAppTemplateFolder, getConfigProp } = Common;
const { logTask } = Logger;
const { writeCleanFile } = FileUtils;

export const parseStoryboard = async (c, platform, appFolder, appFolderName) => {
    logTask('parseStoryboard');

    const storyboard = 'Base.lproj/Main.storyboard';

    const title = getConfigProp(c, platform, 'title');

    const injects = [
        { pattern: '{{TITLE}}', override: title },
    ];

    writeCleanFile(
        path.join(
            getAppTemplateFolder(c, platform),
            appFolderName,
            storyboard
        ),
        path.join(appFolder, appFolderName, storyboard),
        injects, null, c
    );
};
