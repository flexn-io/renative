import { logHook } from '@rnv/core';
import appleSetup from './setup/apple';

const hooks = {
    hello: async () => {
        logHook('Hello build hook!');
    },
    appleSetup,
};

const pipes = {};

export { pipes, hooks };
