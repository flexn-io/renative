import { parsePlugins } from '..';
import { generateContextDefaults } from '../../context/defaults';
import { getContext } from '../../context/provider';

jest.mock('../../logger');
jest.mock('../../context/provider');

beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself. It is not a mock
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('parsePlugins', () => {
    it('should parse plugins correctly', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
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
        c.platform = 'ios';

        const pluginCallback = jest.fn();

        // WHEN
        parsePlugins(pluginCallback, true, true);

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
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
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
        c.platform = 'tvos';

        const pluginCallback = jest.fn();

        // WHEN
        parsePlugins(pluginCallback, false, false);

        // THEN
        expect(pluginCallback).toHaveBeenCalledTimes(2);
        expect(pluginCallback.mock.calls).toEqual([
            [{ _id: 'react', _scopes: [] }, {}, 'react'], // First call
            [{ _id: 'react-art', _scopes: [] }, {}, 'react-art'], // Second call
        ]);
    });

    it('should ignorePlatformObjectCheck', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
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
        c.platform = 'tvos';
        const pluginCallback = jest.fn();

        // WHEN
        parsePlugins(pluginCallback, true, false);

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
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        const c = getContext();
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
        c.platform = 'tvos';
        const pluginCallback = jest.fn();

        // WHEN
        parsePlugins(pluginCallback, true, true);

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
