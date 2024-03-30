import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodPlatformTizenFragment } from './fragments/tizen';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformWebpackFragment } from './fragments/webpack';
import { zodPlatformWebFragment } from './fragments/web';

export const PlatformTizenSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformTizenFragment,
        ...zodPlatformWebFragment,
        ...zodPlatformWebpackFragment,
    })
);
