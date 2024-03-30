import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformWebpackFragment } from './fragments/webpack';
import { zodPlatformWebFragment } from './fragments/web';
import { zodPlatformWebOSFragment } from './fragments/webos';

export const PlatformWebosSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformWebFragment,
        ...zodPlatformWebpackFragment,
        ...zodPlatformWebOSFragment,
    })
);
