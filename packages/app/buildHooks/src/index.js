import { generatePlugins } from './generatePlugins';
import { updateVersions } from './updateVersions';
import { updateMdFilesPlatforms } from './updateMdFilesPlatforms';
import { updateMdFilesEngines } from './updateMdFilesEngines';
import { generateChangelog, generateCombinedChangelog } from './changelog';

const hooks = {
    generateDocs: async (c) => {
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
    },
    prePublish: async (c) => {
        await updateVersions(c);
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
        await generateChangelog(c);
        await generateCombinedChangelog(c);
        return true;
    },
    changelog: generateChangelog,
    changelogCombined: generateCombinedChangelog,
    // changelogAll: generateAllChangelogs
};

const pipes = {};


export { pipes, hooks };
