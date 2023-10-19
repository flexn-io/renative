import { logHook } from '@rnv/core';

const hooks = {
    hello: async () => {
        logHook('Hello build hook!');
    },
};

const pipes = {
    'configure:before': [hooks.hello],
};

export { pipes, hooks };
