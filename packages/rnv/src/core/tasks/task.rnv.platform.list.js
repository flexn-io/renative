/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import { chalk, logToSummary } from '../systemManager/logger';
import { generateOptions } from '../../cli/prompt';


const _genPlatOptions = (c) => {
    const opts = generateOptions(
        c.buildConfig.defaults.supportedPlatforms,
        true,
        null,
        (i, obj, mapping, defaultVal) => {
            const isEjected = c.paths.project.platformTemplatesDirs[
                obj
            ].includes(c.paths.rnv.platformTemplates.dir)
                ? chalk().green('(connected)')
                : chalk().yellow('(ejected)');
            return ` [${chalk().white(i + 1)}]> ${chalk().bold(
                defaultVal
            )} - ${isEjected} \n`;
        }
    );
    return opts;
};

export const rnvPlatformList = c => new Promise((resolve) => {
    const opts = _genPlatOptions(c);
    logToSummary(`Platforms:\n\n${opts.asString}`);
    resolve();
});
