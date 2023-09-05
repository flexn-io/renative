import merge from 'deepmerge';
import { logError, logTask, logWarning, chalk, logInfo } from '../systemManager/logger';
import { inquirerPrompt } from '../../cli/prompt';
import { RnvContext } from '../context/types';

export const isBuildSchemeSupported = async (c: RnvContext) => {
    logTask('isBuildSchemeSupported');

    const { scheme } = c.program;

    const platforms = c.buildConfig.platforms || {};

    if (!platforms[c.platform]) {
        platforms[c.platform] = {
            buildSchemes: {},
        };
    }

    const baseBuildSchemes = c.buildConfig.common?.buildSchemes || {};
    const platformBuildSchemes = platforms[c.platform]?.buildSchemes || {};

    const buildSchemes = merge(baseBuildSchemes, platformBuildSchemes);

    c.buildConfig.platforms = platforms;

    if (!buildSchemes) {
        logWarning(`Your appConfig for platform ${c.platform} has no buildSchemes. Will continue with defaults`);
        return false;
    }

    const schemeDoesNotExist = scheme && !buildSchemes[scheme];
    if (scheme === true || schemeDoesNotExist) {
        if (schemeDoesNotExist && scheme && scheme !== true) {
            logError('Build scheme you picked does not exists.');
        }
        // const opts = generateOptions(buildSchemes);
        const schemeOptions: Array<string> = [];
        const schemeVals: Record<string, string> = {};
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
            logMessage: 'You need to specify scheme',
        });

        c.program.scheme = schemeVals[selectedScheme];
        c.runtime.scheme = c.program.scheme;
    }
    logInfo(`Current Build Scheme: ${chalk().bold.white(c.runtime.scheme)}`);
    return true;
};
