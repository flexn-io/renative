import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformWebpackFragment } from './fragments/webpack';
import { CommonSchemaFragment } from '../common';
import { PlatformWebFragment } from './fragments/web';
import { PlatformNextJsFragment } from './fragments/nextjs';

export const PlatformWebSchema = CommonSchemaFragment.merge(
    z.object({
        ...PlatformBaseFragment,
        ...PlatformWebpackFragment,
        ...PlatformNextJsFragment,
        ...PlatformWebFragment,
    })
);
