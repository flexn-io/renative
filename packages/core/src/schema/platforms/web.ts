import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformWebpackFragment } from './fragments/webpack';
import { CommonSchemaFragment } from '../common';
import { PlatformWebFragment } from './fragments/web';
import { PlatformNextJsFragment } from './fragments/nextjs';

export const PlatformWebSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformWebpackFragment,
    ...PlatformNextJsFragment,
    ...PlatformWebFragment,
});
