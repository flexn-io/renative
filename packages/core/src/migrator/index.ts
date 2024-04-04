import { logDefault, logInfo } from '../logger';

// NOTE: Only support last 3 major releases. i.e: 0.31, 0.30, 0.29
export const checkAndMigrateProject = async () => {
    logDefault('checkAndMigrateProject2');
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
    logInfo(`Migrating version from ${migrator.targetVersion}`);

    return true;
};
