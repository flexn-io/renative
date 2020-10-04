import { PARAMS } from '../../core/constants';

export const taskRnvStatus = async () => Promise.resolve();

export default {
    description: 'Show current info about the project',
    fn: taskRnvStatus,
    task: 'status',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
