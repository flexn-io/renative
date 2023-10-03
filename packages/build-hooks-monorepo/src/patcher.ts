import { fixPackageObject, readObjectSync, writeFileSync } from '@rnv/core';
import merge from 'deepmerge';

export const patchJsonFile = (pPath: string, updateObj: object) => {
    const pObj = readObjectSync(pPath);

    if (!pObj) {
        throw new Error(`patchJsonFile called with unresolveable package.json path '${pPath}'`);
    }

    if (pObj) {
        const obj: Record<string, string | boolean> = merge(pObj, updateObj) || {};

        const output = fixPackageObject(obj);
        writeFileSync(pPath, output, 4, true);
    }
};
