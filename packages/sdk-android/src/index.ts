export * from './runner';
export * from './deviceManager';
export * from './constants';
export * from './installer';
export * from './jetifier';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskSdkConfigure from './tasks/taskSdkConfigure';
import taskLog from './tasks/taskLog';
import taskPackage from './tasks/taskPackage';

export const Tasks = [taskTargetLaunch, taskTargetList, taskSdkConfigure, taskLog, taskPackage];
