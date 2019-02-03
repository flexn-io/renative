import {
    getConfigFile,
    getParsedConfigFile,
    getPackageVersion,
    updatePackageVersion,
} from '../../utils/version-webos';

test('gets config file', () => {
    expect(getConfigFile()).not.toBeNull();
});

test('gets parsed config file', () => {
    expect(getParsedConfigFile()).not.toBeNull();
});

test('gets package version', () => {
    expect(getPackageVersion()).not.toBeNull();
});

test('updates package version', () => {
    expect(updatePackageVersion()).not.toBeFalsy();
    expect(getPackageVersion()).toBe(process.env.npm_package_version);
});
