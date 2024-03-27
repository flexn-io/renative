export * from './deviceManager';
export * from './installer';
export * from './runner';
export * from './constants';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskSdkConfigure from './tasks/taskSdkConfigure';

export const Tasks = [taskTargetLaunch, taskTargetList, taskSdkConfigure];
