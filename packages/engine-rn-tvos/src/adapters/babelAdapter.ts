const env: any = process?.env;

const createEngineAlias = () => {
    const projectPath = process.env.RNV_PROJECT_ROOT || process.cwd();
    const isMonorepo = process.env.RNV_IS_MONOREPO === 'true' || env.RNV_IS_MONOREPO === true;
    const rootPath = isMonorepo ? process.env.RNV_MONO_ROOT || projectPath : projectPath;
    const alias: any = {};

    if (process.env.RNV_IS_NATIVE_TV === 'true' || env.RNV_IS_NATIVE_TV === true) {
        alias['react-native'] = `${rootPath}/node_modules/react-native-tvos`;
    }

    return alias;
};

export const withRNVBabel = (cnf: any) => {
    const plugins = cnf?.plugins || [];

    return {
        retainLines: true,
        presets: ['module:metro-react-native-babel-preset'],
        ...cnf,
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    root: [process.env.RNV_MONO_ROOT || '.'],
                    alias: createEngineAlias(),
                },
            ],
            ...plugins,
        ],
    };
};
