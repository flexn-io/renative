import { RnvTaskName, RnvTaskOptionPresets, createTask } from '@rnv/core';
import { buildReactNativeAndroid } from '@rnv/sdk-react-native';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Build project binary',
    fn: async () => {
        return buildReactNativeAndroid();
    },
    task: RnvTaskName.build,
    dependsOn: [RnvTaskName.package],
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
