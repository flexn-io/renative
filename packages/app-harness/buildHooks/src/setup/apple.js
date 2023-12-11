import path from 'path'
import { executeAsync, logInfo, logError } from '@rnv/core';

export default async (c) => {
    const certRelativePath = c.files.workspace.project?.configPrivate?.apple?.p12?.path;

    if (!certRelativePath) {
        return logError('No configPrivate found. You sure you decrypted?', true);
    }
    const certPass = c.files.workspace.project?.configPrivate?.apple?.p12?.password;
    const certPath = path.resolve(c.paths.workspace.project.dir, certRelativePath);

    logInfo(`Importing certificate ${certPath}`);
    await executeAsync(`fastlane run import_certificate certificate_path:${certPath} certificate_password:${certPass} keychain_name:login`, { privateParams: [certPass] });

    const profiles = c.files.workspace.project?.configPrivate?.apple?.provisioningProfiles;

    if (!profiles) {
        return;
    }

    await Promise.all(profiles.map(async (profile) => {
        const profileRelativePath = profile?.path;
        const profilePath = path.resolve(c.paths.workspace.project.dir, profileRelativePath);
        logInfo(`Installing provisioning profile ${profilePath}`);
        await executeAsync(`fastlane run install_provisioning_profile path:${profilePath}`);
    }))
}