import { Analytics } from './analytics';
import {
    RnvApiLogger,
    RnvApiPrompt,
    RnvApiSpinner,
    RnvContextProgram,
    createRnvApi,
    createRnvContext,
    doResolve,
    executeRnvCore,
    getConfigProp,
    loadWorkspacesConfigSync,
    logError,
    logInitialize,
    registerEngine,
} from '@rnv/core';
import { RNV_HOME_DIR } from './constants';
import EngineCore from '@rnv/engine-core';

export const executeRnv = async ({
    cmd,
    subCmd,
    process,
    program,
    spinner,
    prompt,
    logger,
}: {
    cmd: string;
    subCmd: string;
    process: NodeJS.Process;
    program: RnvContextProgram;
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    logger: RnvApiLogger;
}) => {
    // set mono and ci if json is enabled
    if (program.json) {
        program.mono = true;
        program.ci = true;
    }

    createRnvApi({ spinner, prompt, analytics: Analytics, logger, getConfigProp, doResolve });
    createRnvContext({ program, process, cmd, subCmd, RNV_HOME_DIR });

    logInitialize();
    loadWorkspacesConfigSync();

    Analytics.initialize();

    await registerEngine(EngineCore);

    await executeRnvCore();
};
