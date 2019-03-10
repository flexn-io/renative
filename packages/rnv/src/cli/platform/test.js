import fs from 'fs';
import path from 'path';
import IOS from './ios';

const base = path.resolve('../../');

const _getConfig = (appConfigId) => {
    // logTask('getConfig');

    const c = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    const appConfigFolder = path.join(base, c.appConfigsFolder, appConfigId);
    const platformAssetsFolder = path.join(base, 'platformAssets');
    const platformBuildsFolder = path.join(base, 'platformBuilds');
    const platformTemplatesFolder = path.join(__dirname, '../platformTemplates');
    const appConfigPath = path.join(appConfigFolder, 'config.json');
    const appConfigFile = JSON.parse(fs.readFileSync(appConfigPath).toString());

    return {
        rootConfig: c,
        appId: appConfigId,
        appConfigFile,
        appConfigPath,
        appConfigFolder,
        platformAssetsFolder,
        platformBuildsFolder,
        platformTemplatesFolder,
    };
};

async function test() {
    const config = _getConfig('helloWorld');
    // config.platformBuildsFolder = config.platformBuildsFolder || 'platforms';
    const ios = new IOS();
    try {
        await ios.runSetupProject(config, '');
        console.log('ok');
    } catch (error) {
        console.error(error);
    }
}

test();
