import path from 'path';
import { getConfigProp, fsWriteFileSync, getAppFolder } from '@rnv/core';
import { getAppFolderName } from './common';

export const parsePrivacyManifest = async () => {
    const privacyManifest = getConfigProp('privacyManifests');

    if (privacyManifest) {
        const apiTypes = privacyManifest.NSPrivacyAccessedAPITypes;

        const output = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>NSPrivacyAccessedAPITypes</key>
        <array>
            ${apiTypes
                .map((api) => {
                    return `
                    <dict>
                        <key>NSPrivacyAccessedAPIType</key>
                        <string>${api.NSPrivacyAccessedAPIType}</string>
                        <array>
                        ${api.NSPrivacyAccessedAPITypeReasons.map((reason) => {
                            return `<string>${reason}</string>`;
                        }).join('\n')}
                        </array>
                    <dict>
                `;
                })
                .join('')}
        </array>
    </dict>
</plist>
        `;

        const appFolder = getAppFolder();
        const appFolderName = getAppFolderName();

        const filePath = path.join(appFolder, `${appFolderName}/PrivacyInfo.xcprivacy`);

        fsWriteFileSync(filePath, output);
    }
};
