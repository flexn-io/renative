import { chalk, logDefault, getCurrentCommand } from '../logger';
import { RnvContext } from '../context/types';
import { inquirerPrompt } from '../api';
import { upgradeProjectDependencies } from '../configs/configProject';

export const versionCheck = async (c: RnvContext) => {
    logDefault('versionCheck');

    if (
        c.runtime.versionCheckCompleted ||
        c.files.project?.config?.project?.skipAutoUpdate ||
        c.program.opts().skipDependencyCheck
    ) {
        return true;
    }
    c.runtime.rnvVersionRunner = c.files.rnvCore?.package?.version || 'unknown';
    c.runtime.rnvVersionProject =
        c.files.project?.package?.devDependencies?.['@rnv/core'] ||
        c.files.project?.package?.dependencies?.['@rnv/core'] ||
        'unknown';
    logDefault(
        `versionCheck:rnvRunner:${c.runtime.rnvVersionRunner},rnvProject:${c.runtime.rnvVersionProject}`,
        chalk().grey
    );
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject && !c.program.opts().skipRnvCheck) {
            const recCmd = chalk().bold.white(`$ npx ${getCurrentCommand(true)}`);
            const actionNoUpdate = 'Continue and skip updating package.json';
            const actionWithUpdate = 'Continue and update package.json';
            const actionUpgrade = `Upgrade project to ${c.runtime.rnvVersionRunner}`;

            const { chosenAction } = await inquirerPrompt({
                message: 'What to do next?',
                type: 'list',
                name: 'chosenAction',
                choices: [actionNoUpdate, actionWithUpdate, actionUpgrade],
                warningMessage: `You are running $rnv v${chalk().red(
                    c.runtime.rnvVersionRunner
                )} against project built with rnv v${chalk().red(
                    c.runtime.rnvVersionProject
                )}. This might result in unexpected behaviour!
It is recommended that you run your rnv command with npx prefix: ${recCmd} . or manually update your devDependencies.rnv version in your package.json.`,
            });

            c.runtime.versionCheckCompleted = true;

            c.runtime.skipPackageUpdate = chosenAction === actionNoUpdate;

            if (chosenAction === actionUpgrade) {
                upgradeProjectDependencies(c.runtime.rnvVersionRunner);
            }
        }
    }
    return true;
};
