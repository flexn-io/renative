/* eslint-disable global-require, import/no-dynamic-require */
import semver from 'semver';
import release from 'release-it';
import deepmerge from 'deepmerge';

import Config from '../config';
import { executeAsync } from '../systemTools/exec';
import { logError } from '../systemTools/logger';
import { inquirerPrompt } from '../systemTools/prompt';

/*
 *
 * Usage
 * rnv publish
 * rnv publish --bump major
 * rnv publish --specificVersion 9.9.9
 * rnv publish --tag alpha
 *
 */

const rnvPublish = async () => {
    // make sure release-it is installed
    await Config.checkRequiredPackage('release-it', '12.4.3', 'devDependencies');

    const { program: { ci, scheme, tag, bump, specificVersion } } = Config.getConfig();

    const publishConfig = Config.getConfig().buildConfig.publish;
    if (!publishConfig) throw new Error('You have no publish schemes configured. Please check appConfig/base/renative.json->publish');
    const { schemes } = publishConfig;
    let chosenScheme = scheme;

    // scheme
    if ((!scheme || !schemes[scheme]) && !ci) {
        const { selected } = await inquirerPrompt({
            type: 'list',
            message: 'Please select your publish scheme',
            name: 'selected',
            choices: Object.keys(schemes).map(k => ({ value: k, name: `${k} ${schemes[k].description ? `(${schemes[k].description})` : ''}` }))
        });

        chosenScheme = selected;
    }

    if (!chosenScheme) throw new Error('No scheme selected or passed (-s)');
    const currentScheme = schemes[chosenScheme];

    let chosenBumpStrategy = bump || currentScheme.bump;

    // bump strategy
    if (specificVersion && semver.valid(specificVersion)) {
        chosenBumpStrategy = specificVersion;
    } else if (specificVersion) {
        logError(`Chosen specific version ${specificVersion} is not a valid SemVer version`, false, true);
    }
    if (!chosenBumpStrategy && !ci) {
        const { selected } = await inquirerPrompt({
            type: 'list',
            message: 'Please select your bump strategy',
            name: 'selected',
            choices: [{ value: 'major', name: 'major (1.1.0 -> 2.0.0)' }, { value: 'minor', name: 'minor (1.1.0 -> 1.2.0)' }, { value: 'patch', name: 'patch (1.1.0 -> 1.1.1)' }]
        });

        chosenBumpStrategy = selected;
    }
    if (!chosenBumpStrategy) throw new Error('No bump strategy selected or passed (--bump)');

    // configure options
    const { dir } = Config.getConfig().paths.project;
    const defaultOptions = {
        'dry-run': true,
        increment: chosenBumpStrategy,
        git: {
            tagName: 'v${version}', // eslint-disable-line no-template-curly-in-string
            requireCleanWorkingDir: false
        },
        npm: {
            publish: false
        },
        hooks: {
            'after:bump': 'npx rnv pkg version ${version}' // eslint-disable-line no-template-curly-in-string
        }
    };
    const options = deepmerge(defaultOptions, currentScheme);

    // handle prerelease
    const preRelease = tag || currentScheme.tag;
    if (preRelease) options.preRelease = preRelease;

    const { command } = currentScheme;

    try {
        await release(options);

        if (command) {
            await executeAsync(command, { interactive: true, env: process.env, cwd: dir });
        }
    } catch (e) {
        if (e.includes('SIGINT')) return Promise.resolve();
        if (e.includes('--no-git.requireUpstream')) return Promise.reject(new Error('Seems like you have no upstream configured for current branch. Run `git push -u <origin> <your_branch>` to fix it then try again.'));
        return Promise.reject(e);
    }
};

export default rnvPublish;
