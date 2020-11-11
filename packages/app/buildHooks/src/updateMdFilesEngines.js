import { FileUtils } from 'rnv';
import path from 'path';
import fs from 'fs';

const cleanUrl = v => v.replace('@', '').replace('/', '');

export const updateMdFilesEngines = async (c) => {
    const engines = c.runtime.enginesById;

    Object.values(engines).forEach((engine) => {
        _generateEngineDoc(c, engine);
    });

    return true;
};

const _generateEngineDoc = (c, engine) => {
    const docsPath = path.join(c.paths.project.dir, '../../docs/engines');
    const docFilePath = path.join(docsPath, `${engine.config.id}.md`);
    const fileContent = fs.readFileSync(docFilePath).toString();

    let npmPackages = '';
    let extensions = '';

    const enginePlatforms = engine?.platforms || {};

    Object.keys(enginePlatforms).forEach((v) => {
        const { npm } = enginePlatforms[v];
        let output = '';
        if (npm) {
            Object.keys(npm).forEach((npmDepKey) => {
                output += `${v} (${npmDepKey})\n  - ${Object.keys(npm[npmDepKey]).map(p => `[${p}](https://www.npmjs.com/package/${p})`).join(', ')}\n`;
            });
        }
        npmPackages += `${output}\n\n`;

        extensions = _getExtensionContent(c, v, engine);
    });


    const extContent = `
## Overview

${engine.config?.overview || 'N/A'}

## Supported Platforms

${Object.keys(enginePlatforms).map(v => `[${v}](platforms/${v}.md)`).join(', ')}

## Required Plugins

${Object.keys(engine.config?.plugins || {}).map(v => `[${v}](../plugins#${cleanUrl(v)})`).join(', ')}

## Required NPM Packages

${npmPackages}

## Extensions

${extensions}

`;

    const regEx = /<!--AUTO_GENERATED_START-->([\s\S]*?)<!--AUTO_GENERATED_END-->/g;
    const fixedFile = fileContent.replace(regEx, `<!--AUTO_GENERATED_START-->

${extContent}
<!--AUTO_GENERATED_END-->`);

    FileUtils.writeFileSync(
        docFilePath,
        fixedFile
    );
};


const _getExtensionContent = (c, platform, engine) => {
    let out = '';
    const p = engine?.platforms?.[platform];
    const extenstions = p?.extenstions;
    if (extenstions) {
        out += `| Extension | Priority  |
      | --------- | :-------: |\n`;
        let i = 1;
        extenstions.forEach((v) => {
            out += `| \`${v}\` | ${i} |\n`;
            i++;
        });
    }

    return out;
};
