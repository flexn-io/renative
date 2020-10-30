import { waitForEmulator } from './deviceManager/common';
import * as Android from './deviceManager/android';
import * as Apple from './deviceManager/apple';
import * as Tizen from './deviceManager/tizen';
import * as Webos from './deviceManager/webos';
import * as Kaios from './deviceManager/kaios';


export {
    waitForEmulator,
    Android,
    Apple,
    Tizen,
    Webos,
    Kaios
};
