import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';

const { version, currentRelease } = require('../../../../package.json');

const git = simpleGit();

export const generateChangelog = c => new Promise((resolve, reject) => {
    const d = new Date();
    let logs = '';
    try {
        git.tags([], (e, s) => {
            const latestTag = s.latest;
            // if (s.latest === version) {
            //     s.all.pop();
            //     latestTag = s.all.pop();
            // }

            git.log(latestTag, 'HEAD', (_e, log) => {
                // log.all.pop();
                // log.all.pop();
                log.all.forEach((v) => {
                    const ss = v.message;
                    logs += `- ${ss}\n`;
                });

                const changelog = `## v${version} (${d.getFullYear()}-${d.getMonth()
                      + 1}-${d.getDate()})

### Fixed

${logs}
### Added Features

- none

### Breaking Changes

- none

  `;
                // console.log(changelog.replace(/\*\*/g, '*'));
                const changelogPath = path.join(c.paths.project.dir, '../../docs/changelog', `${version}.md`);
                if (!fs.existsSync(changelogPath)) {
                    fs.writeFileSync(
                        changelogPath,
                        changelog
                    );
                } else {
                    // console.log(`Path ${changelogPath} exists. SKIPPING`);
                }

                resolve(true);
            });
        });
    } catch (e) {
        reject(e);
    }
});

const getVersionNumber = (vrs) => {
    const verArr = vrs.split('-');
    const verMainArr = verArr[0].split('.');
    const verMajor = verMainArr[0].length < 2 ? `0${verMainArr[0]}` : verMainArr[0];
    const verMinor = verMainArr[1].length < 2 ? `0${verMainArr[1]}` : verMainArr[1];
    const verPath = verMainArr[2].length < 2 ? `0${verMainArr[2]}` : verMainArr[2];

    const verAlpha1 = (verArr[2] || !verArr[1]) ? '00' : verArr[1].split('.')[1];
    const verAlpha = verAlpha1.length < 2 ? `0${verAlpha1}` : verAlpha1;

    const verFeat = verArr[2] ? verArr[2].split('.')[1] : '00';

    const output = `${verMajor}${verMinor}${verPath}${verAlpha}${verFeat}`;

    return parseInt(output, 10);
};

export const generateCombinedChangelog = async (c) => {
    const chlogDirPath = path.join(c.paths.project.dir, '../../docs/changelog');
    const chlogCombinedPath = path.join(c.paths.project.dir, '../../docs/changelog.md');

    let output = `---
id: changelog
title: Changelog
sidebar_label: Changelog
---
\n`;

    const chlogArr = fs.readdirSync(chlogDirPath);
    const chlogArrObj = chlogArr.map((v) => {
        const vers = v.split('-');
        const versionNumber = getVersionNumber(v);
        return {
            version: vers[0],
            patch: vers[1],
            versionNumber,
            value: v
        };
    });
    chlogArrObj.sort((x, y) => y.versionNumber - x.versionNumber);
    // let chlogTotal = '';
    chlogArrObj.forEach((chlog) => {
        const chlogPath = path.join(chlogDirPath, chlog.value);

        const chlogVal = fs.readFileSync(chlogPath);

        output += `\n${chlogVal}`;
        // chlogTotal += `\n${chlogVal}`;
    });

    fs.writeFileSync(
        chlogCombinedPath,
        output
    );

    // updateCurrentLiveChangelog(c, chlogTotal);
};

export const updateCurrentLiveChangelog = async (c, chlogVal) => {
    const chlogLivePath = path.join(c.paths.project.dir,
        `../../website/versioned_docs/version-${currentRelease}/changelog.md`);

    let output = `---
id: version-${currentRelease}-changelog
title: Changelog
sidebar_label: Changelog
original_id: changelog
---
\n`;

    output += chlogVal;

    fs.writeFileSync(
        chlogLivePath,
        output
    );
};
