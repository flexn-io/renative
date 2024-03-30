import { z } from 'zod';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformiOSFragment } from './fragments/ios';
import { zodPlatformElectronFragment } from './fragments/electron';
import { zodTemplateXcodeFragment } from './fragments/templateXcode';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformMacosSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformiOSFragment,
        ...zodPlatformReactNativeFragment,
        ...zodTemplateXcodeFragment,
        ...zodPlatformElectronFragment,
    })
);
