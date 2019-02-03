
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';
import { executeAsync } from './exec';


const runApp = (appId, program, process) => new Promise((resolve, reject) => {
    const platform = program.platform;
    if (!isPlatformSupported(platform)) return;
    console.log('RUN: ', appId, platform, program.device);

    getConfig(appId).then((v) => {
        _runiOS(v, platform)
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const _runiOS = (c, platform) => {
    logTask('_runiOS');
    const device = 'iPhone 6';
    const appPath = path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);
    const p = [
        'run-ios',
        '--project-path',
        appPath,
        '--simulator',
        device,
        '--scheme',
        c.appConfigFile.platforms.ios.scheme,
        '--configuration',
        c.appConfigFile.platforms.ios.runScheme,
    ];
    console.log('ASSSAAA', p);
    if (c.appConfigFile.platforms.ios.runScheme === 'Release') {
        iosPackage(buildConfig).then(v => executeAsync('react-native', p));
    } else {
        return executeAsync('react-native', p);
    }
};

export { runApp };
