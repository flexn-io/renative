export const withRNVBabel = (cnf: any) => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:babel-preset-expo'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT || '.'],
                },
            ],
            ...plugins,
        ],
    };
};
