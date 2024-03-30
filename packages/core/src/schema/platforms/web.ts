import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodPlatformWebpackFragment } from './fragments/webpack';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformWebFragment } from './fragments/web';
import { zodPlatformNextJsFragment } from './fragments/nextjs';

export const PlatformWebSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformWebpackFragment,
        ...zodPlatformNextJsFragment,
        ...zodPlatformWebFragment,
    })
);
