import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { provision, cert } from 'ios-mobileprovision-finder';
import {
    logTask,
    logError,
    logWarning,
    getAppFolder,
    isPlatformActive,
    logDebug,
    getAppVersion,
    getAppTitle,
    getEntryFile,
    writeCleanFile,
    getAppTemplateFolder,
    getAppId,
    getConfigProp,
    getIP,
    getBuildFilePath,
    logSuccess,
    getBuildsFolder,
} from '../../common';
import { copyBuildsFolder } from '../../projectTools/projectParser';
import { IOS, TVOS } from '../../constants';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';
import { getAppFolderName } from './index';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, mergeObjects } from '../../systemTools/fileutils';


export const parseProvisioningProfiles = c => new Promise((resolve, reject) => {
    // PROJECT
    const teamID = getConfigProp(c, c.platform, 'teamID');
    const id = getConfigProp(c, c.platform, 'id');
    const certificates = cert.read();
    const provisionProfiles = provision.read();
    const result = provision.select(provisionProfiles, {
        AppId: id,
        TeamIdentifier: teamID,
        Certificates: certificates.valid
    });
    resolve(result);
});
