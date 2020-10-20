import { FileUtils } from 'rnv';
import path from 'path';
import fs from 'fs';

const cleanUrl = v => v.replace('@', '').replace('/', '');

export const updateMdFilesEngines = async (c) => {
    const engines = c.files.rnv.engines.config?.engines;

    Object.values(engines).forEach((engine) => {
        _generateEngineDoc(c, engine);
    });
    _generateEngineDoc(c, {
        id: 'engine-core',
        overview: 'Core RNV engine. used to run common tasks other engines can utilise',
        platforms: {},
        plugins: {}
    });

    return true;
};

const _generateEngineDoc = (c, engine) => {
    const docsPath = path.join(c.paths.project.dir, '../../docs');

    const docFilePath = path.join(docsPath, `${engine.id}.md`);
    const fileContent = fs.readFileSync(docFilePath).toString();

    let npmPackages = '';
    Object.keys(engine.platforms).forEach((v) => {
        const { npm } = engine.platforms[v];
        let output = '';
        if (npm) {
            Object.keys(npm).forEach((npmDepKey) => {
                output += `${v} (${npmDepKey})\n  - ${Object.keys(npm[npmDepKey]).map(p => `[${p}](https://www.npmjs.com/package/${p})`).join(', ')}\n`;
            });
        }
        npmPackages += `${output}\n\n`;
    });

    const extContent = `
## Overview

${engine.overview}

## Supported Platforms

${Object.keys(engine.platforms).map(v => `[${v}](platform-${v}.md)`).join(', ')}

## Required Plugins

${Object.keys(engine.plugins).map(v => `[${v}](plugins#${cleanUrl(v)})`).join(', ')}

## Required NPM Packages

${npmPackages}

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
