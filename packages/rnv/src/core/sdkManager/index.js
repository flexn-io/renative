import { waitForEmulator } from './deviceManager/common';
import * as Android from './deviceManager/android';
import * as Apple from './deviceManager/apple';
import * as Tizen from './deviceManager/tizen';
import * as Webos from './deviceManager/webos';
import * as Kaios from './deviceManager/kaios';
import * as Installer from './installer';

export {
    waitForEmulator,
    Android,
    Apple,
    Tizen,
    Webos,
    Kaios,
    Installer
};
