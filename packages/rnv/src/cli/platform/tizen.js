import fs from 'fs';
import path from 'path';
import { TIZEN, CLI_TIZEN, logTask, logError, logWarning } from '../../common';
import { BasePlatform } from './base';
import { execCLI } from '../../exec';

export default class TizenPlatform extends BasePlatform {
    async runSetupProject(config) {
        await super.runSetupProject(config);
        const tizenAuthorCert = path.join(config.globalConfigFolder, 'tizen_author.p12');
        if (!fs.existsSync(tizenAuthorCert)) {
            logWarning('tizen_author.p12 file missing! Creating one for you...');
            await this.createDevelopTizenCertificate(config);
        }
    }

    async createDevelopTizenCertificate(config) {
        logTask('createDevelopTizenCertificate');
        await execCLI(config, CLI_TIZEN, 'certificate -- ~/.rnv -a rnv -f tizen_author -p 1234')
            .then(() => this.addDevelopTizenCertificate(config));
    }

    async addDevelopTizenCertificate(config) {
        logTask('addDevelopTizenCertificate');
        await execCLI(config, CLI_TIZEN, 'security-profiles add -n RNVanillaCert -a ~/.rnv/tizen_author.p12 -p 1234');
    }
}

TizenPlatform.platform = TIZEN;
TizenPlatform.defaultAppFolder = 'RNVApp';
