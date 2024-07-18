import { packageReactNativeIOS } from '../iosRunner';
import { executeAsync, getContext } from '@rnv/core';
const ctx = {
    platform: 'ios',
    runtime: {
        runtimeExtraProps: {
            reactNativePackageName: 'react-native',
            reactNativeMetroConfigName: 'metro.config.js',
        },
        appId: 'com.test',
    },
    buildConfig: {
        platforms: {
            ios: {
                entryFile: 'index',
            },
        },
    },
    program: {
        opts: jest.fn().mockReturnValue({}),
    },
};

jest.mock('../env', () => ({
    ...jest.requireActual('../env'),
    EnvVars: {
        ...jest.requireActual('../env').EnvVars,
        RNV_APP_ID: jest.fn(() => ({ RNV_APP_ID: 'mockedAppId' })),
        RNV_REACT_NATIVE_PATH: jest.fn(() => ({ RNV_REACT_NATIVE_PATH: 'mockedReactNativePath' })),
        RNV_SKIP_LINKING: jest.fn(() => ({ RNV_SKIP_LINKING: 'mockedSkipLinking' })),
    },
}));

jest.mock('@rnv/core', () => ({
    ...jest.requireActual('@rnv/core'),
    executeAsync: jest.fn(),
    getContext: jest.fn(),
    getConfigProp: jest.fn().mockImplementation((prop) => {
        if (prop === 'entryFile') return 'index';
        if (prop === 'enableSourceMaps') return true;
    }),
    getAppFolder: jest.fn().mockReturnValue('/mocked/app/folder'),
    CoreEnvVars: {
        BASE: jest.fn(() => ({ BASE_VAR: 'mockedBaseValue' })),
        RNV_EXTENSIONS: jest.fn(() => ({ EXTENSION_VAR: 'mockedExtensionValue' })),
    },
}));

jest.mock('../iosRunner', () => ({
    ...jest.requireActual('../iosRunner'),
    logDefault: jest.fn(),
    getConfigProp: jest.fn().mockImplementation((prop) => {
        if (prop === 'entryFile') return 'index';
        if (prop === 'enableSourceMaps') return true;
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('packageReactNativeIOS', () => {
    it('returns if platform isn`t specified', async () => {
        (getContext as jest.Mock).mockReturnValue({ ...ctx, platform: undefined });
        await packageReactNativeIOS(true);
        expect(executeAsync).not.toHaveBeenCalled();
    });

    it('calls executeAsync with correct arguments when isDev is true', async () => {
        (getContext as jest.Mock).mockReturnValue(ctx);
        await packageReactNativeIOS(true);
        expect(executeAsync).toHaveBeenCalledWith(expect.stringContaining('--dev true'), expect.anything());
    });

    it('generateChecksum testing', async () => {
        await packageReactNativeIOS(false);
        expect(executeAsync).toHaveBeenCalledWith(expect.stringContaining('--dev false'), expect.anything());
    });
});
