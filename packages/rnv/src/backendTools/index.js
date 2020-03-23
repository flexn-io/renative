import Config from '../config';
import { writeFileSync } from '../systemTools/fileutils';

export const rnvApiAdd = async () => {
    await Config.checkRequiredPackage('serverless', null, 'devDependencies');
    const { paths } = Config.getConfig();

    console.log('[', paths);
    throw new Error('a');

    writeFileSync();
};

export const rnvApiDeploy = () => {

};
