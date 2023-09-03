export const withRNVBabel = (cnf) => {
    const plugins = cnf?.plugins || [];
    return {
        retainLines: true,
        presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT || '.'],
                },
            ],
            // This is needed for electron projects with _self ref errors
            [
                '@babel/plugin-transform-react-jsx',
                {
                    runtime: 'automatic',
                },
            ],
            ...plugins,
        ],
    };
};
