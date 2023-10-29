// @ts-ignore
import CONFIG from '../platformAssets/renative.runtime.json';
import '../platformAssets/runtime/fontManager';

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

export { CONFIG };
