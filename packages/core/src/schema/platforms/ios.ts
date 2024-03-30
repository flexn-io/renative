import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodPlatformiOSFragment } from './fragments/ios';
import { zodCommonSchemaFragment } from '../common';
import { zodTemplateXcodeFragment } from './fragments/templateXcode';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformiOSSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformiOSFragment,
        ...zodPlatformReactNativeFragment,
        ...zodTemplateXcodeFragment,
    })
);
