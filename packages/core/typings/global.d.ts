import { RnvApi, RnvContext } from "../src";

export {};

declare global {
    //eslint-disable-next-line no-var
    var fetch;
    //eslint-disable-next-line no-var
    var RNV_CONTEXT: RnvContext;
    //eslint-disable-next-line no-var
    var RNV_API: RnvApi;
}
