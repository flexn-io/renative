import { RnvContext } from '../context/types';
import { logDebug } from '../logger';
import { writeFileSync } from '../system/fs';
import { generateBuildConfig } from './buildConfig';

export const writeRenativeConfigFile = (c: RnvContext, configPath: string | undefined, configData: string | object) => {
    logDebug(`writeRenativeConfigFile:${configPath}`);
    writeFileSync(configPath, configData);
    generateBuildConfig(c);
};
