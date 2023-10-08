import { prePublish } from './prePublish';

import { gitCommit, gitTag, gitCommitAndTag } from '@rnv/build-hooks-git';
import { generateSchema } from '@rnv/build-hooks-git';

const hooks = {
    prePublish,
    gitCommitAndTag,
    gitCommit,
    gitTag,
    generateSchema,
};

const pipes = {};

export { pipes, hooks };
