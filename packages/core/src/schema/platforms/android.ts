import { z } from 'zod';
import { CommonSchemaFragment } from '../common';
import { PlatformBaseFragment } from './fragments/base';
import { PlatformAndroidFragment } from './fragments/android';
import { TemplateAndroidFragment } from './fragments/templateAndroid';

export const PlatformAndroidSchema = z.object({
    ...CommonSchemaFragment,
    ...PlatformBaseFragment,
    ...PlatformAndroidFragment,
    ...TemplateAndroidFragment,
});
