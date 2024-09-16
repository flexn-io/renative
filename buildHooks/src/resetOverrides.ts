// npx rnv hooks run -x resetOverrides
import { RnvFileName, fsExistsSync, fsReadFileSync, removeDirSync, revertOverrideToOriginal } from '@rnv/core';
import path from 'path';

export const resetOverrides = async () => {
    const overrideDir = path.join(process.cwd(), '.rnv', 'overrides');

    const appliedOverrideFilePath = path.join(overrideDir, RnvFileName.appliedOverride);

    if (fsExistsSync(appliedOverrideFilePath)) {
        const appliedOverrides = JSON.parse(fsReadFileSync(appliedOverrideFilePath).toString());

        Object.keys(appliedOverrides).forEach((moduleName) => {
            const appliedVersion = appliedOverrides[moduleName].version;
            const packageJsonPath = path.join(process.cwd(), 'node_modules', moduleName, RnvFileName.package);

            if (fsExistsSync(packageJsonPath)) {
                const packageContent = JSON.parse(fsReadFileSync(packageJsonPath).toString());
                const currentVersion = packageContent.version;

                if (currentVersion === appliedVersion) {
                    const packageOverrides = appliedOverrides[moduleName];
                    Object.keys(packageOverrides).forEach((filePath) => {
                        if (filePath !== 'version') {
                            const backupPath = path.join(overrideDir, moduleName, filePath);
                            const destinationPath = path.join(process.cwd(), 'node_modules', moduleName, filePath);

                            revertOverrideToOriginal(destinationPath, backupPath);
                        }
                    });
                }
            }
        });
        removeDirSync(overrideDir);
    }
};
