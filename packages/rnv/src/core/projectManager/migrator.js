import { logTask } from '../systemManager/logger';

// NOTE: Only support last 3 major releases. i.e: 0.31, 0.30, 0.29
export const checkAndMigrateProject = async () => {
    logTask('checkAndMigrateProject');

    return true;
};
