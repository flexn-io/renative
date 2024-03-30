import { z } from 'zod';
import { zodCommonSchemaFragment } from '../common';
import { zodPlatformBaseFragment } from './fragments/base';
import { zodPlatformAndroidFragment } from './fragments/android';
import { zodTemplateAndroidFragment } from './fragments/templateAndroid';
import { zodPlatformReactNativeFragment } from './fragments/reactNative';

export const PlatformAndroidSchema = zodCommonSchemaFragment.merge(
    z.object({
        ...zodPlatformBaseFragment,
        ...zodPlatformAndroidFragment,
        ...zodPlatformReactNativeFragment,
        ...zodTemplateAndroidFragment,
    })
);
