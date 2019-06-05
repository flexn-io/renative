import fs from 'fs';
import path from 'path';
import { removeDirs } from './fileUtils';
import { logTask, askQuestion, finishQuestion } from '../common';

const cleanProjectModules = c => new Promise((resolve, reject) => {
    logTask('cleanProjectModules');
    const pathsToRemove = [
        c.paths.projectNodeModulesFolder,
        path.join(c.paths.projectRootFolder, 'package-lock.json')
    ];
    let msg = './node_modules\n./package-lock.json\n';
    const packagesFolder = path.join(c.paths.projectRootFolder, 'packages');
    if (fs.existsSync(packagesFolder)) {
        fs.readdirSync(packagesFolder).forEach((dir) => {
            pathsToRemove.push(path.join(packagesFolder, dir, 'node_modules'));
            pathsToRemove.push(path.join(packagesFolder, dir, 'package-lock.json'));
            msg += `./packages/${dir}/node_modules\n./packages/${dir}/package-lock.json\n`;
        });
    }


    askQuestion(`Following files/folders will be removed:\n\n${msg}\npress (ENTER) to confirm`)
        .then(() => {
            finishQuestion();
            removeDirs(pathsToRemove).then(() => resolve())
                .catch(e => reject(e));
        })
        .catch(e => reject(e));
});

export { cleanProjectModules };
