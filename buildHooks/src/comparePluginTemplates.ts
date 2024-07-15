import { promises as fsPromises } from 'fs';
import inquirer from 'inquirer';
import { diff, diffString } from 'json-diff';

// this is a very simple utility script to compare pluginTemplates and transfer changes between them
// npx rnv hooks run -x comparePluginTemplates <path-to-original-file> <path-to-newer-file>
// you will see the diff and get several options to pick from:
// overwrite - overwrites just the current plugin
// overwrite version only
// overwrite all
// skip

// todo
// check against latest npm version instead of other file

const comparePluginTemplates = async () => {
    const originalFilePath = process.argv[process.argv.length - 2];
    const modifiedFilePath = process.argv[process.argv.length - 1];

    const data1 = fsPromises.readFile(originalFilePath, 'utf8');
    const data2 = fsPromises.readFile(modifiedFilePath, 'utf8');
    const json1 = JSON.parse(await data1);
    const json2 = JSON.parse(await data2);

    const json1PluginTemplates = json1.pluginTemplates;
    const json2PluginTemplates = json2.pluginTemplates;
    const differences = {};

    Object.keys(json1PluginTemplates).forEach((key) => {
        if (json2PluginTemplates?.[key]) {
            const difference = diff(json1PluginTemplates[key], json2PluginTemplates[key]);
            const differenceString = diffString(json1PluginTemplates[key], json2PluginTemplates[key]);
            if (difference) {
                differences[key] = differenceString;
            }
        }
    });

    let idx = 0;
    let shouldOverwriteAll = false;
    for (const key in differences) {
        let answers;
        if (!shouldOverwriteAll) {
            answers = await inquirer.prompt([
                {
                    type: 'list',
                    message: `Conflict on \`${key}\` dependency (${idx}/${Object.keys(differences).length}): \n\n${
                        differences[key]
                    }\n`,
                    name: 'prompt',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite',
                        },
                        {
                            name: 'Overwrite Version Only',
                            value: 'overwriteVersion',
                        },
                        new inquirer.Separator(),
                        {
                            name: 'Overwrite All',
                            value: 'overwriteAll',
                        },
                        {
                            name: 'Skip',
                            value: 'skip',
                        },
                    ],
                },
            ]);
        }
        if (answers?.prompt !== 'skip') {
            if (answers?.prompt === 'overwriteAll') shouldOverwriteAll = true;
            if (
                answers?.prompt === 'overwriteVersion' &&
                json1PluginTemplates[key]?.version &&
                json2PluginTemplates[key]?.version
            ) {
                json1PluginTemplates[key].version = json2PluginTemplates[key].version;
            } else if (answers?.prompt === 'overwrite') {
                json1PluginTemplates[key] = json2PluginTemplates[key];
            }

            const updatedJsonContent = JSON.stringify(json1, null, 4);
            await fsPromises.writeFile(originalFilePath, updatedJsonContent, 'utf8');
        }
        idx++;
    }
};

export { comparePluginTemplates };
