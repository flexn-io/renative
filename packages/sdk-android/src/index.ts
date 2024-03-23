export * from './runner';
export * from './deviceManager';
export * from './constants';
export * from './installer';
export * from './jetifier';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskSdkConfigure from './tasks/taskSdkConfigure';

export const Tasks = [taskTargetLaunch, taskTargetList, taskSdkConfigure];
