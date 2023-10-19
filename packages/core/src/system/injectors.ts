import { getConfigProp } from '../common';
import { INJECTABLE_CONFIG_PROPS, INJECTABLE_RUNTIME_PROPS } from '../constants';
import { getContext } from '../context/provider';
import { OverridesOptions } from './types';

export const generateConfigPropInjects = () => {
    const ctx = getContext();
    const configPropsInjects: OverridesOptions = [];
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        const configProp = getConfigProp(ctx, ctx.platform, v);
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
