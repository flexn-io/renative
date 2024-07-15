import { provision, cert } from 'ios-mobileprovision-finder';
import path from 'path';
import { getConfigProp, chalk, logWarning } from '@rnv/core';
import { Context } from './getContext';

export const parseProvisioningProfiles = async (c: Context) => {
    // PROJECT
    const teamID = getConfigProp('teamID');
    const id = getConfigProp('id');
    const certificates = cert.read();
    try {
        const provisionProfiles = provision.read();
        const result = provision.select(provisionProfiles, {
            AppId: id,
            //@ts-ignore //TODO: Check TeamIdentifier in ios-mobileprovision-finder
            TeamIdentifier: teamID,
            Certificates: certificates.valid,
        });
        return result;
    } catch (e) {
        logWarning(
            `You have no provisioning files available. Check your ${chalk().bold.white(
                path.join(c.paths.user.homeDir, 'Library/MobileDevice/Provisioning Profiles')
            )} folder`
        );
    }

    return null;
};
