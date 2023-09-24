import { executeAsync, getAppFolder, getConfigProp, generateEnvVars, doResolve, logTask, RnvContext } from '@rnv/core';

import shellQuote from 'shell-quote';

export const packageReactNativeIOS = (c: RnvContext, isDev = false) => {
    logTask('packageBundleForXcode');
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
        shellQuote.quote([`${c.buildConfig.platforms?.[c.platform].entryFile}.js`]),
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
        { env: { ...generateEnvVars(c) } }
    );
};

export const runReactNativeIOS = async (c: RnvContext, scheme: string, runScheme: string) => {
    logTask('_checkLockAndExec', `scheme:${scheme} runScheme:${runScheme}`);

    // const cmd = `node ${doResolve(
    //     c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native'
    // )}/local-cli/cli.js run-ios --project-path ${appPath} --scheme ${scheme} --configuration ${runScheme} ${p}`;
    const cmd = `npx react-native run-ios --scheme=${scheme} --mode=${runScheme} --no-packager`;

    const env: Record<string, string | number | string[] | undefined | boolean> = {
        RCT_METRO_PORT: c.runtime.port,
        ...generateEnvVars(c),
    };

    try {
        // Inherit full logs
        // return executeAsync(c, cmd, { stdio: 'inherit', silent: true });
        return executeAsync(c, cmd, {
            env,
        });
    } catch (e: any) {
        return Promise.reject(e);
    }
};
