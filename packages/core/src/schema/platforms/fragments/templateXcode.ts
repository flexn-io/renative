import { z } from 'zod';
import { TemplateXcodeBaseFragment } from './templateXcodeBase';

export const TemplateXcodeFragment = {
    templateXcode: z.optional(
        z.object({
            ...TemplateXcodeBaseFragment,
        })
    ),
};
