import { logDefault } from '../logger';

// NOTE: Only support last 3 major releases. i.e: 0.31, 0.30, 0.29
export const checkAndMigrateProject = async () => {
    logDefault('checkAndMigrateProject');
    const migrator = {
        targetVersion: '^0.37',
        taskOptions: [],
        commands: [],
        folders: [],
        configs: [],
        files: [],
    };
    // Cli Commands
    //
    logDefault(`Check migrating version from ${migrator.targetVersion}`);

    return true;
};
