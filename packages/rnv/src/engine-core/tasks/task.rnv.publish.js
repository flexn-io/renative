import semver from 'semver';
import Config from '../../core/configManager/config';
import { executeAsync } from '../../core/systemManager/exec';
import { logWarning, logTask } from '../../core/systemManager/logger';
import { writeFileSync } from '../../core/systemManager/fileutils';
import { executeTask } from '../../core/engineManager';
import { TASK_PUBLISH, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


const includesPre = (version) => {
    if (version.includes('alpha')) return 'alpha';
    if (version.includes('beta')) return 'beta';
    if (version.includes('rc')) return 'rc';
    return false;
};


/*
 *
 * Usage
 * rnv publish
 * rnv publish patch|minor|major
 * rnv publish patch|minor|major alpha|beta|rc
 * rnv publish 1.0.0
 * rnv publish 1.0.0-alpha.1
 * rnv publish ... --dry-run
 *
 * Basically the same as release-it documentation. The only difference is that you don't need to specify --preRelease=beta
 * if you are publishing a beta/alpha/rc. That is done automatically by checking if the second arg is alpha, beta, rc.
 *
 */
export const taskRnvPublish = async (c, parentTask, originTask) => {
    logTask('taskRnvPublish');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PUBLISH, originTask);

    // make sure release-it is installed
    await Config.checkRequiredPackage(c,
        'release-it',
        '12.4.3',
        'devDependencies');
    // make sure required object is present in package.json
    const pkgJson = c.files.project.package;
    const existingPath = c.paths.project.package;

    if (!pkgJson['release-it']) {
        pkgJson['release-it'] = {
            git: {
                // eslint-disable-next-line no-template-curly-in-string
                tagName: 'v${version}',
                requireCleanWorkingDir: false
            },
            npm: {
                publish: false
            },
            hooks: {
                // eslint-disable-next-line no-template-curly-in-string
                'before:git': 'npx rnv pkg version ${version}'
            }
        };
        writeFileSync(existingPath, pkgJson);
    }

    // backwards compatibility and user change friendly
    if (!pkgJson['release-it']?.hooks?.['before:git']) {
        if (!pkgJson['release-it'].hooks) {
            pkgJson['release-it'].hooks = {};
        }
        // eslint-disable-next-line no-template-curly-in-string
        pkgJson['release-it'].hooks['before:git'] = 'npx rnv pkg version ${version}';
        writeFileSync(existingPath, pkgJson);
    }

    if (!pkgJson['release-it'].publish) {
        pkgJson['release-it'].publish = 'local';
        pkgJson['release-it'].skipRootPublish = true;
        pkgJson['release-it'].rootPublishCommand = 'npx rnv deploy -p ios -s debug';
        writeFileSync(existingPath, pkgJson);
    }

    let args = [...Config.getConfig().program.rawArgs];
    args = args.slice(3);

    const maybeVersion = args[0];
    const secondArg = args[1];
    let prereleaseMark = '';

    // for handling `rnv publish patch alpha`
    if (['alpha', 'beta', 'rc'].includes(secondArg)) {
        args.splice(1, 1); // remove it so it won't interfere with release-it
        prereleaseMark = `--preRelease=${secondArg}`;
    }

    // for handling `rnv publish 1.0.0-alpha.1`
    if (semver.valid(maybeVersion) && includesPre(maybeVersion)) {
        prereleaseMark = `--preRelease=${includesPre(maybeVersion)}`;
    }

    const { dir } = Config.getConfig().paths.project;
    const execCommonOpts = { interactive: true, env: process.env, cwd: dir };
    const { ci } = Config.getConfig().program;
    const publishMode = pkgJson['release-it'].publish || 'local';
    const { skipRootPublish, rootPublishCommand } = pkgJson['release-it'];

    const rootPublishIfNecessary = async () => {
        await executeAsync('npx rnv pkg publish', execCommonOpts);
        if (!skipRootPublish) {
            if (!rootPublishCommand) {
                throw new Error(
                    "You don't have a rootPublishCommand specified in package.json"
                );
            }
            return executeAsync(rootPublishCommand, execCommonOpts);
        }
    };

    const releaseIt = () => executeAsync(
        `npx release-it ${args.join(' ')} ${prereleaseMark}`,
        execCommonOpts
    )
        .catch((e) => {
            if (e.includes('SIGINT')) return Promise.resolve();
            if (e.includes('--no-git.requireUpstream')) {
                return Promise.reject(
                    new Error(
                        'Seems like you have no upstream configured for current branch. Run `git push -u <origin> <your_branch>` to fix it then try again.'
                    )
                );
            }
            return Promise.reject(e);
        })
        .then(rootPublishIfNecessary);

    // we have a ci flag, checking if the project is configured for ci releases to do a bumpless deploy
    if (ci) {
        if (publishMode !== 'ci') {
            return logWarning(
                'You are running publish with --ci flag but this project is set for local deployments. Check package.json release-it.publish property'
            );
        }
        return rootPublishIfNecessary();
    }

    return releaseIt();
};

export default {
    description: '',
    fn: taskRnvPublish,
    task: 'publish',
    params: PARAMS.withBase(),
    platforms: [],
};
