import { provision, cert } from 'ios-mobileprovision-finder';
import { getConfigProp } from '../../common';

export const parseProvisioningProfiles = async (c) => {
    // PROJECT
    const teamID = getConfigProp(c, c.platform, 'teamID');
    const id = getConfigProp(c, c.platform, 'id');
    const certificates = cert.read();
    const provisionProfiles = provision.read();
    const result = provision.select(provisionProfiles, {
        AppId: id,
        TeamIdentifier: teamID,
        Certificates: certificates.valid
    });
    return result;
};
