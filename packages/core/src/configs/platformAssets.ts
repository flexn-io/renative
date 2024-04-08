import { sanitizeDynamicProps, mergeObjects, fsExistsSync, writeFileSync } from '../system/fs';
import { getConfigProp } from '../context/contextProps';
import { logDefault } from '../logger';
import { getContext } from '../context/provider';

export const generatePlatformAssetsRuntimeConfig = async () => {
    logDefault('generateRuntimeConfig');
    const c = getContext();
    // c.assetConfig = {
    //     common: c.buildConfig.common,
    //     runtime: c.buildConfig.runtime
    // };
    c.assetConfig = mergeObjects(c, c.assetConfig, c.buildConfig.runtime || {});
    c.assetConfig = mergeObjects(c, c.assetConfig, c.buildConfig.common?.runtime || {});
    c.assetConfig = mergeObjects(
        c,
        c.assetConfig,
        c.platform ? c.buildConfig.platforms?.[c.platform]?.runtime || {} : {}
    );
    c.assetConfig = mergeObjects(c, c.assetConfig, getConfigProp('runtime') || {});

    if (fsExistsSync(c.paths.project.assets.dir)) {
        const sanitizedConfig = sanitizeDynamicProps(c.assetConfig, {
            files: c.files,
            runtimeProps: c.runtime,
            props: {},
            configProps: c.injectableConfigProps,
        });
        writeFileSync(c.paths.project.assets.config, sanitizedConfig);
        c.files.project.assets.config = sanitizedConfig;
    }
    return true;
};
