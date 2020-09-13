import { Exec, Common, Constants, FileUtils, Logger, EngineManager } from 'rnv';
import path from 'path';
import fs from 'fs';
import jsdoc2md from 'jsdoc-to-markdown';


export const generateEngineTaks = async (c) => {
    Logger.logHook('generateEngineTaks');

    const engines = EngineManager.getRegisteredEngines(c);

    engines.forEach((engine) => {
        _generateEngineTaks(c, engine);
    });
};

const getSupportedPlatforms = (c, t) => (t.platforms.length
    ? t.platforms.map(v => `\`${v}\``).join(', ')
    : Constants.SUPPORTED_PLATFORMS.map(v => `\`${v}\``).join(', '));

const _generateEngineTaks = async (c, engine) => {
    const id = engine.getId();
    const { title } = engine;
    let output = `---
id: api-cli-${id}
title: ${title} CLI Reference
sidebar_label: ${title}
---

`;

    const tasks = engine.getTasks();

    // console.log('BSBSBSSBS', tasks);

    tasks.forEach((t) => {
        output += `

---

## ${t.task}

> ${t.description}

Supported Platforms:

${getSupportedPlatforms(c, t)}

Example:

\`\`\`bash
rnv ${t.task}
\`\`\`

Options:

${t.params.map((v) => {
        console.log('CCBCBCB', v);
        const option = v.shortcut ? `\`-${v.shortcut}\`, ` : '';
        return `${option}\`--${v.key}\` - ${v.description}`;
    }).join('\n\n')}


`;
    });


    output += 'test';

    fs.writeFileSync(path.join(c.paths.project.dir, `../../docs/api-cli-${id}.md`), output);
};


// \`--ci\` - Don't ask for confirmations
//
// \`-c\`, \`--appConfigID\` - Switch to different appConfig beforehand
//
// \`-p\`, \`--platform\` - Specify platform
//
// \`-s\`, \`--scheme\` - Specify build scheme
//
// \`-r\`, \`--reset\` - Clean project beforehand
//
// \`-t\`, \`--target\` - Specify target simulator / device
//
// \`-d\`, \`--device\` - Run on device
//
// \`-i\`, \`--info\` - Show full stack trace
//
// \`-o\`, \`--only\` - Execute only run task
//
// \`--analyzer\` - Show app size analysis report
//
// \`--hosted\` - Run platform as hosted web app in browser
//
// \`--mono\` - Monochromatic output to terminal (no colors)
