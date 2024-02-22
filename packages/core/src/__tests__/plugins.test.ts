import { parsePlugins } from '../plugins';
import { createRnvApi } from '../api';
import { createRnvContext } from '../context';
import { generateContextDefaults } from '../context/defaults';

jest.mock('../logger/index.ts');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    // jest.resetAllMocks();
    jest.clearAllMocks();
});

describe('parsePlugins', () => {
    it('should parse plugins correctly', () => {
        // GIVEN
        const c = generateContextDefaults();
        c.buildConfig.plugins = {
            react: 'source:rnv',
            'react-art': 'source:rnv',
            'react-native-permissions': {
                tvos: {
                    disabled: true,
                },
                version: '3.10.1',
            },
        };
        const platform = 'ios';
        const pluginCallback = jest.fn();
        const ignorePlatformObjectCheck = true;
        const includeDisabledPlugins = true;

        // WHEN
        parsePlugins(c, platform, pluginCallback, ignorePlatformObjectCheck, includeDisabledPlugins);

        // THEN
        expect(pluginCallback).toHaveBeenCalledTimes(3);
        expect(pluginCallback.mock.calls).toEqual([
            [{ _id: 'react', _scopes: [] }, {}, 'react'], // First call
            [{ _id: 'react-art', _scopes: [] }, {}, 'react-art'], // Second call
            [
                { _id: 'react-native-permissions', _scopes: [], tvos: { disabled: true }, version: '3.10.1' },
                {},
                'react-native-permissions',
            ], // Third call
        ]);
    });

    it('should exclude disabled plugins per platform', () => {
        // GIVEN
        const c = generateContextDefaults();
        c.buildConfig.plugins = {
            react: 'source:rnv',
            'react-art': 'source:rnv',
            'react-native-permissions': {
                tvos: {
                    disabled: true,
                },
                version: '3.10.1',
            },
        };
        const platform = 'tvos';
        const pluginCallback = jest.fn();
        const ignorePlatformObjectCheck = false;
        const includeDisabledPlugins = false;

        // WHEN
        parsePlugins(c, platform, pluginCallback, ignorePlatformObjectCheck, includeDisabledPlugins);

        // THEN
        expect(pluginCallback).toHaveBeenCalledTimes(2);
        expect(pluginCallback.mock.calls).toEqual([
            [{ _id: 'react', _scopes: [] }, {}, 'react'], // First call
            [{ _id: 'react-art', _scopes: [] }, {}, 'react-art'], // Second call
        ]);
    });

    it('should ignorePlatformObjectCheck', () => {
        // GIVEN
        const c = generateContextDefaults();
        c.buildConfig.plugins = {
            react: 'source:rnv',
            'react-art': 'source:rnv',
            'react-native-permissions': {
                tvos: {
                    disabled: true,
                },
                version: '3.10.1',
            },
        };
        const platform = 'tvos';
        const pluginCallback = jest.fn();
        const ignorePlatformObjectCheck = true;
        const includeDisabledPlugins = false;

        // WHEN
        parsePlugins(c, platform, pluginCallback, ignorePlatformObjectCheck, includeDisabledPlugins);

        // THEN
        expect(pluginCallback).toHaveBeenCalledTimes(3);
        expect(pluginCallback.mock.calls).toEqual([
            [{ _id: 'react', _scopes: [] }, {}, 'react'], // First call
            [{ _id: 'react-art', _scopes: [] }, {}, 'react-art'], // Second call
            [
                { _id: 'react-native-permissions', _scopes: [], tvos: { disabled: true }, version: '3.10.1' },
                { disabled: true },
                'react-native-permissions',
            ], // Third call
        ]);
    });

    it('should includeDisabledPlugins and not cause duplicates', () => {
        // GIVEN
        const c = generateContextDefaults();
        c.buildConfig.plugins = {
            react: 'source:rnv',
            'react-art': 'source:rnv',
            'react-native-permissions': {
                tvos: {
                    disabled: true,
                },
                version: '3.10.1',
            },
            'react-native-disabled': {
                disabled: true,
            },
        };
        const platform = 'tvos';
        const pluginCallback = jest.fn(() => {
            // console.log('callback called', rest)
        });
        const ignorePlatformObjectCheck = true;
        const includeDisabledPlugins = true;

        // WHEN
        parsePlugins(c, platform, pluginCallback, ignorePlatformObjectCheck, includeDisabledPlugins);

        // THEN
        expect(pluginCallback).toHaveBeenCalledTimes(4);
        expect(pluginCallback.mock.calls).toEqual([
            [{ _id: 'react', _scopes: [] }, {}, 'react'], // First call
            [{ _id: 'react-art', _scopes: [] }, {}, 'react-art'], // Second call
            [
                { _id: 'react-native-permissions', _scopes: [], tvos: { disabled: true }, version: '3.10.1' },
                { disabled: true },
                'react-native-permissions',
            ], // Third call
            [{ _id: 'react-native-disabled', _scopes: [], disabled: true }, {}, 'react-native-disabled'], // Fourth call
        ]);
    });
});
