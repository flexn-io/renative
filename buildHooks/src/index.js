import { updateVersions } from './updateVersions';
import { gitCommit, gitTag } from './git';

const hooks = {
    prePublish: async (c) => {
        await updateVersions(c);
        return true;
    },
    gitCommit,
    gitTag,
    gitCommitAndTag: async (c) => {
        await gitCommit(c);
        await gitTag(c);
        return true;
    },
};

const pipes = {};

export { pipes, hooks };
