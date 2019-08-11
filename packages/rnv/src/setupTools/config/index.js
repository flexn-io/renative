import { replaceHomeFolder } from '../../systemTools/fileutils';

const isRunningOnWindows = process.platform === 'win32';

let androidPlatform = 'linux';
let tizenPlatform = 'ubuntu';
let tizenExtension = 'bin';

if (isRunningOnWindows) {
    androidPlatform = 'windows';
    tizenPlatform = 'windows';
    tizenExtension = 'exe';
}

if (process.platform === 'darwin') {
    tizenPlatform = 'macos';
    tizenExtension = 'dmg';
}

export default {
    android: {
        sdkUrl: `https://dl.google.com/android/repository/sdk-tools-${androidPlatform}-4333796.zip`,
        downloadLocation: replaceHomeFolder(`~/sdk-tools-${androidPlatform}-4333796.zip`),
        location: replaceHomeFolder('~/Android')
    },
    tizen: {
        sdkUrl: `http://download.tizen.org/sdk/Installer/tizen-studio_3.3/web-ide_Tizen_Studio_3.3_${tizenPlatform}-64.${tizenExtension}`,
        downloadLocation: replaceHomeFolder(`~/web-ide_Tizen_Studio_3.3_${tizenPlatform}-64.${tizenExtension}`),
    },
    webos: {
        downloadLink: 'http://webostv.developer.lge.com/sdk/installation/#',
    }
};
