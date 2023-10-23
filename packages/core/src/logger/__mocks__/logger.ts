const _chalkPass = (v: string | boolean): string => (typeof v === 'string' ? v : String(v));

const getChalk = (): any => {
    const chalk: any = {
        white: (v: string | boolean) => _chalkPass(v),
        green: (v: string) => _chalkPass(v),
        red: (v: string) => _chalkPass(v),
        yellow: (v: string) => _chalkPass(v),
        default: (v: string) => _chalkPass(v),
        gray: (v: string) => _chalkPass(v),
        grey: (v: string) => _chalkPass(v),
        blue: (v: string) => _chalkPass(v),
        cyan: (v: string) => _chalkPass(v),
        magenta: (v: string) => _chalkPass(v),
        rgb: () => (v: string) => _chalkPass(v),
    };
    chalk.bold = chalk;
    return chalk;
};

// const loggerMock = {
//     logToSummary= jest.fn(),
//     logTask= jest.fn(),
//     logDebug= jest.fn(),
//     logInfo= jest.fn(),
//     logError= jest.fn(),
//     logWarning= jest.fn(),
//     logSuccess= jest.fn(),
//     chalk: () => getChalk(),
// };

export const logToSummary = jest.fn();
export const logTask = jest.fn();
export const logDebug = jest.fn();
export const logInfo = jest.fn();
export const logError = jest.fn();
export const logWarning = jest.fn();
export const logSuccess = jest.fn();
export const chalk = () => getChalk();
export const logHook = jest.fn();
export const logEnd = jest.fn();
export const logAppInfo = jest.fn();
export const logWelcome = jest.fn();
export const logComplete = jest.fn();
export const logInitialize = jest.fn();
export const stripAnsi = (v: any) => v;

export default {
    chalk,
    logHook,
    logEnd,
    logInfo,
    logTask,
    logError,
    logDebug,
    logAppInfo,
    logWarning,
    logSuccess,
    logWelcome,
    logComplete,
    logInitialize,
};
