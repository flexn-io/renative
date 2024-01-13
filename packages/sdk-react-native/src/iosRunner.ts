import {
    executeAsync,
    getAppFolder,
    getConfigProp,
    doResolve,
    logTask,
    RnvContext,
    CoreEnvVars,
    fsReadFileSync,
    fsExistsSync,
    logInfo,
    logDebug,
    fsWriteFileSync,
    commandExistsSync,
    logWarning,
} from '@rnv/core';
import { RnvEnvContext } from '@rnv/core/lib/env/types';
import { EnvVars } from './env';
import shellQuote from 'shell-quote';
import path from 'path';
import crypto from 'crypto';

export const packageReactNativeIOS = (c: RnvContext, isDev = false) => {
    logTask('packageBundleForXcode');

    const entryFile = getConfigProp(c, c.platform, 'entryFile');

    if (!c.platform) return;
    // const { maxErrorLength } = c.program;
    const args = [
        'bundle',
        '--platform',
        'ios',
        '--dev',
        isDev,
        '--assets-dest',
        `platformBuilds/${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`,
        '--entry-file',
        // SECURITY-PATCH https://github.com/flexn-io/renative/security/code-scanning/112
        shellQuote.quote([`${entryFile}.js`]),
        '--bundle-output',
        `${getAppFolder(c)}/main.jsbundle`,
    ];

    if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
        args.push('--sourcemap-output');
        args.push(`${getAppFolder(c)}/main.jsbundle.map`);
    }

    if (c.program.info) {
        args.push('--verbose');
    }

    return executeAsync(
        c,
        `node ${doResolve(
            c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native'
        )}/local-cli/cli.js ${args.join(' ')} --config=${
            c.runtime.runtimeExtraProps?.reactNativeMetroConfigName || 'metro.config.js'
        }`,
        {
            env: {
                ...CoreEnvVars.BASE(),
                ...CoreEnvVars.RNV_EXTENSIONS(),
                ...EnvVars.RNV_REACT_NATIVE_PATH(),
                ...EnvVars.RNV_APP_ID(),
            },
        }
    );
};

export const runReactNativeIOS = async (
    c: RnvContext,
    scheme: string,
    runScheme: string,
    extraParamsString: string
) => {
    logTask('_checkLockAndExec', `scheme:${scheme} runScheme:${runScheme}`);

    // const cmd = `node ${doResolve(
    //     c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native'
    // )}/local-cli/cli.js run-ios --project-path ${appPath} --scheme ${scheme} --configuration ${runScheme} ${p}`;
    const cmd = `npx react-native run-ios --scheme=${scheme} --mode=${runScheme} --no-packager ${extraParamsString}`;
    const env: RnvEnvContext = {
        ...CoreEnvVars.BASE(),
        ...EnvVars.RCT_METRO_PORT(),
        ...EnvVars.RNV_REACT_NATIVE_PATH(),
        ...EnvVars.RNV_APP_ID(),
    };

    try {
        // Inherit full logs
        // return executeAsync(c, cmd, { stdio: 'inherit', silent: true });
        return executeAsync(c, cmd, {
            env,
        });
    } catch (e) {
        if (typeof e === 'string') {
            return Promise.reject(e);
        } else if (e instanceof Error) {
            return Promise.reject(e.message);
        }
    }
};
export const generateChecksum = (str: string, algorithm?: string, encoding?: 'base64' | 'base64url' | 'hex') =>
    crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');

const checkIfPodsIsRequired = async (c: RnvContext) => {
    const appFolder = getAppFolder(c);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    if (!fsExistsSync(podChecksumPath)) return true;
    const podChecksum = fsReadFileSync(podChecksumPath).toString();
    const podContentChecksum = generateChecksum(fsReadFileSync(path.join(appFolder, 'Podfile')).toString());
    const packageDependenciesChecksum = generateChecksum(
        JSON.stringify({ ...c.files.project.package.dependencies, ...c.files.project.package.devDependencies })
    );
    const combinedChecksum = podContentChecksum + packageDependenciesChecksum;

    if (podChecksum !== combinedChecksum) {
        logDebug('runCocoaPods:isMandatory');
        return true;
    }
    logInfo(
        'Pods do not seem like they need to be updated. If you want to update them manually run the same command with "-u" parameter'
    );
    return false;
};

const updatePodsChecksum = (c: RnvContext) => {
    logTask('updatePodsChecksum');
    const appFolder = getAppFolder(c);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    const podContentChecksum = generateChecksum(fsReadFileSync(path.join(appFolder, 'Podfile')).toString());
    const packageDependenciesChecksum = generateChecksum(
        JSON.stringify({ ...c.files.project.package.dependencies, ...c.files.project.package.devDependencies })
    );
    const combinedChecksum = podContentChecksum + packageDependenciesChecksum;
    if (fsExistsSync(podChecksumPath)) {
        const existingContent = fsReadFileSync(podChecksumPath).toString();
        if (existingContent !== combinedChecksum) {
            logDebug(`updatePodsChecksum:${combinedChecksum}`);
            return fsWriteFileSync(podChecksumPath, combinedChecksum);
        }
        return true;
    }
    logDebug(`updatePodsChecksum:${combinedChecksum}`);
    return fsWriteFileSync(podChecksumPath, combinedChecksum);
};

export const runCocoaPods = async (c: RnvContext) => {
    logTask('runCocoaPods', `forceUpdate:${!!c.program.updatePods}`);

    if (c.runtime._skipNativeDepResolutions) return;

    const appFolder = getAppFolder(c);

    if (!fsExistsSync(appFolder)) {
        return Promise.reject(`Location ${appFolder} does not exists!`);
    }
    const podsRequired = c.program.updatePods || (await checkIfPodsIsRequired(c));

    const env = {
        ...CoreEnvVars.BASE(),
        ...EnvVars.RNV_REACT_NATIVE_PATH(),
        ...EnvVars.REACT_NATIVE_PERMISSIONS_REQUIRED(),
        ...EnvVars.RCT_NEW_ARCH_ENABLED(),
        ...EnvVars.RNV_SKIP_LINKING(),
    };

    if (podsRequired) {
        if (!commandExistsSync('pod')) {
            throw new Error('Cocoapods not installed. Please run `sudo gem install cocoapods`');
        }

        try {
            await executeAsync(c, 'bundle install');
            await executeAsync(c, 'bundle exec pod install', {
                cwd: appFolder,
                env,
            });
        } catch (e: Error | any) {
            const s = e?.toString ? e.toString() : '';
            const isGenericError =
                s.includes('No provisionProfileSpecifier configured') ||
                s.includes('TypeError:') ||
                s.includes('ReferenceError:') ||
                s.includes('find gem cocoapods');
            if (isGenericError) {
                return new Error(`pod install failed with:\n ${s}`);
            }
            logWarning(`pod install is not enough! Let's try pod update! Error:\n ${s}`);
            await executeAsync(c, 'bundle update');

            return executeAsync(c, 'bundle exec pod update', {
                cwd: appFolder,
                env,
            })
                .then(() => updatePodsChecksum(c))
                .catch((er) => Promise.reject(er));
        }

        updatePodsChecksum(c);
        return true;
    }
};
