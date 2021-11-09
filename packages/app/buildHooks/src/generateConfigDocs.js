import { SchemaManager } from 'rnv';
import path from 'path';
import fs from 'fs';


const _printContent = (header, key, keyPath, prop, level, { hidePath }) => {
    const examples = prop.examples || [];
    let exStr = '';
    let examplesStr = '';
    if (prop.type === 'string' || prop.type === 'integer' || prop.type === 'boolean') {
        exStr += examples.map(v => `
\`\`\`json
${JSON.stringify(JSON.parse(`{"${key}": "${v}"}`), null, 2)}
\`\`\`
`).join('\n\n');
    } else if (prop.type === 'object' || prop.type === 'array') {
        exStr += examples.map(v => `
\`\`\`json
${JSON.stringify(JSON.parse(`{"${key}": ${JSON.stringify(v, null, 2)}}`), null, 2)}
\`\`\`
`).join('\n\n');
    }
    // try {
    //     exStr = JSON.stringify(JSON.parse(exStr), null, 2);
    // } catch (e) {
    //     // BAH
    // }
    // else if (prop.type === 'array') {
    //     exStr = examples.map(v => `"${key}": ${JSON.stringify(v, null, 2)}`).join('\n\n');
    // }
    if (exStr.length) {
        examplesStr = `**examples**

${exStr}

`;
    }
    const defaultProp = prop.default ? `\`${prop.default}\`` : '';
    return `${level < 2 ? '\n' : ''}${header} ${level < 1 ? key : keyPath}


| Prop Name | Type | Default Value | Path |
| :----- | :----- | :---- | :---- |
| \`${key}\` | \`${prop.type}\` | ${defaultProp} | \`${hidePath ? '' : keyPath}\` |

${prop.description || ''}

${examplesStr}

---

`;
};

const maxLevelHeader = 2;

const _parseSubProps = (c, obj, level, parentKey, conf) => {
    let pk = parentKey;
    let out = '';
    let header = '##';

    const l = level <= maxLevelHeader ? level : maxLevelHeader;
    for (let i = 0; i < l; i++) {
        header += '#';
    }
    let properties = {};
    // eslint-disable-next-line prefer-destructuring
    if (obj.properties) { properties = obj.properties; }
    if (!properties && obj && obj.additionalProperties && obj.additionalProperties.properties) {
        // eslint-disable-next-line prefer-destructuring
        properties = obj.additionalProperties.properties;
        if (properties) {
            pk = `${pk}.[object]`;
        }
    }


    if (properties) {
        Object.keys(properties).sort().forEach((k) => {
            const prop = properties[k];
            const key = `${pk}.${k}`;
            out += `${_printContent(header, k, key, prop, level, conf)}

${_parseSubProps(c, properties[k], level + 1, key, conf)}
`;
        });
    }
    return out;
};

export const generateApiConfigDocs = async (c) => {
    let output = `---
id: api-config
title: renative.json API Reference
sidebar_label: renative.json
---

Following Config reference applies to all \`renative.json\` files, including:

\`./renative.json\`

\`./appConfigs/base/renative.json\`

\`./appConfigs/\\<APP_ID\\>/renative.json\`

\`\\<WORKSPACE\\>/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/appConfigs/base/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/appConfigs/\\<APP_ID\\>/renative.json\`


`;

    const rootSchema = SchemaManager.getRenativeJsonSchema();

    Object.keys(rootSchema.properties).sort().forEach((k1) => {
        const prop = rootSchema.properties[k1];
        output += `${_printContent('##', k1, k1, prop, 1, {})}

${_parseSubProps(c, prop, 1, k1, {})}


`;
    });


    fs.writeFileSync(path.join(c.paths.project.dir, '../../docs/api-config.md'), output);
};


export const generateRuntimeObjectDocs = async (c) => {
    let output = `---
id: api-rnv-config
title: rnv Build Config Object Reference
sidebar_label: build config object
---

List of available config props injected into [Build Hooks](guide-build-hooks.md) via method parameter

`;

    const rootSchema = SchemaManager.getRuntimeObjectSchema();

    Object.keys(rootSchema.properties).sort().forEach((k1) => {
        const prop = rootSchema.properties[k1];
        output += `${_printContent('##', k1, k1, prop, 1, { hidePath: true })}

${_parseSubProps(c, prop, 1, k1, { hidePath: true })}


`;
    });


    fs.writeFileSync(path.join(c.paths.project.dir, '../../docs/api/rnv-config.md'), output);
};
