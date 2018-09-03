import {
    getConfigXML,
    getWidgetTag,
    getPackageVersion,
    updatePackageVersion,
} from '../../utils/version-tizen';

test('gets config xml', () => {
    expect(getConfigXML()).not.toBeNull();
});

test('gets widget tag', () => {
    expect(getWidgetTag()).not.toBeNull();
});

test('gets package version', () => {
    expect(getPackageVersion()).not.toBeNull();
});

test('updates package version', () => {
    expect(updatePackageVersion()).not.toBeFalsy();
    expect(getPackageVersion()).toBe(process.env.npm_package_version);
});
