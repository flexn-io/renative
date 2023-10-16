import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { CommonSchemaFragment } from '../common';
import { PlatformiOSFragment } from './fragments/ios';
import { PlatformElectronFragment } from './fragments/electron';
import { TemplateXcodeFragment } from './fragments/templateXcode';

export const PlatformMacosSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformiOSFragment,
    ...TemplateXcodeFragment,
    ...PlatformElectronFragment,
});
