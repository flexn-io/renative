import { z } from 'zod';

const AppName = z.string();

const CertificateProfile = z.string();

export const zodPlatformTizenFragment = {
    package: z.optional(z.string()),
    certificateProfile: z.optional(CertificateProfile),
    appName: z.optional(AppName),
};
