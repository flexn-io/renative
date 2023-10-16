import { z } from 'zod';
import { PlatformBase } from './base';

const AppName = z.string();

const CertificateProfile = z.string();

export const PlatformTizenPartialSchema = {
    package: z.optional(z.string()),
    certificateProfile: z.optional(CertificateProfile),
    appName: z.optional(AppName),
};

export const PlatformTizen = PlatformBase.extend(PlatformTizenPartialSchema);
