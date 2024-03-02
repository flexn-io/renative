import path from 'path';
import { executeAsync, logInfo, logError, RnvContext } from '@rnv/core';

export default async (c: RnvContext) => {
    // TODO: This is a temporary solution. We need to find a better way to handle untyped values
    const cfPrivate: any = c.files.workspace.project?.configPrivate;
    const certRelativePath = cfPrivate?.apple?.p12?.path;

    if (!certRelativePath) {
        return logError('No configPrivate found. You sure you decrypted?', true);
    }
    const certPass = cfPrivate?.apple?.p12?.password;
    const certPath = path.resolve(c.paths.workspace.project.dir, certRelativePath);

    logInfo(`Importing certificate ${certPath}`);
    await executeAsync(
        `fastlane run import_certificate certificate_path:${certPath} certificate_password:${certPass} keychain_name:login`,
        { privateParams: [certPass] }
    );

    const profiles = cfPrivate?.apple?.provisioningProfiles;

    if (!profiles) {
        return;
    }

    await Promise.all(
        profiles.map(async (profile: { path: string }) => {
            const profileRelativePath = profile?.path;
            const profilePath = path.resolve(c.paths.workspace.project.dir, profileRelativePath);
            logInfo(`Installing provisioning profile ${profilePath}`);
            await executeAsync(`fastlane run install_provisioning_profile path:${profilePath}`);
        })
    );
};
