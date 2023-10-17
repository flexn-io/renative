import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformiOSFragment } from './fragments/ios';
import { CommonSchemaFragment } from '../common';
import { TemplateXcodeFragment } from './fragments/templateXcode';

export const PlatformiOSSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformiOSFragment,
    ...TemplateXcodeFragment,
});
