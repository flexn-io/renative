import Config from '../config';
import { executeAsync } from '../systemTools/exec';
import { writeObjectSync } from '../systemTools/fileutils';

const rnvPublish = async () => {
    // make sure release-it is installed
    await Config.checkRequiredPackage('release-it', '12.4.3', 'devDependencies');
    // make sure required object is present in package.json
    const pkgJson = Config.getProjectConfig().package;

    if (!pkgJson['release-it']) {
        pkgJson['release-it'] = {
            git: {
                // eslint-disable-next-line no-template-curly-in-string
                tagName: 'v${version}',
                requireCleanWorkingDir: false
            },
            npm: {
                publish: false
            }
        };
        const existingPath = Config.getConfig().paths.project.package;
        writeObjectSync(existingPath, pkgJson);
    }


    let args = [...Config.getConfig().program.rawArgs];
    args = args.slice(3);

    const { dir } = Config.getConfig().paths.project;

    return executeAsync(`release-it ${args.join(' ')}`, { interactive: true, env: process.env, cwd: dir }).catch((e) => {
        if (e.includes('SIGINT')) return Promise.resolve();
        return Promise.reject(e);
    });
};

export default rnvPublish;
