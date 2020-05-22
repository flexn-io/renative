import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const git = require('simple-git')();
const { version } = require('../../../../package.json');

// export const generateAllChangelogs = c => new Promise((resolve, reject) => {
//       git.tags([], (e, s) => {
//           s.all.forEach((tag, i) => {
//             if(s.all[i + 1]) {
//               git.log(tag, s.all[i + 1], (e, log) => {
//                   log.all.forEach(v => {
//                       const ss = v.message;
//                       logs += `- ${ss}\n`;
//                   });
//               })
//             }
//
//           });
//
//
//       })
// })

export const generateChangelog = c =>
    new Promise((resolve, reject) => {
        console.log('CHANGELOG');
        const d = new Date();
        let logs = '';

        git.tags([], (e, s) => {
            let latestTag = s.latest;
            // if (s.latest === version) {
            //     s.all.pop();
            //     latestTag = s.all.pop();
            // }
            git.log(latestTag, 'HEAD', (e, log) => {
                // log.all.pop();
                // log.all.pop();
                log.all.forEach(v => {
                    const ss = v.message;
                    logs += `- ${ss}\n`;
                });

                const changelog = `## v${version} (${d.getFullYear()}-${d.getMonth() +
                    1}-${d.getDate()})

### Fixed

${logs}
### Added Features

- none

### Breaking Changes

- none

`;
                console.log(changelog.replace(/\*\*/g, '*'));
                fs.writeFileSync(
                    path.join(c.paths.project.dir, '../../docs/changelog', `${version}.md`),
                    changelog
                );
                resolve();
            });
        });
});

export const generateCombinedChangelog = async c => {

    const chlogDirPath = path.join(c.paths.project.dir, '../../docs/changelog');
    const chlogCombinedPath = path.join(c.paths.project.dir, '../../docs/changelog.md');

    let output = `# Changelog\n`

    const chlogArr = fs.readdirSync(chlogDirPath);
    chlogArr.sort().reverse();
    chlogArr.forEach((chlog) => {
        const chlogPath = path.join(chlogDirPath, chlog);

        chlog = fs.readFileSync(chlogPath);

        output += `\n${chlog}`
    });

    fs.writeFileSync(
        chlogCombinedPath,
        output
    );
}
