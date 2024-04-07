import { writeFileSync, logSuccess, logWarning, inquirerPrompt, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Update specific plugin to latest supported version (rnv)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const { confirm } = await inquirerPrompt({
            name: 'confirm',
            type: 'confirm',
            message: 'Above installed plugins will be updated with RNV',
        });

        if (confirm) {
            const { plugins } = ctx.buildConfig;
            if (plugins) {
                const cnf = ctx.files.project.config_original;

                if (!cnf) return;
                Object.keys(plugins).forEach((_key) => {
                    //TODO: fix this. not working
                    // c.buildConfig.plugins[key] = o.json[key];
                    cnf.plugins = cnf.plugins || {};
                    // cnf.plugins[key] = pluginList.json[key];
                });

                writeFileSync(ctx.paths.project.config, cnf);

                logSuccess('Plugins updated successfully!');
            } else {
                logWarning(`No plugins found in renative.json`);
            }
        }
    },
    task: RnvTaskName.pluginUpdate,
});
