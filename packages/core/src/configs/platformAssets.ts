import { sanitizeDynamicProps, mergeObjects, fsExistsSync, writeFileSync } from '../system/fs';
import { RnvContext } from '../context/types';
import { getConfigProp } from '../context/contextProps';
import { logDefault } from '../logger';

export const generatePlatformAssetsRuntimeConfig = async (c: RnvContext) => {
    logDefault('generateRuntimeConfig');
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
    c.assetConfig = mergeObjects(c, c.assetConfig, getConfigProp(c, c.platform, 'runtime') || {});

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
