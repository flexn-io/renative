
const path = require('path');
// eslint-disable-next-line import/no-unresolved
const exclusionList = require('metro-config/src/defaults/exclusionList');

export const withRNV = (config) => {
    const cnf = {
        ...config,
        resolver: {
            blockList: typeof exclusionList === 'function' ? exclusionList([
                // This stops "react-native run-windows" from causing the metro server to crash if its already running
                // TO DO. Project name should be dynamically injected here somehow
                new RegExp(
                    `${path.resolve(__dirname, 'platformBuilds/<projectName>_windows').replace(/[/\\]/g, '/')}.*`,
                ),
                // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
                /.*\.ProjectImports\.zip/,
            ]) : null
        },
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true,
                },
            }),
        },
    };

    return cnf;
};
