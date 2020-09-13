import merge from 'deepmerge';
import { logError, logTask, logWarning, chalk, logInfo } from '../systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';

export const isBuildSchemeSupported = async (c) => {
    logTask('isBuildSchemeSupported');

    const { scheme } = c.program;

    if (!c.buildConfig.platforms[c.platform]) {
        c.buildConfig.platforms[c.platform] = {};
    }

    const baseBuildSchemes = c.buildConfig.common?.buildSchemes || {};
    const platformBuildSchemes = c.buildConfig.platforms?.[c.platform]?.buildSchemes || {};

    const buildSchemes = merge(baseBuildSchemes, platformBuildSchemes);

    if (!buildSchemes) {
        logWarning(
            `Your appConfig for platform ${
                c.platform
            } has no buildSchemes. Will continue with defaults`
        );
        return false;
    }

    const schemeDoesNotExist = scheme && !buildSchemes[scheme];
    if (scheme === true || schemeDoesNotExist) {
        if (schemeDoesNotExist && scheme && scheme !== true) {
            logError('Build scheme you picked does not exists.');
        }
        // const opts = generateOptions(buildSchemes);
        const schemeOptions = [];
        const schemeVals = {};
        Object.keys(buildSchemes).forEach((k) => {
            const s = buildSchemes[k];
            const desc = s.description ? chalk().grey(` (${s.description})`) : '';
            const key = `${k}${desc}`;
            schemeOptions.push(key);
            schemeVals[key] = k;
        });

        const { selectedScheme } = await inquirerPrompt({
            name: 'selectedScheme',
            type: 'list',
            message: 'Pick one of available buildSchemes',
            choices: schemeOptions,
            logMessage: 'You need to specify scheme'
        });

        c.program.scheme = schemeVals[selectedScheme];
        c.runtime.scheme = c.program.scheme;
    }
    logInfo(`Current Build Scheme: ${chalk().bold.white(
        c.runtime.scheme
    )}`);
    return true;
};
