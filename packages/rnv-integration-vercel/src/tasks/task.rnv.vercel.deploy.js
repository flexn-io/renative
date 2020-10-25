import { Logger, Constants } from 'rnv';

const { PARAMS, WEB } = Constants;


export const taskRnvVercelDeploy = async () => {
    Logger.logTask('taskRnvVercelDeploy');
};

export default {
    description: 'Deploys your project to vcercel',
    fn: taskRnvVercelDeploy,
    task: 'vercel deploy',
    params: PARAMS.withBase(),
    platforms: [
        WEB
    ],
};
