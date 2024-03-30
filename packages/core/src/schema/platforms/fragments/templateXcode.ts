import { z } from 'zod';
import { zodTemplateXcodeBaseFragment } from './templateXcodeBase';

export const zodTemplateXcodeFragment = {
    templateXcode: z.optional(
        z.object({
            ...zodTemplateXcodeBaseFragment,
        })
    ),
};
