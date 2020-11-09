import { Logger } from 'rnv';
import path from 'path';
import fs from 'fs';
import jsdoc2md from 'jsdoc-to-markdown';


const execute = async (c) => {
    Logger.logHook('generatePlugins');

    await generateRnvDocs(c, 'rnv', 'RNV');
};

const generateRnvDocs = async (c, id, title) => {
    let output = `---
id: ${id}
title: ${title} CLI Reference
sidebar_label: ${title}
---

`;

    const result = await jsdoc2md.render({ files: `${c.paths.project.dir}/packages/rnv/*.js` });

    output += `${result}\n`;

    fs.writeFileSync(path.join(c.paths.project.dir, '../../docs/api/rnv.md'), output);
};


export default execute;
