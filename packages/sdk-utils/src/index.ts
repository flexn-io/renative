import { OverridesOptions, chalk, getAppConfigBuildsFolder, inquirerPrompt, logWarning } from '@rnv/core';
import { fsExistsSync } from '@rnv/core';
import { DEFAULTS, RnvContext, RnvPlatform, getConfigProp, logTask } from '@rnv/core';
import axios from 'axios';
import open from 'better-opn';
import detectPort from 'detect-port';
import killPort from 'kill-port';
import path from 'path';
import ip from 'ip';
import colorString from 'color-string';

export const getValidLocalhost = (value: string, localhost: string) => {
    if (!value) return localhost;
    switch (value) {
        case 'localhost':
        case '0.0.0.0':
        case '127.0.0.1':
            return localhost;
        default:
            return value;
    }
};

export const openBrowser = open;

export const getDevServerHost = (c: RnvContext) => {
    const devServerHostOrig = getConfigProp(c, c.platform, 'devServerHost');

    const devServerHostFixed = devServerHostOrig
        ? getValidLocalhost(devServerHostOrig, c.runtime.localhost || DEFAULTS.devServerHost)
        : DEFAULTS.devServerHost;

    return devServerHostFixed;
};

export const waitForHost = async (c: RnvContext, suffix = 'assets/bundle.js') => {
    logTask('waitForHost', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost(c);
    const url = `http://${devServerHost}:${c.runtime.port}/${suffix}`;

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            axios
                .get(url)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        // spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const checkPortInUse = (c: RnvContext, platform: RnvPlatform, port: number) =>
    new Promise((resolve, reject) => {
        if (port === undefined || port === null) {
            resolve(false);
            return;
        }
        detectPort(port, (err: string, availablePort: string) => {
            if (err) {
                reject(err);
                return;
            }
            const result = port !== parseInt(availablePort, 10);
            resolve(result);
        });
    });

export const getBuildFilePath = (
    c: RnvContext,
    platform: RnvPlatform,
    filePath: string,
    altTemplateFolder?: string
) => {
    // P1 => platformTemplates
    let sp = path.join(altTemplateFolder || getAppTemplateFolder(c, platform)!, filePath);
    // P2 => appConfigs/base + @buildSchemes
    const sp2bf = getAppConfigBuildsFolder(c, platform, c.paths.project.appConfigBase.dir);
    if (sp2bf) {
        const sp2 = path.join(sp2bf, filePath);
        if (fsExistsSync(sp2)) sp = sp2;
    }

    // P3 => appConfigs + @buildSchemes
    const sp3bf = getAppConfigBuildsFolder(c, platform);

    if (sp3bf) {
        const sp3 = path.join(sp3bf, filePath);
        if (fsExistsSync(sp3)) sp = sp3;
    }

    return sp;
};

export const getAppId = (c: RnvContext, platform: RnvPlatform) => {
    const id = getConfigProp(c, platform, 'id');
    const idSuffix = getConfigProp(c, platform, 'idSuffix');
    return idSuffix ? `${id}${idSuffix}` : id;
};

export const getAppTitle = (c: RnvContext, platform: RnvPlatform) => getConfigProp(c, platform, 'title');

export const getAppAuthor = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'author') || c.files.project.package?.author;

export const getAppLicense = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'license') || c.files.project.package?.license;

export const getEntryFile = (c: RnvContext, platform: RnvPlatform) =>
    platform ? c.buildConfig.platforms?.[platform]?.entryFile : undefined;

export const getGetJsBundleFile = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'getJsBundleFile');

export const getAppDescription = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'description') || c.files.project.package?.description;

export const getAppVersion = (c: RnvContext, platform: RnvPlatform) => {
    const version = getConfigProp(c, platform, 'version') || c.files.project.package?.version;
    if (!version) {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionFormat = getConfigProp(c, platform, 'versionFormat');
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
export const getAppVersionCode = (c: RnvContext, platform: RnvPlatform) => {
    const versionCode = getConfigProp(c, platform, 'versionCode');

    if (versionCode) {
        // android platforms don't allow versionCode to be a string, only positive integer
        if (_androidLikePlatform(platform)) {
            const isValidVersionCode = Number.isInteger(Number(versionCode)) && Number(versionCode) > 0;
            if (!isValidVersionCode) {
                throw new Error(`'versionCode' should be a positive integer. Check your config`);
            }
        }
        return versionCode;
    }

    const version = getConfigProp(c, platform, 'version') || c.files.project.package?.version;
    if (!version || typeof version !== 'string') {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionCodeFormat = getConfigProp(c, platform, 'versionCodeFormat') || '00.00.00';
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

export const confirmActiveBundler = async (c: RnvContext) => {
    if (c.runtime.skipActiveServerCheck) return true;

    if (c.program.ci) {
        //TODO: handle return codes properly
        await killPort(c.runtime.port);
        return true;
    }

    const choices = ['Restart the server (recommended)', 'Use existing session'];

    const { selectedOption } = await inquirerPrompt({
        name: 'selectedOption',
        type: 'list',
        choices,
        warningMessage: `Another ${c.platform} server at port ${chalk().white(c.runtime.port)} already running`,
    });

    if (choices[0] === selectedOption) {
        await killPort(c.runtime.port);
    } else {
        return false;
    }
    return true;
};

export const getIP = () => ip.address();

export const getAppTemplateFolder = (c: RnvContext, platform: RnvPlatform) =>
    platform ? path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`) : undefined;

export const addSystemInjects = (c: RnvContext, injects: OverridesOptions) => {
    if (!c.systemPropsInjects) c.systemPropsInjects = [];
    if (injects) {
        injects.forEach((item) => {
            c.systemPropsInjects.push(item);
        });
    }
};

export const sanitizeColor = (val: string | undefined, key: string) => {
    if (!val) {
        logWarning(`You are missing ${chalk().white(key)} in your renative config. will use default #FFFFFF instead`);
        return {
            rgb: [255, 255, 255, 1],
            rgbDecimal: [1, 1, 1, 1],
            hex: '#FFFFFF',
        };
    }

    const rgb = colorString.get.rgb(val);
    const hex = colorString.to.hex(rgb);

    return {
        rgb,
        rgbDecimal: rgb.map((v: number) => (v > 1 ? Math.round((v / 255) * 10) / 10 : v)),
        hex,
    };
};
