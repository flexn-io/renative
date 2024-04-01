import type { RnvPlatformSchemaFragment } from './platforms';
import type { RnvRootProjectBaseFragment } from './configFiles/project';
import type { _MergedPlatformPrivateObjectType } from './configFiles/private';
import { RnvRootAppBaseFragment } from './configFiles/app';

export type ConfigProp = Required<RnvRootProjectBaseFragment> &
    Required<RnvRootAppBaseFragment> &
    Required<_MergedPlatformPrivateObjectType> &
    Required<RnvPlatformSchemaFragment>;

export type ConfigPropKey = keyof ConfigProp;
