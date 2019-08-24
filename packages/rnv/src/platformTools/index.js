import {
    copyAndroidAssets,
    configureGradleProject,
    launchAndroidSimulator,
    buildAndroid,
    listAndroidTargets,
    packageAndroid,
    runAndroid,
    runAndroidLog
} from './android';
import {
    runPod,
    copyAppleAssets,
    configureXcodeProject,
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    listAppleDevices,
    launchAppleSimulator,
    runAppleLog,
} from './apple';
import { configureElectronProject, runElectron, buildElectron, runElectronDevServer } from './electron';
import { launchKaiOSSimulator, configureKaiOSProject, runFirefoxProject, buildFirefoxProject } from './firefox';
import {
    launchTizenSimulator,
    configureTizenProject,
    createDevelopTizenCertificate,
    addDevelopTizenCertificate,
    runTizen,
    buildTizenProject,
    configureTizenGlobal,
} from './tizen';
import { buildWeb, runWeb, configureWebProject, runWebDevServer, deployWeb } from './web';
import { launchWebOSimulator, copyWebOSAssets, configureWebOSProject, runWebOS, buildWebOSProject } from './webos';


export default {
    // ANDROID
    copyAndroidAssets,
    configureGradleProject,
    launchAndroidSimulator,
    buildAndroid,
    listAndroidTargets,
    packageAndroid,
    runAndroid,
    runAndroidLog,
    // APPLE
    runPod,
    copyAppleAssets,
    configureXcodeProject,
    runXcodeProject,
    exportXcodeProject,
    archiveXcodeProject,
    packageBundleForXcode,
    listAppleDevices,
    launchAppleSimulator,
    runAppleLog,
    // ELECTRON
    configureElectronProject,
    runElectron,
    buildElectron,
    runElectronDevServer,
    // FIREFOX
    launchKaiOSSimulator,
    configureKaiOSProject,
    runFirefoxProject,
    buildFirefoxProject,
    // TIZEN
    launchTizenSimulator,
    configureTizenProject,
    createDevelopTizenCertificate,
    addDevelopTizenCertificate,
    runTizen,
    buildTizenProject,
    configureTizenGlobal,
    // WEB
    buildWeb,
    runWeb,
    configureWebProject,
    runWebDevServer,
    deployWeb,
    // WEBOS
    launchWebOSimulator,
    copyWebOSAssets,
    configureWebOSProject,
    runWebOS,
    buildWebOSProject
};
