import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { CommonSchemaFragment } from '../common';
import { PlatformWebpackFragment } from './fragments/webpack';
import { PlatformWebFragment } from './fragments/web';
import { PlatformWebOSFragment } from './fragments/webos';

export const PlatformWebosSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformWebFragment,
    ...PlatformWebpackFragment,
    ...PlatformWebOSFragment,
});
