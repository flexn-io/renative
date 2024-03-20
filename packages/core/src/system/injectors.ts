import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { ConfigPropKey } from '../schema/types';
import { OverridesOptions } from './types';

const INJECTABLE_RUNTIME_PROPS = ['appId', 'scheme', 'timestamp', 'localhost', 'target', 'port'] as const;

const INJECTABLE_CONFIG_PROPS: Array<ConfigPropKey> = [
    'id',
    'title',
    'entryFile',
    'backgroundColor',
    'scheme',
    'teamID',
    'provisioningStyle',
    'bundleAssets',
    'multipleAPKs',
    'pagesDir',
];

export const generateConfigPropInjects = () => {
    const ctx = getContext();
    const configPropsInjects: OverridesOptions = [];
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        const configProp = getConfigProp(v);
        if (!ctx.injectableConfigProps) ctx.injectableConfigProps = {};
        ctx.injectableConfigProps[v] = configProp;
        configPropsInjects.push({
            pattern: `{{configProps.${v}}}`,
            override: configProp,
        });
    });
    ctx.configPropsInjects = configPropsInjects;
};

export const generateRuntimePropInjects = () => {
    const ctx = getContext();

    const rt = ctx.runtime;

    INJECTABLE_RUNTIME_PROPS.forEach((key) => {
        ctx.runtimePropsInjects.push({
            pattern: `{{runtimeProps.${key}}}`,
            override: rt[key],
        });
    });
};
