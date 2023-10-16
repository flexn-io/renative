import { z } from 'zod';

export const PlatformDecoratorLightningSchema = {
    target: z.string().optional(),
};
