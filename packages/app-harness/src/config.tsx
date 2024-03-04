import { isPlatformIos, isPlatformMacos, isPlatformTvos, isPlatformWeb } from '@rnv/renative';
import CONFIG from '../platformAssets/renative.runtime.json';
import ICON_LOGO from '../platformAssets/runtime/logo.png';
import '../platformAssets/runtime/fontManager';

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

if (!global.performance) {
    // @ts-expect-error Performance needs to be typed
    global.performance = {};
}

if (typeof global.performance.now !== 'function') {
    global.performance.now = function () {
        const performanceNow = global.nativePerformanceNow || Date.now;
        return performanceNow();
    };
}

export { CONFIG, ICON_LOGO };
