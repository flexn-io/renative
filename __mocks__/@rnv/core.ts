// __mocks__/@rnv/core.ts
import merge from 'deepmerge';
import { RnvContext } from '@rnv/core';

const originalCore = jest.requireActual('@rnv/core');

type Context = {
    program: any;
    process: any;
    cmd: string;
    subCmd: string;
    RNV_HOME_DIR: string;
};

const rnvcore: any = jest.createMockFromModule('@rnv/core');

function mockChalk(v) {
    return v;
}

const _chalkCols: any = {
    white: mockChalk,
    green: mockChalk,
    red: mockChalk,
    yellow: mockChalk,
    default: mockChalk,
    gray: mockChalk,
    grey: mockChalk,
    blue: mockChalk,
    cyan: mockChalk,
    magenta: mockChalk,
    bold: mockChalk,
    rgb: mockChalk,
};
Object.assign(mockChalk, _chalkCols);

const _generateContextDefaults = (ctx?: Context): RnvContext => {
    // We use this object to store values during mocking
    const _opts: any = {};
    const defaults: RnvContext = originalCore.generateContextDefaults();
    defaults.program.opts = () => _opts;
    const result = merge(defaults, ctx || {});
    return result;
};

// Manual mocks the core functions
rnvcore.createTask = (task) => task;
rnvcore.chalk = () => _chalkCols;
rnvcore.createRnvContext = (ctx?: Context) => {
    rnvcore.__MOCK_RNV_CONTEXT = _generateContextDefaults(ctx);
};
rnvcore.getContext = () => rnvcore.__MOCK_RNV_CONTEXT;

module.exports = rnvcore;
