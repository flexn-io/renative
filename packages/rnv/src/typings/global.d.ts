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
    var isSystemWin: boolean;
    //eslint-disable-next-line no-var
    var doResolve;
    //eslint-disable-next-line no-var
    var getConfigProp
    //eslint-disable-next-line no-var
    var fetch;
}
