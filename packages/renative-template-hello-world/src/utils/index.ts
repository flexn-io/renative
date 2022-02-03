import {
    isPlatformIos,
    isPlatformMacos,
    isPlatformTvos,
    isPlatformWeb,
} from '../../../renative/src/is';

export function testProps(testId: string | undefined) {
    if (!testId) {
        return;
    }
    const isApplePlatform = isPlatformIos || isPlatformTvos || isPlatformMacos;
    if (isApplePlatform || isPlatformWeb) {
        return { testID: testId };
    }
    return { accessibilityLabel: testId, accessible: true };
}
