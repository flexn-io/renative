import { createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { configureGradleProject } from '../runner';
import { jetifyIfRequired } from '../jetifier';
import { configureFontSources } from '@rnv/sdk-react-native';
import { SdkPlatforms } from '../constants';

export default createTask({
    description: 'Configure current project',
    fn: async () => {
        await configureGradleProject();
        await jetifyIfRequired();
        return configureFontSources();
    },
    task: RnvTaskName.configure,
    dependsOn: [RnvTaskName.platformConfigure],
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
