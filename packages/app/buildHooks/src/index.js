import { generatePlugins } from './generatePlugins';
import { updateVersions } from './updateVersions';
import { updateMdFiles } from './updateMdFiles';

const hooks = {
    generateDocs: async (c) => {
        await generatePlugins(c);
        await updateMdFiles(c);
    },
    prePublish: async (c) => {
        await updateVersions(c);
        await generatePlugins(c);
        await updateMdFiles(c);
    }
};

const pipes = {};


export { pipes, hooks };
