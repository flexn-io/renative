import { RnvContext, logHook } from '@rnv/core';

const hooks = {
    hello: async (c: RnvContext) => {
        logHook('Hello build hook!');
    },
};

const pipes = {};

export { pipes, hooks };
