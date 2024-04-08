import { getAppConfigBuildsFolder, logWarning, RnvPlatform, getConfigProp, fsExistsSync, getContext } from '@rnv/core';
import path from 'path';

export const getBuildFilePath = (filePath: string, altTemplateFolder?: string) => {
    const c = getContext();
    // P1 => platformTemplates
    let sp = path.join(altTemplateFolder || getAppTemplateFolder()!, filePath);
    // P2 => appConfigs/base + @buildSchemes
    const sp2bf = getAppConfigBuildsFolder(c.paths.project.appConfigBase.dir);
    if (sp2bf) {
        const sp2 = path.join(sp2bf, filePath);
        if (fsExistsSync(sp2)) sp = sp2;
    }

    // P3 => appConfigs + @buildSchemes
    const sp3bf = getAppConfigBuildsFolder();

    if (sp3bf) {
        const sp3 = path.join(sp3bf, filePath);
        if (fsExistsSync(sp3)) sp = sp3;
    }

    return sp;
};

export const getAppId = () => {
    const id = getConfigProp('id');
    const idSuffix = getConfigProp('idSuffix');
    return idSuffix ? `${id}${idSuffix}` : id;
};

export const getAppTitle = () => getConfigProp('title');

export const getAppAuthor = () => getConfigProp('author') || getContext().files.project.package?.author;

export const getAppLicense = () => getConfigProp('license') || getContext().files.project.package?.license;

export const getEntryFile = () => {
    const c = getContext();
    return c.platform ? c.buildConfig.platforms?.[c.platform]?.entryFile : undefined;
};

export const getGetJsBundleFile = () => getConfigProp('getJsBundleFile');

export const getAppDescription = () => getConfigProp('description') || getContext().files.project.package?.description;

export const getAppVersion = () => {
    const version = getConfigProp('version') || getContext().files.project.package?.version;
    if (!version) {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionFormat = getConfigProp('versionFormat');
    if (!versionFormat) return version;
    const versionCodeArr = versionFormat.split('.');
    const dotLength = versionCodeArr.length;
    const isNumArr = versionCodeArr.map((v: string) => !Number.isNaN(Number(v)));

    const verArr: Array<string> = [];
    let i = 0;
    version.split('.').map((v: string) =>
        v.split('-').map((v2) =>
            v2.split('+').forEach((v3) => {
                const isNum = !Number.isNaN(Number(v3));
                if (isNumArr[i] && isNum) {
                    verArr.push(v3);
                } else if (!isNumArr[i]) {
                    verArr.push(v3);
                }

                i++;
            })
        )
    );
    if (verArr.length > dotLength) {
        verArr.length = dotLength;
    }

    const output = verArr.join('.');
    // console.log(`IN: ${version}\nOUT: ${output}`);
    return output;
};

const _androidLikePlatform = (platform: RnvPlatform) =>
    ['android', 'androidtv', 'firetv', 'androidwear'].includes(platform!);

/**
 * Retrieves the version code for the specified platform from the configuration.
 * If the platform is Android, the version code must be a positive integer.
 * If the version code is not found or is invalid, it falls back to a default value of '0'.
 * Otherwise version code is generated based on the version and version code format specified in the configuration.
 *
 * @param c - The RnvContext object.
 * @param platform - The RnvPlatform object.
 * @returns The version code as a string.
 * @throws An error if the version code is not a positive integer for Android platforms.
 */
export const getAppVersionCode = () => {
    const c = getContext();
    const versionCode = getConfigProp('versionCode');

    if (versionCode) {
        // android platforms don't allow versionCode to be a string, only positive integer
        if (_androidLikePlatform(c.platform)) {
            const isValidVersionCode = Number.isInteger(Number(versionCode)) && Number(versionCode) > 0;
            if (!isValidVersionCode) {
                throw new Error(`'versionCode' should be a positive integer. Check your config`);
            }
        }
        return versionCode;
    }

    const version = getConfigProp('version') || c.files.project.package?.version;
    if (!version || typeof version !== 'string') {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionCodeFormat = getConfigProp('versionCodeFormat') || '00.00.00';
    const vFormatArr = versionCodeFormat.split('.').map((v: string) => v.length);
    const versionCodeMaxCount = vFormatArr.length;
    const verArr = [];

    version.split('.').map((v) =>
        v.split('-').map((v2) =>
            v2.split('+').forEach((v3) => {
                const asNumber = Number(v3);
                if (!Number.isNaN(asNumber)) {
                    let val = v3;
                    const maxDigits = vFormatArr[verArr.length] || 2;

                    if (v3.length > maxDigits) {
                        val = v3.substr(0, maxDigits);
                    } else if (v3.length < maxDigits) {
                        let toAdd = maxDigits - v3.length;
                        val = v3;
                        while (toAdd > 0) {
                            val = `0${val}`;
                            toAdd--;
                        }
                    }
                    verArr.push(val);
                }
            })
        )
    );
    let verCountDiff = verArr.length - versionCodeMaxCount;
    if (verCountDiff < 0) {
        while (verCountDiff < 0) {
            let extraVersionLen = vFormatArr[versionCodeMaxCount + verCountDiff];
            let num = '';
            while (extraVersionLen) {
                num += '0';
                extraVersionLen--;
            }
            verArr.push(num);
            verCountDiff++;
        }
    }

    const output = Number(verArr.join('')).toString();
    // console.log(`IN: ${version}\nOUT: ${output}`);
    return output;
};

export const getAppTemplateFolder = () => {
    const c = getContext();
    const { platform } = c;
    return platform ? path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`) : undefined;
};
