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
    getContext,
    getCurrentCommand,
    inquirerPrompt,
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
        ...CoreEnvVars.RNV_EXTENSIONS(),
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

const generateCombinedChecksum = () => {
    const c = getContext();
    const appFolder = getAppFolder(c);

    const podContentChecksum = generateChecksum(fsReadFileSync(path.join(appFolder, 'Podfile')).toString());
    const pluginVersionsChecksum = generateChecksum(JSON.stringify(c.runtime.pluginVersions));

    const combinedChecksum = podContentChecksum + pluginVersionsChecksum;
    return combinedChecksum;
};

const checkIfPodsIsRequired = (c: RnvContext): { result: boolean; reason: string; code: number } => {
    if (c.runtime._skipNativeDepResolutions) {
        return { result: false, reason: `Command ${getCurrentCommand(true)} explicitly skips pod checks`, code: 1 };
    }
    if (c.program.updatePods) {
        return { result: true, reason: 'You passed --updatePods option', code: 2 };
    }
    const appFolder = getAppFolder(c);

    const podLockPath = path.join(appFolder, 'Podfile.lock');
    if (!fsExistsSync(podLockPath)) {
        return { result: true, reason: 'Podfile.lock does not exist', code: 3 };
    }

    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');
    if (!fsExistsSync(podChecksumPath)) {
        return { result: true, reason: 'Podfile.checksum does not exist', code: 4 };
    }
    const podChecksum = fsReadFileSync(podChecksumPath).toString();
    const combinedChecksum = generateCombinedChecksum();

    if (podChecksum !== combinedChecksum) {
        return { result: true, reason: 'Podfile and/or plugins versions have changed', code: 5 };
    }

    return { result: false, reason: 'Podfile.checksum matches current value', code: 6 };
};

const updatePodsChecksum = (c: RnvContext) => {
    logTask('updatePodsChecksum');
    const appFolder = getAppFolder(c);
    const podChecksumPath = path.join(appFolder, 'Podfile.checksum');

    const combinedChecksum = generateCombinedChecksum();
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

    const checkResult = await checkIfPodsIsRequired(c);

    if (!checkResult.result) {
        logInfo(`Skipping pod action. Reason: ${checkResult.reason}`);
        return false;
    }

    // logInfo(`Will execute pod command. Reason: ${checkResult.reason}`);

    const appFolder = getAppFolder(c);

    if (!fsExistsSync(appFolder)) {
        return Promise.reject(`Location ${appFolder} does not exists!`);
    }

    const option1 = 'Continue with pod action (recommended)';
    const option2 = 'Skip pod action';
    const option3 = "Skip and don't ask again";

    const runPods = async () => {
        await executeAsync(c, 'bundle install');

        const env = {
            ...CoreEnvVars.BASE(),
            ...EnvVars.RNV_REACT_NATIVE_PATH(),
            ...EnvVars.RCT_NEW_ARCH_ENABLED(),
            ...EnvVars.RNV_SKIP_LINKING(),
        };

        if (c.program.updatePods) {
            await executeAsync(c, 'bundle exec pod update', {
                cwd: appFolder,
                env,
            });
        } else {
            await executeAsync(c, 'bundle exec pod install', {
                cwd: appFolder,
                env,
            });
        }

        updatePodsChecksum(c);
    };

    if (checkResult.code === 3) {
        //If Podfile.lock does not exist let's not wait for confirmation
        logInfo(`${checkResult.reason}. Will execute pod actions...`);
        return runPods();
    }

    const { selectedOption } = await inquirerPrompt({
        name: 'selectedOption',
        type: 'list',
        message: `${checkResult.reason}`,
        choices: [option1, option2, option3],
        default: option1,
    });

    if (selectedOption === option1) {
        return runPods();
    } else if (selectedOption === option2) {
        return false;
    }

    updatePodsChecksum(c);
    return false;
};
