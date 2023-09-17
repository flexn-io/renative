import 'regenerator-runtime/runtime';
import 'source-map-support/register';
import { Analytics } from './analytics';
import { configureFilesystem, createRnvConfig, doResolve, getConfigProp, isSystemWin, logInitialize } from '@rnv/core';

export * from './modules';
export * from './adapter';

export const initializeRnv = async (cmd: string, subCmd: string, process: any, program: any) => {
    // set mono and ci if json is enabled
    if (program.json) {
        program.mono = true;
        program.ci = true;
    }

    Analytics.initialize();
    configureFilesystem(getConfigProp, doResolve, isSystemWin);
    const c = createRnvConfig(program, process, cmd, subCmd);
    logInitialize();

    //@ts-ignore
    global.fetch = await import('node-fetch');
    //@ts-ignore
    global.Headers = global.fetch.Headers;

    return c;
};
