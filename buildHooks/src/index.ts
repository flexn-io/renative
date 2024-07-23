import { comparePluginTemplates } from './comparePluginTemplates';
import { comparePluginOverrides } from './comparePluginOverrides';
import { prePublish } from './prePublish';

import { gitCommit, gitCommitAndTag, gitTag } from '@rnv/build-hooks-git';
import { generateSchema } from '@rnv/build-hooks-schema';

const hooks = {
    prePublish,
    comparePluginTemplates,
    comparePluginOverrides,
    gitCommitAndTag,
    gitCommit,
    gitTag,
    generateSchema,
};

const pipes = {};

export { hooks, pipes };
