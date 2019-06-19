import fs from 'fs';
import { isObject, isArray, isBool, isString } from '../../systemTools/objectUtils';

const PLIST_START = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">\n`;

const PLIST_END = '</plist>\n';

const objToPlist = (obj) => {
    let output = PLIST_START;
    output += _parseObject(obj, 0);
    output += PLIST_END;
    return output;
};

const _parseObject = (obj, level) => {
    let output = '';
    let space = '';
    for (let i = 0; i < level; i++) {
        space += '  ';
    }
    if (isArray(obj)) {
        output += `${space}<array>\n`;
        obj.forEach((v) => {
            output += _parseObject(v, level + 1);
        });
        output += `${space}</array>\n`;
    } else if (isBool(obj)) {
        output += `${space}<${obj} />\n`;
    } else if (isObject(obj)) {
        output += `${space}<dict>\n`;
        for (const key in obj) {
            output += `  ${space}<key>${key}</key>\n`;
            output += _parseObject(obj[key], level + 1);
        }
        output += `${space}</dict>\n`;
    } else if (isString(obj)) {
        output += `${space}<string>${obj}</string>\n`;
    }

    return output;
};

const saveObjToPlistSync = (filePath, obj) => {
    fs.writeFileSync(filePath, objToPlist(obj));
};


export {
    objToPlist,
    saveObjToPlistSync
};
