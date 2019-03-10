import {
    IOS, ANDROID, ANDROID_TV, ANDROID_WEAR,
    WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH,
} from '../../constants';

import TizenPlatform from './tizen';
import IOSPlatform from './ios';
import TVOSPlatform from './tvos';

export default {
    [TIZEN]: TizenPlatform,
    [IOS]: IOSPlatform,
    [TVOS]: TVOSPlatform,
};
