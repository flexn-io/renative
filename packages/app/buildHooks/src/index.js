import { generatePlugins } from './generatePlugins';
import { updateVersions } from './updateVersions';
import { updateMdFilesPlatforms } from './updateMdFilesPlatforms';
import { updateMdFilesEngines } from './updateMdFilesEngines';
import { generateChangelog, generateCombinedChangelog } from './changelog';
import { generateEngineTaks } from './generateEngineDocs';
import { gitCommit, gitTag } from './git';
import { generateApiConfigDocs, generateRuntimeObjectDocs } from './generateConfigDocs';

const hooks = {
    generateDocs: async (c) => {
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
        await generateChangelog(c);
        await generateEngineTaks(c);
        await generateApiConfigDocs(c);
        await generateRuntimeObjectDocs(c);
        await generateCombinedChangelog(c);
    },
    prePublish: async (c) => {
        await updateVersions(c);
        await generatePlugins(c);
        await updateMdFilesPlatforms(c);
        await updateMdFilesEngines(c);
        await generateChangelog(c);
        await generateEngineTaks(c);
        await generateApiConfigDocs(c);
        await generateRuntimeObjectDocs(c);
        await generateCombinedChangelog(c);
        return true;
    },
    generateChangelog,
    generateCombinedChangelog,
    generateEngineTaks,
    gitCommit,
    gitTag,
    generateApiConfigDocs,
    generateRuntimeObjectDocs,
    gitCommitAndTag: async (c) => {
        await gitCommit(c);
        await gitTag(c);
        return true;
    }
};

const pipes = {};


export { pipes, hooks };
