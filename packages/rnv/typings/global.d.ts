// import type { RnvContext } from "rnv";

export {};

declare global {
    //eslint-disable-next-line no-var
    var _messages: Array<string>;
    //eslint-disable-next-line no-var
    var timeEnd: Date
    //eslint-disable-next-line no-var
    var timeStart: Date
    //eslint-disable-next-line no-var
    var RNV_CONFIG
    //eslint-disable-next-line no-var
    var RNV_ANALYTICS
    //eslint-disable-next-line no-var
    var _isSystemWin: boolean;
    //eslint-disable-next-line no-var
    var _doResolve;
    //eslint-disable-next-line no-var
    var _getConfigProp
    //eslint-disable-next-line no-var
    var fetch;
    // //eslint-disable-next-line no-var
    // var RNV_CONTEXT: RnvContext;
}
