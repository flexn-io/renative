import { z } from 'zod';
import { PlatformBaseFragment } from './fragments/base';
import { CommonSchemaFragment } from '../common';
import { PlatformiOSFragment } from './fragments/ios';
import { PlatformElectronFragment } from './fragments/electron';
import { TemplateXcodeFragment } from './fragments/templateXcode';
import { PlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformMacosSchema = CommonSchemaFragment.merge(
    z.object({
        ...PlatformBaseFragment,
        ...PlatformiOSFragment,
        ...PlatformReactNativeFragment,
        ...TemplateXcodeFragment,
        ...PlatformElectronFragment,
    })
);
