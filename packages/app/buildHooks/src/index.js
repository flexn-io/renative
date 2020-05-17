import { generatePlugins } from './generatePlugins';
import { updateVersions } from './updateVersions';
import { updateMdFiles } from './updateMdFiles';
import { generateChangelog, generateCombinedChangelog } from './changelog';

const hooks = {
    generateDocs: async (c) => {
        await generatePlugins(c);
        await updateMdFiles(c);
    },
    prePublish: async (c) => {
        await updateVersions(c);
        await generatePlugins(c);
        await updateMdFiles(c);
    },
    changelog: generateChangelog,
    changelogCombined: generateCombinedChangelog,
    // changelogAll: generateAllChangelogs
};

const pipes = {};


export { pipes, hooks };
