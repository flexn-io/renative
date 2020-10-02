import { generatePlugins } from './generatePlugins';
import { updateVersions } from './updateVersions';
import { updateMdFilesPlatforms } from './updateMdFilesPlatforms';
import { updateMdFilesEngines } from './updateMdFilesEngines';
import { generateChangelog, generateCombinedChangelog } from './changelog';
import { generateEngineTaks } from './generateEngineDocs';
import { gitCommitAndTagVersion, gitPush } from './git';

const hooks = {
    generateDocs: async (c) => {
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
        await generateChangelog(c);
        await generateEngineTaks(c);
        await generateCombinedChangelog(c);
    },
    prePublish: async (c) => {
        await updateVersions(c);
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
        await generateChangelog(c);
        await generateEngineTaks(c);
        await generateCombinedChangelog(c);
        return true;
    },
    changelog: generateChangelog,
    changelogCombined: generateCombinedChangelog,
    engine: generateEngineTaks,
    publishGithub: async (c) => {
        await gitCommitAndTagVersion(c);
        await gitPush(c);
        return true;
    }
    // changelogAll: generateAllChangelogs
};

const pipes = {};


export { pipes, hooks };
