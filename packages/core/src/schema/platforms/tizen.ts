import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformTizenFragment } from './fragments/tizen';
import { CommonSchemaFragment } from '../common';
import { PlatformWebpackFragment } from './fragments/webpack';
import { PlatformWebFragment } from './fragments/web';

export const PlatformTizenSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformTizenFragment,
    ...PlatformWebFragment,
    ...PlatformWebpackFragment,
});
