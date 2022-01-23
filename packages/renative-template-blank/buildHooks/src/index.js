import { Logger } from 'rnv';

const hooks = {
    hello: async () => {
        Logger.logHook('Hello build hook!');
    }
};

const pipes = {};

export { pipes, hooks };
