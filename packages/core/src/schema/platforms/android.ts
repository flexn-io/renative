import { z } from 'zod';
import { CommonSchemaFragment } from '../common';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformAndroidFragment } from './fragments/android';
import { TemplateAndroidFragment } from './fragments/templateAndroid';
import { PlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformAndroidSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformAndroidFragment,
    ...PlatformReactNativeFragment,
    ...TemplateAndroidFragment,
});
